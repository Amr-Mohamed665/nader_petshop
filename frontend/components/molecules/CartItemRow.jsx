import Image from 'next/image';
import QuantitySelector from '@/components/molecules/QuantitySelector';
import Price from '@/components/atoms/Price';
import IconButton from '@/components/atoms/IconButton';

export default function CartItemRow({ item, onUpdateQuantity, onRemove }) {
  const isVideo = item.image && (
    item.image.endsWith('.mp4') || 
    item.image.endsWith('.webm') || 
    item.image.includes('youtube.com') || 
    item.image.includes('youtu.be')
  );

  return (
    <div className="flex gap-4 py-4 border-b border-slate-100 last:border-0 items-center animate-fade-in bg-white">
      {/* Product Image / Video thumbnail */}
      <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
        {item.image ? (
          isVideo ? (
            <div className="relative h-full w-full bg-slate-900 flex items-center justify-center">
              <span className="text-xl">📹</span>
            </div>
          ) : (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="64px"
              unoptimized
            />
          )
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold text-xl select-none">
            🐾
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-grow min-w-0">
        <h4 className="text-sm font-bold text-slate-800 truncate mb-0.5">
          {item.name}
        </h4>
        <div className="flex items-center justify-between gap-2 mt-1">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
            onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="scale-90 origin-left"
          />
          <IconButton
            variant="danger"
            onClick={() => onRemove(item.id)}
            className="p-1.5 rounded-full hover:bg-rose-50"
            title="Remove item"
          >
            🗑️
          </IconButton>
        </div>
      </div>

      {/* Subtotal */}
      <div className="flex flex-col items-end flex-shrink-0">
        <Price amount={item.price * item.quantity} className="text-sm text-teal-600 font-bold" />
        <span className="text-[10px] text-slate-400 mt-0.5">
          {formatUnit(item.price)} each
        </span>
      </div>
    </div>
  );
}

function formatUnit(price) {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}
