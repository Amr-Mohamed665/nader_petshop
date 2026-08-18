import api from './api';

export const productsService = {
  async getAll({ search, category } = {}) {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    const { data } = await api.get('/menu', { params });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/menu/${id}`);
    return data;
  },

  async create(productData) {
    const { data } = await api.post('/menu', productData);
    return data;
  },

  async update(id, productData) {
    const { data } = await api.put(`/menu/${id}`, productData);
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(`/menu/${id}`);
    return data;
  },
};
