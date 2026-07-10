'use client';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMugHot, faPen, faBook, faMugSaucer, faBagShopping, faLaptop,
  faArrowRight, faCircleCheck, faEnvelope, faPhone, faTag,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { HeroSection } from '@/modules/domains/landing/hero/HeroSection';
import { HowItWorksSection } from '@/modules/domains/landing/how-it-works/HowItWorksSection';
import { FeatureGrid } from '@/modules/domains/landing/feature/FeatureGrid';
import { StatsBar } from '@/modules/domains/landing/stat/StatsBar';
import { PartnerLogosStrip } from '@/modules/domains/landing/partner/PartnerLogosStrip';
import { FaqAccordion } from '@/modules/domains/landing/faq/FaqAccordion';
import { Button } from '@/modules/ui/Button';
import { PromoTopBar } from './PromoTopBar';
import { PromoProductCard } from './PromoProductCard';
import { ProductDetailView } from './ProductDetailView';
import { CategoryView, sortProducts, type SortKey } from './CategoryView';
import { QuoteListDrawer } from './QuoteListDrawer';
import { QuoteRequestForm } from './QuoteRequestForm';
import { QuoteSuccess } from './QuoteSuccess';
import {
  PRODUCTS, CATEGORIES, HERO, HOW_IT_WORKS, FEATURES, STATS, PARTNERS, FAQS,
  PROMOZONE_BRAND, whatsappLink,
  type QuoteItem, type PromoProduct,
} from './promozone.data';

const CATEGORY_ICONS: Record<string, typeof faTag> = {
  'cat-termos': faMugHot,
  'cat-kalem': faPen,
  'cat-defter': faBook,
  'cat-kupa': faMugSaucer,
  'cat-canta': faBagShopping,
  'cat-teknoloji': faLaptop,
};

type View = 'home' | 'category' | 'product';

function scrollTop() {
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
}

export default function PromozoneHomePage() {
  // ── Navigasyon ──
  const [view, setView] = useState<View>('home');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<PromoProduct | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [returnView, setReturnView] = useState<View>('home');

  // ── Teklif akışı ──
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [rfqNumber, setRfqNumber] = useState<string | null>(null);

  // ── Katalog filtre ──
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');

  // ── Geçici bildirim ──
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const editingItem = editingItemId ? quoteItems.find((i) => i.id === editingItemId) ?? null : null;
  const featuredProducts = useMemo(() => PRODUCTS.filter((p) => p.isActive && p.isFeatured), []);

  const listingProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      if (!p.isActive) return false;
      if (activeCategory && p.categoryId !== activeCategory) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
    return sortProducts(list, sort);
  }, [search, activeCategory, sort]);

  // ── Navigasyon handler'ları ──
  function openCategory(categoryId: string | null) {
    setActiveCategory(categoryId);
    setView('category');
    scrollTop();
  }

  function openProduct(product: PromoProduct) {
    setActiveProduct(product);
    setEditingItemId(null);
    setReturnView(view === 'category' ? 'category' : 'home');
    setView('product');
    scrollTop();
  }

  function backFromProduct() {
    setView(returnView);
    setEditingItemId(null);
    scrollTop();
  }

  function backToHome() {
    setView('home');
    setSearch('');
    scrollTop();
  }

  function handleSearch(value: string) {
    setSearch(value);
    if (value.trim() && view === 'home') {
      setActiveCategory(null);
      setView('category');
      scrollTop();
    }
  }

  // ── Teklif handler'ları ──
  function handleConfigSubmit(item: QuoteItem) {
    const wasEditing = !!editingItemId;
    setQuoteItems((items) =>
      wasEditing ? items.map((i) => (i.id === item.id ? item : i)) : [...items, item],
    );
    setEditingItemId(null);
    setView(returnView);
    scrollTop();
    if (wasEditing) {
      setIsDrawerOpen(true);
    } else {
      setToast(`“${item.snapshot.name}” added to your quote list.`);
    }
  }

  function editItem(item: QuoteItem) {
    const product = PRODUCTS.find((p) => p.id === item.productId) ?? null;
    if (!product) return;
    setActiveProduct(product);
    setEditingItemId(item.id);
    setReturnView(view === 'category' ? 'category' : 'home');
    setIsDrawerOpen(false);
    setView('product');
    scrollTop();
  }

  function removeItem(id: string) {
    setQuoteItems((items) => items.filter((i) => i.id !== id));
  }

  function proceedToForm() {
    setIsDrawerOpen(false);
    setIsFormOpen(true);
  }

  function handleFormSubmit() {
    const year = new Date().getFullYear();
    const seq = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
    setRfqNumber(`RFQ-${year}-${seq}`);
    setQuoteItems([]);
    setIsFormOpen(false);
    setIsSuccessOpen(true);
    setView('home');
  }

  const activeCategoryName = activeCategory
    ? CATEGORIES.find((c) => c.id === activeCategory)?.name
    : undefined;
  const productCategoryName = activeProduct
    ? CATEGORIES.find((c) => c.id === activeProduct.categoryId)?.name
    : undefined;

  return (
    <div id="top" className="flex min-h-screen flex-col bg-surface-base text-text-primary">
      <PromoTopBar
        quoteCount={quoteItems.length}
        search={search}
        onSearch={handleSearch}
        onOpenQuote={() => setIsDrawerOpen(true)}
      />

      <main id="main-content" className="flex-1">
        {view === 'product' && activeProduct ? (
          <ProductDetailView
            key={`${activeProduct.id}-${editingItemId ?? 'new'}`}
            product={activeProduct}
            categoryName={productCategoryName}
            editingItem={editingItem}
            onBack={backFromProduct}
            onSubmit={handleConfigSubmit}
          />
        ) : view === 'category' ? (
          <CategoryView
            title={activeCategoryName ?? (search.trim() ? `Results for “${search.trim()}”` : 'All products')}
            subtitle={activeCategoryName ? CATEGORIES.find((c) => c.id === activeCategory)?.description : undefined}
            products={listingProducts}
            categories={CATEGORIES}
            activeCategory={activeCategory}
            sort={sort}
            onSortChange={setSort}
            onPickCategory={(id) => setActiveCategory(id)}
            onSelectProduct={openProduct}
            onBack={backToHome}
            onClearFilters={() => { setSearch(''); setActiveCategory(null); }}
          />
        ) : (
          <HomeSections
            featuredProducts={featuredProducts}
            onOpenCategory={openCategory}
            onOpenProduct={openProduct}
            onOpenAll={() => openCategory(null)}
          />
        )}
      </main>

      {/* Footer · base (CTA raised sonrası şerit devam eder) */}
      <footer className="border-t border-border bg-surface-base">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-fg" aria-hidden="true">
                <FontAwesomeIcon icon={faTag} className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold">{PROMOZONE_BRAND.name}</span>
            </div>
            <p className="text-sm text-text-secondary">{PROMOZONE_BRAND.tagline}. Your one stop for promotional products that add value to your brand.</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-text-primary">Contact</p>
            <a href={`mailto:${PROMOZONE_BRAND.email}`} className="flex items-center gap-2 text-text-secondary hover:text-primary">
              <FontAwesomeIcon icon={faEnvelope} className="h-3.5 w-3.5" aria-hidden="true" />
              {PROMOZONE_BRAND.email}
            </a>
            <a href={`tel:${PROMOZONE_BRAND.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-text-secondary hover:text-primary">
              <FontAwesomeIcon icon={faPhone} className="h-3.5 w-3.5" aria-hidden="true" />
              {PROMOZONE_BRAND.phone}
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary hover:text-primary">
              <FontAwesomeIcon icon={faWhatsapp} className="h-3.5 w-3.5 text-[var(--success)]" aria-hidden="true" />
              WhatsApp support
            </a>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-text-secondary">
          © {new Date().getFullYear()} {PROMOZONE_BRAND.name}. All rights reserved. · kui-react demo theme
        </div>
      </footer>

      {/* Overlay'ler */}
      <QuoteListDrawer
        open={isDrawerOpen}
        items={quoteItems}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={editItem}
        onRemove={removeItem}
        onProceed={proceedToForm}
      />
      <QuoteRequestForm
        open={isFormOpen}
        itemCount={quoteItems.length}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
      <QuoteSuccess
        open={isSuccessOpen}
        rfqNumber={rfqNumber}
        onClose={() => setIsSuccessOpen(false)}
      />

      {/* Geçici bildirim */}
      <div aria-live="polite" className="sr-only">{toast}</div>
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-[110] -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-base px-4 py-3 shadow-lg">
            <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4 text-[var(--success)]" aria-hidden="true" />
            <span className="text-sm text-text-primary">{toast}</span>
            <Button variant="ghost" size="xs" className="ml-2" onClick={() => setIsDrawerOpen(true)}>
              View list
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   Ana sayfa bölümleri (landing + kategori grid + öne çıkanlar)
========================================================= */

function HomeSections({
  featuredProducts,
  onOpenCategory,
  onOpenProduct,
  onOpenAll,
}: {
  featuredProducts: PromoProduct[];
  onOpenCategory: (id: string) => void;
  onOpenProduct: (product: PromoProduct) => void;
  onOpenAll: () => void;
}) {
  // Ana sayfa bölümleri, arka planları şerit halinde değişir:
  // base → raised → base → raised … (aynı renk asla art arda gelmez).
  return (
    <>
      {/* 1 · base */}
      <HeroSection hero={HERO} />

      {/* 2 · raised — Kategoriler */}
      <section id="kategoriler" className="border-t border-border bg-surface-raised">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Categories</h2>
            <p className="mt-2 text-text-secondary">Choose the promotional product group that fits your needs.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onOpenCategory(cat.id)}
                className={cn(
                  'group flex flex-col items-center gap-3 rounded-xl border border-border bg-surface-base p-4 text-center transition-colors',
                  'hover:border-primary hover:bg-surface-overlay',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                )}
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary" aria-hidden="true">
                  <FontAwesomeIcon icon={CATEGORY_ICONS[cat.id] ?? faTag} className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-text-primary">{cat.name}</span>
                <span className="text-xs text-text-secondary">{cat.productCount} products</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · base — Öne çıkan ürünler */}
      <section id="urunler" className="border-t border-border bg-surface-base">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Best sellers</h2>
              <p className="mt-2 text-text-secondary">The most requested promotional products.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAll}
              iconRight={<FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" aria-hidden="true" />}
            >
              All products
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <PromoProductCard key={product.id} product={product} onSelect={onOpenProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* 4 · raised — Nasıl çalışır */}
      <section id="nasil-calisir" className="border-t border-border bg-surface-raised">
        <HowItWorksSection
          eyebrow="In 4 steps"
          title="How it works"
          subtitle="Pick a product, customize it, and collect everything in a single quote request."
          steps={HOW_IT_WORKS}
        />
      </section>

      {/* 5 · base — Değer önerileri + istatistik */}
      <section className="border-t border-border bg-surface-base">
        <FeatureGrid
          eyebrow="Why Personalise"
          title="End-to-end corporate promo solution"
          features={FEATURES}
          columns={4}
        />
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <StatsBar stats={STATS} variant="cards" />
        </div>
      </section>

      {/* 6 · raised — Referanslar */}
      <section id="referanslar" className="border-t border-border bg-surface-raised">
        <PartnerLogosStrip label="Brands that trust us" partners={PARTNERS} />
      </section>

      {/* 7 · base — SSS */}
      <section id="sss" className="border-t border-border bg-surface-base">
        <FaqAccordion eyebrow="FAQ" title="Questions on your mind" items={FAQS} />
      </section>

      {/* 8 · raised — Final CTA */}
      <section className="border-t border-border bg-surface-raised">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Need bulk promo items?</h2>
          <p className="mx-auto mt-3 max-w-xl text-text-secondary">
            Pick products, customize them, and create your quote request in minutes. No sign-up required.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenAll}
              iconRight={<FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" aria-hidden="true" />}
            >
              Browse the catalog
            </Button>
            <Button
              as="a"
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="lg"
              iconLeft={<FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4 text-[var(--success)]" aria-hidden="true" />}
            >
              Ask on WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
