// Personalise theme — static sample data.
//
// B2B promotional products catalog: the user customizes a product with
// color / print / quantity / logo and collects everything into a single
// quote request (RFQ). All data is static. Landing display types are
// imported from the landing domain.

import type { Hero, HowItWorksStep, Feature, Stat, PartnerLogo, FaqItem } from '@/modules/domains/landing/types';

/* =========================================================
   TYPES
========================================================= */

export type PromoCategory = {
  id: string;
  name: string;
  slug: string;
  /** FontAwesome solid icon variable is mapped in the page (see CATEGORY_ICON) */
  icon: string;
  image: string;
  productCount: number;
  description: string;
};

export type PromoPrintOption = {
  technique: string;      // e.g. "Laser Engraving"
  positions: string[];    // e.g. ["Front", "Back"]
  requiresLogo: boolean;
};

export type PromoColor = { name: string; hex: string };

export type PromoProduct = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  image: string;
  gallery: string[];              // image gallery (first item = image)
  minimumOrderQuantity: number;   // MOQ
  minimumPrice: number;           // ₺ range lower bound (per unit)
  maximumPrice: number;           // ₺ range upper bound (per unit)
  colors: PromoColor[];
  printOptions: PromoPrintOption[];
  specs: { label: string; value: string }[];
  attributes: Record<string, string | number | boolean>;
  isFeatured: boolean;
  isActive: boolean;
};

/** Placement of the uploaded logo inside the print area (align + zoom + rotate). */
export type LogoPlacement = {
  dataUrl: string;   // data URL of the uploaded image (for preview)
  fileName: string;
  x: number;         // horizontal offset from print-area center (editor stage px)
  y: number;         // vertical offset
  scale: number;     // 1 = original size
  rotation: number;  // degrees
};

/** Quote line item — with a product snapshot (survives later product edits). */
export type QuoteItem = {
  id: string;
  productId: string;
  snapshot: {
    sku: string;
    name: string;
    image: string;
    minimumPrice: number;
    maximumPrice: number;
  };
  quantity: number;
  color?: PromoColor;
  printed: boolean;
  printTechnique?: string;
  printPosition?: string;
  logo?: LogoPlacement;
  note?: string;
};

export type QuoteForm = {
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  deliveryDate: string;
  description: string;
  consentAccepted: boolean;
  // optional
  taxNumber?: string;
  website?: string;
  altContact?: string;
};

/* =========================================================
   BRAND / CONTACT
========================================================= */

export const PROMOZONE_BRAND = {
  name: 'Personalise',
  tagline: 'Branded promotional products for your company',
  /** for the wa.me link (demo number) */
  whatsappNumber: '905555555555',
  whatsappMessage: 'Hello, I would like to request a quote for promotional products.',
  email: 'quotes@personalise.example',
  phone: '+90 212 555 0 555',
} as const;

export function whatsappLink(text: string = PROMOZONE_BRAND.whatsappMessage): string {
  return `https://wa.me/${PROMOZONE_BRAND.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/** ₺ formatting. */
export function formatTRY(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Estimated per-product price range label. */
export function priceRangeLabel(min: number, max: number): string {
  return `${formatTRY(min)} – ${formatTRY(max)}`;
}

/* =========================================================
   IMAGES
========================================================= */

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&q=80`;

/* =========================================================
   CATEGORIES (6)
========================================================= */

export const CATEGORIES: PromoCategory[] = [
  {
    id: 'cat-termos',
    name: 'Thermos',
    slug: 'thermos',
    icon: 'mug-hot',
    image: img('1544716278-ca5e3f4abd8c'),
    productCount: 2,
    description: 'Steel and copper-lined thermoses',
  },
  {
    id: 'cat-kalem',
    name: 'Pen',
    slug: 'pen',
    icon: 'pen',
    image: img('1583394838336-acd977736f90'),
    productCount: 3,
    description: 'Metal, plastic and bamboo pens',
  },
  {
    id: 'cat-defter',
    name: 'Notebook',
    slug: 'notebook',
    icon: 'book',
    image: img('1531346878377-a5be20888e57'),
    productCount: 2,
    description: 'Hardcover, spiral and lined notebooks',
  },
  {
    id: 'cat-kupa',
    name: 'Mug',
    slug: 'mug',
    icon: 'mug-saucer',
    image: img('1514228742587-6b1558fcca3d'),
    productCount: 3,
    description: 'Ceramic, enamel and color-changing mugs',
  },
  {
    id: 'cat-canta',
    name: 'Bag',
    slug: 'bag',
    icon: 'bag-shopping',
    image: img('1553062407-98eeb64c6a62'),
    productCount: 3,
    description: 'Tote, backpack and laptop bags',
  },
  {
    id: 'cat-teknoloji',
    name: 'Tech',
    slug: 'tech',
    icon: 'laptop',
    image: img('1583394838336-acd977736f90'),
    productCount: 4,
    description: 'Power banks, chargers, USB and speakers',
  },
];

/* Category slug → FontAwesome icon name (for HowItWorks/Feature-style library lookup) */
export const CATEGORY_ICON: Record<string, string> = {
  thermos: 'mug-hot',
  pen: 'pen',
  notebook: 'book',
  mug: 'mug-saucer',
  bag: 'bag-shopping',
  tech: 'laptop',
};

/* =========================================================
   COLOR PALETTE (reusable)
========================================================= */

const C = {
  white: { name: 'White', hex: '#ffffff' },
  black: { name: 'Black', hex: '#111827' },
  navy: { name: 'Navy', hex: '#1e3a8a' },
  red: { name: 'Red', hex: '#dc2626' },
  green: { name: 'Green', hex: '#16a34a' },
  gray: { name: 'Gray', hex: '#6b7280' },
  blue: { name: 'Blue', hex: '#2563eb' },
  maroon: { name: 'Maroon', hex: '#7f1d1d' },
  silver: { name: 'Silver', hex: '#cbd5e1' },
  natural: { name: 'Natural', hex: '#d6c7a1' },
} satisfies Record<string, PromoColor>;

/* =========================================================
   PRODUCTS (17)
========================================================= */

export const PRODUCTS: PromoProduct[] = [
  // ── Thermos ─────────────────────────────────────────
  {
    id: 'p-termos-celik-500',
    sku: 'TRM-500',
    name: 'Steel Thermos 500ml',
    slug: 'steel-thermos-500ml',
    description: 'Double-walled vacuum stainless steel thermos. Keeps hot for 12h, cold for 24h.',
    categoryId: 'cat-termos',
    image: img('1544716278-ca5e3f4abd8c'),
    gallery: [img('1544716278-ca5e3f4abd8c'), img('1503341504253-dff4815485f1'), img('1524678606370-a47ad25cb82a')],
    minimumOrderQuantity: 100,
    minimumPrice: 145,
    maximumPrice: 220,
    colors: [C.silver, C.black, C.navy, C.red, C.green],
    printOptions: [
      { technique: 'Laser Engraving', positions: ['Front', 'Side'], requiresLogo: true },
      { technique: 'Screen Print', positions: ['Front', 'Back'], requiresLogo: true },
      { technique: 'Digital Print', positions: ['Front'], requiresLogo: true },
    ],
    specs: [
      { label: 'Volume', value: '500 ml' },
      { label: 'Material', value: '304 stainless steel' },
      { label: 'Insulation', value: 'Double-wall vacuum' },
    ],
    attributes: { insulation: '12h hot / 24h cold', bpaFree: true },
    isFeatured: true,
    isActive: true,
  },
  {
    id: 'p-termos-bakir-750',
    sku: 'TRM-750',
    name: 'Copper-Lined Thermos 750ml',
    slug: 'copper-lined-thermos-750ml',
    description: 'Copper-coated inner surface for superior insulation. Non-slip base and leak-proof lid.',
    categoryId: 'cat-termos',
    image: img('1524678606370-a47ad25cb82a'),
    gallery: [img('1524678606370-a47ad25cb82a'), img('1544716278-ca5e3f4abd8c'), img('1550439062-609e1531270e')],
    minimumOrderQuantity: 100,
    minimumPrice: 190,
    maximumPrice: 280,
    colors: [C.black, C.silver, C.maroon, C.navy],
    printOptions: [
      { technique: 'Laser Engraving', positions: ['Front', 'Side'], requiresLogo: true },
      { technique: 'Digital Print', positions: ['Front'], requiresLogo: true },
    ],
    specs: [
      { label: 'Volume', value: '750 ml' },
      { label: 'Inner surface', value: 'Copper coated' },
      { label: 'Lid', value: 'Leak-proof screw' },
    ],
    attributes: { insulation: '18h hot / 36h cold', bpaFree: true },
    isFeatured: false,
    isActive: true,
  },

  // ── Pen ─────────────────────────────────────────────
  {
    id: 'p-kalem-metal',
    sku: 'KLM-MTL',
    name: 'Metal Ballpoint Pen',
    slug: 'metal-ballpoint-pen',
    description: 'Weighted metal body with twist mechanism. Ideal for corporate gifts.',
    categoryId: 'cat-kalem',
    image: img('1583394838336-acd977736f90'),
    gallery: [img('1583394838336-acd977736f90'), img('1546435770-a3e426bf472b'), img('1527814050087-3793815479db')],
    minimumOrderQuantity: 250,
    minimumPrice: 18,
    maximumPrice: 42,
    colors: [C.black, C.silver, C.navy, C.maroon, C.blue],
    printOptions: [
      { technique: 'Laser Engraving', positions: ['Barrel', 'Clip'], requiresLogo: true },
      { technique: 'Pad Print', positions: ['Barrel'], requiresLogo: true },
    ],
    specs: [
      { label: 'Body', value: 'Aluminium' },
      { label: 'Tip', value: '0.7 mm' },
      { label: 'Ink', value: 'Blue' },
    ],
    attributes: { refillable: true },
    isFeatured: true,
    isActive: true,
  },
  {
    id: 'p-kalem-roller-set',
    sku: 'KLM-RLR',
    name: 'Roller Pen Set',
    slug: 'roller-pen-set',
    description: 'Boxed roller + ballpoint duo set. The presentation box can be printed too.',
    categoryId: 'cat-kalem',
    image: img('1546435770-a3e426bf472b'),
    gallery: [img('1546435770-a3e426bf472b'), img('1583394838336-acd977736f90'), img('1556821840-3a63f15732ce')],
    minimumOrderQuantity: 100,
    minimumPrice: 65,
    maximumPrice: 120,
    colors: [C.black, C.navy, C.maroon],
    printOptions: [
      { technique: 'Laser Engraving', positions: ['Barrel'], requiresLogo: true },
      { technique: 'Foil Print', positions: ['Box'], requiresLogo: true },
    ],
    specs: [
      { label: 'Contents', value: 'Roller + Ballpoint' },
      { label: 'Box', value: 'Magnetic cardboard' },
    ],
    attributes: { giftBox: true },
    isFeatured: false,
    isActive: true,
  },
  {
    id: 'p-kalem-bambu',
    sku: 'KLM-BMB',
    name: 'Bamboo Pen',
    slug: 'bamboo-pen',
    description: 'Natural bamboo body, recyclable eco-friendly pen.',
    categoryId: 'cat-kalem',
    image: img('1527814050087-3793815479db'),
    gallery: [img('1527814050087-3793815479db'), img('1583394838336-acd977736f90'), img('1546435770-a3e426bf472b')],
    minimumOrderQuantity: 250,
    minimumPrice: 12,
    maximumPrice: 26,
    colors: [C.natural],
    printOptions: [
      { technique: 'Laser Engraving', positions: ['Barrel'], requiresLogo: true },
    ],
    specs: [
      { label: 'Body', value: 'Bamboo' },
      { label: 'Tip', value: '1.0 mm' },
    ],
    attributes: { eco: true },
    isFeatured: false,
    isActive: true,
  },

  // ── Notebook ────────────────────────────────────────
  {
    id: 'p-defter-sert-a5',
    sku: 'DFT-A5',
    name: 'Hardcover Notebook A5',
    slug: 'hardcover-notebook-a5',
    description: 'Hardcover notebook with elastic band and pen loop. 160 lined pages.',
    categoryId: 'cat-defter',
    image: img('1531346878377-a5be20888e57'),
    gallery: [img('1531346878377-a5be20888e57'), img('1544816155-12df9643f363'), img('1517842645767-c639042777db')],
    minimumOrderQuantity: 100,
    minimumPrice: 75,
    maximumPrice: 140,
    colors: [C.black, C.navy, C.maroon, C.green, C.gray],
    printOptions: [
      { technique: 'Foil Print', positions: ['Cover'], requiresLogo: true },
      { technique: 'Screen Print', positions: ['Cover'], requiresLogo: true },
      { technique: 'Digital Print', positions: ['Cover', 'Back'], requiresLogo: true },
    ],
    specs: [
      { label: 'Size', value: 'A5 (14x21 cm)' },
      { label: 'Pages', value: '160 lined' },
      { label: 'Paper', value: '80 gsm ivory' },
    ],
    attributes: { elasticBand: true, penLoop: true },
    isFeatured: true,
    isActive: true,
  },
  {
    id: 'p-defter-spiral-a4',
    sku: 'DFT-A4',
    name: 'Spiral Notebook A4',
    slug: 'spiral-notebook-a4',
    description: 'Metal spiral A4 notebook with grid pages. Thick cover with bookmark.',
    categoryId: 'cat-defter',
    image: img('1544816155-12df9643f363'),
    gallery: [img('1544816155-12df9643f363'), img('1531346878377-a5be20888e57'), img('1517842645767-c639042777db')],
    minimumOrderQuantity: 100,
    minimumPrice: 90,
    maximumPrice: 160,
    colors: [C.black, C.navy, C.red, C.gray],
    printOptions: [
      { technique: 'Screen Print', positions: ['Cover'], requiresLogo: true },
      { technique: 'Digital Print', positions: ['Cover'], requiresLogo: true },
    ],
    specs: [
      { label: 'Size', value: 'A4 (21x29.7 cm)' },
      { label: 'Pages', value: '120 grid' },
      { label: 'Binding', value: 'Metal spiral' },
    ],
    attributes: { bookmark: true },
    isFeatured: false,
    isActive: true,
  },

  // ── Mug ─────────────────────────────────────────────
  {
    id: 'p-kupa-seramik',
    sku: 'KPA-SRM',
    name: 'Ceramic Mug 330ml',
    slug: 'ceramic-mug-330ml',
    description: 'Classic ceramic mug. Dishwasher-safe print option available.',
    categoryId: 'cat-kupa',
    image: img('1514228742587-6b1558fcca3d'),
    gallery: [img('1514228742587-6b1558fcca3d'), img('1517256064527-09c73fc73e38'), img('1481833761820-0509d3217039')],
    minimumOrderQuantity: 100,
    minimumPrice: 55,
    maximumPrice: 95,
    colors: [C.white, C.black, C.navy, C.red],
    printOptions: [
      { technique: 'Digital Print', positions: ['Front', 'Back', '360°'], requiresLogo: true },
      { technique: 'Screen Print', positions: ['Front', 'Back'], requiresLogo: true },
    ],
    specs: [
      { label: 'Volume', value: '330 ml' },
      { label: 'Material', value: 'Ceramic' },
      { label: 'Print', value: 'Kiln-cured' },
    ],
    attributes: { dishwasherSafe: true },
    isFeatured: true,
    isActive: true,
  },
  {
    id: 'p-kupa-sihirli',
    sku: 'KPA-MGC',
    name: 'Color-Changing Mug',
    slug: 'color-changing-mug',
    description: 'Magic mug that changes color with hot drinks. Print reveals when warm.',
    categoryId: 'cat-kupa',
    image: img('1517256064527-09c73fc73e38'),
    gallery: [img('1517256064527-09c73fc73e38'), img('1514228742587-6b1558fcca3d'), img('1481833761820-0509d3217039')],
    minimumOrderQuantity: 100,
    minimumPrice: 85,
    maximumPrice: 150,
    colors: [C.black],
    printOptions: [
      { technique: 'Digital Print', positions: ['Front', 'Back'], requiresLogo: true },
    ],
    specs: [
      { label: 'Volume', value: '330 ml' },
      { label: 'Effect', value: 'Heat-sensitive coating' },
    ],
    attributes: { magic: true, handWashOnly: true },
    isFeatured: false,
    isActive: true,
  },
  {
    id: 'p-kupa-emaye',
    sku: 'KPA-EMY',
    name: 'Enamel Mug 400ml',
    slug: 'enamel-mug-400ml',
    description: 'Retro enamel camping mug. Durable and lightweight, for outdoor events.',
    categoryId: 'cat-kupa',
    image: img('1481833761820-0509d3217039'),
    gallery: [img('1481833761820-0509d3217039'), img('1514228742587-6b1558fcca3d'), img('1517256064527-09c73fc73e38')],
    minimumOrderQuantity: 150,
    minimumPrice: 70,
    maximumPrice: 120,
    colors: [C.white, C.navy, C.red, C.green],
    printOptions: [
      { technique: 'Screen Print', positions: ['Front'], requiresLogo: true },
    ],
    specs: [
      { label: 'Volume', value: '400 ml' },
      { label: 'Material', value: 'Enamel-coated steel' },
    ],
    attributes: { camping: true },
    isFeatured: false,
    isActive: true,
  },

  // ── Bag ─────────────────────────────────────────────
  {
    id: 'p-canta-bez',
    sku: 'CNT-BEZ',
    name: 'Cotton Tote Bag',
    slug: 'cotton-tote-bag',
    description: 'Heavyweight raw cotton tote. Long handles, wide print area. Eco choice.',
    categoryId: 'cat-canta',
    image: img('1553062407-98eeb64c6a62'),
    gallery: [img('1553062407-98eeb64c6a62'), img('1548036328-c9fa89d128fa'), img('1591561954557-26941169b49e')],
    minimumOrderQuantity: 300,
    minimumPrice: 28,
    maximumPrice: 60,
    colors: [C.natural, C.black, C.navy],
    printOptions: [
      { technique: 'Screen Print', positions: ['Front', 'Back'], requiresLogo: true },
      { technique: 'Digital Print', positions: ['Front'], requiresLogo: true },
    ],
    specs: [
      { label: 'Material', value: '140 gsm cotton' },
      { label: 'Size', value: '38x42 cm' },
      { label: 'Handle', value: '70 cm' },
    ],
    attributes: { eco: true },
    isFeatured: true,
    isActive: true,
  },
  {
    id: 'p-canta-sirt',
    sku: 'CNT-SRT',
    name: 'Backpack',
    slug: 'backpack',
    description: 'Water-repellent fabric, multi-compartment backpack. Laptop sleeve.',
    categoryId: 'cat-canta',
    image: img('1548036328-c9fa89d128fa'),
    gallery: [img('1548036328-c9fa89d128fa'), img('1553062407-98eeb64c6a62'), img('1491637639811-60e2756cc1c7')],
    minimumOrderQuantity: 50,
    minimumPrice: 320,
    maximumPrice: 520,
    colors: [C.black, C.navy, C.gray],
    printOptions: [
      { technique: 'Embroidery', positions: ['Front pocket'], requiresLogo: true },
      { technique: 'Screen Print', positions: ['Front'], requiresLogo: true },
    ],
    specs: [
      { label: 'Fabric', value: '600D polyester' },
      { label: 'Laptop', value: '15.6" compartment' },
      { label: 'Capacity', value: '22 L' },
    ],
    attributes: { waterResistant: true },
    isFeatured: false,
    isActive: true,
  },
  {
    id: 'p-canta-laptop',
    sku: 'CNT-LPT',
    name: 'Laptop Sleeve',
    slug: 'laptop-sleeve',
    description: 'Felt laptop sleeve. Minimal design, soft inner lining.',
    categoryId: 'cat-canta',
    image: img('1491637639811-60e2756cc1c7'),
    gallery: [img('1491637639811-60e2756cc1c7'), img('1548036328-c9fa89d128fa'), img('1553062407-98eeb64c6a62')],
    minimumOrderQuantity: 100,
    minimumPrice: 140,
    maximumPrice: 240,
    colors: [C.gray, C.black, C.natural],
    printOptions: [
      { technique: 'Laser Engraving', positions: ['Front'], requiresLogo: true },
      { technique: 'Embroidery', positions: ['Front'], requiresLogo: true },
    ],
    specs: [
      { label: 'Material', value: 'Felt' },
      { label: 'Compatibility', value: '13" – 15.6"' },
    ],
    attributes: {},
    isFeatured: false,
    isActive: true,
  },

  // ── Tech ────────────────────────────────────────────
  {
    id: 'p-tek-sarj-stand',
    sku: 'TEK-CHG',
    name: 'Wireless Charging Stand',
    slug: 'wireless-charging-stand',
    description: '15W fast wireless charging stand. Dual area for phone and earbuds.',
    categoryId: 'cat-teknoloji',
    image: img('1585790050230-5dd28404ccb9'),
    gallery: [img('1585790050230-5dd28404ccb9'), img('1591290619762-cf5eef19a0f0'), img('1616353071855-2c6e35d5f04a')],
    minimumOrderQuantity: 50,
    minimumPrice: 210,
    maximumPrice: 360,
    colors: [C.black, C.white],
    printOptions: [
      { technique: 'UV Print', positions: ['Base'], requiresLogo: true },
      { technique: 'Laser Engraving', positions: ['Base'], requiresLogo: true },
    ],
    specs: [
      { label: 'Power', value: '15W' },
      { label: 'Input', value: 'USB-C' },
      { label: 'Compatibility', value: 'Qi standard' },
    ],
    attributes: { fastCharge: true },
    isFeatured: true,
    isActive: true,
  },
  {
    id: 'p-tek-powerbank',
    sku: 'TEK-PWB',
    name: 'Power Bank 10000mAh',
    slug: 'power-bank-10000mah',
    description: 'Slim aluminium power bank. Dual output, digital power display.',
    categoryId: 'cat-teknoloji',
    image: img('1591290619762-cf5eef19a0f0'),
    gallery: [img('1591290619762-cf5eef19a0f0'), img('1585790050230-5dd28404ccb9'), img('1609592806596-b43bada2f4bb')],
    minimumOrderQuantity: 100,
    minimumPrice: 240,
    maximumPrice: 420,
    colors: [C.black, C.silver, C.navy],
    printOptions: [
      { technique: 'Laser Engraving', positions: ['Front'], requiresLogo: true },
      { technique: 'UV Print', positions: ['Front', 'Back'], requiresLogo: true },
    ],
    specs: [
      { label: 'Capacity', value: '10000 mAh' },
      { label: 'Output', value: '2x USB-A + USB-C' },
      { label: 'Body', value: 'Aluminium' },
    ],
    attributes: { display: true },
    isFeatured: false,
    isActive: true,
  },
  {
    id: 'p-tek-usb',
    sku: 'TEK-USB',
    name: 'USB Flash Drive 32GB',
    slug: 'usb-flash-drive-32gb',
    description: 'Metal swivel-cap USB 3.0 flash drive. With keyring hole.',
    categoryId: 'cat-teknoloji',
    image: img('1618410320928-25228d811631'),
    gallery: [img('1618410320928-25228d811631'), img('1591290619762-cf5eef19a0f0'), img('1585790050230-5dd28404ccb9')],
    minimumOrderQuantity: 200,
    minimumPrice: 95,
    maximumPrice: 170,
    colors: [C.silver, C.black, C.navy],
    printOptions: [
      { technique: 'Laser Engraving', positions: ['Body'], requiresLogo: true },
      { technique: 'Pad Print', positions: ['Body'], requiresLogo: true },
    ],
    specs: [
      { label: 'Capacity', value: '32 GB' },
      { label: 'Interface', value: 'USB 3.0' },
      { label: 'Body', value: 'Metal' },
    ],
    attributes: {},
    isFeatured: false,
    isActive: true,
  },
  {
    id: 'p-tek-hoparlor',
    sku: 'TEK-SPK',
    name: 'Bluetooth Speaker',
    slug: 'bluetooth-speaker',
    description: 'Portable water-resistant Bluetooth speaker. 8 hours playtime.',
    categoryId: 'cat-teknoloji',
    image: img('1608043152269-423dbba4e7e1'),
    gallery: [img('1608043152269-423dbba4e7e1'), img('1589003077984-894e133dabab'), img('1545454675-3531b543be5d')],
    minimumOrderQuantity: 50,
    minimumPrice: 280,
    maximumPrice: 480,
    colors: [C.black, C.red, C.navy, C.green],
    printOptions: [
      { technique: 'UV Print', positions: ['Front grille', 'Side'], requiresLogo: true },
      { technique: 'Laser Engraving', positions: ['Side'], requiresLogo: true },
    ],
    specs: [
      { label: 'Connectivity', value: 'Bluetooth 5.0' },
      { label: 'Battery', value: '8 hours' },
      { label: 'Protection', value: 'IPX5' },
    ],
    attributes: { waterproof: true },
    isFeatured: false,
    isActive: true,
  },
];

/* =========================================================
   LANDING CONTENT
========================================================= */

export const HERO: Hero = {
  eyebrow: 'B2B Promo Catalog',
  headline: 'Branded promotional products, quoted fast',
  subheadline:
    'Customize hundreds of promotional products — from thermoses to bags — with color, print and quantity options, and collect them into a single quote request. No sign-up required.',
  primaryCta: { label: 'Request a quote', href: '#urunler', variant: 'primary' },
  secondaryCta: { label: 'Browse catalog', href: '#kategoriler', variant: 'outline' },
  image: img('1556742049-0cfed4f6a45d'),
};

export const HOW_IT_WORKS: HowItWorksStep[] = [
  { stepId: 's1', order: 1, title: 'Pick a product', description: 'Find and explore a promotional product in the catalog.', icon: 'magnifying-glass' },
  { stepId: 's2', order: 2, title: 'Customize', description: 'Choose color, print technique, quantity and upload your logo.', icon: 'palette' },
  { stepId: 's3', order: 3, title: 'Add to quote list', description: 'Collect multiple products in one list.', icon: 'list-check' },
  { stepId: 's4', order: 4, title: 'Send the request', description: 'Enter your company details and get your quote number.', icon: 'paper-plane' },
];

export const FEATURES: Feature[] = [
  { featureId: 'f1', icon: 'coins', title: 'Low minimum order', description: 'Orders from 100 units, suitable for small teams too.' },
  { featureId: 'f2', icon: 'stamp', title: 'Many print techniques', description: 'Laser engraving, screen, digital and UV print options.' },
  { featureId: 'f3', icon: 'truck-fast', title: 'Fast turnaround', description: 'Average delivery in 7–10 business days after approval.' },
  { featureId: 'f4', icon: 'headset', title: 'Dedicated account manager', description: 'A sales rep assigned to every quote.' },
];

export const STATS: Stat[] = [
  { statId: 'st1', value: '500+', label: 'Corporate clients', description: 'Brands that trust us' },
  { statId: 'st2', value: '2M+', label: 'Printed items', description: 'Produced to date' },
  { statId: 'st3', value: '7–10', label: 'Business days', description: 'Average delivery time' },
  { statId: 'st4', value: '98%', label: 'Satisfaction', description: 'Repeat order rate' },
];

export const PARTNERS: PartnerLogo[] = [
  { partnerId: 'pt1', name: 'Acme', logo: 'https://dummyimage.com/120x40/9ca3af/ffffff&text=ACME' },
  { partnerId: 'pt2', name: 'Globex', logo: 'https://dummyimage.com/120x40/9ca3af/ffffff&text=Globex' },
  { partnerId: 'pt3', name: 'Umbrella', logo: 'https://dummyimage.com/120x40/9ca3af/ffffff&text=Umbrella' },
  { partnerId: 'pt4', name: 'Initech', logo: 'https://dummyimage.com/120x40/9ca3af/ffffff&text=Initech' },
  { partnerId: 'pt5', name: 'Soylent', logo: 'https://dummyimage.com/120x40/9ca3af/ffffff&text=Soylent' },
  { partnerId: 'pt6', name: 'Hooli', logo: 'https://dummyimage.com/120x40/9ca3af/ffffff&text=Hooli' },
];

export const FAQS: FaqItem[] = [
  { faqId: 'q1', question: 'What is the minimum order quantity?', answer: 'It varies by product; most start at 100 units. Each product card shows its minimum order quantity.' },
  { faqId: 'q2', question: 'Do I need to sign up to request a quote?', answer: 'No. You can add products to your quote list and create a quote request with just your company and contact details.' },
  { faqId: 'q3', question: 'How do I share my logo?', answer: 'You can upload your logo (PNG, SVG, PDF) directly in the product customization step. Our sales team will contact you for a print proof before production.' },
  { faqId: 'q4', question: 'Why are prices shown as a range?', answer: 'The final unit price depends on quantity, print technique and number of colors. The range in the catalog is an estimate; the exact price is in your quote.' },
  { faqId: 'q5', question: 'What is the delivery time?', answer: 'On average 7–10 business days after print approval. If you are in a hurry, note it in the delivery date field of the quote form and our team will assess expedited options.' },
];
