"use client";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../components/CartContext";

const whiteHatImages = [
  "/images/whitehatmale1.jpeg",
  "/images/whitehatsolo.jpeg"
];

const PRODUCT = {
  name: "White Hat",
  price: 40,
  description: "Crisp white hat, clean look for any outfit.",
};

export default function WhiteHatPage() {
  const [selectedImage, setSelectedImage] = useState(whiteHatImages[0]);
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [popupPhase, setPopupPhase] = useState<'center'|'toTaskbar'|null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart({
      productId: "white-hat",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: whiteHatImages[0],
      quantity: 1,
    });
    setShowPopup(true);
    setPopupPhase('center');
    setTimeout(() => {
      setPopupPhase('toTaskbar');
      setTimeout(() => {
        setShowPopup(false);
        setPopupPhase(null);
      }, 500);
    }, 900);
  };

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
          {whiteHatImages.map((img) => (
            <button
              key={img}
              onClick={() => setSelectedImage(img)}
              className={`relative w-16 h-16 rounded border ${selectedImage === img ? "ring-2 ring-black" : ""}`}
            >
              <Image src={img} alt="White Hat" fill style={{ objectFit: "contain", background: "#fff" }} />
            </button>
          ))}
        </div>
      </div>
      {/* Product Info */}
      <div className="md:w-1/2 flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-2">{PRODUCT.name}</h1>
        <p className="text-lg mb-4">{PRODUCT.description}</p>
        <div className="text-2xl font-semibold mb-6">${PRODUCT.price}</div>
        <button
          className="bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-900 transition"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
      </div>
    </>
  );
}
