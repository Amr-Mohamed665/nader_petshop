'use client';

import Link from 'next/link';
import Price from '@/components/atoms/Price';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { formatDateShort } from '@/utils/formatDate';
import { getStatusColor } from '@/utils/getStatusColor';
import { VALID_STATUS_VALUES } from '@/constants/orderStatuses';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

export default function OrderTable({ orders = [], onStatusUpdate, updatingId, onDelete }) {
  if (orders.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-sm">
        No orders found matching the filters.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Card List (hidden on md+) */}
      <div className="block md:hidden space-y-4">
        {orders.map((order) => {
          const statusInfo = getStatusColor(order.status);
          const itemsSummary = order.items
            ?.map((i) => `${i.name} (x${i.quantity})`)
            .join(', ');

          return (
            <div key={order.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Order ID</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">#{order.id?.slice(-8)}</span>
                </div>
                <Badge variant={order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : order.status === 'cancelled' ? 'danger' : 'info'}>
                  {statusInfo.label}
                </Badge>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Items Summary</span>
                <p className="text-xs font-semibold text-slate-800 line-clamp-2" title={itemsSummary}>
                  {itemsSummary}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Date</span>
                  <span className="text-slate-500">{formatDateShort(order.createdAt)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total</span>
                  <Price amount={order.total} className="text-teal-600 font-extrabold text-sm" />
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <select
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                  className="px-2.5 py-1.5 text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 cursor-pointer disabled:opacity-50 flex-grow"
                >
                  {VALID_STATUS_VALUES.map((status) => {
                    const label = status === 'preparing' ? 'ON DELIVERY' : status.toUpperCase();
                    return (
                      <option key={status} value={status}>
                        {label}
                      </option>
                    );
                  })}
                </select>

                <div className="flex items-center gap-1.5">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="py-1.5 px-3 text-[10px] font-bold">
                      Details
                    </Button>
                  </Link>

                  {onDelete && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete order #${order.id}?`)) {
                          onDelete(order.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
                      title="Delete Order"
                    >
                      <i className="fa-solid fa-trash text-[11px]"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop/Tablet Table View (hidden on mobile) */}
      <div className="hidden md:block border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm bg-white">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow className="bg-slate-50 border-b border-slate-200/80">
              <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider h-auto">Order ID</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider h-auto">Date</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider h-auto">Items Summary</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider h-auto">Total</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider h-auto">Current Status</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider h-auto text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100 text-xs text-slate-700">
            {orders.map((order) => {
              const statusInfo = getStatusColor(order.status);
              const itemsSummary = order.items
                ?.map((i) => `${i.name} (x${i.quantity})`)
                .join(', ');

              return (
                <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                  <TableCell className="px-6 py-4 font-mono font-bold text-slate-900">
                    #{order.id}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-slate-400">
                    {formatDateShort(order.createdAt)}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-semibold text-slate-800 max-w-xs truncate" title={itemsSummary}>
                    {itemsSummary}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Price amount={order.total} className="text-teal-600 font-extrabold text-sm" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant={order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : order.status === 'cancelled' ? 'danger' : 'info'}>
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Status selection quick changer */}
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 cursor-pointer disabled:opacity-50"
                      >
                        {VALID_STATUS_VALUES.map((status) => {
                          const label = status === 'preparing' ? 'ON DELIVERY' : status.toUpperCase();
                          return (
                            <option key={status} value={status}>
                              {label}
                            </option>
                          );
                        })}
                      </select>

                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="py-1 px-2.5 text-[10px] font-bold">
                          Details
                        </Button>
                      </Link>

                      {onDelete && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete order #${order.id}?`)) {
                              onDelete(order.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Order"
                        >
                          <i className="fa-solid fa-trash text-[11px]"></i>
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
