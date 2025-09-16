"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  hoverImage?: string;
}

// Editable product list for the homepage grid
export const products: Product[] = [
  // Hockey Jersey
  { id: 1, name: "Hockey Jersey", price: "$90", image: "/images/hockeyjerseymale1.jpeg", hoverImage: "/images/hockeyjerseymale2.jpeg" },
  // Classic Tee (cover models)
  { id: 2, name: "Classic Tee", price: "$55", image: "/images/classicteemale1.jpeg", hoverImage: "/images/classicteecovermodels.jpeg" },
  // Classic Tee (female)
  { id: 3, name: "Classic Tee", price: "$55", image: "/images/classicteefemale1.jpeg", hoverImage: "/images/classicteefemale2.jpeg" },
  // Classic Tee (male)
  { id: 4, name: "Classic Tee", price: "$55", image: "/images/classicteemale2.jpeg", hoverImage: "/images/classicteecovermodels.jpeg" },
  // Tracksuit (B&W)
  { id: 5, name: "Tracksuit", price: "$120", image: "/images/B&Wtracksuitmale1.jpeg", hoverImage: "/images/tracksuitscovermodels.jpeg" },
  // Tracksuit (Maroon)
  { id: 6, name: "Tracksuit", price: "$120", image: "/images/maroontracksuitmale1.jpeg", hoverImage: "/images/tracksuitscovermodels.jpeg" },
  // Denim Hat (male)
  { id: 7, name: "Denim Hat", price: "$40", image: "/images/denimhatmale1.jpeg", hoverImage: "/images/denimhatmale2.jpeg" },
  // Denim Hat (female)
  { id: 8, name: "Denim Hat", price: "$40", image: "/images/denimhatfemale1.jpeg", hoverImage: "/images/denimhatsolo.jpeg" },
  // White Hat (male)
  { id: 9, name: "White Hat", price: "$40", image: "/images/whitehatmale1.jpeg", hoverImage: "/images/whitehatsolo.jpeg" },
  // Beige Hat (female)
  { id: 10, name: "Beige Hat", price: "$40", image: "/images/beigehatfemale1.jpeg", hoverImage: "/images/beigehatsolo.jpeg" },
  // Empire Hat (NEW)
  { id: 11, name: "Empire Hat", price: "$42", image: "/images/empirehatfemale.jpg", hoverImage: "/images/empirehatsolo.jpg" },
];

export default function ProductsGrid() {
  const [hovered, setHovered] = useState<number | null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const gridProducts = products;
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
          width: '100vw',
          margin: 0,
          padding: isMobile ? '18px 0' : 0,
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gridTemplateRows: isMobile ? undefined : 'repeat(4, 1fr)',
          overflowX: 'hidden',
          alignItems: isMobile ? 'stretch' : 'stretch',
          background: isMobile ? 'transparent' : undefined,
        }}
      >
      {gridProducts.map((product) => {
        const isActive = isMobile ? mobileHover === product.id : hovered === product.id;
        // Custom link for Empire Hat and Denim Hat
        const getProductLink = () => {
          if (product.name === "Empire Hat") return "/shop/empire-hat";
          if (product.name === "Denim Hat") return "/shop/denim-hat";
          return `/products/${product.id}`;
        };
        return (
          <div
            key={product.id}
            style={{
              background: isMobile ? 'rgba(255,255,255,0.82)' : '#fff',
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
              width: isMobile ? '100%' : '100%',
              height: isMobile ? '54vw' : '60vh', // less tall on mobile
              minHeight: isMobile ? '54vw' : '60vh',
              maxWidth: isMobile ? '100%' : '100%',
              maxHeight: isMobile ? '60vw' : '60vh',
              aspectRatio: isMobile ? undefined : '3/4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              overflow: 'hidden',
            }}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                style={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  borderRadius: 0,
                  background: '#fff',
                  transition: 'opacity 0.5s cubic-bezier(.4,0,.2,1)',
                  opacity: isActive ? 0 : 1,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
              {product.hoverImage && (
                <Image
                  src={product.hoverImage}
                  alt={product.name + ' alt'}
                  fill
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    borderRadius: 0,
                    background: '#fff',
                    transition: 'opacity 0.5s cubic-bezier(.4,0,.2,1)',
                    opacity: isActive ? 1 : 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                  }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              )}
              {/* Overlay name and price at the bottom of the grid cell */}
              <div style={{
                position: 'absolute',
                left: isMobile ? '50%' : 0,
                right: isMobile ? undefined : 0,
                bottom: 0,
                transform: isMobile ? 'translateX(-50%)' : 'none',
                background: isMobile ? 'rgba(255,255,255,0.92)' : '#fff',
                padding: isMobile ? '8px 18px' : '10px 32px',
                borderRadius: isMobile ? 14 : '0 0 18px 18px',
                boxSizing: 'border-box',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isMobile ? 10 : 18,
                width: isMobile ? 'auto' : '100%',
                minWidth: 0,
                maxWidth: isMobile ? '90vw' : '100%',
              }}>
                <h3 style={{
                  fontSize: isMobile ? '1.05rem' : '1.12rem',
                  fontWeight: 500,
                  color: '#232323',
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: '0.02em',
                  fontFamily: 'inherit',
                  textTransform: 'none',
                }}>{product.name}</h3>
                <p style={{
                  color: '#888',
                  fontWeight: 400,
                  fontSize: isMobile ? '0.98rem' : '1.05rem',
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: '0.01em',
                  fontFamily: 'inherit',
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
