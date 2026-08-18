'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/templates/AdminLayout';
import AdminRoute from '@/components/guards/AdminRoute';
import Price from '@/components/atoms/Price';
import Badge from '@/components/atoms/Badge';
import Spinner from '@/components/atoms/Spinner';
import Button from '@/components/atoms/Button';
import ErrorState from '@/components/molecules/ErrorState';
import { ordersService } from '@/services/orders.service';
import { formatDate } from '@/utils/formatDate';
import { getStatusColor } from '@/utils/getStatusColor';
import { VALID_STATUS_VALUES } from '@/constants/orderStatuses';

function statusBadgeVariant(status) {
  switch (status) {
    case 'completed': return 'success';
    case 'pending': return 'warning';
    case 'cancelled': return 'danger';
    default: return 'info';
  }
}

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ordersService.getById(id);
      if (response.success) {
        setOrder(response.data);
      } else {
        setError(response.message || 'Order not found.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load order.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (id) fetchOrder();
  }, [id, fetchOrder]);

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await ordersService.updateStatus(id, newStatus);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="min-h-[50vh] flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        </AdminLayout>
      </AdminRoute>
    );
  }

  if (error || !order) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="py-12">
            <ErrorState title="Order not found" description={error} onRetry={fetchOrder} />
          </div>
        </AdminLayout>
      </AdminRoute>
    );
  }

  const statusInfo = getStatusColor(order.status);

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="max-w-3xl space-y-6 animate-fade-in">
          {/* Back button */}
          <button
            onClick={() => router.push('/admin/orders')}
            className="text-xs font-bold text-slate-500 hover:text-teal-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-arrow-left text-[10px]"></i>
            Back to Manage Orders
          </button>

          {/* Order Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Order ID</span>
                <h1 className="text-xl font-extrabold text-slate-900 font-mono tracking-wide">
                  #{order.id}
                </h1>
              </div>
              <Badge
                variant={statusBadgeVariant(order.status)}
                className="text-sm px-4 py-1.5"
              >
                {statusInfo.label}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-2 border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Placed On</span>
                <p className="font-bold text-slate-800">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Customer ID</span>
                <p className="font-bold text-slate-800 font-mono text-xs">{order.userId}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Amount</span>
                <Price amount={order.total} className="text-lg text-teal-600 font-extrabold" />
              </div>
            </div>
          </div>

          {/* Status Update Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
              Update Status
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              {VALID_STATUS_VALUES.map((status) => {
                const info = getStatusColor(status);
                const isActive = order.status === status;
                return (
                  <button
                    key={status}
                    disabled={isActive || updatingStatus}
                    onClick={() => handleStatusChange(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 border ${
                      isActive
                        ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/15 cursor-default'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50/40 disabled:opacity-50'
                    }`}
                  >
                    {updatingStatus && !isActive ? (
                      <span className="flex items-center gap-1.5">
                        <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {info.label}
                      </span>
                    ) : (
                      info.label
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Order Items
            </h2>

            <div className="divide-y divide-slate-100">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 gap-4">
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Qty: {item.quantity} × {new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(item.price)}
                    </p>
                  </div>
                  <Price amount={item.lineTotal} className="text-sm text-teal-600 font-extrabold flex-shrink-0" />
                </div>
              ))}
            </div>

            <hr className="border-slate-100" />

            <div className="flex justify-between items-center text-base pt-2">
              <span className="font-extrabold text-slate-900">Grand Total</span>
              <Price amount={order.total} className="text-xl text-teal-600 font-extrabold" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push('/admin/orders')} className="font-bold text-xs">
              <i className="fa-solid fa-arrow-left mr-1.5 text-[10px]"></i>
              All Orders
            </Button>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
