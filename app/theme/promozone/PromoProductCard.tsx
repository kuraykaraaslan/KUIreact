'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxesStacked, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '@/modules/ui/Badge';
import { priceRangeLabel, type PromoProduct } from './promozone.data';

type PromoProductCardProps = {
  product: PromoProduct;
  onSelect: (product: PromoProduct) => void;
  className?: string;
};

export function PromoProductCard({ product, onSelect, className }: PromoProductCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      aria-label={`View and customize ${product.name}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-border bg-surface-base text-left',
        'transition-all duration-200 hover:border-primary hover:shadow-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        className,
      )}
    >
      {/* Görsel */}
      <div className="relative h-44 w-full overflow-hidden bg-surface-sunken">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.isFeatured && (
          <span className="absolute left-2 top-2">
            <Badge variant="primary" size="sm">Featured</Badge>
          </span>
        )}
      </div>

      {/* İçerik */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-text-primary line-clamp-2">
            {product.name}
          </h3>
        </div>

        <p className="font-mono text-xs text-text-disabled">{product.sku}</p>

        <div className="mt-auto space-y-1.5 pt-1">
          <p className="text-sm font-semibold text-text-primary">
            {priceRangeLabel(product.minimumPrice, product.maximumPrice)}
            <span className="ml-1 text-xs font-normal text-text-secondary">/ unit</span>
          </p>
          <p className="flex items-center gap-1.5 text-xs text-text-secondary">
            <FontAwesomeIcon icon={faBoxesStacked} className="h-3 w-3" aria-hidden="true" />
            Min. {product.minimumOrderQuantity} units
          </p>
        </div>

        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-primary-hover">
          View product
          <FontAwesomeIcon
            icon={faArrowRight}
            className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </button>
  );
}
