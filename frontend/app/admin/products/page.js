'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/templates/AdminLayout';
import AdminRoute from '@/components/guards/AdminRoute';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Price from '@/components/atoms/Price';
import Spinner from '@/components/atoms/Spinner';
import ErrorState from '@/components/molecules/ErrorState';
import ConfirmModal from '@/components/molecules/ConfirmModal';
import { productsService } from '@/services/products.service';
import { toastSuccess, toastError } from '@/utils/toast';

// ─── Product Row (Desktop) ────────────────────────────────────────────────────
function ProductRow({ product, onDelete, onToggleStatus }) {
  return (
    <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50/60">
      {/* Image */}
      <td className="px-3 py-3">
        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="40px"
              unoptimized
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-sm select-none">🐾</div>
          )}
        </div>
      </td>

      {/* Name */}
      <td className="px-3 py-3 max-w-[160px] sm:max-w-[220px] truncate text-xs">
        <span className="font-bold text-slate-900">{product.name}</span>
        {product.featured && (
          <span className="ml-1.5 text-amber-500" title="Featured Product">
            <i className="fa-solid fa-star text-[10px]" />
          </span>
        )}
      </td>

      {/* Category - hidden on xs */}
      <td className="px-3 py-3 hidden sm:table-cell">
        <Badge variant="primary">{product.category}</Badge>
      </td>

      {/* Price */}
      <td className="px-3 py-3">
        <Price amount={product.price} className="text-teal-600 font-extrabold text-sm" />
      </td>

      {/* Status - hidden on xs */}
      <td className="px-3 py-3 hidden md:table-cell">
        {onToggleStatus ? (
          <button
            onClick={() => onToggleStatus(product)}
            className="cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95 block w-[105px]"
            title="Click to toggle availability"
          >
            <Badge
              variant={product.available ? 'success' : 'danger'}
              className="w-[105px] justify-center"
            >
              {product.available ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </button>
        ) : (
          <Badge
            variant={product.available ? 'success' : 'danger'}
            className="w-[105px] justify-center"
          >
            {product.available ? 'In Stock' : 'Out of Stock'}
          </Badge>
        )}
      </td>

      {/* Actions */}
      <td className="px-3 py-3 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Link href={`/admin/products/${product.id}/edit`}>
            <Button variant="outline" size="sm" className="py-1 px-2.5 text-[10px] font-bold h-auto">
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            className="py-1 px-2.5 text-[10px] font-bold h-auto"
            onClick={() => onDelete(product)}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

// ─── Product Card (Mobile) ────────────────────────────────────────────────────
function ProductCard({ product, onDelete, onToggleStatus }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-grow">
          {/* Image */}
          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="48px"
                unoptimized
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-base select-none">🐾</div>
            )}
          </div>

          {/* Name & Category */}
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate flex items-center gap-1">
              {product.name}
              {product.featured && (
                <i className="fa-solid fa-star text-amber-400 text-[10px] flex-shrink-0" title="Featured" />
              )}
            </h3>
            <div className="mt-1">
              <Badge variant="primary" className="text-[9px] px-1.5 py-0.5">{product.category}</Badge>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          {onToggleStatus ? (
            <button
              onClick={() => onToggleStatus(product)}
              className="cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95 block w-fit"
              title="Click to toggle availability"
            >
              <Badge variant={product.available ? 'success' : 'danger'} className="text-[9px] px-1.5 py-0.5">
                {product.available ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </button>
          ) : (
            <Badge variant={product.available ? 'success' : 'danger'} className="text-[9px] px-1.5 py-0.5">
              {product.available ? 'In Stock' : 'Out of Stock'}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price</span>
          <Price amount={product.price} className="text-teal-600 font-extrabold text-sm" />
        </div>

        <div className="flex items-center gap-1.5">
          <Link href={`/admin/products/${product.id}/edit`}>
            <Button variant="outline" size="sm" className="py-1 px-3 text-[10px] font-bold h-auto">
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            className="py-1 px-3 text-[10px] font-bold h-auto"
            onClick={() => onDelete(product)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsService.getAll();
      if (response.success) {
        setProducts(response.data);
      } else {
        setError(response.message || 'Failed to load products.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productsService.delete(deleteTarget.id);
      toastSuccess(`"${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      toastError(err, 'Failed to delete product.');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (product) => {
    const updatedStatus = !product.available;

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, available: updatedStatus } : p))
    );

    try {
      const res = await productsService.update(product.id, { available: updatedStatus });

      if (!res?.success) {
        // Revert on failure
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, available: product.available } : p))
        );
        toastError(res?.message || 'Failed to update product availability.');
      } else {
        toastSuccess(
          updatedStatus
            ? `"${product.name}" marked as In Stock.`
            : `"${product.name}" marked as Out of Stock.`
        );
      }
    } catch (err) {
      // Revert on error
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, available: product.available } : p))
      );
      toastError(err, 'Failed to update product availability.');
    }
  };

  // Filtered products for search
  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-5 sm:space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Manage Products
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Add, edit, or remove products from the catalog.
              </p>
            </div>
            <Button
              href="/admin/products/new"
              variant="primary"
              className="self-start sm:self-auto font-extrabold text-xs uppercase tracking-wider shadow-md shadow-teal-500/10 whitespace-nowrap"
            >
              Add New Product
            </Button>
          </div>

          {/* Search */}
          {!loading && !error && products.length > 0 && (
            <div className="relative max-w-sm">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-colors"
              />
            </div>
          )}

          {/* Products */}
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Spinner size="md" />
              <span className="text-xs text-slate-400 font-bold tracking-wide">Loading products...</span>
            </div>
          ) : error ? (
            <ErrorState onRetry={fetchProducts} description={error} />
          ) : products.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200/80">
              <i className="fa-solid fa-bone text-4xl text-slate-200 mb-3" />
              <p className="text-sm text-slate-500 font-semibold">No products in the catalog yet.</p>
              <p className="text-xs text-slate-400 mt-1">Click &quot;Add New Product&quot; to get started.</p>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="block md:hidden space-y-4">
                {filteredProducts.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-400">
                    No products match your search.
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onDelete={setDeleteTarget}
                      onToggleStatus={handleToggleStatus}
                    />
                  ))
                )}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block w-full overflow-x-auto rounded-2xl border border-slate-200/80 shadow-sm bg-white">
                <table className="w-full text-left border-collapse min-w-[520px]">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                      <th className="px-3 py-3.5">Image</th>
                      <th className="px-3 py-3.5">Product Name</th>
                      <th className="px-3 py-3.5 hidden sm:table-cell">Category</th>
                      <th className="px-3 py-3.5">Price</th>
                      <th className="px-3 py-3.5 hidden md:table-cell">Status</th>
                      <th className="px-3 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-400">
                          No products match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <ProductRow
                          key={product.id}
                          product={product}
                          onDelete={setDeleteTarget}
                          onToggleStatus={handleToggleStatus}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Product?"
          description={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          isDanger
          isLoading={deleting}
        />
      </AdminLayout>
    </AdminRoute>
  );
}
