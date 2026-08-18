'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/templates/AdminLayout';
import AdminRoute from '@/components/guards/AdminRoute';
import DashboardStats from '@/components/organisms/DashboardStats';
import DashboardCharts from '@/components/organisms/DashboardCharts';
import RecentOrders from '@/components/organisms/RecentOrders';
import Spinner from '@/components/atoms/Spinner';
import ErrorState from '@/components/molecules/ErrorState';
import { productsService } from '@/services/products.service';
import { ordersService } from '@/services/orders.service';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [ordersData, setOrdersData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        productsService.getAll(),
        ordersService.getAll(),
      ]);

      const productsData = productsRes.success ? productsRes.data : [];
      const allOrders = ordersRes.success ? ordersRes.data : [];

      const revenue = allOrders
         .filter((o) => o.status === 'completed')
         .reduce((sum, o) => sum + (o.total || 0), 0);

      setStats({
        products: productsData.length,
        orders: allOrders.length,
        revenue,
      });

      // Store all orders for charts
      setOrdersData(allOrders);

      // Populate recent orders — latest 5 sorted by date
      const sorted = [...allOrders].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentOrders(sorted.slice(0, 5));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Welcome back, Administrator. Here is a quick snapshot of your store.
            </p>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Spinner size="md" />
              <span className="text-xs text-slate-400 font-bold tracking-wide">Loading dashboard...</span>
            </div>
          ) : error ? (
            <ErrorState onRetry={fetchData} description={error} />
          ) : (
            <>
              {/* Stats Cards */}
              <DashboardStats
                productsCount={stats.products}
                ordersCount={stats.orders}
                revenue={stats.revenue}
              />

              {/* Charts */}
              <DashboardCharts orders={ordersData} />

              {/* Recent Orders */}
              <RecentOrders orders={recentOrders} />
            </>
          )}
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
