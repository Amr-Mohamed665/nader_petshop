'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '@/lib/validators';
import FormField from '@/components/molecules/FormField';
import ImageUploader from '@/components/molecules/ImageUploader';
import Button from '@/components/atoms/Button';
import { useCategoriesQuery } from '@/hooks/useCategories';
import { cn } from '@/utils/cn';

/**
 * Shared product form for both Create and Edit modes.
 *
 * Props:
 *  initialValues  – Pre-populated values (edit mode)
 *  onSubmit(data) – Called with validated form data
 *  isLoading      – Disables submit while API call is in flight
 *  mode           – 'create' | 'edit' (changes submit button label)
 */
export default function ProductForm({
  initialValues,
  onSubmit,
  isLoading = false,
  mode = 'create',
}) {
  const { data: categories = [] } = useCategoriesQuery();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues || {
      name: '',
      category: '',
      price: '',
      description: '',
      image: '',
      available: true,
      featured: false,
    },
  });

  // Re-populate form when initialValues change (e.g. after async fetch in edit mode)
  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const available = watch('available');
  const featured = watch('featured');
  const imageValue = watch('image');

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm max-w-xl"
    >
      {/* Product Name */}
      <FormField
        id="name"
        label="Product Name"
        register={register}
        error={errors.name?.message}
        placeholder="Enter product name (e.g. Premium Dog Kibbles)"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category Select */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="category" className="text-xs font-bold text-slate-700 tracking-wide">
            Category
          </label>
          <select
            id="category"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-150"
            {...register('category')}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-xs text-red-500 font-medium mt-0.5">
              {errors.category.message}
            </span>
          )}
        </div>

        <FormField
          id="price"
          label="Price (AED)"
          type="number"
          step="0.01"
          register={register}
          error={errors.price?.message}
          placeholder="e.g. 149"
        />
      </div>

      {/* Description */}
      <FormField
        id="description"
        label="Product Description"
        type="textarea"
        register={register}
        error={errors.description?.message}
        placeholder="Provide details about product ingredients, sizing, care, or instructions."
      />

      {/* Product Image — Cloudinary uploader */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-700 tracking-wide">
          Product Image
        </label>
        <ImageUploader
          currentImageUrl={imageValue}
          onUpload={(url) => setValue('image', url, { shouldValidate: true })}
        />
        {/* Hidden input keeps image URL in the form state */}
        <input type="hidden" {...register('image')} />
        {errors.image && (
          <span className="text-xs text-red-500 font-medium">{errors.image.message}</span>
        )}
      </div>

      {/* Toggles row */}
      <div className="flex flex-col sm:flex-row gap-4 pt-1">
        {/* Available toggle */}
        <label
          htmlFor="available"
          className={cn(
            'flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl border transition-all',
            available
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-slate-200 bg-slate-50'
          )}
        >
          <div className="relative">
            <input
              id="available"
              type="checkbox"
              className="sr-only"
              {...register('available')}
            />
            <div
              className={cn(
                'w-9 h-5 rounded-full transition-colors duration-200',
                available ? 'bg-emerald-500' : 'bg-slate-300'
              )}
            />
            <div
              className={cn(
                'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
                available ? 'translate-x-4' : 'translate-x-0'
              )}
            />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Available</p>
            <p className="text-[10px] text-slate-400">
              {available ? 'Visible and in stock' : 'Hidden from storefront'}
            </p>
          </div>
        </label>

        {/* Featured toggle */}
        <label
          htmlFor="featured"
          className={cn(
            'flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl border transition-all',
            featured
              ? 'border-purple-200 bg-purple-50'
              : 'border-slate-200 bg-slate-50'
          )}
        >
          <div className="relative">
            <input
              id="featured"
              type="checkbox"
              className="sr-only"
              {...register('featured')}
            />
            <div
              className={cn(
                'w-9 h-5 rounded-full transition-colors duration-200',
                featured ? 'bg-purple-600' : 'bg-slate-300'
              )}
            />
            <div
              className={cn(
                'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
                featured ? 'translate-x-4' : 'translate-x-0'
              )}
            />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              <i className="fa-solid fa-star text-amber-400 mr-1" />
              Featured Product
            </p>
            <p className="text-[10px] text-slate-400">
              {featured ? 'Shown on home page' : 'Not on home page'}
            </p>
          </div>
        </label>
      </div>

      {/* Submit */}
      <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
        <Button
          type="submit"
          isLoading={isLoading}
          className="px-6 py-3 font-extrabold shadow-md shadow-teal-500/10 text-xs uppercase tracking-wider"
        >
          {mode === 'edit' ? 'Save Changes' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}
