import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories.service';

export const DEFAULT_CATEGORIES = [
  {
    id: '1',
    name: 'Dogs',
    slug: 'dogs',
    description: 'Food, toys, beds, and health supplies for your best friend.',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1074&auto=format&fit=crop',
    order: 0,
  },
  {
    id: '2',
    name: 'Cats',
    slug: 'cats',
    description: 'Delicious cat food, scratching posts, litters, and toys.',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1043&auto=format&fit=crop',
    order: 1,
  },
  {
    id: '3',
    name: 'Birds',
    slug: 'birds',
    description: 'Nutritious seeds, spacious cages, and colorful toys for birds.',
    image: 'https://images.unsplash.com/photo-1522850959516-58f958d6212e?q=80&w=1035&auto=format&fit=crop',
    order: 2,
  },
  {
    id: '4',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Leashes, collars, food bowls, carriers, and grooming accessories.',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1064&auto=format&fit=crop',
    order: 3,
  },
];

const LOCAL_STORAGE_KEY = 'pet_shop_custom_categories';

function getStoredCategories() {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((c) => ({ ...c, id: String(c.id || c._id) }));
      }
    }
  } catch (_) {}
  return DEFAULT_CATEGORIES;
}

function saveStoredCategories(cats) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cats));
  } catch (_) {}
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await categoriesService.getAll();
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const normalized = res.data.map((c) => ({
            ...c,
            id: String(c.id || c._id),
          }));
          saveStoredCategories(normalized);
          return normalized;
        }
        return getStoredCategories();
      } catch (err) {
        console.warn('Categories API unavailable, using local categories:', err);
        return getStoredCategories();
      }
    },
    placeholderData: DEFAULT_CATEGORIES,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      let created = null;
      try {
        const res = await categoriesService.create(data);
        if (res?.success && res.data) {
          created = { ...res.data, id: String(res.data.id || res.data._id) };
        }
      } catch (err) {
        console.warn('Backend create category failed, saving locally:', err);
      }

      const current = queryClient.getQueryData(['categories']) || getStoredCategories();
      if (!created) {
        const maxOrder = current.reduce((max, c) => Math.max(max, c.order ?? 0), -1);
        created = {
          id: Date.now().toString(),
          name: data.name,
          slug: data.slug,
          description: data.description || '',
          image: data.image || '',
          order: maxOrder + 1,
        };
      }

      const updated = [...current, created];
      saveStoredCategories(updated);
      queryClient.setQueryData(['categories'], updated);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      let updatedItem = null;
      const targetId = String(id);
      try {
        const res = await categoriesService.update(targetId, data);
        if (res?.success && res.data) {
          updatedItem = { ...res.data, id: String(res.data.id || res.data._id) };
        }
      } catch (err) {
        console.warn('Backend update category failed, updating locally:', err);
      }

      const current = queryClient.getQueryData(['categories']) || getStoredCategories();
      const updatedList = current.map((cat) => {
        if (String(cat.id || cat._id) === targetId) {
          return updatedItem || { ...cat, ...data, id: targetId };
        }
        return cat;
      });

      saveStoredCategories(updatedList);
      queryClient.setQueryData(['categories'], updatedList);
      return updatedItem || { ...data, id: targetId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const targetId = String(id);
      try {
        await categoriesService.delete(targetId);
      } catch (err) {
        console.warn('Backend delete category failed, removing locally:', err);
      }

      const current = queryClient.getQueryData(['categories']) || getStoredCategories();
      const updatedList = current.filter((cat) => String(cat.id || cat._id) !== targetId);

      saveStoredCategories(updatedList);
      queryClient.setQueryData(['categories'], updatedList);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useReorderCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds) => {
      try {
        await categoriesService.reorder(orderedIds);
      } catch (err) {
        console.warn('Backend reorder categories failed, reordering locally:', err);
      }

      const current = queryClient.getQueryData(['categories']) || getStoredCategories();
      const reordered = orderedIds
        .map((id, idx) => {
          const item = current.find((c) => String(c.id || c._id) === String(id));
          return item ? { ...item, order: idx } : null;
        })
        .filter(Boolean);

      saveStoredCategories(reordered);
      queryClient.setQueryData(['categories'], reordered);
      return reordered;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
