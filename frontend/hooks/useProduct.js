'use client';

import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';

export default function useProduct(id) {
  const query = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await productsService.getById(id);
      return res.success ? res.data : null;
    },
    enabled: !!id,
  });

  return {
    product: query.data || null,
    loading: query.isLoading,
    error: query.error ? (query.error.message || 'Product not found.') : null,
    refetch: query.refetch,
  };
}
