'use client';

import Image from 'next/image';
import Link from 'next/link';
import Price from '@/components/atoms/Price';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addItem, openCart } = useCart();
  const { id, name, price, image, description, available } = product;

  // Simple video source detection
  const isVideo = image && (
    image.endsWith('.mp4') || 
    image.endsWith('.webm') || 
    image.includes('youtube.com') || 
    image.includes('youtu.be')
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (available) {
      addItem(product);
      openCart();
    }
  };

  return (
    <Link
      href={`/products/${id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-teal-500/20 transition-all duration-300 relative"
    >
      {/* Product Image / Video container */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        {image ? (
          isVideo ? (
            <video
              src={image}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          )
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400 font-extrabold text-3xl select-none">
            🐾
          </div>
        )}

        {/* Availability Badge */}
        {!available && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Badge variant="danger" className="scale-110">
              Out of stock
            </Badge>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-teal-600 transition-colors mb-1">
          {name}
        </h3>
        
        {description && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3 flex-grow">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-slate-50">
          <Price amount={price} className="text-base text-teal-600 font-extrabold" />
          
          <Button
            variant={available ? 'primary' : 'outline'}
            size="sm"
            disabled={!available}
            onClick={handleAddToCart}
            className="px-3 py-1.5 text-xs font-bold"
          >
            {available ? 'Add to Cart' : 'Sold Out'}
          </Button>
        </div>
      </div>
    </Link>
  );
}
