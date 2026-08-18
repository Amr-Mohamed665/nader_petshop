'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '@/lib/validators';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { useCategoriesQuery } from '@/hooks/useCategories';

export default function ProductForm({
  initialValues,
  onSubmit,
  isLoading = false,
}) {
  const { data: categories = [] } = useCategoriesQuery();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
    },
  });

  const available = watch('available');

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm max-w-xl">
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

      <FormField
        id="description"
        label="Product Description"
        type="textarea"
        register={register}
        error={errors.description?.message}
        placeholder="Provide details about product ingredients, sizing, care, or instructions."
      />

      <FormField
        id="image"
        label="Media URL (Image or Video URL)"
        register={register}
        error={errors.image?.message}
        placeholder="https://example.com/pet-image.jpg or video.mp4"
      />

    

      <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
        <Button
          type="submit"
          isLoading={isLoading}
          className="px-6 py-3 font-extrabold shadow-md shadow-teal-500/10 text-xs uppercase tracking-wider"
        >
          Save Product Details
        </Button>
      </div>
    </form>
  );
}
