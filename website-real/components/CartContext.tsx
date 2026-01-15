"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  // bundle metadata
  isBundle?: boolean;
  bundleId?: string;
  bundleItems?: number[];
  bundleSize?: string;
  // Unique line identifier to distinguish same product with different options
  lineId?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  // Add a bundle as a single cart line with its own price
  addBundleToCart: (opts: { bundleId: string; name: string; price: number; image: string; itemIds?: number[]; bundleSize?: string; quantity?: number }) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const deriveLineId = (item: Partial<CartItem>) => {
  const productId = item.productId ?? "";
  const size = item.size ?? "";
  const color = item.color ?? "";
  const bundleToken = item.isBundle ? "bundle" : "";
  return `${productId}::${size}::${color}::${bundleToken}`;
};

const normalizeStoredItems = (raw: unknown): CartItem[] => {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((candidate): CartItem | null => {
      if (!candidate || typeof candidate !== "object") return null;
      const value = candidate as Record<string, unknown>;

      const productIdRaw = value.productId;
      const productId = typeof productIdRaw === "string" && productIdRaw.trim().length > 0
        ? productIdRaw
        : productIdRaw != null
          ? String(productIdRaw)
          : "";
      if (!productId) return null;

      const quantity = Number(value.quantity) || 0;
      if (quantity <= 0) return null;

      const bundleItems = Array.isArray(value.bundleItems)
        ? value.bundleItems.map((entry) => Number(entry)).filter((entry) => Number.isFinite(entry))
        : undefined;

      const normalized: CartItem = {
        productId,
        name: typeof value.name === "string" ? value.name : "",
        price: Number(value.price) || 0,
        image: typeof value.image === "string" ? value.image : "",
        quantity,
        size: typeof value.size === "string" ? value.size : undefined,
        color: typeof value.color === "string" ? value.color : undefined,
        isBundle: Boolean(value.isBundle),
        bundleId: typeof value.bundleId === "string" ? value.bundleId : undefined,
        bundleItems,
        bundleSize: typeof value.bundleSize === "string" ? value.bundleSize : undefined,
        lineId: typeof value.lineId === "string" && value.lineId.trim().length > 0 ? value.lineId : undefined,
      };

      normalized.lineId = normalized.lineId ?? deriveLineId(normalized);
      return normalized;
    })
    .filter((entry): entry is CartItem => Boolean(entry));
};

const cartsEqual = (a: CartItem[], b: CartItem[]) => {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  const serialize = (items: CartItem[]) =>
    items
      .map((item) => ({
        id: item.lineId ?? deriveLineId(item),
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: item.size ?? "",
        color: item.color ?? "",
        bundleSize: item.bundleSize ?? "",
        bundleId: item.bundleId ?? "",
        isBundle: Boolean(item.isBundle),
        name: item.name,
        image: item.image,
      }))
      .sort((left, right) => left.id.localeCompare(right.id));

  const left = serialize(a);
  const right = serialize(b);

  return left.every((item, idx) => {
    const other = right[idx];
    return (
      item.id === other.id &&
      item.productId === other.productId &&
      item.quantity === other.quantity &&
      item.price === other.price &&
      item.size === other.size &&
      item.color === other.color &&
      item.bundleSize === other.bundleSize &&
      item.bundleId === other.bundleId &&
      item.isBundle === other.isBundle &&
      item.name === other.name &&
      item.image === other.image
    );
  });
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
    console.log('Loading cart from localStorage:', stored);
    if (stored) {
      try {
        const parsedItems = JSON.parse(stored);
        console.log('Parsed cart items:', parsedItems);
        const normalized = normalizeStoredItems(parsedItems);
        setItems(normalized);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('cart'); // Clear corrupted data
      }
    }
    setIsLoaded(true);
  }, []);

  // Listen for cart cleared event from success page
  useEffect(() => {
    const handleCartCleared = () => {
      setItems([]);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('cartCleared', handleCartCleared);
      return () => window.removeEventListener('cartCleared', handleCartCleared);
    }
  }, []);

  // Save cart to localStorage whenever it changes (only after initial load)
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;

    const syncFromStorage = () => {
      const stored = window.localStorage.getItem('cart');

      if (!stored) {
        setItems(prev => (prev.length ? [] : prev));
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        const normalized = normalizeStoredItems(parsed);
        setItems(prev => (cartsEqual(prev, normalized) ? prev : normalized));
      } catch (error) {
        console.error('Error parsing cart from localStorage during sync:', error);
        window.localStorage.removeItem('cart');
        setItems([]);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'cart') {
        syncFromStorage();
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncFromStorage();
      }
    };

    const handlePageShow = () => {
      syncFromStorage();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('focus', syncFromStorage);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('focus', syncFromStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isLoaded]);

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      // Normalize incoming item: ensure price is numeric and produce a stable lineId
      const normalized: CartItem = { ...item, price: Number(item.price) || 0 };
      const lineId = item.lineId ?? deriveLineId(normalized);
      normalized.lineId = lineId;

      const existing = prev.find(i => i.lineId === lineId);
      if (existing) {
        return prev.map(i =>
          i.lineId === lineId
            ? { ...i, quantity: i.quantity + normalized.quantity }
            : i
        );
      }
      return [...prev, normalized];
    });
  };

  const addBundleToCart = ({ bundleId, name, price, image, itemIds = [], bundleSize, quantity = 1 }: { bundleId: string; name: string; price: number; image: string; itemIds?: number[]; bundleSize?: string; quantity?: number }) => {
    const productId = `bundle-${bundleId}`;
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
      }
      const lineId = deriveLineId({ productId, size: bundleSize, isBundle: true });
      const bundleItem: CartItem = {
        productId,
        name,
        price,
        image,
        quantity,
        isBundle: true,
        bundleId,
        bundleItems: itemIds,
        bundleSize,
        lineId,
      };
      return [...prev, bundleItem];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => {
      // If the provided id matches a lineId, remove only that line. Otherwise fall back to removing by productId for compatibility.
      const hasLine = prev.some(i => i.lineId === productId);
      if (hasLine) return prev.filter(i => i.lineId !== productId);
      return prev.filter(i => i.productId !== productId);
    });
  };

  const clearCart = () => {
    console.log('Cart cleared manually');
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
  };

  return (
    <CartContext.Provider value={{ items, addToCart, addBundleToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
