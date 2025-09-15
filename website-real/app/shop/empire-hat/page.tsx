"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { useCart } from "../../../components/CartContext";

const empireHatImages = [
  "/images/empirehatsolo.jpg", // Empire Hat product shot
  "/images/empirehatfemale.jpg", // Empire Hat on model (female)
  "/images/empirehatmale.jpg", // Empire Hat on model (male)
];

const PRODUCT = {
  name: "Empire Hat",
  price: 42,
  description: "A bold, structured hat inspired by the Empire State. Stand tall in style.",
};

export default function EmpireHatPage() {
  const [selectedImage, setSelectedImage] = useState(empireHatImages[0]);
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [popupPhase, setPopupPhase] = useState<'center'|'toTaskbar'|null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // GSAP ScrollTrigger for video scrubbing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let duration = 0;
    const onLoaded = () => {
      duration = video.duration;
      gsap.to(video, {
        currentTime: duration,
        ease: "none",
        scrollTrigger: {
          trigger: "#empire-hat-video-bg",
          start: "top top",
          end: "bottom+=2000 top",
          scrub: true,
          pin: true,
        },
      });
    };
    video.addEventListener("loadedmetadata", onLoaded);
    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const handleAddToCart = () => {
    addToCart({
      productId: "empire-hat",
      name: PRODUCT.name,
      price: PRODUCT.price,
  image: empireHatImages[0],
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
      {/* Video background with GSAP scroll control */}
      <div id="empire-hat-video-bg" style={{ position: 'fixed', inset: 0, zIndex: -1, width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          src="/Videos/applehat.mp4"
          style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
          muted
          playsInline
          preload="auto"
        />
      </div>
      <div
        className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto py-12 px-4"
        style={{ paddingBottom: taskbarHeight, position: 'relative', zIndex: 1 }}
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
            {empireHatImages.map((img) => (
              <button
                key={img}
                onClick={() => setSelectedImage(img)}
                className={`relative w-16 h-16 rounded border ${selectedImage === img ? "ring-2 ring-black" : ""}`}
              >
                <Image src={img} alt="Empire Hat" fill style={{ objectFit: "contain", background: "#fff" }} />
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
      {/* Popup and taskbar UI are not included here for brevity; copy from denim-hat if you want the same effect */}
    </>
  );
}
