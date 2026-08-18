'use client';

import { useState } from 'react';
import ShopLayout from '@/components/templates/ShopLayout';
import ProductGrid from '@/components/organisms/ProductGrid';
import ProductFilters from '@/components/organisms/ProductFilters';
import SearchBar from '@/components/molecules/SearchBar';
import Spinner from '@/components/atoms/Spinner';
import ErrorState from '@/components/molecules/ErrorState';
import useProducts from '@/hooks/useProducts';

export default function ProductsPage() {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  
  const {
    products,
    loading,
    error,
    refetch,
    updateFilters,
  } = useProducts({ search: '', category: '' });

  const handleSearch = (term) => {
    setSearch(term);
    updateFilters({ search: term });
  };

  const handleCategorySelect = (slug) => {
    setCategory(slug);
    updateFilters({ category: slug });
  };

  return (
    <ShopLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Products Catalog
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Browse healthy pet food, accessories, cages, and toys
            </p>
          </div>

          <SearchBar onSearch={handleSearch} initialValue={search} className="w-full md:max-w-xs" />
        </div>

        {/* Filter Toggle Buttons */}
        <ProductFilters
          selectedCategory={category}
          onSelectCategory={handleCategorySelect}
        />

        {/* Catalog List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Spinner size="md" />
            <span className="text-xs text-slate-400 font-bold tracking-wide">Loading catalog items...</span>
          </div>
        ) : error ? (
          <div className="py-12">
            <ErrorState onRetry={refetch} description={error} />
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </ShopLayout>
  );
}
