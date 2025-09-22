"use client";
import React, { useState, useRef, useEffect } from "react";
import { useCart } from "./CartContext";

export default function CartBar() {
  const { items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [popupPhase, setPopupPhase] = useState<'center'|'toTaskbar'|null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(items.reduce((a, b) => a + b.quantity, 0));

  // Detect add to cart, but skip on first render
  const didMount = useRef(false);
  useEffect(() => {
    const count = items.reduce((a, b) => a + b.quantity, 0);
    if (!didMount.current) {
      prevCount.current = count;
      didMount.current = true;
      return;
    }
    // Only play animation if count increases and previous count was not zero (skip hydration/nav)
    if (count > prevCount.current && prevCount.current !== 0) {
      setShowPopup(true);
      setPopupPhase('center');
      setTimeout(() => {
        setPopupPhase('toTaskbar');
        setTimeout(() => {
          setShowPopup(false);
          setPopupPhase(null);
        }, 500);
      }, 900);
    }
    prevCount.current = count;
  }, [items]);

  return (
    <>
      {/* Popup animation */}
      {showPopup && (
        <div
          ref={popupRef}
          className="fixed z-50 flex flex-col items-center justify-center"
          style={{
            left: '50%',
            bottom: 0,
            transform: popupPhase === 'center'
              ? 'translate(-50%, -50vh) scale(1)'
              : 'translate(-50%, 0) scale(0.97)',
            opacity: showPopup ? 1 : 0,
            transition: 'transform 0.8s cubic-bezier(0.77,0,0.175,1), opacity 0.5s',
            willChange: 'transform, opacity',
            width: popupPhase === 'center' ? 180 : '100vw',
            height: popupPhase === 'center' ? 200 : 64,
            background: popupPhase === 'center'
              ? 'url(/images/apple.png) center/contain no-repeat'
              : 'linear-gradient(135deg, #18191a 60%, #232324 100%)',
            color: 'white',
            borderRadius: popupPhase === 'center' ? '50%' : '32px 32px 0 0',
            boxShadow: popupPhase === 'center'
              ? '0 8px 32px 0 rgba(0,0,0,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)'
              : '0 4px 24px 0 rgba(0,0,0,0.18)',
            textAlign: 'center',
            fontFamily: 'inherit',
            fontWeight: 600,
            fontSize: popupPhase === 'center' ? 22 : 18,
            letterSpacing: 1,
            padding: popupPhase === 'center' ? '0 0 24px 0' : '18px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            pointerEvents: 'none',
            overflow: 'visible',
            position: 'fixed',
          }}
        >
          <span style={{
            display: 'inline-block',
            background: popupPhase === 'center' ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.08)',
            borderRadius: 18,
            padding: popupPhase === 'center' ? '18px 38px 12px 38px' : '8px 18px',
            boxShadow: popupPhase === 'center' ? '0 2px 12px 0 rgba(0,0,0,0.10)' : 'none',
            fontSize: popupPhase === 'center' ? 22 : 18,
            fontWeight: 700,
            letterSpacing: 1,
            marginTop: popupPhase === 'center' ? 12 : 0,
            transition: 'all 0.5s cubic-bezier(.7,-0.2,.3,1.2)',
          }}>
            Added to cart!
          </span>
        </div>
      )}
      {/* Floating cart bar */}
      {items.length > 0 && !showPopup && (
        <div
          className="fixed left-0 right-0 bottom-0 z-50 bg-black text-white px-2 py-3 md:px-4 md:py-4 flex items-center justify-between animate-slideInUp"
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
