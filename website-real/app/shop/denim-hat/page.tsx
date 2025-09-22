"use client";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../components/CartContext";

const denimHatImages = [
  "/images/denimhatfemale1.jpeg",
  "/images/denimhatmale1.jpeg",
  "/images/denimhatmale2.jpeg",
  "/images/denimhatsolo.jpeg"
];

const PRODUCT = {
  name: "Denim Hat",
  price: 20,
  description: "Classic denim hat with a modern fit. Durable, stylish, and perfect for any season.",
};

export default function DenimHatPage() {
  const [selectedImage, setSelectedImage] = useState(denimHatImages[0]);
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [popupPhase, setPopupPhase] = useState<'center'|'toTaskbar'|null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Show popup in center, then animate to taskbar
  const handleAddToCart = () => {
    addToCart({
      productId: "denim-hat",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: denimHatImages[0],
      quantity: 1,
    });
    setShowPopup(true);
    setPopupPhase('center');
    setTimeout(() => {
      setPopupPhase('toTaskbar');
      setTimeout(() => {
        setShowPopup(false);
        setPopupPhase(null);
      }, 500); // duration of morph animation
    }, 900); // time in center before morphing down
  };

  // Height of the taskbar (matches py-3 + px-2, but add extra for safety)
  const taskbarHeight = items.length > 0 && !showPopup ? 64 : 0;
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
        style={{ paddingBottom: taskbarHeight }}
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
          {denimHatImages.map((img) => (
            <button
              key={img}
              onClick={() => setSelectedImage(img)}
              className={`relative w-16 h-16 rounded border ${selectedImage === img ? "ring-2 ring-black" : ""}`}
            >
              <Image src={img} alt="Denim Hat" fill style={{ objectFit: "contain", background: "#fff" }} />
            </button>
          ))}
        </div>
      </div>
      {/* Product Info */}
      <div className="md:w-1/2 flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
        <p className="text-lg text-gray-700 mb-4">{PRODUCT.description}</p>
        <div className="text-2xl font-semibold mb-6">${PRODUCT.price}</div>
        <button
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition mb-2"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
        <button className="border border-black text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          Buy Now
        </button>
      </div>
    </div>

      {/* GPU-accelerated, super-fluid popup animation */}
      {showPopup && (
        <div
          ref={popupRef}
          className="fixed z-50 flex flex-col items-center justify-center"
          style={{
            left: '50%',
            bottom: 0,
            transform: popupPhase === 'center'
              ? 'translate(-50%, -50vh) scale(1)'
              : 'translate(-50%, 0) scale(0.97)',
            opacity: showPopup ? 1 : 0,
            transition: 'transform 0.8s cubic-bezier(0.77,0,0.175,1), opacity 0.5s',
            willChange: 'transform, opacity',
            width: popupPhase === 'center' ? 180 : '100vw',
            height: popupPhase === 'center' ? 200 : 64,
            background: popupPhase === 'center'
              ? 'url(/images/apple.png) center/contain no-repeat'
              : 'linear-gradient(135deg, #18191a 60%, #232324 100%)',
            color: 'white',
            borderRadius: popupPhase === 'center' ? '50%' : '32px 32px 0 0',
            boxShadow: popupPhase === 'center'
              ? '0 8px 32px 0 rgba(0,0,0,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)'
              : '0 4px 24px 0 rgba(0,0,0,0.18)',
            textAlign: 'center',
            fontFamily: 'inherit',
            fontWeight: 600,
            fontSize: popupPhase === 'center' ? 22 : 18,
            letterSpacing: 1,
            padding: popupPhase === 'center' ? '0 0 24px 0' : '18px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            pointerEvents: 'none',
            overflow: 'visible',
            position: 'relative',
          }}
        >
          {/* No apple SVG, the popup itself is the apple image now */}
          {/* Box message */}
          <span style={{
            display: 'inline-block',
            background: popupPhase === 'center' ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.08)',
            borderRadius: 18,
            padding: popupPhase === 'center' ? '18px 38px 12px 38px' : '8px 18px',
            boxShadow: popupPhase === 'center' ? '0 2px 12px 0 rgba(0,0,0,0.10)' : 'none',
            fontSize: popupPhase === 'center' ? 22 : 18,
            fontWeight: 700,
            letterSpacing: 1,
            marginTop: popupPhase === 'center' ? 12 : 0,
            transition: 'all 0.5s cubic-bezier(.7,-0.2,.3,1.2)',
          }}>
            Added to cart!
          </span>
        </div>
      )}

      {/* Minimalistic cart taskbar at bottom if cart has items */}
      {items.length > 0 && !showPopup && (
        <div
          className="fixed left-0 right-0 bottom-0 z-50 bg-black text-white px-2 py-3 md:px-4 md:py-4 flex items-center justify-between animate-slideInUp"
          style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)', borderBottom: 'none' }}
        >
          <span className="font-medium text-sm md:text-base">Cart</span>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="inline-block bg-white text-black rounded px-2 py-1 md:px-3 font-bold text-sm md:text-base">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
            <a
              href="/cart"
              className="ml-1 md:ml-2 px-3 py-2 md:px-4 md:py-2 bg-white text-black rounded font-semibold hover:bg-gray-200 transition text-xs md:text-base"
              style={{ textDecoration: 'none' }}
            >
              Head to Cart
            </a>
          </div>
        </div>
      )}
    </>
  );
}
