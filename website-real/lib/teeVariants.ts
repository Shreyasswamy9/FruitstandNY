export type TeeColor = {
  name: string;
  hex: string;
  image: string;
};

export type TeeVariant = {
  slug: 'gala-tshirt' | 'cameo-tshirt' | 'mutsu-tshirt' | 'fuji-tshirt';
  name: string;
  colors: TeeColor[];
};

export const TEE_VARIANTS: TeeVariant[] = [
  {
    slug: 'gala-tshirt',
    name: 'Gala Tshirt',
    colors: [
      { name: 'Gala Red', hex: '#d32f2f', image: '/images/products/gala-tshirt/gala-red/1.jpeg' },
      { name: 'Midnight Black', hex: '#232323', image: '/images/products/gala-tshirt/midnight-black/1.jpeg' },
      { name: 'Crisp White', hex: '#ffffff', image: '/images/products/gala-tshirt/crisp-white/1.jpeg' },
      { name: 'Forest Green', hex: '#2e7d32', image: '/images/products/gala-tshirt/forest-green/1.jpeg' },
    ],
  },
  {
    slug: 'cameo-tshirt',
    name: 'Cameo Tshirt',
    colors: [
      { name: 'Cameo Pink', hex: '#f8b4c0', image: '/images/products/cameo-tshirt/cameo-pink/1.jpeg' },
      { name: 'Charcoal', hex: '#4a4a4a', image: '/images/products/cameo-tshirt/charcoal/1.jpeg' },
      { name: 'Ivory', hex: '#f8f6f0', image: '/images/products/cameo-tshirt/ivory/1.jpeg' },
      { name: 'Navy', hex: '#1f3a5f', image: '/images/products/cameo-tshirt/navy/1.jpeg' },
    ],
  },
  {
    slug: 'mutsu-tshirt',
    name: 'Mutsu Tshirt',
    colors: [
      { name: 'Mutsu Green', hex: '#4caf50', image: '/images/products/mutsu-tshirt/mutsu-green/1.jpeg' },
      { name: 'Slate', hex: '#6b7280', image: '/images/products/mutsu-tshirt/slate/1.jpeg' },
      { name: 'Sand', hex: '#d6c3a5', image: '/images/products/mutsu-tshirt/sand/1.jpeg' },
      { name: 'Sky', hex: '#60a5fa', image: '/images/products/mutsu-tshirt/sky/1.jpeg' },
    ],
  },
  {
    slug: 'fuji-tshirt',
    name: 'Fuji Tshirt',
    colors: [
      { name: 'Fuji Red', hex: '#c62828', image: '/images/products/fuji-tshirt/fuji-red/1.jpeg' },
      { name: 'Onyx', hex: '#111827', image: '/images/products/fuji-tshirt/onyx/1.jpeg' },
      { name: 'Snow', hex: '#f9fafb', image: '/images/products/fuji-tshirt/snow/1.jpeg' },
      { name: 'Indigo', hex: '#3f51b5', image: '/images/products/fuji-tshirt/indigo/1.jpeg' },
    ],
  },
];

export const SIZE_OPTIONS = ["XS","S","M","L","XL","XXL"] as const;
export type SizeOption = typeof SIZE_OPTIONS[number];
