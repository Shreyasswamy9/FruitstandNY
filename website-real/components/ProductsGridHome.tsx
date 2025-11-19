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
  variantColor?: string; // For tee color variants
  variantSlug?: string; // slugified color for query param preselection
}

// Editable product list for the homepage grid
export const products: Product[] = [
  // New Tees (prioritized at top)
  // Gala Tshirt – each color variant surfaced individually
  { id: 1011, name: "Gala Tshirt", price: "$22", image: "/images/products/gala-tshirt/broadwaynoir/Firefly 20250924162431.png", hoverImage: "/images/products/gala-tshirt/broadwaynoir/Firefly 20250922123545.png", category: "T-Shirts", variantColor: "Broadway Noir", variantSlug: "broadway-noir" },
  { id: 1012, name: "Gala Tshirt", price: "$22", image: "/images/products/gala-tshirt/suttonplacesnow/SHIRTFINALIMAGES-63.jpg", hoverImage: "/images/products/gala-tshirt/suttonplacesnow/Firefly 20250924162628.png", category: "T-Shirts", variantColor: "Sutton Place Snow", variantSlug: "sutton-place-snow" },
  { id: 1013, name: "Gala Tshirt", price: "$22", image: "/images/products/gala-tshirt/Grasshopper/7.jpg", hoverImage: "/images/products/gala-tshirt/Grasshopper/GALATEES-23.jpg", category: "T-Shirts", variantColor: "Grasshopper", variantSlug: "grasshopper" },
  { id: 1014, name: "Gala Tshirt", price: "$22", image: "/images/products/gala-tshirt/frostedlemonade/GALATEES-47.jpg", hoverImage: "/images/products/gala-tshirt/frostedlemonade/GALATEES-49.jpg", category: "T-Shirts", variantColor: "Frosted Lemonade", variantSlug: "frosted-lemonade" },
  { id: 1015, name: "Gala Tshirt", price: "$22", image: "/images/products/gala-tshirt/italianice/3.jpg", hoverImage: "/images/products/gala-tshirt/italianice/GALATEES-23.jpg", category: "T-Shirts", variantColor: "Italian Ice", variantSlug: "italian-ice" },
  // Cameo variants
  { id: 1021, name: "Cameo Tshirt", price: "$22", image: "/images/products/cameo-tshirt/broadwaynoir/Firefly 20250923122927.png", hoverImage: "/images/products/cameo-tshirt/broadwaynoir/Firefly 20250923122927.png", category: "T-Shirts", variantColor: "Broadway Noir", variantSlug: "broadway-noir" },
  { id: 1022, name: "Cameo Tshirt", price: "$22", image: "/images/products/cameo-tshirt/suttonplacesnow/Firefly 20250923122951.png", hoverImage: "/images/products/cameo-tshirt/suttonplacesnow/Firefly 20250923122951.png", category: "T-Shirts", variantColor: "Sutton Place Snow", variantSlug: "sutton-place-snow" },
  // Mutsu variants
  { id: 1031, name: "Mutsu Tshirt", price: "$22", image: "/images/products/mutsu-tshirt/broadwaynoir/Firefly 20251118133858.png", hoverImage: "/images/products/mutsu-tshirt/broadwaynoir/Firefly 20251118134335.png", category: "T-Shirts", variantColor: "Broadway Noir", variantSlug: "broadway-noir" },
  { id: 1032, name: "Mutsu Tshirt", price: "$22", image: "/images/products/mutsu-tshirt/suttonplacesnow/Firefly 20251118133938.png", hoverImage: "/images/products/mutsu-tshirt/suttonplacesnow/Firefly 20251118134406.png", category: "T-Shirts", variantColor: "Sutton Place Snow", variantSlug: "sutton-place-snow" },
  // Fuji variants
  { id: 1041, name: "Fuji Tshirt", price: "$22", image: "/images/products/fuji-tshirt/fuji-red/1.jpeg", hoverImage: "/images/products/fuji-tshirt/fuji-red/1.jpeg", category: "T-Shirts", variantColor: "Fuji Red", variantSlug: "fuji-red" },
  { id: 1042, name: "Fuji Tshirt", price: "$22", image: "/images/products/fuji-tshirt/onyx/1.jpeg", hoverImage: "/images/products/fuji-tshirt/onyx/1.jpeg", category: "T-Shirts", variantColor: "Onyx", variantSlug: "onyx" },
  { id: 1043, name: "Fuji Tshirt", price: "$22", image: "/images/products/fuji-tshirt/snow/1.jpeg", hoverImage: "/images/products/fuji-tshirt/snow/1.jpeg", category: "T-Shirts", variantColor: "Snow", variantSlug: "snow" },
  { id: 1044, name: "Fuji Tshirt", price: "$22", image: "/images/products/fuji-tshirt/indigo/1.jpeg", hoverImage: "/images/products/fuji-tshirt/indigo/1.jpeg", category: "T-Shirts", variantColor: "Indigo", variantSlug: "indigo" },
  // Hockey Jersey
  { id: 1, name: "Hockey Jersey", price: "$90", image: "/images/hockeyjerseymale1.jpeg", hoverImage: "/images/hockeyjerseymale2.jpeg", category: "Jerseys" },
  // Classic Tee (cover models)
  { id: 2, name: "Classic Tee", price: "$55", image: "/images/tshirt plain.jpeg", hoverImage: "/images/tshirt back.jpeg", category: "T-Shirts" },
  // Classic Tee (female)
  { id: 3, name: "Classic Tee", price: "$55", image: "/images/tshirt plain.jpeg", hoverImage: "/images/tshirt back.jpeg", category: "T-Shirts" },
  // Classic Tee (male)
  { id: 4, name: "Classic Tee", price: "$55", image: "/images/tshirt plain.jpeg", hoverImage: "/images/tshirt back.jpeg", category: "T-Shirts" },
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
  { id: 99, name: "Product Page Tester", price: "$99", image: "/images/tshirt plain.jpeg", hoverImage: "/images/tshirt back.jpeg", category: "T-Shirts" },
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
  const CARD_RADIUS = 0; // squared edges for grid cards

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
  
  // Filter products based on category then collapse variants so only one card per product name
  const filteredProducts = categoryFilter 
    ? products.filter(p => p.category === categoryFilter)
    : products;
  // For each product name, pick a representative variant (random but stable within session)
  const variantGroups = filteredProducts.reduce((acc, p) => {
    (acc[p.name] ||= []).push(p);
    return acc;
  }, {} as Record<string, Product[]>);
  const displayProducts: Product[] = Object.entries(variantGroups).map(([name, group]) => {
    if (group.length === 1) return group[0];
    // Stable selection using sessionStorage per name
    if (typeof window !== 'undefined') {
      const key = `rep_variant_${name}`;
      const storedId = sessionStorage.getItem(key);
      const found = storedId ? group.find(g => String(g.id) === storedId) : null;
      if (found) return found;
      const chosen = group[Math.floor(Math.random() * group.length)];
      sessionStorage.setItem(key, String(chosen.id));
      return chosen;
    }
    // Fallback (SSR won't happen because component is client-only, but guard anyway)
    return group[0];
  });
  // Store touch state for each product card
  const touchState = useRef<{ [key: number]: { start: number; moved: boolean } }>({});
  // Track which product is showing hover image on mobile
  const [mobileHover, setMobileHover] = useState<number | null>(null);
  const formatPrice = (p: string) => {
    const n = Number(String(p).replace(/[^0-9.]/g, ''))
    return isFinite(n)
      ? `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : String(p)
  }
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
          gap: isMobile ? 22 : 32,
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
            className="bundle-banner w-full relative rounded-2xl p-3 sm:p-4 font-semibold active:scale-[0.99]"
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

      {displayProducts.map((product) => {
        const isActive = isMobile ? mobileHover === product.id : hovered === product.id;
        // Determine bundle availability: if any variant (sharing name) participates in a bundle, mark as bundled
        const bundledVariantIds = products.filter(p => p.name === product.name).map(p => p.id);
        const isBundled = bundles.some(b => b.itemIds.some(id => bundledVariantIds.includes(id)));
        // Custom link for Empire Hat and Denim Hat
        const getProductLink = () => {
          const basePathMap: Record<string, string> = {
            'Empire Hat': '/shop/empire-hat',
            'Denim Hat': '/shop/denim-hat',
            'Hockey Jersey': '/shop/hockey-jersey',
            'Classic Tee': '/shop/classic-tee',
            'Gala Tshirt': '/shop/gala-tshirt',
            'Cameo Tshirt': '/shop/cameo-tshirt',
            'Mutsu Tshirt': '/shop/mutsu-tshirt',
            'Fuji Tshirt': '/shop/fuji-tshirt',
            'Tracksuit': '/shop/tracksuit',
            'White Hat': '/shop/white-hat',
            'Beige Hat': '/shop/beige-hat',
            'Product Page Tester': '/shop/productpagetester'
          };
          const base = basePathMap[product.name] || `/products/${product.id}`;
          return product.variantSlug ? `${base}?color=${encodeURIComponent(product.variantSlug)}` : base;
        };
        return (
          <div
            key={product.id}
            style={{
              background: 'transparent',
              borderRadius: CARD_RADIUS,
              boxShadow: 'none',
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
                border: 'none'
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
            {/* Availability badge: show bundle options presence instead of color */}
            <button
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (isBundled) setBundleOpen(true) }}
              className="bundle-badge absolute top-2 left-2 z-[2] px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur shadow-md active:scale-95"
              aria-label={isBundled ? 'Bundle options available' : 'No bundle options'}
              disabled={!isBundled}
            >
              {isBundled ? 'Bundle options' : 'No bundle options'}
            </button>
            <div style={{
              width: '100%',
              aspectRatio: '4 / 5',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 0,
            }}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                style={{
                  objectFit: 'cover',
                  transition: 'opacity .4s ease',
                  opacity: isActive ? 0 : 1,
                }}
                priority
              />
              {product.hoverImage && (
                <Image
                  src={product.hoverImage}
                  alt={product.name}
                  fill
                  style={{
                    objectFit: 'cover',
                    transition: 'opacity .4s ease',
                    opacity: isActive ? 1 : 0,
                    position: 'absolute',
                    inset: 0,
                  }}
                  priority
                />
              )}
              </div>
              {/* Name and price below the image with premium spacing */}
              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: 6,
                padding: 0,
                marginTop: isMobile ? 10 : 12,
              }}>
                <h3 style={{
                  fontSize: isMobile ? '1.02rem' : '1.12rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  margin: 0,
                  lineHeight: 1.25,
                  letterSpacing: '0.005em',
                  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                }}>{product.name}</h3>
                <p style={{
                  color: '#111827',
                  fontWeight: 500,
                  fontSize: isMobile ? '0.92rem' : '1.0rem',
                  margin: 0,
                  lineHeight: 1.2,
                  letterSpacing: '0.01em',
                  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                }}>{formatPrice(product.price)}</p>
            </div>
          </div>
        );
      })}
      {/* Floating Bundle CTA for mobile */}
      {isMobile && !bundleOpen && (
        <button
          onClick={() => { setBundleOpen(true); sessionStorage.setItem('bundleTeaserDismissed', '1'); setTeased(false); }}
          className={`bundle-banner fixed bottom-[calc(env(safe-area-inset-bottom)+16px)] left-1/2 -translate-x-1/2 z-[10005] px-5 py-3 rounded-full font-semibold shadow-lg active:scale-95 transition-transform ${
            teased ? 'animate-[pulseGlow_1.8s_ease-in-out_infinite]' : ''
          }`}
          style={{ boxShadow: '0 8px 24px rgba(139,92,246,0.35)' }}
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
