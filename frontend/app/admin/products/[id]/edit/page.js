'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/templates/AdminLayout';
import AdminRoute from '@/components/guards/AdminRoute';
import ProductForm from '@/components/organisms/ProductForm';
import Spinner from '@/components/atoms/Spinner';
import ErrorState from '@/components/molecules/ErrorState';
import { productsService } from '@/services/products.service';
import { toastSuccess, toastError } from '@/utils/toast';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchProduct = useCallback(async () => {
    setFetchLoading(true);
    setFetchError(null);
    try {
      const response = await productsService.getById(id);
      if (response.success) {
        setProduct(response.data);
      } else {
        setFetchError(response.message || 'Product not found.');
      }
    } catch (err) {
      setFetchError(err.response?.data?.message || err.message || 'Failed to load product.');
    } finally {
      setFetchLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (id) fetchProduct();
  }, [id, fetchProduct]);

  const handleSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      const response = await productsService.update(id, data);
      if (response.success) {
        toastSuccess('Product updated successfully.');
        router.push('/admin/products');
      } else {
        toastError(response.message || 'Failed to update product.');
      }
    } catch (err) {
      toastError(err, 'Failed to update product.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="min-h-[50vh] flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        </AdminLayout>
      </AdminRoute>
    );
  }

  if (fetchError || !product) {
    return (
      <AdminRoute>
        <AdminLayout>
          <ErrorState title="Product not found" description={fetchError} onRetry={fetchProduct} />
        </AdminLayout>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Edit Product
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Editing: <strong className="text-slate-700">{product.name}</strong>
            </p>
          </div>

          <ProductForm
            initialValues={{
              name: product.name || '',
              category: product.category || '',
              price: product.price || '',
              description: product.description || '',
              image: product.image || '',
              available: product.available !== false,
              featured: product.featured === true,
            }}
            onSubmit={handleSubmit}
            isLoading={submitLoading}
            mode="edit"
          />
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
