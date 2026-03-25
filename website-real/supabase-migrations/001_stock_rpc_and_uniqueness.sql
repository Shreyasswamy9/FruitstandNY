-- =============================================================================
-- Migration 001: Stock RPC functions + variant uniqueness constraint
-- Run in: Supabase Dashboard → SQL Editor → New query
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Atomic stock decrement RPC functions
--    These eliminate the read-then-write race condition in the webhook.
--    Called by the Stripe webhook via supabaseAdmin.rpc(...)
-- -----------------------------------------------------------------------------

-- Decrement a product_variants row by p_qty, flooring at 0.
-- Keeps is_available in sync: true when stock > 0, false when stock hits 0.
CREATE OR REPLACE FUNCTION decrement_variant_stock(p_variant_id uuid, p_qty int)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE product_variants
  SET
    stock_quantity = GREATEST(0, stock_quantity - p_qty),
    is_available   = (GREATEST(0, stock_quantity - p_qty) > 0)
  WHERE id = p_variant_id;
$$;

-- Decrement a products row by p_qty, flooring at 0.
-- Used as a fallback when no matching variant is found.
CREATE OR REPLACE FUNCTION decrement_product_stock(p_product_id uuid, p_qty int)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE products
  SET stock_quantity = GREATEST(0, stock_quantity - p_qty)
  WHERE id = p_product_id;
$$;

-- -----------------------------------------------------------------------------
-- 2. Variant uniqueness constraint
--    Prevents duplicate (product_id, size, color) combinations so that
--    a LIMIT 1 lookup always returns an unambiguous single row.
--
--    Null-safe: two NULLs are treated as distinct by standard UNIQUE, so we
--    use a partial-unique approach via a unique index with COALESCE to treat
--    NULL as the empty string sentinel for uniqueness purposes.
--
--    If you already have duplicate rows, deduplicate first:
--      DELETE FROM product_variants a
--      USING product_variants b
--      WHERE a.id > b.id
--        AND a.product_id = b.product_id
--        AND COALESCE(a.size, '') = COALESCE(b.size, '')
--        AND COALESCE(a.color, '') = COALESCE(b.color, '');
-- -----------------------------------------------------------------------------

CREATE UNIQUE INDEX IF NOT EXISTS uq_product_variants_product_size_color
  ON product_variants (product_id, COALESCE(size, ''), COALESCE(color, ''));

-- -----------------------------------------------------------------------------
-- Verification queries (run after migration to confirm success):
--
--   SELECT proname FROM pg_proc WHERE proname IN ('decrement_variant_stock','decrement_product_stock');
--   SELECT indexname FROM pg_indexes WHERE tablename = 'product_variants' AND indexname = 'uq_product_variants_product_size_color';
-- -----------------------------------------------------------------------------
