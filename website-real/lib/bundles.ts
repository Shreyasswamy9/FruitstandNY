export type Bundle = {
  id: string;
  title: string;
  itemIds: number[]; // product ids from ProductsGridHome.products
  description?: string;
  discountPercent?: number; // informational
};

export const bundles: Bundle[] = [
  {
    id: 'tee-hat-classic-denim',
    title: 'Classic Tee + Denim Hat',
    itemIds: [2, 7],
    description: 'Pair the Classic Tee with the Denim Hat',
    discountPercent: 10,
  },
  {
    id: 'tracksuit-empire-hat',
    title: 'Tracksuit + Empire Hat',
    itemIds: [5, 11],
    description: 'Tracksuit set and the Empire Hat',
    discountPercent: 12,
  },
  {
    id: 'tee-empire',
    title: 'Classic Tee + Empire Hat',
    itemIds: [2, 11],
    description: 'Clean tee with the bold Empire Hat',
    discountPercent: 12,
  },
  {
    id: 'jersey-white-hat',
    title: 'Hockey Jersey + White Hat',
    itemIds: [1, 9],
    description: 'Statement jersey paired with the minimalist White Hat',
    discountPercent: 15,
  },
  {
    id: 'tracksuit-beige-hat',
    title: 'Tracksuit + Beige Hat',
    itemIds: [5, 10],
    description: 'Tracksuit comfort with warm beige tones',
    discountPercent: 12,
  },
  {
    id: 'jacket-empire',
    title: 'Premium Jacket + Empire Hat',
    itemIds: [12, 11],
    description: 'Elevated outerwear with an iconic cap',
    discountPercent: 14,
  },
];
