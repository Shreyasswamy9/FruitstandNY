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
    title: 'Retro Track Suit + Empire Cordury hat',
    itemIds: [2001, 11],
    description: 'Retro Track Suit set and the Empire Cordury hat',
    discountPercent: 12,
  },
  {
    id: 'jersey-white-hat',
    title: 'Broadway Blueberry Jersey + White Hat',
    itemIds: [1, 9],
    description: 'Statement Broadway Blueberry Jersey paired with the minimalist White Hat',
    discountPercent: 15,
  },
  {
    id: 'tracksuit-beige-hat',
    title: 'Retro Track Suit + Beige Hat',
    itemIds: [2001, 10],
    description: 'Retro Track Suit comfort with warm beige tones',
    discountPercent: 12,
  },
];
