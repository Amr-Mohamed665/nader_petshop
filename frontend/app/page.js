'use client';

import { useEffect, useState, useCallback } from 'react';
import ShopLayout from '@/components/templates/ShopLayout';
import HeroSection from '@/components/organisms/HeroSection';
import CategoryShowcase from '@/components/organisms/CategoryShowcase';
import FeaturedProducts from '@/components/organisms/FeaturedProducts';
import AboutSection from '@/components/organisms/AboutSection';
import CustomerCarousel from '@/components/organisms/CustomerCarousel';
import BenefitsSection from '@/components/organisms/BenefitsSection';
import Spinner from '@/components/atoms/Spinner';
import ErrorState from '@/components/molecules/ErrorState';
import { productsService } from '@/services/products.service';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsService.getAll();
      if (response.success) {
        // Filter out unavailable items if any, then select top 4
        const availableItems = response.data.filter((item) => item.available !== false);
        setProducts(availableItems);
      } else {
        setError(response.message || 'Failed to load featured products.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch catalog.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFeatured();
  }, [fetchFeatured]);

  return (
    <ShopLayout>
      {/* Hero Carousel */}
      <HeroSection />

      {/* Shop by Category */}
      <CategoryShowcase />

      {/* Featured Products */}
      {loading ? (
        <div className="py-12 flex flex-col items-center gap-3">
          <Spinner size="md" />
          <span className="text-xs text-slate-400 font-bold tracking-wide">Loading catalog...</span>
        </div>
      ) : error ? (
        <div className="py-8">
          <ErrorState onRetry={fetchFeatured} description={error} />
        </div>
      ) : (
        <FeaturedProducts products={products} />
      )}

      {/* About Al Nader */}
      <AboutSection />

      {/* Happy Customers Carousel */}
      <CustomerCarousel />

      {/* Why Choose Us */}
      <BenefitsSection />

    </ShopLayout>
  );
}
