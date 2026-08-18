'use client';

import Link from 'next/link';
import Image from 'next/image';
import ShopLayout from '@/components/templates/ShopLayout';
import QuantitySelector from '@/components/molecules/QuantitySelector';
import EmptyState from '@/components/molecules/EmptyState';
import Price from '@/components/atoms/Price';
import Button from '@/components/atoms/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { items, total, count, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (items.length === 0) {
    return (
      <ShopLayout>
        <div className="py-12">
          <EmptyState
            title="Your cart is empty"
            description="Looks like you haven't added anything to your cart yet. Explore our catalog and find the perfect supplies for your pet!"
            icon="🛒"
            actionLabel="Browse Products"
            actionHref="/products"
          />
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {count} {count === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs">
            🗑️ Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const isVideo = item.image && (
                item.image.endsWith('.mp4') || item.image.endsWith('.webm')
              );

              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all items-center"
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                    {item.image ? (
                      isVideo ? (
                        <div className="h-full w-full bg-slate-900 flex items-center justify-center">
                          <span className="text-2xl">📹</span>
                        </div>
                      ) : (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                          unoptimized
                        />
                      )
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-2xl select-none">🐾</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0 space-y-2">
                    <Link href={`/products/${item.id}`} className="text-sm font-bold text-slate-800 hover:text-teal-600 transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-3">
                      <QuantitySelector
                        quantity={item.quantity}
                        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                        onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                      />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0 space-y-0.5">
                    <Price amount={item.price * item.quantity} className="text-base text-teal-600 font-extrabold" />
                    <p className="text-[10px] text-slate-400">
                      {new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(item.price)} each
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm sticky top-24 space-y-5">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({count} items)</span>
                  <Price amount={total} className="font-bold text-slate-800" />
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-xs font-bold text-emerald-600">FREE</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between text-base font-extrabold">
                  <span className="text-slate-900">Total</span>
                  <Price amount={total} className="text-teal-600 text-lg" />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {isAuthenticated ? (
                  <Link href="/checkout" className="block">
                    <Button variant="primary" className="w-full py-3.5 font-extrabold shadow-md shadow-teal-500/10 text-xs uppercase tracking-wider">
                      Proceed to Checkout
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login" className="block">
                    <Button variant="primary" className="w-full py-3.5 font-extrabold shadow-md shadow-teal-500/10 text-xs uppercase tracking-wider">
                      Login to Checkout
                    </Button>
                  </Link>
                )}
                <Link href="/products" className="block">
                  <Button variant="outline" className="w-full py-3 font-bold text-xs">
                    ← Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
