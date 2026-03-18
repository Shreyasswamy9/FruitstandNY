/**
 * St. Patrick's Day Sale — DISABLED
 * This sale is no longer active.
 */

export const SALE_DISCOUNT = 0; // Disabled

const SALE_START = new Date("2025-03-17T00:00:00-05:00"); // Past date
const SALE_END   = new Date("2025-03-18T00:00:00-05:00"); // Past date

// Always false - sale is disabled
const FORCE_ACTIVE = false;

/** Returns false - sale is disabled. */
export function isStPatsDayActive(): boolean {
  return false;
}

/**
 * Map of product slug → the color slugs that qualify for the St. Patrick's discount.
 * Add or remove slugs here as needed.
 */
export const ST_PATS_GREEN_SLUGS: Record<string, string[]> = {
  "jozi-rugby-jersey":  ["default"],          // Jozi Jersey (only colorway is green)
  "forest-hills-hat":   ["default"],           // Forest Hills Hat (lime green, one size)
  "gala-tshirt":        ["grasshopper"],        // Gala Tee – Grasshopper
  "fuji-tshirt":        ["arboretum"],          // Fuji Long Sleeve – Arboretum
  "tracksuit":          ["greenpoint-patina-crew"], // Greenpoint Tracksuit
  "track-top":          ["greenpoint-patina-crew"], // Greenpoint Top
  "track-pants":        ["greenpoint-patina-crew"], // Greenpoint Bottom
  "liberty-zip-up":     ["moss"],              // Moss Liberty Zip-Up
};

/**
 * Returns the discounted price for a product/color combination when the
 * St. Patrick's Day sale is active, otherwise returns the original price.
 *
 * Pass `colorSlug = null` for single-colorway products (Forest Hills Hat, Jozi Jersey).
 */
export function getStPatsPrice(
  productSlug: string,
  originalPrice: number,
  colorSlug: string | null
): number {
  if (!isStPatsDayActive()) return originalPrice;

  const greenSlugs = ST_PATS_GREEN_SLUGS[productSlug];
  if (!greenSlugs) return originalPrice;

  const slugToCheck = colorSlug ?? "default";
  if (greenSlugs.includes(slugToCheck)) {
    return Math.round(originalPrice * (1 - SALE_DISCOUNT) * 100) / 100;
  }

  return originalPrice;
}

/**
 * Returns true if the given color slug qualifies for the St. Patrick's discount
 * on this product (and the sale is currently active).
 */
export function isGreenColorOnSale(productSlug: string, colorSlug: string | null): boolean {
  if (!isStPatsDayActive()) return false;
  const greenSlugs = ST_PATS_GREEN_SLUGS[productSlug];
  if (!greenSlugs) return false;
  return greenSlugs.includes(colorSlug ?? "default");
}
