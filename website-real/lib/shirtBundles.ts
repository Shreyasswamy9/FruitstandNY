// Shirt bundle pricing structure
export type ShirtBundleType = 'gala' | 'mutsu' | 'cameo' | 'fuji';
export type BundleQty = 1 | 2 | 3 | 4 | 5 | 6;

export type ShirtBundleConfig = {
  id: string;
  slug: string;
  type: ShirtBundleType;
  name: string;
  displayName: string; // for UI
  description: string;
  basePrice: number; // Price for 1 shirt
  prices: Record<BundleQty, number>; // Bundled prices by qty
  image: string;
  hoverImage: string;
};

export const SHIRT_BUNDLE_PRICING: Record<ShirtBundleType, Record<BundleQty, number>> = {
  gala: {
    1: 29.99,
    2: 55.99,
    3: 69.99,
    4: 79.99,
    5: 99.99,
    6: 115.99,
  },
  mutsu: {
    1: 34.99,
    2: 68.99,
    3: 79.99,
    4: 99.99,
    5: 120.99,
    6: 139.99,
  },
  cameo: {
    1: 29.99,
    2: 57.99,
    3: 79.99,
    4: 99.99,
    5: 99.99,
    6: 120.99,
  },
  fuji: {
    1: 44.00,
    2: 79.99,
    3: 99.99,
    4: 129.99,
    5: 160.99,
    6: 185.99,
  },
};

export const SHIRT_BUNDLES: ShirtBundleConfig[] = [
  {
    id: '9002',
    slug: 'gala-bundle',
    type: 'gala',
    name: 'Gala Tee Bundle',
    displayName: 'Gala Tee Bundle',
    description: 'Build your Gala Tee bundle. Mix colors and sizes.',
    basePrice: 29.99,
    prices: SHIRT_BUNDLE_PRICING.gala,
    image: '/images/products/gala-tshirt/broadwaynoir/GN4.png',
    hoverImage: '/images/products/gala-tshirt/broadwaynoir/GN5.png',
  },
  {
    id: '9003',
    slug: 'mutsu-bundle',
    type: 'mutsu',
    name: 'Mutsu Tee Bundle',
    displayName: 'Mutsu Tee Bundle',
    description: 'Build your Mutsu Tee bundle. Mix colors and sizes.',
    basePrice: 34.99,
    prices: SHIRT_BUNDLE_PRICING.mutsu,
    image: '/images/products/mutsu-tshirt/broadwaynoir/Mutsu Broadway Noir.png',
    hoverImage: '/images/products/mutsu-tshirt/broadwaynoir/N1.png',
  },
  {
    id: '9004',
    slug: 'cameo-bundle',
    type: 'cameo',
    name: 'Cameo Tee Bundle',
    displayName: 'Cameo Tee Bundle',
    description: 'Build your Cameo Tee bundle. Mix colors and sizes.',
    basePrice: 29.99,
    prices: SHIRT_BUNDLE_PRICING.cameo,
    image: '/images/products/cameo-tshirt/broadwaynoir/MN.png',
    hoverImage: '/images/products/cameo-tshirt/broadwaynoir/MN3.png',
  },
  {
    id: '9005',
    slug: 'fuji-bundle',
    type: 'fuji',
    name: 'Fuji Long Sleeve Bundle',
    displayName: 'Fuji Long Sleeve Bundle',
    description: 'Build your Fuji Long Sleeve bundle. Mix colors and sizes.',
    basePrice: 44.00,
    prices: SHIRT_BUNDLE_PRICING.fuji,
    image: '/images/products/fuji-tshirt/Broadwaynoir/Fuji Broadway Noir.png',
    hoverImage: '/images/products/fuji-tshirt/Broadwaynoir/F7.png',
  },
];

// Hat bundle pricing
export const HAT_BUNDLE_PRICES: Record<1 | 2 | 3, number> = {
  1: 24.99,
  2: 39.99,
  3: 49.99,
};

export type HatBundleConfig = {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  prices: Record<1 | 2 | 3, number>;
  image: string;
  hoverImage: string;
};

export const HAT_BUNDLES: HatBundleConfig[] = [
  {
    id: '9006',
    slug: 'hat-bundle',
    name: 'Hat Bundle',
    displayName: 'Hat Bundle',
    description: 'Build your hat bundle. 1 for $24.99, 2 for $39.99, 3 for $49.99.',
    prices: HAT_BUNDLE_PRICES,
    image: '/images/products/Forest Hills Hat/Forest Hills Hat Final.png',
    hoverImage: '/images/products/Forest Hills Hat/G1.png',
  },
];
