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
      { name: 'Broadway Noir', hex: '#000000', image: '/images/products/gala-tshirt/broadwaynoir/Firefly 20250924162431.png' },
      { name: 'Sutton Place Snow', hex: '#ffffff', image: '/images/products/gala-tshirt/suttonplacesnow/SHIRTFINALIMAGES-63.jpg' },
      { name: 'Grasshopper', hex: '#85c96e', image: '/images/products/gala-tshirt/Grasshopper/7.jpg' },
      { name: 'Frosted Lemonade', hex: '#fff7a8', image: '/images/products/gala-tshirt/frostedlemonade/GALATEES-47.jpg' },
      { name: 'Italian Ice', hex: '#c7eaff', image: '/images/products/gala-tshirt/italianice/3.jpg' },
    ],
  },
  {
    slug: 'cameo-tshirt',
    name: 'Cameo Tshirt',
    colors: [
      { name: 'Broadway Noir', hex: '#000000', image: '/images/products/cameo-tshirt/broadwaynoir/Firefly 20250923122927.png' },
      { name: 'Sutton Place Snow', hex: '#ffffff', image: '/images/products/cameo-tshirt/suttonplacesnow/Firefly 20250923122951.png' },
    ],
  },
  {
    slug: 'mutsu-tshirt',
    name: 'Mutsu Tshirt',
    colors: [
      { name: 'Broadway Noir', hex: '#000000', image: '/images/products/mutsu-tshirt/broadwaynoir/Firefly 20251118133823.png' },
      { name: 'Sutton Place Snow', hex: '#ffffff', image: '/images/products/mutsu-tshirt/suttonplacesnow/Firefly 20251118133938.png' },
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
