"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  // Retro Track Suit Collection (spotlight first)
  { id: 2001, name: "Retro Track Suit", price: "$120", image: "/images/products/tracksuits/ELMHURST TARO CUSTARD/TP.png", hoverImage: "/images/products/tracksuits/ELMHURST TARO CUSTARD/TS7.png", category: "Tracksuits", variantColor: "Elmhurst Taro Custard", variantSlug: "elmhurst-taro-custard" },
  { id: 2002, name: "Retro Track Suit", price: "$120", image: "/images/products/tracksuits/Greenpoint Patina Crew/GB.png", hoverImage: "/images/products/tracksuits/Greenpoint Patina Crew/TS2.png", category: "Tracksuits", variantColor: "Greenpoint Patina Crew", variantSlug: "greenpoint-patina-crew" },
  { id: 2003, name: "Retro Track Suit", price: "$120", image: "/images/products/tracksuits/NOHO NAPOLETANOS/TB.png", hoverImage: "/images/products/tracksuits/NOHO NAPOLETANOS/TS3.png", category: "Tracksuits", variantColor: "Noho Napoletanos", variantSlug: "noho-napoletanos" },
  { id: 2004, name: "Retro Track Suit", price: "$120", image: "/images/products/tracksuits/THE FACTORY FLOOR/BG.png", hoverImage: "/images/products/tracksuits/THE FACTORY FLOOR/TS4.png", category: "Tracksuits", variantColor: "The Factory Floor", variantSlug: "the-factory-floor" },
  { id: 2005, name: "Retro Track Suit", price: "$120", image: "/images/products/tracksuits/VICE CITY RUNNERS/PB.png", hoverImage: "/images/products/tracksuits/VICE CITY RUNNERS/TS5.png", category: "Tracksuits", variantColor: "Vice City Runners", variantSlug: "vice-city-runners" },
  { id: 2006, name: "Retro Track Suit", price: "$120", image: "/images/products/tracksuits/Victory Liberty Club/RB.png", hoverImage: "/images/products/tracksuits/Victory Liberty Club/TS6.png", category: "Tracksuits", variantColor: "Victory Liberty Club", variantSlug: "victory-liberty-club" },
  { id: 2007, name: "Retro Track Suit", price: "$120", image: "/images/products/tracksuits/YORKVILLE BLACK AND WHITE COOKIES/BW.png", hoverImage: "/images/products/tracksuits/YORKVILLE BLACK AND WHITE COOKIES/TS1.png", category: "Tracksuits", variantColor: "Yorkville Black and White Cookies", variantSlug: "yorkville-black-and-white-cookies" },
  // Broadway Blueberry Jersey (merch slot before tees)
  { id: 1, name: "Broadway Blueberry Jersey", price: "$90", image: "/images/products/hockey Jersey/JN.png", hoverImage: "/images/products/hockey Jersey/JN1.png", category: "Jerseys", variantColor: "Black Ice", variantSlug: "hockey-jersey" },
  // New Tee lineup
  // Gala Tee – each color variant surfaced individually
  { id: 1011, name: "Gala Tee", price: "$40", image: "/images/products/gala-tshirt/broadwaynoir/GN4.png", hoverImage: "/images/products/gala-tshirt/broadwaynoir/GN5.png", category: "Tops", variantColor: "Broadway Noir", variantSlug: "broadway-noir" },
  { id: 1012, name: "Gala Tee", price: "$40", image: "/images/products/gala-tshirt/suttonplacesnow/GN6.png", hoverImage: "/images/products/gala-tshirt/suttonplacesnow/GN11.png", category: "Tops", variantColor: "Sutton Place Snow", variantSlug: "sutton-place-snow" },
  { id: 1013, name: "Gala Tee", price: "$40", image: "/images/products/gala-tshirt/Grasshopper/GN3.png", hoverImage: "/images/products/gala-tshirt/Grasshopper/GN8.png", category: "Tops", variantColor: "Grasshopper", variantSlug: "grasshopper" },
  { id: 1014, name: "Gala Tee", price: "$40", image: "/images/products/gala-tshirt/frostedlemonade/GN9.png", hoverImage: "/images/products/gala-tshirt/frostedlemonade/GN10.png", category: "Tops", variantColor: "Frosted Lemonade", variantSlug: "frosted-lemonade" },
  { id: 1015, name: "Gala Tee", price: "$40", image: "/images/products/gala-tshirt/italianice/GN1.png", hoverImage: "/images/products/gala-tshirt/italianice/GN2.png", category: "Tops", variantColor: "Italian Ice", variantSlug: "italian-ice" },
  { id: 1016, name: "Gala Tee", price: "$40", image: "/images/products/gala-tshirt/ruby red/GN.png", hoverImage: "/images/products/gala-tshirt/ruby red/GN7.png", category: "Tops", variantColor: "Ruby Red", variantSlug: "ruby-red" },
  // Cameo variants
  { id: 1021, name: "Cameo Tee", price: "$40", image: "/images/products/cameo-tshirt/broadwaynoir/MN.png", hoverImage: "/images/products/cameo-tshirt/broadwaynoir/MN3.png", category: "Tops", variantColor: "Broadway Noir", variantSlug: "broadway-noir" },
  { id: 1022, name: "Cameo Tee", price: "$40", image: "/images/products/cameo-tshirt/suttonplacesnow/MN1.png", hoverImage: "/images/products/cameo-tshirt/suttonplacesnow/MN2.png", category: "Tops", variantColor: "Sutton Place Snow", variantSlug: "sutton-place-snow" },
  // Mutsu variants
  { id: 1031, name: "Mutsu Tee", price: "$45", image: "/images/products/mutsu-tshirt/broadwaynoir/N1.png", hoverImage: "/images/products/mutsu-tshirt/broadwaynoir/N2.png", category: "Tops", variantColor: "Broadway Noir", variantSlug: "broadway-noir" },
  { id: 1032, name: "Mutsu Tee", price: "$45", image: "/images/products/mutsu-tshirt/suttonplacesnow/N3.png", hoverImage: "/images/products/mutsu-tshirt/suttonplacesnow/N4.png", category: "Tops", variantColor: "Sutton Place Snow", variantSlug: "sutton-place-snow" },
  // Fuji Long Sleeve variants (updated colors & images)
  { id: 1041, name: "Fuji Long Sleeve", price: "$80", image: "/images/products/fuji-tshirt/Arboretum/F2.png", hoverImage: "/images/products/fuji-tshirt/Arboretum/F11.png", category: "Tops", variantColor: "Arboretum", variantSlug: "arboretum" },
  { id: 1042, name: "Fuji Long Sleeve", price: "$80", image: "/images/products/fuji-tshirt/Hudson blue/F1.png", hoverImage: "/images/products/fuji-tshirt/Hudson blue/F9.png", category: "Tops", variantColor: "Hudson Blue", variantSlug: "hudson-blue" },
  { id: 1043, name: "Fuji Long Sleeve", price: "$80", image: "/images/products/fuji-tshirt/Redbird/F4.png", hoverImage: "/images/products/fuji-tshirt/Redbird/F5.png", category: "Tops", variantColor: "Redbird", variantSlug: "redbird" },
  { id: 1044, name: "Fuji Long Sleeve", price: "$80", image: "/images/products/fuji-tshirt/Broadwaynoir/F3.png", hoverImage: "/images/products/fuji-tshirt/Broadwaynoir/F7.png", category: "Tops", variantColor: "Broadway Noir", variantSlug: "broadway-noir" },
  // Denim Hat (male)
  { id: 7, name: "Denim Hat", price: "$40", image: "/images/denimhatmale1.jpeg", hoverImage: "/images/denimhatmale2.jpeg", category: "Hats" },
  // Denim Hat (female)
  { id: 8, name: "Denim Hat", price: "$40", image: "/images/denimhatfemale1.jpeg", hoverImage: "/images/denimhatsolo.jpeg", category: "Hats" },
  // White Hat (male)
  { id: 9, name: "White Hat", price: "$40", image: "/images/whitehatmale1.jpeg", hoverImage: "/images/whitehatsolo.jpeg", category: "Hats" },
  // Beige Hat (female)
  { id: 10, name: "Beige Hat", price: "$40", image: "/images/beigehatfemale1.jpeg", hoverImage: "/images/beigehatsolo.jpeg", category: "Hats" },
  // Empire Cordury hat (NEW)
  { id: 11, name: "Empire Cordury hat", price: "$42", image: "/images/empirehatfemale.jpg", hoverImage: "/images/empirehatsolo.jpg", category: "Hats" },
];

interface ProductsGridProps {
  categoryFilter?: string | null;
  showBackgroundVideo?: boolean; // render the fixed background video (home only)
}

export default function ProductsGrid({ categoryFilter, showBackgroundVideo = true }: ProductsGridProps = {}) {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [bundleOpen, setBundleOpen] = useState(false);
  // Track swatch selection per product name (id of the chosen variant)
  const [selectedVariantByName, setSelectedVariantByName] = useState<Record<string, number>>({});
  const CARD_RADIUS = 7; // subtle curvature for grid cards

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
  const filteredProducts = useMemo(() => (
    categoryFilter
      ? products.filter(p => {
        if (!p.category) return false;
        if (categoryFilter === 'Tops') {
          return ['Tops', 'T-Shirts'].includes(p.category);
        }
        return p.category === categoryFilter;
      })
      : products
  ), [categoryFilter]);
  // For each product name, bucket all variants together for representative selection
  const variantGroups = useMemo(() => (
    filteredProducts.reduce((acc, p) => {
      (acc[p.name] ||= []).push(p);
      return acc;
    }, {} as Record<string, Product[]>)
  ), [filteredProducts]);
  // Randomized representative variant per product name to avoid uniform default colors
  const [representativeByName, setRepresentativeByName] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const nextMap: Record<string, number> = {};
    Object.entries(variantGroups).forEach(([name, group]) => {
      if (!group.length) return;
      if (group.length === 1) {
        nextMap[name] = group[0].id;
        sessionStorage.setItem(`rep_variant_${name}`, String(group[0].id));
        return;
      }
      const key = `rep_variant_${name}`;
      const storedId = sessionStorage.getItem(key);
      const storedVariant = storedId ? group.find(g => String(g.id) === storedId) : undefined;
      const chosen = storedVariant || group[Math.floor(Math.random() * group.length)];
      nextMap[name] = chosen.id;
      sessionStorage.setItem(key, String(chosen.id));
    });
    setRepresentativeByName(nextMap);
  }, [variantGroups]);

  const displayProducts: Product[] = useMemo(() => (
    Object.entries(variantGroups).map(([name, group]) => {
      if (!group.length) return group[0];
      if (group.length === 1) return group[0];
      const repId = representativeByName[name];
      return group.find(item => item.id === repId) || group[0];
    })
  ), [variantGroups, representativeByName]);
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

  // Map variant color names to hex for swatch display
  const COLOR_HEX: Record<string, string> = {
    // Gala
    'Broadway Noir': '#000000',
    'Sutton Place Snow': '#ffffff',
    'Grasshopper': '#85c96e',
    'Frosted Lemonade': '#fff7a8',
  'Ruby Red': '#fd8987',
    'Italian Ice': '#c7eaff',
    // Cameo/Mutsu safety
    'Broadway Noir ': '#000000',
    'Broadway noir': '#000000',
  // Fuji Long Sleeve palette
    'Arboretum': '#0f5132',
    'Hudson Blue': '#243b5a',
    'Redbird': '#c21010',
  // Retro Track Suit palette (updated)
    'Elmhurst Taro Custard': '#8271c2',
    'Greenpoint Patina Crew': '#58543a',
    'Noho Napoletanos': '#ab8c65',
    'The Factory Floor': '#1e2744',
    'Vice City Runners': '#fddde9',
    'Victory Liberty Club': '#7a273b',
    'Yorkville Black and White Cookies': '#000000',
  // Broadway Blueberry Jersey
    'Black Ice': '#101010',
  };
  return (
    <>
      {/* Optional fixed background video (default true for home) */}
      {showBackgroundVideo && (
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
            className="home-grid-video"
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
      )}
      <style>{`
        @media (max-width: 600px) {
          .home-grid-video {
            object-position: center center !important;
          }
        }
      `}</style>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gap: isMobile ? 22 : 28,
          width: '100%',
          maxWidth: isMobile ? '100%' : '1200px',
          margin: '0 auto',
          padding: isMobile ? '12px 16px' : '0 20px',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, minmax(0, 1fr))',
          gridAutoRows: 'auto',
          gridAutoFlow: 'row dense',
          overflowX: 'auto',
          alignItems: 'start',
          background: 'transparent',
          justifyContent : 'center',
        }}
      >
      {displayProducts.map((product, idx) => {
    const isActive = isMobile ? mobileHover === product.id : hovered === product.id;
        // All variants for this product name (for swatches)
        const variants = variantGroups[product.name] || [product];
        const chosenId = selectedVariantByName[product.name];
        const activeVariant = chosenId ? (variants.find(v => v.id === chosenId) || product) : product;
        // Custom link mapping for named PDPs
        const getProductLink = () => {
          const basePathMap: Record<string, string> = {
            'Empire Cordury hat': '/shop/empire-hat',
            'Denim Hat': '/shop/denim-hat',
            'Broadway Blueberry Jersey': '/shop/hockey-jersey',
            'Gala Tee': '/shop/gala-tshirt',
            'Cameo Tee': '/shop/cameo-tshirt',
            'Mutsu Tee': '/shop/mutsu-tshirt',
            'Fuji Long Sleeve': '/shop/fuji-tshirt', // keeping existing route; can change to /shop/fuji-full-sleeve later
            'Retro Track Suit': '/shop/tracksuit',
            'White Hat': '/shop/white-hat',
            'Beige Hat': '/shop/beige-hat',
          };
          const base = basePathMap[product.name] || `/products/${product.id}`;
          const slug = activeVariant.variantSlug;
          return slug ? `${base}?color=${encodeURIComponent(slug)}` : base;
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
              width: '100%',
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
                  router.push(getProductLink());
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
                router.push(getProductLink());
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div style={{
              width: '100%',
              aspectRatio: '1 / 1',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: CARD_RADIUS,
            }}>
              <Image
                src={activeVariant.image}
                alt={product.name}
                fill
                style={{
                  objectFit: 'cover',
                  transition: 'opacity .4s ease',
                  opacity: isActive ? 0 : 1,
                }}
                priority={idx < 6}
              />
              {activeVariant.hoverImage && (
                <Image
                  src={activeVariant.hoverImage}
                  alt={product.name}
                  fill
                  style={{
                    objectFit: 'cover',
                    transition: 'opacity .4s ease',
                    opacity: isActive ? 1 : 0,
                    position: 'absolute',
                    inset: 0,
                  }}
                  priority={idx < 6}
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
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <h3 style={{
                      fontSize: isMobile ? '1.02rem' : '1.12rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      margin: 0,
                      lineHeight: 1.25,
                      letterSpacing: '0.005em',
                      fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                      display: 'flex',
                      alignItems: 'center'
                    }}>{product.name}</h3>
                    {/* Color swatches for products with color variants */}
                    {variants.length > 1 && variants.some(v => !!v.variantColor) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} aria-label={`Available colors for ${product.name}`}>
                        {variants.map((v) => (
                          v.variantColor ? (
                            <button
                              key={v.id}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedVariantByName(prev => ({ ...prev, [product.name]: v.id }));
                                if (typeof window !== 'undefined') {
                                  try { sessionStorage.setItem(`rep_variant_${product.name}`, String(v.id)); } catch {}
                                }
                              }}
                              onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                              onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); }}
                              title={v.variantColor}
                              aria-label={v.variantColor}
                              style={{
                                width: isMobile ? 20 : 22,
                                height: isMobile ? 20 : 22,
                                borderRadius: '999px',
                                background: COLOR_HEX[v.variantColor] || '#e5e7eb',
                                border: (COLOR_HEX[v.variantColor] || '').toLowerCase() === '#ffffff' ? '1px solid #d1d5db' : '1px solid rgba(0,0,0,0.1)',
                                boxShadow: selectedVariantByName[product.name] === v.id ? '0 0 0 2px #111' : '0 2px 4px rgba(0,0,0,0.12)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                                cursor: 'pointer'
                              }}
                            />
                          ) : null
                        ))}
                      </div>
                    )}
                  </div>
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
          </div>
        );
      })}
      {/* Mobile bundle sheet */}
      <BundleSheet open={bundleOpen} onClose={() => setBundleOpen(false)} />
    </div>
    </>
  );
}
