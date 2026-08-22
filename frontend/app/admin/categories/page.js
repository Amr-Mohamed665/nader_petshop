'use client';

import { useState } from 'react';
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
import ConfirmModal from '@/components/molecules/ConfirmModal';
import Spinner from '@/components/atoms/Spinner';
import ErrorState from '@/components/molecules/ErrorState';
import ImageUploader from '@/components/molecules/ImageUploader';
import {
  useCategoriesQuery,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useReorderCategories,
} from '@/hooks/useCategories';

const EMPTY_FORM = { name: '', slug: '', description: '', image: '' };

function slugify(str) {
  return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}


// ─── Sortable Category Row ───────────────────────────────────────────────────
function SortableCategoryRow({ category, onEdit, onDelete, isDragOverlay }) {
  const categoryId = String(category.id || category._id);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: categoryId });

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

      {/* Image URL column (rendered as actual image) */}
      <td className="px-5 py-3">
        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 shadow-inner">
          {category.image && isValidUrl(category.image) ? (
            <img
              src={category.image}
              alt={category.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs font-semibold text-slate-400 select-none">No Image</div>
          )}
        </div>
      </td>

      {/* Name */}
      <td className="px-5 py-3 font-extrabold text-slate-900 text-xs">
        {category.name}
      </td>

      {/* Slug */}
      <td className="px-5 py-3">
        <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">
          /category/{category.slug}
        </span>
      </td>

      {/* Description */}
      <td className="px-5 py-3 text-slate-500 max-w-[220px] truncate">
        {category.description || <span className="italic text-slate-300">—</span>}
      </td>

      {/* Actions */}
      <td className="px-5 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(category)}
            className="px-3 py-1.5 text-[11px] font-bold text-slate-600 border border-slate-200 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(category)}
            className="px-3 py-1.5 text-[11px] font-bold text-rose-600 border border-rose-200 hover:bg-rose-50 rounded-lg transition-all"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Modal Form ─────────────────────────────────────────────────────────────
function CategoryModal({ initial, onClose, onSave, existingSlugs, isSubmitting }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    initial
      ? {
          name: initial.name || '',
          slug: initial.slug || '',
          description: initial.description || '',
          image: initial.image || '',
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'name' && !isEdit) {
        next.slug = slugify(value);
      }
      return next;
    });
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.slug.trim()) errs.slug = 'Slug is required.';
    else if (!/^[a-z0-9-]+$/.test(form.slug)) errs.slug = 'Slug must be lowercase letters, numbers, and hyphens only.';
    else if (!isEdit && existingSlugs.includes(form.slug)) errs.slug = 'This slug already exists.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/80 animate-scale-in overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">
            {isEdit ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="cat-name"
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Reptiles"
              className={`w-full px-3 py-2 text-sm border rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.name ? 'border-rose-400' : 'border-slate-200'}`}
            />
            {errors.name && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Slug <span className="text-rose-500">*</span>
              <span className="ml-1 text-[10px] text-slate-400 normal-case font-medium">(used in URLs, e.g. /category/reptiles)</span>
            </label>
            <input
              id="cat-slug"
              type="text"
              value={form.slug}
              onChange={(e) => set('slug', slugify(e.target.value))}
              placeholder="reptiles"
              disabled={isEdit}
              className={`w-full px-3 py-2 text-sm border rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono ${isEdit ? 'opacity-50 cursor-not-allowed' : ''} ${errors.slug ? 'border-rose-400' : 'border-slate-200'}`}
            />
            {errors.slug && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <input
              id="cat-description"
              type="text"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="e.g. Snakes, lizards, and exotic reptile supplies."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          <ImageUploader
            label="Category Image"
            value={form.image}
            onChange={(url) => set('image', url)}
          />

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" isLoading={isSubmitting} className="text-xs font-extrabold px-5">
              {isEdit ? 'Save Changes' : 'Add Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading, error, refetch } = useCategoriesQuery();

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const reorderMutation = useReorderCategories();

  const [modalMode, setModalMode] = useState(null); // null | 'add' | { ...category }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeId, setActiveId] = useState(null);

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

  const handleSave = async (form) => {
    try {
      if (modalMode === 'add') {
        await createMutation.mutateAsync(form);
      } else {
        const targetId = String(modalMode.id || modalMode._id);
        await updateMutation.mutateAsync({ id: targetId, data: form });
      }
      setModalMode(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save category.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const targetId = String(deleteTarget.id || deleteTarget._id);
      await deleteMutation.mutateAsync(targetId);
      setDeleteTarget(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete category.');
    }
  };

  const handleDragStart = ({ active }) => {
    setActiveId(String(active.id));
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => String(c.id || c._id) === String(active.id));
    const newIndex = categories.findIndex((c) => String(c.id || c._id) === String(over.id));

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedList = arrayMove(categories, oldIndex, newIndex);
    const orderedIds = reorderedList.map((c) => String(c.id || c._id));

    try {
      await reorderMutation.mutateAsync(orderedIds);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to persist category order.');
    }
  };

  const existingSlugs = categories.map((c) => c.slug);
  const activeCategory = activeId ? categories.find((c) => String(c.id || c._id) === activeId) : null;
  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Manage Categories
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Add, edit, reorder, or remove product categories dynamically.
              </p>
            </div>
            <Button
              id="add-category-btn"
              variant="primary"
              className="font-extrabold text-xs uppercase tracking-wider shadow-md shadow-teal-500/10"
              onClick={() => setModalMode('add')}
            >
              Add New Category
            </Button>
          </div>

          {/* DnD hint */}
          {!isLoading && !error && categories.length > 1 && (
            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 w-fit animate-fade-in">
              <i className="fa-solid fa-grip-vertical text-slate-300 text-[13px]"></i>
              <span>Drag the <strong className="text-slate-500">grip handle</strong> on any row to sort categories</span>
            </div>
          )}

          {/* Table */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Spinner size="md" />
              <span className="text-xs text-slate-400 font-bold tracking-wide">Loading categories...</span>
            </div>
          ) : error ? (
            <ErrorState onRetry={refetch} description={error.message || 'Failed to load categories.'} />
          ) : categories.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
              <p className="text-2xl mb-2">🐾</p>
              <p className="text-sm font-bold text-slate-500">No categories found.</p>
              <p className="text-xs text-slate-400 mt-1">Click &quot;Add New Category&quot; to get started.</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 shadow-sm bg-white">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                      <th className="pl-4 py-3.5 w-10">
                        <i className="fa-solid fa-arrows-up-down text-slate-300 text-[12px]"></i>
                      </th>
                      <th className="px-5 py-4">Image</th>
                      <th className="px-5 py-4">Name</th>
                      <th className="px-5 py-4">Slug</th>
                      <th className="px-5 py-4">Description</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <SortableContext
                      items={categories.map((c) => String(c.id || c._id))}
                      strategy={verticalListSortingStrategy}
                    >
                      {categories.map((cat) => (
                        <SortableCategoryRow
                          key={cat.id || cat._id || cat.slug}
                          category={cat}
                          onEdit={setModalMode}
                          onDelete={setDeleteTarget}
                        />
                      ))}
                    </SortableContext>
                  </tbody>
                </table>
              </div>

              {/* Drag overlay */}
              <DragOverlay>
                {activeCategory ? (
                  <table className="w-full rounded-xl overflow-hidden shadow-2xl bg-white">
                    <tbody>
                      <SortableCategoryRow
                        category={activeCategory}
                        onEdit={() => {}}
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

        {/* Add / Edit Modal */}
        {modalMode !== null && (
          <CategoryModal
            initial={modalMode === 'add' ? null : modalMode}
            onClose={() => setModalMode(null)}
            onSave={handleSave}
            existingSlugs={existingSlugs}
            isSubmitting={isMutating}
          />
        )}

        {/* Delete Confirm Modal with Cascade Delete warning */}
        <ConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Category & All Products?"
          description={`WARNING: Deleting the category "${deleteTarget?.name}" will PERMANENTLY delete the category itself AND ALL PRODUCTS associated with it. This action cannot be undone.`}
          confirmLabel="Delete Category & Products"
          isDanger
          isLoading={deleteMutation.isPending}
        />
      </AdminLayout>
    </AdminRoute>
  );
}
