"use client";
import Image from "next/image";
import React, { useState } from "react";
import SizeGuide from "@/components/SizeGuide";
import CustomerReviews from "@/components/CustomerReviews";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import { useRouter } from "next/navigation";
import { useCart } from "../../../components/CartContext";

const mandarinImages = [
  "/images/products/Mandarin Tee/Mandarin 1.png",
  "/images/products/Mandarin Tee/Mandarin 2.png",
  "/images/products/Mandarin Tee/Mandarin 3.png",
  "/images/products/Mandarin Tee/Mandarin 4.png",
];

const PRODUCT = {
  name: "Mandarin Tee",
  price: 38,
  description: "Soft, premium Mandarin Tee. Available in multiple sizes.",
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
};

export default function MandarinTeePage() {
  const [selectedImage, setSelectedImage] = useState(mandarinImages[0]);
  const [selectedSize, setSelectedSize] = useState(PRODUCT.sizes[0]);
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const handleAddToCart = () => {
    addToCart({
      productId: "mandarin-tee",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const boughtTogetherItems = getFBTForPage('mandarin-tee');

  const handleAddBoughtTogetherItem = (item: { id: string; name: string; price: number; image: string }) => {
    addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, size: PRODUCT.sizes[2] });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const handleAddAllToCart = () => {
    boughtTogetherItems.forEach((item) => addToCart({ productId: item.id, name: item.name, price: item.price * 0.85, image: item.image, quantity: 1, size: PRODUCT.sizes[2] }));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const taskbarHeight = items.length > 0 && !showPopup ? 64 : 0;

  

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      <span
        onClick={() => router.back()}
        style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', fontSize: 16, color: '#232323', cursor: 'pointer', fontWeight: 500, zIndex: 10005, background: 'rgba(255,255,255,0.9)', border: '1px solid #e0e0e0', borderRadius: '20px', padding: '8px 16px', textDecoration: 'none', backdropFilter: 'blur(10px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.2s ease', pointerEvents: 'auto' }}
      >
        ← Go Back
      </span>
  <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4" style={{ paddingTop: 120, paddingBottom: taskbarHeight }}>
        <div className="flex w-full md:w-1/2 flex-col items-center gap-4">
          <div className="relative w-full max-w-sm md:max-w-full aspect-square rounded-xl overflow-hidden bg-white shadow-sm">
            <Image src={selectedImage} alt={PRODUCT.name} fill sizes="(max-width: 768px) 90vw, 420px" style={{ objectFit: "contain", background: "#fff" }} priority />
          </div>
          <div className="flex gap-2 justify-center">
            {mandarinImages.map((img) => (
              <button key={img} onClick={() => setSelectedImage(img)} className={`relative w-16 h-16 rounded border ${selectedImage === img ? "ring-2 ring-black" : ""}`}>
                <Image src={img} alt={PRODUCT.name} fill style={{ objectFit: "contain", background: "#fff" }} />
              </button>
            ))}
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
          <div className="text-2xl font-semibold mb-6">${PRODUCT.price}</div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Size:</p>
            <div className="size-single-line">
              {PRODUCT.sizes.map((size) => (
                <button key={size} className={`size-button px-3 rounded-lg font-semibold border-2 transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-black hover:border-gray-400 hover:bg-gray-50'}`} onClick={() => setSelectedSize(size)} type="button">{size}</button>
              ))}
            </div>
            <div className="mt-2"><SizeGuide productSlug="mandarin-tee" /></div>
          </div>

          <div className="mb-4">
            <p className="text-lg text-gray-700 leading-relaxed">{PRODUCT.description}</p>
          </div>

          <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 mb-2" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>

      <FrequentlyBoughtTogether
        products={boughtTogetherItems}
        onAddToCart={handleAddBoughtTogetherItem}
        onAddAllToCart={handleAddAllToCart}
      />

      {/* Reviews */}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#fbf6f0' }} className="py-12 px-4">
        <div className="max-w-4xl mx-auto w-full">
          <CustomerReviews productId="mandarin-tee" />
        </div>
      </div>

      {/* Minimalistic cart taskbar at bottom if cart has items */}
      {items.length > 0 && !showPopup && (
        <div className="fixed left-0 right-0 bottom-0 z-50 bg-black text-white px-2 py-3 md:px-4 md:py-4 flex items-center justify-between" style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)', borderBottom: 'none' }}>
          <span className="font-medium text-sm md:text-base">Cart</span>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="inline-block bg-white text-black rounded px-2 py-1 md:px-3 font-bold text-sm md:text-base">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
            <a href="/cart" className="ml-1 md:ml-2 px-3 py-2 md:px-4 md:py-2 bg-white text-black rounded font-semibold hover:bg-gray-200 text-xs md:text-base" style={{ textDecoration: 'none' }}>Head to Cart</a>
          </div>
        </div>
      )}
    </div>
  );
}
