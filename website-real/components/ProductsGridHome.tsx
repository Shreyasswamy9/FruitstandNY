"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { bundles } from '@/lib/bundles'
import BundleSheet from './BundleSheet'

export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  hoverImage?: string;
  category?: string;
}

// Editable product list for the homepage grid
export const products: Product[] = [
  // New Tees (prioritized at top)
  { id: 101, name: "Gala Tshirt", price: "$22", image: "/images/classicteemale1.jpeg", hoverImage: "/images/classicteecovermodels.jpeg", category: "T-Shirts" },
  { id: 102, name: "Cameo Tshirt", price: "$22", image: "/images/classicteefemale1.jpeg", hoverImage: "/images/classicteefemale2.jpeg", category: "T-Shirts" },
  { id: 103, name: "Mutsu Tshirt", price: "$22", image: "/images/classicteemale2.jpeg", hoverImage: "/images/classicteecovermodels.jpeg", category: "T-Shirts" },
  { id: 104, name: "Fuji Tshirt", price: "$22", image: "/images/classicteemale1.jpeg", hoverImage: "/images/classicteecovermodels.jpeg", category: "T-Shirts" },
  // Hockey Jersey
  { id: 1, name: "Hockey Jersey", price: "$90", image: "/images/hockeyjerseymale1.jpeg", hoverImage: "/images/hockeyjerseymale2.jpeg", category: "Jerseys" },
  // Classic Tee (cover models)
  { id: 2, name: "Classic Tee", price: "$55", image: "/images/classicteemale1.jpeg", hoverImage: "/images/classicteecovermodels.jpeg", category: "T-Shirts" },
  // Classic Tee (female)
  { id: 3, name: "Classic Tee", price: "$55", image: "/images/classicteefemale1.jpeg", hoverImage: "/images/classicteefemale2.jpeg", category: "T-Shirts" },
  // Classic Tee (male)
  { id: 4, name: "Classic Tee", price: "$55", image: "/images/classicteemale2.jpeg", hoverImage: "/images/classicteecovermodels.jpeg", category: "T-Shirts" },
  // Tracksuit (B&W)
  { id: 5, name: "Tracksuit", price: "$120", image: "/images/B&Wtracksuitmale1.jpeg", hoverImage: "/images/tracksuitscovermodels.jpeg", category: "Tracksuits" },
  // Tracksuit (Maroon)
  { id: 6, name: "Tracksuit", price: "$120", image: "/images/maroontracksuitmale1.jpeg", hoverImage: "/images/tracksuitscovermodels.jpeg", category: "Tracksuits" },
  // Denim Hat (male)
  { id: 7, name: "Denim Hat", price: "$40", image: "/images/denimhatmale1.jpeg", hoverImage: "/images/denimhatmale2.jpeg", category: "Hats" },
  // Denim Hat (female)
  { id: 8, name: "Denim Hat", price: "$40", image: "/images/denimhatfemale1.jpeg", hoverImage: "/images/denimhatsolo.jpeg", category: "Hats" },
  // White Hat (male)
  { id: 9, name: "White Hat", price: "$40", image: "/images/whitehatmale1.jpeg", hoverImage: "/images/whitehatsolo.jpeg", category: "Hats" },
  // Beige Hat (female)
  { id: 10, name: "Beige Hat", price: "$40", image: "/images/beigehatfemale1.jpeg", hoverImage: "/images/beigehatsolo.jpeg", category: "Hats" },
  // Empire Hat (NEW)
  { id: 11, name: "Empire Hat", price: "$42", image: "/images/empirehatfemale.jpg", hoverImage: "/images/empirehatsolo.jpg", category: "Hats" },
  // Product Page Tester (for skeleton testing)
  { id: 99, name: "Product Page Tester", price: "$99", image: "/images/classicteemale1.jpeg", hoverImage: "/images/denimhatfemale1.jpeg", category: "T-Shirts" },
  // Jacket (placeholder - can be updated with actual jacket images)
  { id: 12, name: "Premium Jacket", price: "$150", image: "/images/classicteemale1.jpeg", hoverImage: "/images/classicteecovermodels.jpeg", category: "Jackets" },
];

interface ProductsGridProps {
  categoryFilter?: string | null;
  showBundleBanner?: boolean; // shows the top-of-grid bundle banner
}

export default function ProductsGrid({ categoryFilter, showBundleBanner = true }: ProductsGridProps = {}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [bundleOpen, setBundleOpen] = useState(false);
  const [teased, setTeased] = useState(false);
  const maxDiscount = Math.max(0, ...bundles.map(b => b.discountPercent || 0));
  const CARD_RADIUS = 16; // keep card/UI rounding consistent

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = sessionStorage.getItem('bundleTeaserDismissed');
    if (!dismissed) {
      // Show teaser pulse soon after load for mobile
      const t = setTimeout(() => setTeased(true), 900);
      return () => clearTimeout(t);
    }
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isMobile) return;
    const autoShown = sessionStorage.getItem('bundleAutoShown');
    if (!autoShown) {
      const t = setTimeout(() => {
        setBundleOpen(true);
        sessionStorage.setItem('bundleAutoShown', '1');
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [isMobile]);
  
  // Filter products based on category
  const gridProducts = categoryFilter 
    ? products.filter(product => product.category === categoryFilter)
    : products;
  // Store touch state for each product card
  const touchState = useRef<{ [key: number]: { start: number; moved: boolean } }>({});
  // Track which product is showing hover image on mobile
  const [mobileHover, setMobileHover] = useState<number | null>(null);
  return (
    <>
      {/* Fixed video background for all devices */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            objectPosition: isMobile ? 'center center' : 'right center',
            pointerEvents: 'none',
          }}
          src="/Videos/homevideo.mp4"
        />
      </div>
      <style>{`
        @media (max-width: 600px) {
          video {
            object-position: center center !important;
          }
        }
      `}</style>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gap: isMobile ? 18 : 32,
          width: isMobile ? '100%' : 'auto',
          maxWidth: '100%',
          margin: '0 auto',
          padding: isMobile ? '12px 16px' : 0,
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, auto)',
          gridAutoRows: 'auto',
          gridAutoFlow: 'row dense',
          overflowX: 'auto',
          alignItems: 'start',
          background: 'transparent',
          justifyContent : 'center',
        }}
      >
      {/* Bundle spotlight banner: ensure it sits below category bar with clear spacing */}
      {showBundleBanner && (
        <div className="col-span-full w-full mx-auto max-w-md mt-1.5 mb-1.5">
          <button
            onClick={() => setBundleOpen(true)}
            className="w-full relative rounded-2xl p-3 sm:p-4 text-white font-semibold shadow-lg active:scale-[0.99]"
            style={{
              background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 50%, #22D3EE 100%)',
              boxShadow: '0 10px 28px rgba(139,92,246,0.35)'
            }}
            aria-label="Open bundle deals"
          >
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-lg">🔥 Bundle Deals</span>
              <span className="text-[11px] sm:text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Save up to {maxDiscount}%</span>
            </div>
            <span className="block text-[11px] sm:text-xs mt-1 text-white/90">Tap to see curated combos that pair perfectly</span>
          </button>
        </div>
      )}

      {gridProducts.map((product) => {
        const isActive = isMobile ? mobileHover === product.id : hovered === product.id;
        const isBundled = bundles.some(b => b.itemIds.includes(product.id));
        // Custom link for Empire Hat and Denim Hat
        const getProductLink = () => {
          switch (product.name) {
            case "Empire Hat":
              return "/shop/empire-hat";
            case "Denim Hat":
              return "/shop/denim-hat";
            case "Hockey Jersey":
              return "/shop/hockey-jersey";
            case "Classic Tee":
              return "/shop/classic-tee";
            case "Gala Tshirt":
              return "/shop/gala-tshirt";
            case "Cameo Tshirt":
              return "/shop/cameo-tshirt";
            case "Mutsu Tshirt":
              return "/shop/mutsu-tshirt";
            case "Fuji Tshirt":
              return "/shop/fuji-tshirt";
            case "Tracksuit":
              return "/shop/tracksuit";
            case "White Hat":
              return "/shop/white-hat";
            case "Beige Hat":
              return "/shop/beige-hat";
            case "Product Page Tester":
              return "/shop/productpagetester";
            default:
              return `/products/${product.id}`;
          }
        };
        return (
          <div
            key={product.id}
            style={{
              background: 'transparent',
              borderRadius: CARD_RADIUS,
              boxShadow: isMobile 
                ? (isBundled 
                    ? '0 0 0 2px rgba(139,92,246,0.6), 0 8px 24px rgba(139,92,246,0.25)'
                    : '0 4px 24px 0 rgba(0,0,0,0.10)')
                : (isBundled ? '0 0 0 2px rgba(139,92,246,0.5)' : 'none'),
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              minHeight: isMobile ? 'auto' : 0,
              height: 'auto',
              width: isMobile ? '100%' : '320px',
              maxWidth: '100%',
              margin: 0,
              marginBottom: 0,
              boxSizing: 'border-box',
              position: 'relative',
              transform: isActive ? 'scale(1.01)' : 'none',
              zIndex: isActive ? 10 : 1,
              justifyContent: isMobile ? 'center' : 'stretch',
              pointerEvents: 'auto',
              border: '1px solid rgba(0,0,0,0.06)'
            }}
            onMouseEnter={() => { 
              if (!isMobile) setHovered(product.id); 
            }}
            onMouseLeave={() => { 
              if (!isMobile) setHovered(null); 
            }}
            onTouchStart={() => {
              if (isMobile) {
                touchState.current[product.id] = { start: Date.now(), moved: false };
                setMobileHover(product.id);
              }
            }}
            onTouchMove={() => {
              if (isMobile) {
                if (touchState.current[product.id]) {
                  touchState.current[product.id].moved = true;
                }
              }
            }}
            onTouchEnd={() => {
              if (isMobile) {
                const state = touchState.current[product.id];
                const touchTime = state ? Date.now() - state.start : 0;
                if (state && !state.moved && touchTime < 250) {
                  window.location.href = getProductLink();
                } else {
                  setMobileHover(null);
                }
                delete touchState.current[product.id];
              }
            }}
            onTouchCancel={() => {
              if (isMobile) {
                setMobileHover(null);
                delete touchState.current[product.id];
              }
            }}
            onClick={() => {
              if (!isMobile) {
                window.location.href = getProductLink();
              }
            }}
            role="button"
            tabIndex={0}
          >
            {/* Bundle badge (show when this product participates in at least one bundle) */}
            {isBundled && (
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setBundleOpen(true) }}
                className="absolute top-2 left-2 z-[2] px-2.5 py-1 rounded-full text-[11px] font-semibold text-white backdrop-blur shadow-md active:scale-95"
                aria-label="Bundle and save"
                style={{
                  background: 'linear-gradient(90deg, rgba(139,92,246,0.95) 0%, rgba(236,72,153,0.95) 50%, rgba(34,211,238,0.95) 100%)',
                  boxShadow: '0 6px 16px rgba(139,92,246,0.35)'
                }}
              >
                ✨ Bundle & Save
              </button>
            )}
            <div style={{
              pointerEvents: 'none',
              position: 'relative',
              background: 'transparent',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 'fit-content',
              margin: 0,
              padding: 0,
              borderRadius: CARD_RADIUS,
              boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
            }}>
              <Image
                src={product.image}
                alt={product.name}
                width={320}
                height={420}
                style={{
                  objectFit: 'cover',
                  display: isActive ? 'none' : 'block',
                  borderRadius: 0,
                  background: 'transparent',
                  transition: 'opacity 0.5s cubic-bezier(.4,0,.2,1)',
                  opacity: isActive ? 0 : 1,
                  zIndex: 1,
                  width: '100%',
                  height: 'auto',
                }}
                priority
              />
              {product.hoverImage && (
                <Image
                  src={product.hoverImage}
                  alt={product.name + ' alt'}
                  width={320}
                  height={420}
                  style={{
                    objectFit: 'cover',
                    display: isActive ? 'block' : 'none',
                    borderRadius: 0,
                    background: 'transparent',
                    transition: 'opacity 0.5s cubic-bezier(.4,0,.2,1)',
                    opacity: isActive ? 1 : 0,
                    zIndex: 1,
                    width: '100%',
                    height: 'auto',
                  }}
                  priority
                />
              )}
              {/* Overlay name and price at the bottom of the grid cell */}
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255,255,255,0.97)',
                padding: isMobile ? '16px 20px 14px 20px' : '16px 24px 14px 24px',
                borderBottomLeftRadius: CARD_RADIUS,
                borderBottomRightRadius: CARD_RADIUS,
                boxSizing: 'border-box',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 18,
                width: '100%',
                minWidth: 0,
                maxWidth: '100%',
                boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
                borderTop: '1px solid #eee',
              }}>
                <h3 style={{
                  fontSize: isMobile ? '1.18rem' : '1.22rem',
                  fontWeight: 600,
                  color: '#181818',
                  margin: 0,
                  lineHeight: 1.13,
                  letterSpacing: '0.01em',
                  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                  textTransform: 'none',
                  textShadow: '0 1px 0 #fff',
                }}>{product.name}</h3>
                <p style={{
                  color: '#444',
                  fontWeight: 500,
                  fontSize: isMobile ? '0.85rem' : '1.13rem',
                  margin: 0,
                  lineHeight: 1.13,
                  letterSpacing: '0.01em',
                  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                  textShadow: '0 1px 0 #fff',
                }}>{product.price}</p>
              </div>
            </div>
          </div>
        );
      })}
      {/* Floating Bundle CTA for mobile */}
      {isMobile && !bundleOpen && (
        <button
          onClick={() => { setBundleOpen(true); sessionStorage.setItem('bundleTeaserDismissed', '1'); setTeased(false); }}
          className={`fixed bottom-[calc(env(safe-area-inset-bottom)+16px)] left-1/2 -translate-x-1/2 z-[10005] px-5 py-3 rounded-full text-white font-semibold shadow-lg active:scale-95 transition-transform ${
            teased ? 'animate-[pulseGlow_1.8s_ease-in-out_infinite]' : ''
          }`}
          style={{
            background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 50%, #22D3EE 100%)',
            boxShadow: '0 8px 24px rgba(139,92,246,0.35)',
          }}
          aria-label="Open bundle deals"
        >
          ✨ Bundle & Save
        </button>
      )}
      {/* Local keyframes for glowing pulse */}
      <style>{`
        @keyframes pulseGlow {
          0% { filter: drop-shadow(0 0 0 rgba(236,72,153,0.0)); transform: translateX(-50%) scale(1); }
          50% { filter: drop-shadow(0 0 16px rgba(236,72,153,0.45)); transform: translateX(-50%) scale(1.03); }
          100% { filter: drop-shadow(0 0 0 rgba(236,72,153,0.0)); transform: translateX(-50%) scale(1); }
        }
      `}</style>
      {/* Mobile bundle sheet */}
      <BundleSheet open={bundleOpen} onClose={() => setBundleOpen(false)} />
    </div>
    </>
  );
}
