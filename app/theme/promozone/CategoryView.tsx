'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/modules/ui/Button';
import { Badge } from '@/modules/ui/Badge';
import { PromoProductCard } from './PromoProductCard';
import type { PromoCategory, PromoProduct } from './promozone.data';

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'moq-asc';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'moq-asc', label: 'Min. qty: low' },
];

export function sortProducts(list: PromoProduct[], sort: SortKey): PromoProduct[] {
  switch (sort) {
    case 'price-asc': return [...list].sort((a, b) => a.minimumPrice - b.minimumPrice);
    case 'price-desc': return [...list].sort((a, b) => b.maximumPrice - a.maximumPrice);
    case 'moq-asc': return [...list].sort((a, b) => a.minimumOrderQuantity - b.minimumOrderQuantity);
    default: return [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
}

type CategoryViewProps = {
  title: string;
  subtitle?: string;
  products: PromoProduct[];
  categories: PromoCategory[];
  activeCategory: string | null;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  onPickCategory: (id: string | null) => void;
  onSelectProduct: (product: PromoProduct) => void;
  onBack: () => void;
  onClearFilters: () => void;
};

export function CategoryView({
  title,
  subtitle,
  products,
  categories,
  activeCategory,
  sort,
  onSortChange,
  onPickCategory,
  onSelectProduct,
  onBack,
  onClearFilters,
}: CategoryViewProps) {
  return (
    <div>
      {/* Üst bar: geri + breadcrumb */}
      <div className="border-b border-border bg-surface-raised">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            iconLeft={<FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" aria-hidden="true" />}
          >
            Home
          </Button>
          <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-xs text-text-secondary sm:flex">
            <span>Catalog</span>
            <span aria-hidden="true">/</span>
            <span className="text-text-primary">{title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Başlık + sıralama */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-2 text-text-secondary">
              {products.length} products{subtitle ? ` · ${subtitle}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="promo-sort" className="text-sm text-text-secondary">Sort:</label>
            <select
              id="promo-sort"
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortKey)}
              className={cn(
                'rounded-md border border-border bg-surface-base px-3 py-2 text-sm text-text-primary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              )}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Kategori çipleri */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onPickCategory(null)}
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <Badge variant={activeCategory === null ? 'primary' : 'neutral'} size="lg">All</Badge>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onPickCategory(cat.id)}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              <Badge variant={activeCategory === cat.id ? 'primary' : 'neutral'} size="lg">{cat.name}</Badge>
            </button>
          ))}
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <PromoProductCard key={product.id} product={product} onSelect={onSelectProduct} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-sm text-text-secondary">No products match your search.</p>
            <Button variant="ghost" size="sm" className="mt-3" onClick={onClearFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
