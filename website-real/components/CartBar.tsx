"use client";
import React, { useState, useRef, useEffect } from "react";
import { useCart } from "./CartContext";

export default function CartBar() {
  const { items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [showCartBar, setShowCartBar] = useState(false);
  const prevCount = useRef(items.reduce((a, b) => a + b.quantity, 0));
  const didMount = useRef(false);
  useEffect(() => {
    const count = items.reduce((a, b) => a + b.quantity, 0);
    if (!didMount.current) {
      prevCount.current = count;
      didMount.current = true;
      setShowCartBar(count > 0);
      return;
    }
    if (count > prevCount.current) {
      setShowPopup(true);
      // Only hide cart bar if this is the first item being added
      if (prevCount.current === 0) {
        setShowCartBar(false);
        setTimeout(() => {
          setShowPopup(false);
          setTimeout(() => setShowCartBar(items.length > 0), 50);
        }, 1500);
      } else {
        // For subsequent adds, keep cart bar visible
        setTimeout(() => setShowPopup(false), 1500);
      }
    } else {
      setShowCartBar(count > 0 && !showPopup);
    }
    prevCount.current = count;
  }, [items]);

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
