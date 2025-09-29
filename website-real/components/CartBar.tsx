"use client";
import React, { useState, useRef, useEffect } from "react";
import { useCart } from "./CartContext";

export default function CartBar() {
  const { items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [showCartBar, setShowCartBar] = useState(false);
  const prevCount = useRef(0);
  const isInitialized = useRef(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const count = items.reduce((a, b) => a + b.quantity, 0);
    
    // On initial mount, get the previous count from localStorage
    if (!isInitialized.current) {
      const storedCount = typeof window !== 'undefined' ? 
        parseInt(localStorage.getItem('cartCount') || '0') : 0;
      prevCount.current = storedCount;
      isInitialized.current = true;
      setShowCartBar(count > 0);
      
      // Update localStorage with current count
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartCount', count.toString());
      }
      return;
    }
    
    // Only show popup if count actually increased (item was added)
    if (count > prevCount.current) {
      // Clear any existing timeout
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
      
      setShowPopup(true);
      // Only hide cart bar if this is the first item being added
      if (prevCount.current === 0) {
        setShowCartBar(false);
        popupTimeoutRef.current = setTimeout(() => {
          setShowPopup(false);
          setTimeout(() => setShowCartBar(items.length > 0), 50);
        }, 1500);
      } else {
        // For subsequent adds, keep cart bar visible
        popupTimeoutRef.current = setTimeout(() => setShowPopup(false), 1500);
      }
    } else if (count < prevCount.current) {
      // Item was removed, update cart bar visibility
      setShowCartBar(count > 0 && !showPopup);
    }
    // If count is the same, don't do anything (no popup)
    
    prevCount.current = count;
    
    // Update localStorage with current count
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartCount', count.toString());
    }
  }, [items]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Simple popup, no animation, no image */}
      {showPopup && (
        <div
          className="fixed z-50 flex items-center justify-center"
          style={{
            left: '50%',
            bottom: '80px',
            background: '#232323',
            color: 'white',
            borderRadius: 18,
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 20,
            padding: '18px 32px',
            position: 'fixed',
            minWidth: 160,
            minHeight: 48,
            zIndex: 9999,
            transform: 'translateX(-50%)',
          }}
        >
          Added to cart!
        </div>
      )}
      {showCartBar && (
        <div
          className="fixed left-0 right-0 bottom-0 z-50 bg-black text-white px-2 py-3 md:px-4 md:py-4 flex items-center justify-between"
          style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)', borderBottom: 'none' }}
        >
          <span className="font-medium text-sm md:text-base">Cart</span>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-lg font-bold">{items.reduce((a, b) => a + b.quantity, 0)} item(s)</span>
            <a href="/cart" className="bg-white text-black rounded px-4 py-2 font-semibold hover:bg-gray-200 transition">View Cart</a>
          </div>
        </div>
      )}
    </>
  );
}
