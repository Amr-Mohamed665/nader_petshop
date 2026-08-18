import { formatPrice } from '@/utils/formatPrice';
import { cn } from '@/utils/cn';

export default function Price({ amount, className }) {
  return (
    <span className={cn('font-bold text-slate-900', className)}>
      {formatPrice(amount)}
    </span>
  );
}
