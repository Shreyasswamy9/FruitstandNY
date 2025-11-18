export const CUSTOM_BUNDLE_SIZES = [2, 3, 4, 5] as const;
export type CustomBundleSize = typeof CUSTOM_BUNDLE_SIZES[number];

// Assumption: base tee is $22; these are rounded bundle prices with a built-in discount
export const CUSTOM_BUNDLE_PRICES: Record<CustomBundleSize, number> = {
  2: 44,  // ~$4 off
  3: 63,  // ~$6 off
  4: 80,  // ~$13 off
  5: 99,   // ~$20 off
};
