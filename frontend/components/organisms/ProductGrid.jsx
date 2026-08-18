import ProductCard from '@/components/organisms/ProductCard';
import EmptyState from '@/components/molecules/EmptyState';
import { cn } from '@/utils/cn';

export default function ProductGrid({ products = [], className }) {
  if (products.length === 0) {
    return (
      <div className="py-12 w-full">
        <EmptyState
          title="No products available"
          description="We couldn't find any products in this category at the moment. Please check back later!"
          icon="📦"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full',
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
