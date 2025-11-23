export type Bundle = {
  id: string;
  title: string;
  itemIds: number[]; // product ids from ProductsGridHome.products
  description?: string;
  discountPercent?: number; // informational
};

export const bundles: Bundle[] = [
  {
    id: 'tracksuit-empire-hat',
    title: 'Retro Track Suit + Empire Corduroy Hat',
    // Track Suit (2001) + Empire Corduroy Hat (3004)
    itemIds: [2001, 3004],
    description: 'Retro Track Suit set paired with the Empire Corduroy Hat',
    discountPercent: 12,
  },
  {
    id: 'jersey-porcelain-hat',
    title: 'Broadway Blueberry Jersey + Porcelain FS Cap',
    // Jersey (1) + Porcelain FS Cap (3002)
    itemIds: [1, 3002],
    description: 'Statement Broadway Blueberry Jersey paired with the Porcelain FS Cap',
    discountPercent: 15,
  },
  {
    id: 'tracksuit-ecru-hat',
    title: 'Retro Track Suit + Ecru FS Cap',
    // Track Suit (2001) + Ecru FS Cap (3003)
    itemIds: [2001, 3003],
    description: 'Retro Track Suit comfort paired with the Ecru FS Cap',
    discountPercent: 12,
  },
];
