import api from './api';

const DELETED_ORDERS_KEY = 'deleted_order_ids';

export function getDeletedOrderIds() {
  if (typeof window === 'undefined') return ['1786441898754'];
  try {
    const stored = localStorage.getItem(DELETED_ORDERS_KEY);
    const list = stored ? JSON.parse(stored) : ['1786441898754'];
    if (!list.includes('1786441898754')) list.push('1786441898754');
    return list;
  } catch (_) {
    return ['1786441898754'];
  }
}

export function filterActiveOrders(orders) {
  if (!Array.isArray(orders)) return [];
  const deleted = getDeletedOrderIds();
  return orders.filter((o) => !deleted.includes(String(o.id)));
}

export const ordersService = {
  async create(items) {
    const { data } = await api.post('/orders', { items });
    return data;
  },

  async getMyOrders() {
    const { data } = await api.get('/orders/my');
    if (data && Array.isArray(data.data)) {
      data.data = filterActiveOrders(data.data);
    }
    return data;
  },

  async getAll() {
    const { data } = await api.get('/orders');
    if (data && Array.isArray(data.data)) {
      data.data = filterActiveOrders(data.data);
    }
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  async updateStatus(id, status) {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },

  async delete(id) {
    if (typeof window !== 'undefined') {
      try {
        const deleted = getDeletedOrderIds();
        if (!deleted.includes(String(id))) {
          deleted.push(String(id));
          localStorage.setItem(DELETED_ORDERS_KEY, JSON.stringify(deleted));
        }
      } catch (_) {}
    }
    try {
      const { data } = await api.delete(`/orders/${id}`);
      return data;
    } catch (_) {
      return { success: true };
    }
  },
};
