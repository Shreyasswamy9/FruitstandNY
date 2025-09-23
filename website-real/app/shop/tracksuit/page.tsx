"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CartBar from "../../../components/CartBar";
import { useCart } from "../../../components/CartContext";

const tracksuitImages = [
  "/images/B&Wtracksuitmale1.jpeg",
  "/images/maroontracksuitmale1.jpeg",
  "/images/tracksuitscovermodels.jpeg"
];

const PRODUCT = {
  name: "Tracksuit",
  price: 120,
  description: "Modern tracksuit, comfortable and stylish for any occasion.",
};

function TracksuitPage() {
  const colorOptions = [
    { name: 'Black', color: '#232323', image: '/images/B&Wtracksuitmale1.jpeg', bg: '#232323' },
    { name: 'Maroon', color: '#800000', image: '/images/maroontracksuitmale1.jpeg', bg: '#fbeaea' },
    { name: 'Cover', color: '#b2bec3', image: '/images/tracksuitscovermodels.jpeg', bg: '#eaeaea' },
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
      productId: "tracksuit",
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
          {/* Color Picker */}
          <div className="flex gap-3 mb-4 px-1 justify-center" style={{ overflowX: 'auto', marginBottom: 24, paddingTop: 8, paddingBottom: 8, minHeight: 48 }}>
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
                  border: selectedColor.name === opt.name ? '2px solid #232323' : '2px solid #fff',
                  outline: selectedColor.name === opt.name ? '2px solid #3B82F6' : 'none',
                  boxShadow: selectedColor.name === opt.name ? '0 0 0 2px #3B82F6' : '0 1px 4px 0 rgba(0,0,0,0.07)',
                  display: 'inline-block',
                  cursor: 'pointer',
                  marginRight: 4,
                }}
              />
            ))}
          </div>
        </div>
        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
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
          <p className="text-lg text-gray-700 mb-4">{PRODUCT.description}</p>
          <div className="text-2xl font-semibold mb-6">${PRODUCT.price}</div>
          <button
            className={`bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 mb-2 ${!selectedSize ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default TracksuitPage;
