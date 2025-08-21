
import { products } from "../components/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

const SIZES = ["XS", "S", "M", "L", "XL"];

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id.toString() === params.id);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [added, setAdded] = useState(false);
  if (!product) return notFound();
  return (
    <div style={{ maxWidth: 600, margin: "80px auto", background: "#fff", borderRadius: 24, boxShadow: "0 2px 12px #bbb", padding: 32, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Image src={product.image} alt={product.name} width={500} height={400} style={{ borderRadius: 24, objectFit: "cover", marginBottom: 32 }} unoptimized />
      <h1 style={{ fontSize: "2.2rem", fontWeight: 700, margin: "0 0 12px 0", color: "#222", textAlign: "center", letterSpacing: "0.08em" }}>{product.name}</h1>
      <p style={{ fontSize: "1.3rem", color: "#444", fontWeight: 500, marginBottom: 24 }}>{product.price}</p>
      <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
        {SIZES.map(size => (
          <button
            key={size}
            style={{
              padding: "8px 20px",
              borderRadius: 12,
              border: selectedSize === size ? "2px solid #222" : "1px solid #bbb",
              background: selectedSize === size ? "#f7f7f7" : "#fff",
              color: "#222",
              fontWeight: 500,
              fontSize: "1rem",
              cursor: "pointer",
              transition: "border 0.2s, background 0.2s"
            }}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
      <button
        style={{
          padding: "12px 32px",
          borderRadius: 16,
          background: added ? "#222" : "#f7f7f7",
          color: added ? "#fff" : "#222",
          fontWeight: 600,
          fontSize: "1.1rem",
          border: "none",
          boxShadow: "0 2px 8px #bbb",
          cursor: selectedSize ? "pointer" : "not-allowed",
          opacity: selectedSize ? 1 : 0.6,
          marginBottom: 24,
          transition: "background 0.2s, color 0.2s, opacity 0.2s"
        }}
        disabled={!selectedSize}
        onClick={() => setAdded(true)}
      >
        {added ? "Added to Cart" : "Add to Cart"}
      </button>
      <p style={{ color: "#666", fontSize: "1rem", textAlign: "center" }}>
        This is a placeholder description for {product.name}. Customize this text for each product.
      </p>
    </div>
  );
}
