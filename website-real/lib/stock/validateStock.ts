import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type StockCheckItem = {
  productId: string;
  variantId?: string | null;
  name?: string;
  size?: string | null;
  color?: string | null;
  /** The total quantity being requested (cumulative, not a delta). */
  quantity: number;
};

export type StockCheckError = {
  productId: string;
  variantId?: string | null;
  name: string;
  requested: number;
  available: number;
  reason: string;
};

export type StockCheckResult = {
  valid: boolean;
  errors: StockCheckError[];
};

/**
 * Creates a read-only Supabase client using the public (anon) key for stock reads.
 * Safe to use in server routes — the anon key is already public.
 */
function makeSupabaseReadClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * Validates that every item in `items` has sufficient stock.
 *
 * Strategy (variant-first):
 *   1. If variantId is provided, query product_variants by id.
 *   2. Else if size or color is provided, query product_variants by product_id + size + color.
 *   3. Else fall back to product-level stock_quantity.
 *
 * Returns { valid: true, errors: [] } when all items pass.
 * Returns { valid: false, errors: [...] } with one entry per failing item.
 *
 * The caller should reject the request when valid === false.
 *
 * @param items     Cart items to check.
 * @param client    Optional Supabase client — useful for testing with mocks.
 *                  When omitted, a new read-only client is created from env vars.
 */
export async function validateCartStock(
  items: StockCheckItem[],
  client?: SupabaseClient,
): Promise<StockCheckResult> {
  const supabase = client ?? makeSupabaseReadClient();

  if (!supabase) {
    // If we can't create a client (missing env vars in test/CI), fail open to avoid blocking orders.
    console.warn('validateCartStock: Supabase client unavailable — skipping stock check');
    return { valid: true, errors: [] };
  }

  const errors: StockCheckError[] = [];

  for (const item of items) {
    const qty = Math.max(1, Number(item.quantity));
    const label = item.name ?? item.productId;

    if (item.variantId) {
      // --- Variant-first path ---
      const { data, error } = await supabase
        .from('product_variants')
        .select('stock_quantity, is_available')
        .eq('id', item.variantId)
        .maybeSingle();

      if (error || !data) {
        errors.push({
          productId: item.productId,
          variantId: item.variantId,
          name: label,
          requested: qty,
          available: 0,
          reason: 'Variant not found',
        });
        continue;
      }

      const avail = Math.max(0, Number(data.stock_quantity ?? 0));
      if (!data.is_available || avail < qty) {
        errors.push({
          productId: item.productId,
          variantId: item.variantId,
          name: label,
          requested: qty,
          available: avail,
          reason: avail <= 0 ? 'Out of stock' : 'Insufficient stock',
        });
      }
    } else if (item.size || item.color) {
      // --- Size/color variant lookup path ---
      let q = supabase
        .from('product_variants')
        .select('id, stock_quantity, is_available')
        .eq('product_id', item.productId);
      if (item.size) q = q.eq('size', item.size);
      if (item.color) q = q.eq('color', item.color);

      const { data } = await q.limit(1).maybeSingle();

      if (data) {
        const avail = Math.max(0, Number(data.stock_quantity ?? 0));
        if (!data.is_available || avail < qty) {
          errors.push({
            productId: item.productId,
            name: label,
            requested: qty,
            available: avail,
            reason: avail <= 0 ? 'Out of stock' : 'Insufficient stock',
          });
        }
      } else {
        // No variant row found — fall back to product-level
        await checkProductStock(supabase, item.productId, qty, label, errors);
      }
    } else {
      // --- Product-level fallback ---
      await checkProductStock(supabase, item.productId, qty, label, errors);
    }
  }

  return { valid: errors.length === 0, errors };
}

async function checkProductStock(
  supabase: SupabaseClient,
  productId: string,
  qty: number,
  label: string,
  errors: StockCheckError[],
): Promise<void> {
  const { data } = await supabase
    .from('products')
    .select('stock_quantity, is_active')
    .eq('id', productId)
    .maybeSingle();

  if (!data || !data.is_active) {
    errors.push({
      productId,
      name: label,
      requested: qty,
      available: 0,
      reason: 'Product not found or unavailable',
    });
    return;
  }

  const avail = Math.max(0, Number(data.stock_quantity ?? 0));
  if (avail < qty) {
    errors.push({
      productId,
      name: label,
      requested: qty,
      available: avail,
      reason: avail <= 0 ? 'Out of stock' : 'Insufficient stock',
    });
  }
}
