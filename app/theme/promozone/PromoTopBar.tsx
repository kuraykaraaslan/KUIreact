'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { SearchBar } from '@/modules/ui/SearchBar';
import { Button } from '@/modules/ui/Button';
import { PROMOZONE_BRAND, whatsappLink } from './promozone.data';

const NAV_LINKS = [
  { label: 'Categories', href: '#kategoriler' },
  { label: 'Products', href: '#urunler' },
  { label: 'How it works', href: '#nasil-calisir' },
  { label: 'Clients', href: '#referanslar' },
  { label: 'FAQ', href: '#sss' },
];

type PromoTopBarProps = {
  quoteCount: number;
  search: string;
  onSearch: (value: string) => void;
  onOpenQuote: () => void;
};

export function PromoTopBar({ quoteCount, search, onSearch, onOpenQuote }: PromoTopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-base/95 backdrop-blur supports-[backdrop-filter]:bg-surface-base/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        {/* Logo */}
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-fg"
            aria-hidden="true"
          >
            <FontAwesomeIcon icon={faTag} className="h-4 w-4" />
          </span>
          <span className="text-lg font-bold tracking-tight text-text-primary">{PROMOZONE_BRAND.name}</span>
        </a>

        {/* Nav (desktop) */}
        <nav aria-label="Main menu" className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors',
                'hover:bg-surface-overlay hover:text-text-primary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Arama (desktop) */}
        <div className="ml-auto hidden w-56 md:block">
          <SearchBar
            id="promo-search"
            placeholder="Search products…"
            value={search}
            onChange={onSearch}
          />
        </div>

        {/* WhatsApp */}
        <Button
          as="a"
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          size="sm"
          iconOnly
          aria-label="Contact us on WhatsApp"
          className="ml-auto text-[var(--success)] md:ml-2"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="h-5 w-5" aria-hidden="true" />
        </Button>

        {/* Teklif listesi */}
        <button
          type="button"
          onClick={onOpenQuote}
          aria-label={`Quote list, ${quoteCount} items`}
          className={cn(
            'relative inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-text-primary',
            'transition-colors hover:bg-surface-overlay',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          )}
        >
          <FontAwesomeIcon icon={faFileLines} className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">My quote list</span>
          {quoteCount > 0 && (
            <span
              className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-fg"
              aria-hidden="true"
            >
              {quoteCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
