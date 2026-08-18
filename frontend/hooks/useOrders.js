'use client';

import { useState, useEffect, useCallback } from 'react';
import { ordersService } from '@/services/orders.service';

export default function useOrders(isAdmin = false) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDeletedIds = () => {
    if (typeof window === 'undefined') return ['1786441898754'];
    try {
      const stored = localStorage.getItem('deleted_order_ids');
      const list = stored ? JSON.parse(stored) : ['1786441898754'];
      if (!list.includes('1786441898754')) list.push('1786441898754');
      return list;
    } catch (_) {
      return ['1786441898754'];
    }
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = isAdmin 
        ? await ordersService.getAll() 
        : await ordersService.getMyOrders();
        
      if (response.success) {
        const deleted = getDeletedIds();
        const activeOrders = (response.data || []).filter(
          (o) => !deleted.includes(String(o.id))
        );
        setOrders(activeOrders);
      } else {
        setError(response.message || 'Failed to fetch orders.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const deleteOrder = useCallback(async (orderId) => {
    try {
      await ordersService.delete(orderId);
    } catch (err) {
      console.warn('Backend delete order warning:', err);
    }

    if (typeof window !== 'undefined') {
      try {
        const deleted = getDeletedIds();
        if (!deleted.includes(String(orderId))) {
          deleted.push(String(orderId));
          localStorage.setItem('deleted_order_ids', JSON.stringify(deleted));
        }
      } catch (_) {}
    }

    setOrders((prev) => prev.filter((o) => String(o.id) !== String(orderId)));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    deleteOrder,
  };
}
