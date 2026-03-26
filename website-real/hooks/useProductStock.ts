'use client';
import { useCallback, useEffect, useState } from 'react';

type VariantInfo = {
  id: string;
  size: string | null;
  color: string | null;
  stock_quantity: number;
  is_available: boolean;
};

type StockState = {
  productStock: number;
  productActive: boolean;
  enableStockTracking: boolean;
  variants: VariantInfo[];
};

const normalizeToken = (value: string | null | undefined): string => {
  if (!value) return '';
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const COLOR_ALIASES: Record<string, string> = {
  onyx: 'black',
  noir: 'black',
  stone: 'grey',
  gray: 'grey',
};

const canonicalColorToken = (value: string | null | undefined): string => {
  const token = normalizeToken(value);
  return COLOR_ALIASES[token] ?? token;
};

const colorsMatch = (left: string | null | undefined, right: string | null | undefined): boolean => {
  if (!left || !right) return false;

  const leftRaw = left.trim().toLowerCase();
  const rightRaw = right.trim().toLowerCase();
  if (leftRaw === rightRaw) return true;

  return canonicalColorToken(left) === canonicalColorToken(right);
};

const sizesMatch = (left: string | null | undefined, right: string | null | undefined): boolean => {
  if (!left || !right) return false;
  return left.trim().toLowerCase() === right.trim().toLowerCase();
};

export function useProductStock(productId: string) {
  const [stockState, setStockState] = useState<StockState | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/products/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data.success) return;
        const p = data.data;
        setStockState({
          productStock: (p.stock_quantity as number) ?? 0,
          productActive: (p.is_active as boolean) ?? true,
          enableStockTracking: (p.enable_stock_tracking as boolean) ?? true,
          variants: ((p.product_variants ?? []) as Record<string, unknown>[]).map((v) => ({
            id: v.id as string,
            size: (v.size as string | null) ?? null,
            color: (v.color as string | null) ?? null,
            stock_quantity: (v.stock_quantity as number) ?? 0,
            is_available: (v.is_available as boolean) ?? true,
          })),
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [productId]);

  /**
   * Returns true if a specific size (for a given optional color) is sold out.
   * Falls back to product-level stock when no variants exist.
   * 
   * If stock tracking is disabled for this product, always returns false.
   */
  const isSizeSoldOut = useCallback(
    (size: string, color?: string | null): boolean => {
      if (!stockState) return false; // not yet loaded — used only for dropdown label display
      const { variants, productStock, productActive, enableStockTracking } = stockState;
      
      // If stock tracking is disabled, product is always considered in stock
      if (!enableStockTracking) return false;
      
      if (!productActive) return true;
      if (variants.length === 0) return productStock <= 0;

      const matching = variants.filter((v) => {
        if (v.size && !sizesMatch(v.size, size)) return false;
        if (color && v.color && !colorsMatch(v.color, color)) return false;
        return true;
      });
      if (matching.length === 0) {
        const scope = color
          ? variants.filter((v) => !v.color || colorsMatch(v.color, color))
          : variants;
        if (scope.length === 0) {
          if (color && variants.some((v) => Boolean(v.color))) return true;
          return false;
        }
        // If this product/color has explicit sized variants but not the requested size,
        // treat it as unavailable.
        if (scope.some((v) => Boolean(v.size))) return true;
        return false;
      }
      return matching.every((v) => v.stock_quantity <= 0 || !v.is_available);
    },
    [stockState],
  );

  /**
   * Returns true if the product/variant is out of stock for the given size and color.
   * Pass null/undefined size to check if ALL variants (for a color) are out of stock.
   *
   * Safety rule: when a specific size is requested but stock data has not yet loaded,
   * returns true (treat as OOS) so the Add-to-Cart button stays disabled until we
   * have confirmed the item is purchasable. This prevents the loading-race where a
   * user can add an OOS item before the fetch completes.
   * 
   * If stock tracking is disabled for this product, always returns false.
   */
  const isOutOfStock = useCallback(
    (size: string | null, color?: string | null): boolean => {
      // Loading guard: if a specific size is being checked and we have no stock data
      // yet, be conservative and block the add rather than allowing a potentially OOS item.
      if (!stockState) return size !== null;

      const { variants, productStock, productActive, enableStockTracking } = stockState;
      
      // If stock tracking is disabled, product is always considered in stock
      if (!enableStockTracking) return false;
      
      if (!productActive) return true;
      if (variants.length === 0) return productStock <= 0;

      if (!size) {
        const scope = color
          ? variants.filter(
              (v) => !v.color || colorsMatch(v.color, color),
            )
          : variants;
        return scope.length > 0 && scope.every((v) => v.stock_quantity <= 0 || !v.is_available);
      }

      return isSizeSoldOut(size, color);
    },
    [stockState, isSizeSoldOut],
  );

  return { isOutOfStock, isSizeSoldOut };
}

/**
 * Like useProductStock but fetches multiple products and treats a size/color as
 * sold out if ANY of the products is out of stock for that combination.
 * Useful for sets (e.g. tracksuit = top + pants) where you want the display to
 * reflect the most-constrained component.
 */
export function useProductSetStock(productIds: string[]) {
  const [stockStates, setStockStates] = useState<Record<string, StockState>>({});

  useEffect(() => {
    if (productIds.length === 0) return;
    let cancelled = false;

    Promise.all(
      productIds.map((id) =>
        fetch(`/api/products/${id}`)
          .then((r) => r.json())
          .then((data) => {
            if (!data.success) return null;
            const p = data.data;
            return {
              id,
              state: {
                productStock: (p.stock_quantity as number) ?? 0,
                productActive: (p.is_active as boolean) ?? true,
                enableStockTracking: (p.enable_stock_tracking as boolean) ?? true,
                variants: ((p.product_variants ?? []) as Record<string, unknown>[]).map((v) => ({
                  id: v.id as string,
                  size: (v.size as string | null) ?? null,
                  color: (v.color as string | null) ?? null,
                  stock_quantity: (v.stock_quantity as number) ?? 0,
                  is_available: (v.is_available as boolean) ?? true,
                })),
              } as StockState,
            };
          })
          .catch(() => null),
      ),
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, StockState> = {};
      for (const r of results) {
        if (r) map[r.id] = r.state;
      }
      setStockStates(map);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIds.join(',')]);

  const isSizeSoldOut = useCallback(
    (size: string, color?: string | null): boolean => {
      if (Object.keys(stockStates).length === 0) return false;
      // Sold out if ANY component product is OOS for this size+color
      return Object.values(stockStates).some((s) => {
        // If stock tracking is disabled, consider it in stock
        if (!s.enableStockTracking) return false;
        if (!s.productActive) return true;
        if (s.variants.length === 0) return s.productStock <= 0;
        const matching = s.variants.filter((v) => {
          if (v.size && !sizesMatch(v.size, size)) return false;
          if (color && v.color && !colorsMatch(v.color, color)) return false;
          return true;
        });
        if (matching.length === 0) {
          const scope = color
            ? s.variants.filter((v) => !v.color || colorsMatch(v.color, color))
            : s.variants;
          if (scope.length === 0) {
            if (color && s.variants.some((v) => Boolean(v.color))) return true;
            return false;
          }
          if (scope.some((v) => Boolean(v.size))) return true;
          return false;
        }
        return matching.every((v) => v.stock_quantity <= 0 || !v.is_available);
      });
    },
    [stockStates],
  );

  const isOutOfStock = useCallback(
    (size: string | null, color?: string | null): boolean => {
      if (Object.keys(stockStates).length === 0) return false;
      return Object.values(stockStates).some((s) => {
        // If stock tracking is disabled, consider it in stock
        if (!s.enableStockTracking) return false;
        if (!s.productActive) return true;
        if (s.variants.length === 0) return s.productStock <= 0;
        if (!size) {
          const scope = color
            ? s.variants.filter((v) => !v.color || colorsMatch(v.color, color))
            : s.variants;
          return scope.length > 0 && scope.every((v) => v.stock_quantity <= 0 || !v.is_available);
        }
        return isSizeSoldOut(size, color);
      });
    },
    [stockStates, isSizeSoldOut],
  );

  return { isOutOfStock, isSizeSoldOut };
}
