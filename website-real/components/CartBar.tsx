"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import { LogoVisibilityContext } from "./ClientRootLayout";
import { useCart } from "./CartContext";
import { usePathname } from "next/navigation";

export default function CartBar() {
  const { items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [showCartBar, setShowCartBar] = useState(false);
  const prevCount = useRef(0);
  const isInitialized = useRef(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const { hideLogo } = useContext(LogoVisibilityContext); // hideLogo true during intro on home
  
  // Don't show cart bar on cart page
  const isCartPage = pathname === '/cart';
  const isHomePage = pathname === '/';
  useEffect(() => {
    const count = items.reduce((a, b) => a + b.quantity, 0);
    
    // On initial mount, get the previous count from localStorage
    if (!isInitialized.current) {
      const storedCount = typeof window !== 'undefined' ? 
        parseInt(localStorage.getItem('cartCount') || '0') : 0;
      prevCount.current = storedCount;
      isInitialized.current = true;
  const shouldShowCartBar = count > 0 && !isCartPage;
      setShowCartBar(shouldShowCartBar);
      
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
      // Show cart bar after popup
      popupTimeoutRef.current = setTimeout(() => {
        setShowPopup(false);
        setTimeout(() => setShowCartBar(count > 0 && !isCartPage), 50);
      }, 1500);
    } else if (count < prevCount.current) {
      // Item was removed, update cart bar visibility
      const shouldShowCartBar = count > 0 && !showPopup && !isCartPage;
      setShowCartBar(shouldShowCartBar);
    } else {
      // Count is the same, but ensure cart bar is visible if we have items and not on cart page
      if (count > 0 && !isCartPage && !showPopup) {
        setShowCartBar(true);
      } else if (count === 0 || isCartPage) {
        setShowCartBar(false);
      }
    }
    // If count is the same, don't do anything (no popup)
    
    prevCount.current = count;
    
    // Update localStorage with current count
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartCount', count.toString());
    }
  }, [items, isCartPage, showPopup]);

  // Handle page navigation - ensure cart bar visibility is correct
  useEffect(() => {
    const count = items.reduce((a, b) => a + b.quantity, 0);
    if (isInitialized.current && count > 0 && !isCartPage && !showPopup) {
      setShowCartBar(true);
    } else if (isCartPage) {
      setShowCartBar(false);
    }
  }, [pathname, isCartPage, showPopup, items]);

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
      {showCartBar && !isCartPage && !(isHomePage && hideLogo) && (
        <div
          className="fixed left-0 right-0 bottom-0 z-[10002] text-white px-3 md:px-6 flex items-center justify-between"
          style={{ 
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'saturate(140%) blur(8px)',
            WebkitBackdropFilter: 'saturate(140%) blur(8px)',
            borderTopLeftRadius: 18, 
            borderTopRightRadius: 18, 
            borderTop: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 -6px 30px rgba(0,0,0,0.35)',
            borderBottom: 'none',
            paddingTop: '14px',
            paddingBottom: 'calc(14px + env(safe-area-inset-bottom))',
            marginBottom: '0'
          }}
        >
          <div className="flex items-center gap-3">
            <span className="font-medium text-sm md:text-base">Cart</span>
            <span className="inline-block bg-white text-black rounded-full px-3 py-1 text-sm font-bold shadow">
              {items.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-sm md:text-base font-semibold">
              ${items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}
            </span>
            <a
              href="/cart"
              className="bg-white text-black rounded-lg px-4 py-2 md:px-6 md:py-2 font-semibold hover:bg-gray-200 transition-colors text-sm md:text-base shadow"
            >
              Checkout
            </a>
          </div>
        </div>
      )}
    </>
  );
}
