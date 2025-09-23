"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../components/CartContext";
import CartBar from "../../../components/CartBar";

const beigeHatImages = [
  "/images/beigehatfemale1.jpeg",
  "/images/beigehatsolo.jpeg"
];

const PRODUCT = {
  name: "Beige Hat",
  price: 40,
  description: "Neutral beige hat, versatile and stylish for any look.",
};

function BeigeHatPage() {
  const colorOptions = [
    { name: 'Beige', color: '#e5d1b8', image: '/images/beigehatfemale1.jpeg', bg: '#f7f3ed' },
    { name: 'White', color: '#fff', image: '/images/beigehatsolo.jpeg', bg: '#f8f8f8', border: '#bbb' },
  ];
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedImage, setSelectedImage] = useState(colorOptions[0].image);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "beige-hat",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
  };

  return (
    <>
      {/* Go Back text link top left */}
      <span
        onClick={() => router.back()}
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          fontSize: 18,
          color: '#232323',
          cursor: 'pointer',
          fontWeight: 500,
          zIndex: 100,
          userSelect: 'none',
          background: 'none',
          border: 'none',
          padding: 0,
          textDecoration: 'underline',
        }}
      >
        Go Back
      </span>
      <div
        className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4"
      >
        {/* Images */}
        <div className="flex flex-col gap-4 md:w-1/2">
          <div className="w-full rounded-lg overflow-hidden bg-white flex items-center justify-center" style={{ height: 600, minHeight: 600, position: 'relative' }}>
            <Image
              src={selectedImage}
              alt={PRODUCT.name}
              style={{ objectFit: "contain", background: "#fff" }}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              priority
            />
          </div>
          <div className="flex gap-2 justify-center">
            {beigeHatImages.map((img) => (
              <button
                key={img}
                onClick={() => setSelectedImage(img)}
                className={`relative w-16 h-16 rounded border ${selectedImage === img ? "ring-2 ring-black" : ""}`}
              >
                <Image src={img} alt="Beige Hat" fill style={{ objectFit: "contain", background: "#fff" }} />
              </button>
            ))}
          </div>
        </div>
        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
          {/* Color Picker */}
          <div className="flex gap-3 mb-4 px-1" style={{ overflowX: 'auto', marginBottom: 24, paddingTop: 8, paddingBottom: 8, minHeight: 48 }}>
            {colorOptions.map((opt) => (
              <button
                key={opt.name}
                aria-label={opt.name}
                onClick={() => {
                  setSelectedColor(opt);
                  setSelectedImage(opt.image);
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: opt.color,
                  border: selectedColor.name === opt.name ? '2px solid #232323' : (opt.border || '2px solid #fff'),
                  outline: selectedColor.name === opt.name ? '2px solid #3B82F6' : 'none',
                  boxShadow: selectedColor.name === opt.name ? '0 0 0 2px #3B82F6' : '0 1px 4px 0 rgba(0,0,0,0.07)',
                  display: 'inline-block',
                  cursor: 'pointer',
                  marginRight: 4,
                }}
              />
            ))}
          </div>
          {/* Size Dropdown */}
          <div style={{ marginBottom: 18, position: 'relative', width: 180 }}>
            <button
              className="border border-black text-black px-5 py-2 rounded-lg font-semibold flex items-center justify-between w-full bg-white hover:bg-gray-50"
              style={{ minWidth: 120, fontSize: 16 }}
              onClick={() => setSizeDropdownOpen((open) => !open)}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={sizeDropdownOpen}
            >
              {selectedSize ? `Size: ${selectedSize}` : "Select Size"}
              <span style={{ marginLeft: 8, fontSize: 18 }}>{sizeDropdownOpen ? "▲" : "▼"}</span>
            </button>
            {sizeDropdownOpen && (
              <ul
                className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                style={{ listStyle: 'none', padding: 0, margin: 0 }}
                role="listbox"
              >
                {sizeOptions.map((size) => (
                  <li
                    key={size}
                    className={`px-5 py-2 cursor-pointer hover:bg-gray-100 ${selectedSize === size ? 'bg-gray-200 font-bold' : ''}`}
                    style={{ fontSize: 16, borderBottom: size !== sizeOptions[sizeOptions.length-1] ? '1px solid #eee' : 'none' }}
                    onClick={() => { setSelectedSize(size); setSizeDropdownOpen(false); }}
                    role="option"
                    aria-selected={selectedSize === size}
                  >
                    {size}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="text-lg mb-4">{PRODUCT.description}</p>
          <div className="text-2xl font-semibold mb-6">${PRODUCT.price}</div>
          <button
            className={`bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-900 mb-2 ${!selectedSize ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!selectedSize}
            onClick={handleAddToCart}
          >
            {!selectedSize ? 'Pick a size to add to cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
      <CartBar />
    </>
  );
}

export default BeigeHatPage;
