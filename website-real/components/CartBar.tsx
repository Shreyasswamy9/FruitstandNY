"use client";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { LogoVisibilityContext } from "./ClientRootLayout";
import { useCart } from "./CartContext";
import { usePathname } from "next/navigation";

export default function CartBar() {
  const { items } = useCart();
  const [showCartBar, setShowCartBar] = useState(false);
  const pathname = usePathname();
  const { hideLogo } = useContext(LogoVisibilityContext); // hideLogo true during intro on home
  
  // Don't show cart bar on cart page
  const isCartPage = pathname === '/cart';
  const isHomePage = pathname === '/';
  const isProductDetailPage = Boolean(pathname && pathname.startsWith('/shop/') && pathname !== '/shop');
  const itemCount = useMemo(() => items.reduce((a, b) => a + b.quantity, 0), [items]);

  useEffect(() => {
    const shouldShow = itemCount > 0 && !isCartPage && !isProductDetailPage && !(isHomePage && hideLogo);
    setShowCartBar(shouldShow);
  }, [itemCount, isCartPage, isProductDetailPage, isHomePage, hideLogo]);

  // Handle page navigation - ensure cart bar visibility is correct
  useEffect(() => {
    if (itemCount > 0 && !isCartPage && !isProductDetailPage && !(isHomePage && hideLogo)) {
      setShowCartBar(true);
    } else if (isCartPage || isProductDetailPage) {
      setShowCartBar(false);
    }
  }, [pathname, itemCount, isCartPage, isProductDetailPage, isHomePage, hideLogo]);

  return (
    <>
      {showCartBar && !isCartPage && !isProductDetailPage && !(isHomePage && hideLogo) && (
        <div
          className="fixed left-0 right-0 bottom-0 z-10002 text-white px-3 md:px-6 flex items-center justify-between"
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
