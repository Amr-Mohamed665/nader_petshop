import api from './api';

export const categoriesService = {
  async getAll() {
    try {
      const { data } = await api.get('/categories');
      return data;
    } catch (_) {
      return { success: false, data: [] };
    }
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/categories/${id}`);
      return data;
    } catch (_) {
      return { success: false, data: null };
    }
  },

  async create(categoryData) {
    try {
      const { data } = await api.post('/categories', categoryData);
      return data;
    } catch (_) {
      return { success: false, data: null };
    }
  },

  async update(id, categoryData) {
    try {
      const { data } = await api.put(`/categories/${id}`, categoryData);
      return data;
    } catch (_) {
      return { success: false, data: null };
    }
  },

  async delete(id) {
    try {
      const { data } = await api.delete(`/categories/${id}`);
      return data;
    } catch (_) {
      return { success: false };
    }
  },

  async reorder(orderedIds) {
    try {
      const { data } = await api.put('/categories/reorder', { orderedIds });
      return data;
    } catch (_) {
      return { success: false };
    }
  },
};
