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
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 32, width: "100vw", margin: 0, padding: 0 }}>
      {products.map((product) => {
        const isHovered = hovered === product.id;
        return (
          <a
            key={product.id}
            href={`/products/${product.id}`}
            style={{
              background: "#fff",
              borderRadius: 24,
              boxShadow: isHovered ? "0 8px 32px #bbb" : "0 2px 12px #bbb",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              minHeight: 320,
              position: "relative",
              transform: isHovered ? "scale(1.06)" : "scale(1)",
              zIndex: isHovered ? 10 : 1
            }}
            onMouseEnter={() => setHovered(product.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ position: "relative", width: "100%", height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Image src={isHovered && product.hoverImage ? product.hoverImage : product.image} alt={product.name} fill style={{ objectFit: "cover", borderRadius: 24, transition: "box-shadow 0.2s" }} unoptimized />
            </div>
            <div style={{ padding: 18, textAlign: "center", width: "100%" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#222", marginBottom: 8 }}>{product.name}</h3>
              <p style={{ color: "#666", fontWeight: 500 }}>{product.price}</p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
