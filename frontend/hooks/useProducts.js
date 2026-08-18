'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { productsService } from '@/services/products.service';

export default function useProducts(initialFilters = { search: '', category: '' }) {
  const [filters, setFilters] = useState(initialFilters);

  const query = useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const res = await productsService.getAll(filters);
      return res.success ? res.data : [];
    },
  });

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    products: query.data || [],
    loading: query.isLoading,
    error: query.error ? (query.error.message || 'An error occurred') : null,
    refetch: query.refetch,
    updateFilters,
    filters,
  };
}
