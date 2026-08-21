'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/templates/AdminLayout';
import AdminRoute from '@/components/guards/AdminRoute';
import ProductForm from '@/components/organisms/ProductForm';
import { productsService } from '@/services/products.service';
import { toastSuccess, toastError } from '@/utils/toast';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await productsService.create(data);
      if (response.success) {
        toastSuccess('Product added successfully.');
        router.push('/admin/products');
      } else {
        toastError(response.message || 'Failed to create product.');
      }
    } catch (err) {
      toastError(err, 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Add New Product
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in the product information below.
            </p>
          </div>

          <ProductForm onSubmit={handleSubmit} isLoading={loading} mode="create" />
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
