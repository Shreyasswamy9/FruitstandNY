/**
 * Price scheduling utility
 * Determines if a sale price should be active based on the effective date
 */

export function isPriceActive(effectiveDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const saleDate = new Date(effectiveDate);
  saleDate.setHours(0, 0, 0, 0);
  
  return today >= saleDate;
}

export function getActivePrice(
  regularPrice: number,
  salePrice?: number,
  salePriceEffectiveDate?: string
): number {
  if (!salePrice || !salePriceEffectiveDate) {
    return regularPrice;
  }
  
  return isPriceActive(salePriceEffectiveDate) ? salePrice : regularPrice;
}
