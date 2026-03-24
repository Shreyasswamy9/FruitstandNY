export type TeeColor = {
  name: string;
  hex: string;
  image: string;
  images?: string[];
};

export type TeeVariant = {
  slug: 'gala-tshirt' | 'cameo-tshirt' | 'mutsu-tshirt' | 'fuji-tshirt';
  name: string;
  colors: TeeColor[];
};

export const TEE_VARIANTS: TeeVariant[] = [
  {
    slug: 'gala-tshirt',
    name: 'Gala Tee',
    colors: [
      { name: 'Broadway Noir', hex: '#000000', image: '/images/products/gala-tshirt/broadwaynoir/GN4.png' },
      { name: 'Sutton Place Snow', hex: '#ffffff', image: '/images/products/gala-tshirt/suttonplacesnow/Gala Sutton Place Snow.png' },
      { name: 'Grasshopper', hex: '#85c96e', image: '/images/products/gala-tshirt/Grasshopper/Gala Grasshopper.png' },
      { name: 'Frosted Lemonade', hex: '#fff7a8', image: '/images/products/gala-tshirt/frostedlemonade/Gala Frosted Lemonade.png' },
      { name: 'Ruby Red', hex: '#fd8987', image: '/images/products/gala-tshirt/ruby red/Gala Ruby Red.png' },
      { name: 'Italian Ice', hex: '#c7eaff', image: '/images/products/gala-tshirt/italianice/Gala Italian Ice.png' },
    ],
  },
  {
    slug: 'cameo-tshirt',
    name: 'Cameo Tee',
    colors: [
      { name: 'Broadway Noir', hex: '#000000', image: '/images/products/cameo-tshirt/broadwaynoir/MN.png' },
      { name: 'Sutton Place Snow', hex: '#ffffff', image: '/images/products/cameo-tshirt/suttonplacesnow/Cameo Sutton Place Snow.png' },
    ],
  },
  {
    slug: 'mutsu-tshirt',
    name: 'Mutsu Tee',
    colors: [
      { name: 'Broadway Noir', hex: '#000000', image: '/images/products/mutsu-tshirt/broadwaynoir/Mutsu Broadway Noir.png' },
      { name: 'Sutton Place Snow', hex: '#ffffff', image: '/images/products/mutsu-tshirt/suttonplacesnow/Mutsu Sutton Place Snow.png' },
    ],
  },
  {
    slug: 'fuji-tshirt',
    name: 'Fuji Long Sleeve',
    colors: [
      { name: 'Arboretum', hex: '#0f5132', image: '/images/products/fuji-tshirt/Arboretum/Fuji Arboretum.png' },
      { name: 'Hudson Blue', hex: '#243b5a', image: '/images/products/fuji-tshirt/Hudson blue/Fuji Hudson Blue.png' },
      { name: 'Redbird', hex: '#c21010', image: '/images/products/fuji-tshirt/Redbird/Fuji Redbird.png' },
      { name: 'Broadway Noir', hex: '#000000', image: '/images/products/fuji-tshirt/Broadwaynoir/Fuji Broadway Noir.png' },
    ],
  },
];

export const SIZE_OPTIONS = ["XS","S","M","L","XL","XXL"] as const;
export type SizeOption = typeof SIZE_OPTIONS[number];
