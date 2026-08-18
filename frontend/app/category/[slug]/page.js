'use client';

import { useParams } from 'next/navigation';
import ShopLayout from '@/components/templates/ShopLayout';
import ProductGrid from '@/components/organisms/ProductGrid';
import Spinner from '@/components/atoms/Spinner';
import ErrorState from '@/components/molecules/ErrorState';
import useProducts from '@/hooks/useProducts';
import { useCategoriesQuery } from '@/hooks/useCategories';

export default function CategoryPage() {
  const { slug } = useParams();
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();

  const categoryInfo = categories.find(
    (c) => c.slug.toLowerCase() === String(slug).toLowerCase()
  );

  const {
    products,
    loading: productsLoading,
    error,
    refetch,
  } = useProducts({ category: slug });

  const loading = categoriesLoading || productsLoading;

  return (
    <ShopLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Category Header */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight capitalize">
              {categoryInfo?.name || slug} Supplies
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              {categoryInfo?.description || `Premium quality products for your companion.`}
            </p>
          </div>
          
          {/* Configured category image representation instead of category icon */}
          {categoryInfo?.image && (
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100 shadow-sm z-10">
              <img
                src={categoryInfo.image}
                alt={categoryInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Spinner size="md" />
            <span className="text-xs text-slate-400 font-bold tracking-wide">Loading category items...</span>
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
