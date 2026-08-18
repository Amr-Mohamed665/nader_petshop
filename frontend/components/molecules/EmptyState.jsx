import Link from 'next/link';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';

export default function EmptyState({
  title = 'No items found',
  description = "We couldn't find what you were looking for.",
  icon = '🔍',
  actionLabel,
  actionHref,
  onAction,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-300 rounded-2xl bg-white max-w-md mx-auto shadow-sm animate-fade-in', className)}>
      <span className="text-5xl mb-4 select-none">{icon}</span>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 text-balance">{description}</p>
      
      {actionHref && actionLabel && (
        <Link href={actionHref}>
          <Button variant="primary">{actionLabel}</Button>
        </Link>
      )}

      {!actionHref && actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
