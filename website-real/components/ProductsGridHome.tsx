"use client";

import Image from "next/image";
import { useState, useRef } from "react";

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
}

export default function ProductsGrid({ categoryFilter }: ProductsGridProps = {}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  
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
          width: 'fit-content',
          margin: '0 auto',
          padding: isMobile ? '18px 0' : 0,
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, auto)',
          gridAutoRows: 'auto',
          gridAutoFlow: 'row dense',
          overflowX: 'visible',
          alignItems: 'start',
          background: 'transparent',
        }}
      >
      {gridProducts.map((product) => {
        const isActive = isMobile ? mobileHover === product.id : hovered === product.id;
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
              borderRadius: isMobile ? 18 : 0,
              boxShadow: isMobile ? '0 4px 24px 0 rgba(0,0,0,0.10)' : 'none',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              minHeight: isMobile ? 'auto' : 0,
              height: isMobile ? 'auto' : '100%',
              width: isMobile ? '92vw' : '100%',
              maxWidth: isMobile ? '96vw' : '100vw',
              margin: isMobile ? '0 auto' : 0,
              marginBottom: isMobile ? 12 : 0,
              boxSizing: 'border-box',
              position: 'relative',
              transform: isActive ? 'scale(1.01)' : 'none',
              zIndex: isActive ? 10 : 1,
              justifyContent: isMobile ? 'center' : 'stretch',
            }}
            onMouseEnter={() => { if (!isMobile) setHovered(product.id); }}
            onMouseLeave={() => { if (!isMobile) setHovered(null); }}
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
                  // Tap: open product page
                  setMobileHover(null);
                  window.location.href = getProductLink();
                } else {
                  // Hold or scroll: revert hover image immediately on release
                  setMobileHover(null);
                }
              }
            }}
            onTouchCancel={() => {
              if (isMobile) {
                setMobileHover(null);
              }
            }}
            onClick={e => {
              if (!isMobile) {
                window.location.href = getProductLink();
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div style={{
              position: 'relative',
              background: 'transparent',
              overflow: 'hidden', // ensure child corners are clipped
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'fit-content',
              height: 'fit-content',
              margin: 0,
              padding: 0,
              borderRadius: 18,
              boxShadow: '0 4px 18px 0 rgba(0,0,0,0.10)',
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
                padding: isMobile ? '18px 24px 16px 24px' : '18px 32px 16px 32px',
                borderBottomLeftRadius: 18,
                borderBottomRightRadius: 18,
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
                boxShadow: '0 4px 18px 0 rgba(0,0,0,0.10)',
                borderTop: '1.5px solid #ececec',
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
                  fontSize: isMobile ? '1.08rem' : '1.13rem',
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
    </div>
    </>
  );
}
