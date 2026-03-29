import { Link } from 'react-router-dom';
import { type Product, getDiscountPercent, formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact }: ProductCardProps) {
  const discount = getDiscountPercent(product.price, product.oldPrice);

  return (
    <Link
      to={`/produit/${product.id}`}
      className={`group block ${compact ? 'min-w-[200px] w-[200px]' : ''}`}
    >
      <div className="relative aspect-square bg-secondary rounded-xl overflow-hidden mb-3">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-foreground text-background text-xs font-bold px-2 py-1 rounded-md">
            -{discount}%
          </span>
        )}
        {product.isPack && (
          <span className="absolute top-2 right-2 bg-foreground text-background text-xs font-bold px-2 py-1 rounded-md">
            PACK
          </span>
        )}
      </div>
      <h3 className="font-medium text-sm leading-tight mb-1">{product.name}</h3>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
        {product.oldPrice && (
          <span className="text-muted-foreground text-xs line-through">{formatPrice(product.oldPrice)}</span>
        )}
      </div>
    </Link>
  );
}
