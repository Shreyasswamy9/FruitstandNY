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
        setItems(parsedItems);
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

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const addBundleToCart = ({ bundleId, name, price, image, itemIds = [], bundleSize, quantity = 1 }: { bundleId: string; name: string; price: number; image: string; itemIds?: number[]; bundleSize?: string; quantity?: number }) => {
    const productId = `bundle-${bundleId}`;
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
      }
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
      };
      return [...prev, bundleItem];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
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
