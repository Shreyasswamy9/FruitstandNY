"use client";
import Image from "next/image";
import React, { useState } from "react";
import CustomerReviews from "@/components/CustomerReviews";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import { useRouter } from "next/navigation";
import { useCart } from "../../../components/CartContext";

const ecruHatImages = [
  "/images/products/Ecru Hat/B1.png",
  "/images/products/Ecru Hat/Beige Hat.png",
];

const PRODUCT = {
  name: "Ecru Hat",
  price: 44,
  description: "Neutral ecru hat, versatile and stylish for any look.",
};

export default function EcruHatPage() {
  const [selectedImage, setSelectedImage] = useState(ecruHatImages[0]);
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const handleAddToCart = () => {
    addToCart({
      productId: "ecru-hat",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedImage,
      quantity: 1,
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const boughtTogetherItems = getFBTForPage('ecru-hat');

  const handleAddBoughtTogetherItem = (item: { id: string; name: string; price: number; image: string }) => {
    addToCart({ productId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const handleAddAllToCart = () => {
    boughtTogetherItems.forEach((item) => addToCart({ productId: item.id, name: item.name, price: item.price * 0.85, image: item.image, quantity: 1 }));
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
          <div className="flex gap-2 mt-4">
            {ecruHatImages.map((img, idx) => (
              <button
                key={img}
                onClick={() => setSelectedImage(img)}
                style={{
                  border: selectedImage === img ? '2px solid #232323' : '1px solid #e0e0e0',
                  borderRadius: 8,
                  padding: 0,
                  background: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                aria-label={`Select image ${idx + 1}`}
              >
                <Image src={img} alt={`Ecru Hat ${idx + 1}`} width={56} height={56} style={{ objectFit: 'cover', borderRadius: 8 }} />
              </button>
            ))}
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
          <p className="text-lg text-gray-700 mb-4">{PRODUCT.description}</p>
          <div className="text-2xl font-semibold mb-6">${PRODUCT.price}</div>
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
          <CustomerReviews productId="ecru-hat" />
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
