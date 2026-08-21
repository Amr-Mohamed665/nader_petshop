'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ShopLayout from '@/components/templates/ShopLayout';
import ProtectedRoute from '@/components/guards/ProtectedRoute';
import Price from '@/components/atoms/Price';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersService } from '@/services/orders.service';

import { toastSuccess, toastError } from '@/utils/toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, count, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    setLoading(true);
    try {
      // Transform cart items to the backend format: { menuItemId, quantity }
      const orderItems = items.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
      }));

      const response = await ordersService.create(orderItems);

      if (response.success) {
        clearCart();
        toastSuccess('Order submitted successfully.');
        router.push(`/orders/${response.data.id}`);
      } else {
        toastError(response.message || 'Failed to place order.');
      }
    } catch (err) {
      toastError(err, 'An error occurred while placing your order.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <ShopLayout>
        <div className="py-12">
          <EmptyState
            title="Nothing to checkout"
            description="Your cart is empty. Add items to your cart before checking out."
            icon="🛒"
            actionLabel="Browse Products"
            actionHref="/products"
          />
        </div>
      </ShopLayout>
    );
  }

  return (
    <ProtectedRoute>
      <ShopLayout>
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          {/* Page Header */}
          <div className="border-b border-slate-100 pb-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Checkout
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Review your order below and confirm to place it.
            </p>
          </div>

          {/* Customer Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Name</span>
                <p className="font-bold text-slate-800">{user?.name || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email</span>
                <p className="font-bold text-slate-800">{user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Order Items ({count})
            </h2>

            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Qty: {item.quantity} × {new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(item.price)}
                    </p>
                  </div>
                  <Price amount={item.price * item.quantity} className="text-sm text-teal-600 font-extrabold flex-shrink-0" />
                </div>
              ))}
            </div>

            <hr className="border-slate-100" />

            <div className="flex justify-between items-center text-base pt-2">
              <span className="font-extrabold text-slate-900">Total Amount</span>
              <Price amount={total} className="text-xl text-teal-600 font-extrabold" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/cart" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full py-3.5 font-bold text-xs">
                ← Back to Cart
              </Button>
            </Link>
            <Button
              variant="primary"
              onClick={handlePlaceOrder}
              isLoading={loading}
              className="w-full sm:flex-1 py-3.5 font-extrabold shadow-lg shadow-teal-500/15 text-xs uppercase tracking-wider"
            >
              Confirm & Place Order 🎉
            </Button>
          </div>
        </div>
      </ShopLayout>
    </ProtectedRoute>
  );
}
