'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ShopLayout from '@/components/templates/ShopLayout';
import Price from '@/components/atoms/Price';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Spinner from '@/components/atoms/Spinner';
import ErrorState from '@/components/molecules/ErrorState';
import QuantitySelector from '@/components/molecules/QuantitySelector';
import useProduct from '@/hooks/useProduct';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatPrice';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { product, loading, error, refetch } = useProduct(id);
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <ShopLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </ShopLayout>
    );
  }

  if (error || !product) {
    return (
      <ShopLayout>
        <div className="py-12">
          <ErrorState
            title="Product not found"
            description={error || "The requested product does not exist."}
            onRetry={refetch}
          />
        </div>
      </ShopLayout>
    );
  }

  const { name, price, image, description, category, available } = product;

  // Simple video source detection
  const isVideo = image && (
    image.endsWith('.mp4') || 
    image.endsWith('.webm') || 
    image.includes('youtube.com') || 
    image.includes('youtu.be')
  );

  const handleAddToCart = () => {
    if (available) {
      addItem(product, quantity);
      openCart();
    }
  };

  return (
    <ShopLayout>
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="text-xs font-bold text-slate-500 hover:text-teal-600 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          ← Back to Catalog
        </button>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          {/* Media Player Column */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
            {image ? (
              isVideo ? (
                <video
                  src={image}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  unoptimized
                />
              )
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-400 font-extrabold text-5xl select-none">
                🐾
              </div>
            )}
          </div>

          {/* Info Details Column */}
          <div className="flex flex-col justify-between py-2 gap-6">
            <div className="space-y-4">
              {/* Category tag */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block bg-teal-50 text-teal-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-teal-100 uppercase tracking-wider">
                  {category}
                </span>
                <Badge variant={available ? 'success' : 'danger'}>
                  {available ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>

              {/* Title & Price */}
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {name}
                </h1>
                <div className="flex items-baseline gap-2 pt-1">
                  <Price amount={price} className="text-2xl text-teal-600 font-extrabold" />
                  <span className="text-xs text-slate-400 font-semibold">incl. VAT</span>
                </div>
              </div>

              {/* Description */}
              {description && (
                <div className="space-y-2 pt-2 border-t border-slate-50">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    About this product
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed text-balance">
                    {description}
                  </p>
                </div>
              )}
            </div>

            {/* Actions Block */}
            {available && (
              <div className="space-y-4 pt-4 border-t border-slate-100 mt-auto">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-500">Select Quantity</span>
                  <QuantitySelector
                    quantity={quantity}
                    onIncrease={() => setQuantity((q) => q + 1)}
                    onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="primary"
                    onClick={handleAddToCart}
                    className="w-full sm:flex-1 py-3.5 font-extrabold shadow-md shadow-teal-500/10 text-xs uppercase tracking-wider"
                  >
                    Add {quantity} to Cart 🛒
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
