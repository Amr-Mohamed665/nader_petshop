'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AdminLayout from '@/components/templates/AdminLayout';
import AdminRoute from '@/components/guards/AdminRoute';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Price from '@/components/atoms/Price';
import Spinner from '@/components/atoms/Spinner';
import ErrorState from '@/components/molecules/ErrorState';
import ConfirmModal from '@/components/molecules/ConfirmModal';
import { productsService } from '@/services/products.service';

// ─── Sortable Row ─────────────────────────────────────────────────────────────
function SortableProductRow({ product, onEdit, onDelete, isDragOverlay }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-slate-100 transition-colors group ${
        isDragging ? 'bg-teal-50/40' : 'hover:bg-slate-50/60'
      } ${isDragOverlay ? 'shadow-2xl rounded-xl bg-white ring-2 ring-teal-400/40' : ''}`}
    >
      {/* Drag Handle */}
      <td className="pl-4 py-3 w-10">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 text-slate-300 hover:text-slate-500 rounded-lg hover:bg-slate-100 transition-all touch-none"
          aria-label="Drag to reorder"
          title="Drag to reorder"
        >
          <i className="fa-solid fa-grip-vertical text-[15px]"></i>
        </button>
      </td>

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
      <td className="px-3 py-3 font-bold text-slate-900 max-w-[160px] sm:max-w-[220px] truncate text-xs">
        {product.name}
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
        <Badge variant={product.available ? 'success' : 'danger'}>
          {product.available ? 'In Stock' : 'Out of Stock'}
        </Badge>
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    setProducts((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === active.id);
      const newIndex = prev.findIndex((p) => p.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
    // NOTE: Backend does not currently support sort order persistence.
    // When the API supports it, call: productsService.updateOrder(newOrderedIds)
  };

  // Filtered products for search
  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const activeProduct = activeId ? products.find((p) => p.id === activeId) : null;

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
                Add, edit, reorder, or remove products from the catalog.
              </p>
            </div>
            <Link href="/admin/products/new" className="self-start sm:self-auto">
              <Button variant="primary" className="font-extrabold text-xs uppercase tracking-wider shadow-md shadow-teal-500/10 whitespace-nowrap">
                Add New Product
              </Button>
            </Link>
          </div>

          {/* Search */}
          {!loading && !error && products.length > 0 && (
            <div className="relative max-w-sm">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]"></i>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-colors"
              />
            </div>
          )}

          {/* DnD hint */}
          {!loading && !error && products.length > 1 && (
            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 w-fit">
              <i className="fa-solid fa-grip-vertical text-slate-300 text-[13px]"></i>
              <span>Drag the <strong className="text-slate-500">grip handle</strong> on any row to reorder products</span>
            </div>
          )}

          {/* Products Table */}
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Spinner size="md" />
              <span className="text-xs text-slate-400 font-bold tracking-wide">Loading products...</span>
            </div>
          ) : error ? (
            <ErrorState onRetry={fetchProducts} description={error} />
          ) : products.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200/80">
              <i className="fa-solid fa-bone text-4xl text-slate-200 mb-3"></i>
              <p className="text-sm text-slate-500 font-semibold">No products in the catalog yet.</p>
              <p className="text-xs text-slate-400 mt-1">Click &quot;Add New Product&quot; to get started.</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 shadow-sm bg-white">
                <table className="w-full text-left border-collapse min-w-[520px]">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                      <th className="pl-4 py-3.5 w-10">
                        <i className="fa-solid fa-arrows-up-down text-slate-300 text-[12px]"></i>
                      </th>
                      <th className="px-3 py-3.5">Image</th>
                      <th className="px-3 py-3.5">Product Name</th>
                      <th className="px-3 py-3.5 hidden sm:table-cell">Category</th>
                      <th className="px-3 py-3.5">Price</th>
                      <th className="px-3 py-3.5 hidden md:table-cell">Status</th>
                      <th className="px-3 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <SortableContext
                      items={filteredProducts.map((p) => p.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-400">
                            No products match your search.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => (
                          <SortableProductRow
                            key={product.id}
                            product={product}
                            onDelete={setDeleteTarget}
                          />
                        ))
                      )}
                    </SortableContext>
                  </tbody>
                </table>
              </div>

              {/* Drag overlay — renders a floating copy while dragging */}
              <DragOverlay>
                {activeProduct ? (
                  <table className="w-full rounded-xl overflow-hidden shadow-2xl">
                    <tbody>
                      <SortableProductRow
                        product={activeProduct}
                        onDelete={() => {}}
                        isDragOverlay
                      />
                    </tbody>
                  </table>
                ) : null}
              </DragOverlay>
            </DndContext>
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
