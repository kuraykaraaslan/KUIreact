# Personalise Theme (`/theme/promozone`)

B2B promotional-products catalog demo. Single frontend route: the user customizes
a product with **color / print technique / print position / quantity / logo**,
adds it to a **quote list**, and submits a **single quote request (RFQ)** with
their company details, receiving a request number. No payment or online ordering.

## Structure

Single route, three full-page client-side views (state lives in `page.tsx` — no Zustand/Context).

| File | Responsibility |
|---|---|
| `layout.tsx` | Server shell: metadata + `SkipLink`. |
| `page.tsx` | `'use client'` orchestrator: all state + top bar + landing sections + view switch + overlays. |
| `promozone.data.ts` | Theme-local types + static sample data (6 categories, 17 products, landing content). |
| `PromoTopBar.tsx` | Sticky header: logo, nav, search, WhatsApp, quote badge. |
| `PromoProductCard.tsx` | Clickable product tile → opens the product detail view. |
| `CategoryView.tsx` | Full-page category/product listing: chips, sort, grid. |
| `ProductDetailView.tsx` | Full-page detail + configurator (color/print/quantity/logo/note). |
| `LogoPlacementEditor.tsx` | Interactive logo uploader: drag-align + zoom + rotate within the print area. |
| `QuoteListDrawer.tsx` | Right drawer: quote items, edit/remove, estimated total. |
| `QuoteRequestForm.tsx` | Company/contact form (plain `useState` validation) + consent. |
| `QuoteSuccess.tsx` | Success modal showing the RFQ number. |

## Views & flow

`Home → Category listing page → Product detail page` (client-side view switch inside
one route). Product & category are full pages, not modals. The quote list is a right
**Drawer**; the request form and success screen are **Modals**. Print options are
dynamic per product (`product.printOptions`). Each quote item stores a product **snapshot**.

## Conventions

1. `layout.tsx` is a server component; `page.tsx` is `'use client'` because it owns state.
2. `<main id="main-content">` lives in `page.tsx` for the skip link.
3. All sample data is in `promozone.data.ts`; components receive data via props.
4. No domain components are duplicated — `modules/domains/landing`, `modules/domains/commerce`
   and `modules/ui` are reused; only RFQ-flow wrappers are theme-local.
5. No new domain vertical; theme registration is only in `showcase.menu.ts` /
   `showcase.config.ts` / `HomePanel.tsx`.
6. Home section backgrounds alternate `base → raised` so no two consecutive sections share a color.
7. Token-only styling, Font Awesome icons, `cn()`, `focus-visible` ring, ARIA.

> Note: the route slug and folder are still `promozone`; the displayed brand is **Personalise**.

Canonical project rules: [AGENTS.md](../../../AGENTS.md).
