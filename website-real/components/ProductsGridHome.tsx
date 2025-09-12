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
];

export default function ProductsGrid() {
  const [hovered, setHovered] = useState<number | null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const gridProducts = products;
  // Store touch state for each product card
  const touchState = useRef<{ [key: number]: { start: number; moved: boolean } }>({});
  return (
    <div
      style={{
        display: 'grid',
  gap: isMobile ? 0 : 32,
  width: '100vw',
  margin: 0,
  padding: 0,
  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
  gridTemplateRows: isMobile ? undefined : 'repeat(4, 1fr)',
  overflowX: 'hidden',
  alignItems: isMobile ? 'stretch' : 'stretch',
      }}
    >
      {gridProducts.map((product) => {
        const isActive = hovered === product.id;
        return (
            <div
              key={product.id}
              style={{
                background: '#fff',
                borderRadius: 0,
                boxShadow: 'none',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                minHeight: isMobile ? '88vh' : 0,
                height: isMobile ? '88vh' : '100%',
                width: isMobile ? '100vw' : '100%',
                maxWidth: isMobile ? '100vw' : '100vw',
                maxHeight: isMobile ? '88vh' : undefined,
                boxSizing: 'border-box',
                position: 'relative',
                transform: isActive ? 'scale(1.01)' : 'none',
                zIndex: isActive ? 10 : 1,
                justifyContent: isMobile ? 'center' : 'stretch',
              }}
            onMouseEnter={() => !isMobile && setHovered(product.id)}
            onMouseLeave={() => !isMobile && setHovered(null)}
            onTouchStart={() => {
              if (isMobile) {
                touchState.current[product.id] = { start: Date.now(), moved: false };
                setHovered(product.id);
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
                setHovered(null);
                if (state && !state.moved && touchTime < 250) {
                  // Quick tap: open product page
                  if (product.name === "Denim Hat") {
                    window.location.href = "/shop/denim-hat";
                  } else {
                    window.location.href = `/products/${product.id}`;
                  }
                }
                // else: hold or scroll, just change image
              }
            }}
            onTouchCancel={() => {
              if (isMobile) {
                setHovered(null);
              }
            }}
            onClick={e => {
              if (!isMobile) {
                if (product.name === "Denim Hat") {
                  window.location.href = "/shop/denim-hat";
                } else {
                  window.location.href = `/products/${product.id}`;
                }
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div style={{
              position: 'relative',
              width: isMobile ? '100vw' : '100%',
              height: isMobile ? '88vh' : '60vh',
              minHeight: isMobile ? '88vh' : '60vh',
              maxWidth: isMobile ? '100vw' : '100%',
              maxHeight: isMobile ? '88vh' : '60vh',
              aspectRatio: isMobile ? undefined : '3/4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
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
                background: '#fff',
                padding: isMobile ? '6px 14px' : '10px 32px',
                borderRadius: isMobile ? 12 : '0 0 18px 18px',
                boxSizing: 'border-box',
                zIndex: 2,
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
                transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)',
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
  );}
