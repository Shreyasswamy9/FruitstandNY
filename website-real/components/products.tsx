"use client";

import Image from "next/image";


export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  hoverImage?: string;
}

export const products: Product[] = [
  { id: 1, name: "Green Hat", price: "$25", image: "/images/green1.jpeg", hoverImage: "/images/green2.jpeg" },
  { id: 2, name: "Green Tee 2", price: "$25", image: "/images/green2.jpeg", hoverImage: "/images/green1.jpeg" },
  { id: 3, name: "Red Tee 1", price: "$25", image: "/images/red1.jpeg", hoverImage: "/images/red2.jpeg" },
  { id: 4, name: "Red Tee 2", price: "$25", image: "/images/red2.jpeg", hoverImage: "/images/red1.jpeg" },
  { id: 5, name: "T-Shirt Back", price: "$30", image: "/images/tshirt back.jpeg", hoverImage: "/images/tshirt plain.jpeg" },
  { id: 6, name: "T-Shirt Plain", price: "$30", image: "/images/tshirt plain.jpeg", hoverImage: "/images/tshirt back.jpeg" },
  { id: 7, name: "T-Shirt 1", price: "$30", image: "/images/tshirt1.jpeg", hoverImage: "/images/white1.jpeg" },
  { id: 8, name: "White Tee", price: "$25", image: "/images/white1.jpeg", hoverImage: "/images/white 2.jpeg" },
  { id: 9, name: "Black Tee", price: "$25", image: "/images/black1.jpeg", hoverImage: "/images/black2.jpeg" },
  { id: 10, name: "White Tee 2", price: "$25", image: "/images/white 2.jpeg", hoverImage: "/images/white1.jpeg" },
  { id: 11, name: "Blue Hoodie", price: "$40", image: "/images/green1.jpeg", hoverImage: "/images/green2.jpeg" },
  { id: 12, name: "Yellow Cap", price: "$20", image: "/images/green2.jpeg", hoverImage: "/images/green1.jpeg" },
  { id: 13, name: "Orange Shorts", price: "$28", image: "/images/red1.jpeg", hoverImage: "/images/red2.jpeg" },
  { id: 14, name: "Purple Socks", price: "$12", image: "/images/red2.jpeg", hoverImage: "/images/red1.jpeg" },
  { id: 15, name: "Grey Sweater", price: "$35", image: "/images/tshirt back.jpeg", hoverImage: "/images/tshirt plain.jpeg" },
  { id: 16, name: "Pink Scarf", price: "$18", image: "/images/tshirt plain.jpeg", hoverImage: "/images/tshirt back.jpeg" },
  { id: 17, name: "Brown Belt", price: "$22", image: "/images/tshirt1.jpeg", hoverImage: "/images/white1.jpeg" },
  { id: 18, name: "Silver Watch", price: "$80", image: "/images/white1.jpeg", hoverImage: "/images/white 2.jpeg" },
  { id: 19, name: "Gold Ring", price: "$120", image: "/images/black1.jpeg", hoverImage: "/images/black2.jpeg" },
  { id: 20, name: "Tan Shoes", price: "$55", image: "/images/white 2.jpeg", hoverImage: "/images/white1.jpeg" }
];

import { useState } from "react";

export default function ProductsGrid() {
  const [hovered, setHovered] = useState<number | null>(null);
  // Responsive: 1 col on mobile, 5 on desktop; full viewport for each item on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  // Only show first 12 products (3 columns x 4 rows) on desktop, all on mobile (but 1 per screen)
  const desktopProducts = products.slice(0, 12);
  const gridProducts = isMobile ? products : desktopProducts;
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
  minHeight: undefined,
  height: undefined,
        overflowX: 'hidden',
        alignItems: isMobile ? undefined : 'stretch',
      }}
    >
      {gridProducts.map((product) => {
        const isActive = hovered === product.id;
        // On mobile, swap image on touch; on desktop, swap on hover
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
              minHeight: isMobile ? '100vh' : 0,
              height: isMobile ? '100vh' : '100%',
              width: isMobile ? '100vw' : '100%',
              maxWidth: '100vw',
              boxSizing: 'border-box',
              position: 'relative',
              transform: isActive ? 'scale(1.01)' : 'none',
              zIndex: isActive ? 10 : 1,
              justifyContent: isMobile ? 'center' : 'stretch',
            }}
            onMouseEnter={() => !isMobile && setHovered(product.id)}
            onMouseLeave={() => !isMobile && setHovered(null)}
            onTouchStart={() => isMobile && setHovered(product.id)}
            onTouchEnd={() => isMobile && setHovered(null)}
            onClick={() => window.location.href = `/products/${product.id}`}
            role="button"
            tabIndex={0}
          >
            <div style={{
              position: 'relative',
              width: isMobile ? '100vw' : '100%',
              maxWidth: isMobile ? '100vw' : '100%',
              height: isMobile ? '85vh' : '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: '#f3f3f3',
                border: '2px dashed #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                color: '#bbb',
              }}>
                Image Placeholder
              </div>
            </div>
            <div style={{ padding: isMobile ? '8px 0 0 0' : 18, textAlign: 'center', width: '100%' }}>
              <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 600, color: '#222', margin: 0 }}>{product.name}</h3>
              <p style={{ color: '#666', fontWeight: 500, fontSize: isMobile ? '0.95rem' : undefined, margin: 0 }}>{product.price}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
