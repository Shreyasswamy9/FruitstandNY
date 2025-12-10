"use client";
import Image from "next/image";
import React, { useState } from "react";
import CustomerReviews from "@/components/CustomerReviews";
import FrequentlyBoughtTogether, { getFBTForPage } from "@/components/FrequentlyBoughtTogether";
import Price from '@/components/Price';
import { useRouter } from "next/navigation";
import { useCart } from "../../../components/CartContext";

const empireHatImages = [
  "/images/products/empire-hat/Apple Hat.png",
  "/images/products/empire-hat/A1.png",
  "/images/products/empire-hat/A2.png",
  "/images/products/empire-hat/A3.png",
  "/images/products/empire-hat/A4.png",
  "/images/products/empire-hat/A5.png",
];

const PRODUCT = {
  name: "EMPIRE CORDUROY HAT",
  price: 49,
  salePrice: 25,
    description: "Crafted from premium corduroy with an apple-inspired silhouette. Designed in NYC, worn everywhere.",
    details: [
      "Red corduroy construction",
      "Apple-inspired silhouette",
      "6-panel camp hat",
      "Adjustable size, one size fits most",
      "Detailed embroidery on front, back and brim of hat",
      "Flexible brim",
      "Made in Fujian, China",
    ],
};

export default function EmpireHatPage() {
  const [selectedImage, setSelectedImage] = useState(empireHatImages[0]);
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const handleAddToCart = () => {
    const priceToCharge = PRODUCT.salePrice ?? PRODUCT.price;
    addToCart({
      productId: "empire-hat",
      name: PRODUCT.name,
      price: priceToCharge,
      image: selectedImage,
      quantity: 1,
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  // Handle adding items from "Frequently Bought Together" section
  const handleAddBoughtTogetherItem = (item: { id: string; name: string; price: number; image: string }) => {
    addToCart({
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      size: "M", // Default size for bought together items
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  // Handle adding all items from "Frequently Bought Together" section
  const handleAddAllToCart = () => {
    boughtTogetherItems.forEach(item => {
      addToCart({
        productId: item.id,
        name: item.name,
        price: item.price * 0.85, // 15% discount
        image: item.image,
        quantity: 1,
        size: "M", // Default size for bought together items
      });
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  // Height of the taskbar (matches py-3 + px-2, but add extra for safety)
  const taskbarHeight = items.length > 0 && !showPopup ? 64 : 0;

  // Sample data for "bought together" items
  const boughtTogetherItems = getFBTForPage('empire-hat');
  

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      {/* Go Back button - top center to avoid overlap with logo (left) and menu (right) */}
      <span
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Go back button clicked');
          try {
            router.back();
          } catch (err) {
            console.log('Router.back failed, using window.history.back', err);
            window.history.back();
          }
        }}
        style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 16,
          color: '#232323',
          cursor: 'pointer',
          fontWeight: 500,
          zIndex: 10005,
          userSelect: 'none',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #e0e0e0',
          borderRadius: '20px',
          padding: '8px 16px',
          textDecoration: 'none',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          pointerEvents: 'auto',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
          e.currentTarget.style.transform = 'translateX(-50%) translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
          e.currentTarget.style.transform = 'translateX(-50%) translateY(0px)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }}
      >
        ← Go Back
      </span>
      
      {/* Section 1: Product Details */}
      <div
        className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4"
        style={{
          paddingBottom: taskbarHeight,
          minHeight: '100vh',
          paddingTop: 120
        }}
      >
        {/* Images */}
        <div className="flex w-full md:w-1/2 flex-col items-center gap-4">
          <div className="relative w-full max-w-sm md:max-w-full aspect-square rounded-xl overflow-hidden bg-white shadow-sm">
            <Image
              src={selectedImage}
              alt={PRODUCT.name}
              fill
              sizes="(max-width: 768px) 90vw, 420px"
              style={{ objectFit: "contain", background: "#fff" }}
              priority
            />
          </div>
          <div className="flex gap-2 justify-center">
          {empireHatImages.map((img) => (
            <button
              key={img}
              onClick={() => setSelectedImage(img)}
              className={`relative w-16 h-16 rounded border ${selectedImage === img ? "ring-2 ring-black" : ""}`}
            >
              <Image src={img} alt="Empire Cordury hat" fill style={{ objectFit: "contain", background: "#fff" }} />
            </button>
          ))}
          </div>
        </div>
        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-start">
  <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
        <p className="text-sm text-gray-600 mb-6">Vintage corduroy finish is the single style offered.</p>
        <p className="text-sm text-gray-600 mb-6">Adjustable strap ensures an easy, one-size fit.</p>
        <p className="text-lg text-gray-700 mb-4">{PRODUCT.description}</p>
          <div className="text-2xl font-semibold mb-6"><Price price={PRODUCT.price} salePrice={PRODUCT.salePrice} /></div>
        <button
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 mb-2"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
        {/* Buy Now button removed as requested */}
      </div>
      </div>

      <FrequentlyBoughtTogether
        products={boughtTogetherItems}
        onAddToCart={handleAddBoughtTogetherItem}
        onAddAllToCart={handleAddAllToCart}
      />

      {/* Section 3: Customer Reviews */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: '#fbf6f0'
        }}
        className="py-12 px-4"
      >
        <div className="max-w-4xl mx-auto w-full">
          <CustomerReviews productId="empire-hat" />
        </div>
      </div>

      {/* No add to cart popup or animation */}

      {/* Minimalistic cart taskbar at bottom if cart has items */}
      {items.length > 0 && !showPopup && (
        <div
          className="fixed left-0 right-0 bottom-0 z-50 bg-black text-white px-2 py-3 md:px-4 md:py-4 flex items-center justify-between"
          style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)', borderBottom: 'none' }}
        >
          <span className="font-medium text-sm md:text-base">Cart</span>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="inline-block bg-white text-black rounded px-2 py-1 md:px-3 font-bold text-sm md:text-base">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
            <a
              href="/cart"
              className="ml-1 md:ml-2 px-3 py-2 md:px-4 md:py-2 bg-white text-black rounded font-semibold hover:bg-gray-200 text-xs md:text-base"
              style={{ textDecoration: 'none' }}
            >
              Head to Cart
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
