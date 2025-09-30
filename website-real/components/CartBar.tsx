"use client";
import React, { useState, useRef, useEffect } from "react";
import { useCart } from "./CartContext";
import { usePathname } from "next/navigation";

export default function CartBar() {
  const { items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [showCartBar, setShowCartBar] = useState(false);
  const [hasScrolledOnHome, setHasScrolledOnHome] = useState(false);
  const prevCount = useRef(0);
  const isInitialized = useRef(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  
  // Don't show cart bar on cart page
  const isCartPage = pathname === '/cart';
  const isHomePage = pathname === '/';

  // Handle scroll on home page to determine when to show cart bar
  useEffect(() => {
    if (!isHomePage) {
      setHasScrolledOnHome(true); // On non-home pages, always allow cart bar
      return;
    }

    const handleScroll = () => {
      const scrollThreshold = 600; // Same threshold as sign-up modal
      if (window.scrollY > scrollThreshold) {
        setHasScrolledOnHome(true);
      } else {
        setHasScrolledOnHome(false);
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Reset scroll state when navigating to/from home page
  useEffect(() => {
    if (!isHomePage) {
      setHasScrolledOnHome(true);
    } else {
      // Check initial scroll position on home page
      const scrollThreshold = 600;
      setHasScrolledOnHome(window.scrollY > scrollThreshold);
    }
  }, [pathname, isHomePage]);
  useEffect(() => {
    const count = items.reduce((a, b) => a + b.quantity, 0);
    
    // On initial mount, get the previous count from localStorage
    if (!isInitialized.current) {
      const storedCount = typeof window !== 'undefined' ? 
        parseInt(localStorage.getItem('cartCount') || '0') : 0;
      prevCount.current = storedCount;
      isInitialized.current = true;
      const shouldShowCartBar = count > 0 && !isCartPage && (isHomePage ? hasScrolledOnHome : true);
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
        setTimeout(() => setShowCartBar(count > 0 && !isCartPage && (isHomePage ? hasScrolledOnHome : true)), 50);
      }, 1500);
    } else if (count < prevCount.current) {
      // Item was removed, update cart bar visibility
      const shouldShowCartBar = count > 0 && !showPopup && !isCartPage && (isHomePage ? hasScrolledOnHome : true);
      setShowCartBar(shouldShowCartBar);
    } else {
      // Count is the same, but ensure cart bar is visible if we have items and not on cart page
      if (count > 0 && !isCartPage && !showPopup && (isHomePage ? hasScrolledOnHome : true)) {
        setShowCartBar(true);
      } else if (count === 0 || isCartPage || (isHomePage && !hasScrolledOnHome)) {
        setShowCartBar(false);
      }
    }
    // If count is the same, don't do anything (no popup)
    
    prevCount.current = count;
    
    // Update localStorage with current count
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartCount', count.toString());
    }
  }, [items, isCartPage, isHomePage, hasScrolledOnHome]);

  // Handle page navigation - ensure cart bar visibility is correct
  useEffect(() => {
    const count = items.reduce((a, b) => a + b.quantity, 0);
    if (isInitialized.current && count > 0 && !isCartPage && !showPopup && (isHomePage ? hasScrolledOnHome : true)) {
      setShowCartBar(true);
    } else if (isCartPage || (isHomePage && !hasScrolledOnHome)) {
      setShowCartBar(false);
    }
  }, [pathname, isCartPage, isHomePage, hasScrolledOnHome, showPopup]);

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
      {showCartBar && !isCartPage && (
        <div
          className="fixed left-0 right-0 bottom-0 z-40 bg-black text-white px-3 py-4 md:px-6 md:py-4 flex items-center justify-between"
          style={{ 
            borderTopLeftRadius: 20, 
            borderTopRightRadius: 20, 
            boxShadow: '0 -4px 24px 0 rgba(0,0,0,0.2)', 
            borderBottom: 'none',
            marginBottom: isHomePage ? '0' : '0' // Ensure no margin issues
          }}
        >
          <div className="flex items-center gap-3">
            <span className="font-medium text-sm md:text-base">Cart</span>
            <span className="inline-block bg-white text-black rounded-full px-3 py-1 text-sm font-bold">
              {items.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-sm md:text-base font-semibold">
              ${items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}
            </span>
            <a 
              href="/cart" 
              className="bg-white text-black rounded-lg px-4 py-2 md:px-6 md:py-2 font-semibold hover:bg-gray-200 transition-colors text-sm md:text-base"
            >
              Checkout
            </a>
          </div>
        </div>
      )}
    </>
  );
}
