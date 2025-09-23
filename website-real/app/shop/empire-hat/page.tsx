"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { useCart } from "../../../components/CartContext";

const PRODUCT = {
  name: "Empire Hat",
  price: 42,
  description: "A bold, structured hat inspired by the New York City! Stand tall in style.",
};

const colorOptions = [
  {
    name: 'Female',
    color: '#e5d1b8',
    images: [
      '/images/empirehatfemale.jpg',
    ],
    bg: '#f7f3ed',
    border: '#fff',
  },
  {
    name: 'Solo',
    color: '#fff',
    images: [
      '/images/empirehatsolo.jpg',
    ],
    bg: '#f8f8f8',
    border: '#bbb',
  },
  {
    name: 'Male',
    color: '#232323',
    images: [
      '/images/empirehatmale.jpg',
    ],
    bg: '#232323',
    border: '#fff',
  },
];

function EmpireHatPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [spacerHeight, setSpacerHeight] = useState(2200); // default fallback
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const { addToCart } = useCart();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let duration = 0;
    let updateImage: (() => void) | null = null;
    let scrollTween: gsap.core.Tween | null = null;

    // Always reset video to 0 on mount
    video.currentTime = 0;

    const setupScrollTween = () => {
      duration = video.duration;
      if (!duration || isNaN(duration) || duration === Infinity) return;
      // Dynamically set scroll spacer height so the end of the page is the end of the video
      // 1s of video = 1 viewport height of scroll (tweak as needed)
      const vh = window.innerHeight;
      const newSpacerHeight = Math.max(Math.round(duration * vh), vh * 2); // at least 2 screens
      setSpacerHeight(newSpacerHeight);

      // Kill any previous tween
      if (scrollTween) scrollTween.kill();
      scrollTween = gsap.to(video, {
        currentTime: duration,
        ease: "none",
        scrollTrigger: {
          trigger: "#empire-hat-scroll-spacer",
          start: "top top",
          end: "+=" + newSpacerHeight,
          scrub: true,
          pin: "#empire-hat-video-bg",
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      updateImage = () => {
        if (!video || !duration) return;
        const percent = video.currentTime / duration;
        let idx = 0;
        if (percent > 0.66) idx = 2;
        else if (percent > 0.33) idx = 1;
        else idx = 0;
        setCurrentImageIdx(idx);
      };
      video.addEventListener('timeupdate', updateImage);
      // Force ScrollTrigger refresh in case layout changed
      setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh) {
          ScrollTrigger.refresh();
        }
      }, 100);
    };

    if (video.readyState >= 1) {
      // Metadata already loaded
      setupScrollTween();
    } else {
      video.addEventListener("loadedmetadata", setupScrollTween);
    }

    return () => {
      if (video) {
        video.removeEventListener("loadedmetadata", setupScrollTween);
        if (updateImage) video.removeEventListener('timeupdate', updateImage);
      }
      if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.getAll) {
        ScrollTrigger.getAll().forEach(t => {
          try { t.kill(); } catch (e) {}
        });
      }
      if (scrollTween) scrollTween.kill();
    };
  }, [isMobile]);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: "empire-hat",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: selectedColor.images[selectedImageIdx],
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
    });
  };

  return (
    <>
      {/* Video background fixed and pinned with GSAP */}
      <div id="empire-hat-video-bg" style={{ position: 'fixed', inset: 0, zIndex: -2, width: '100vw', height: '100dvh', minHeight: '100dvh', maxHeight: '100dvh', overflow: 'hidden', background: '#000' }}>
        <video
          ref={videoRef}
          style={{ width: '100vw', height: '100vh', objectFit: isMobile ? 'contain' : 'cover', objectPosition: 'center center', display: 'block', background: '#000' }}
          muted
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
        >
          <source
            src={isMobile ? "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/Videos/mobileapplehat.mp4" : "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/Videos/applehatfinal.mp4"}
            type="video/mp4"
          />
        </video>
      </div>
      {/* Overlay: image left, text right on desktop; stacked on mobile */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          zIndex: 2,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          gap: isMobile ? 0 : 48,
        }}
      >
        {/* Main image and thumbnails as a block */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* Main image */}
          <div style={{ position: 'relative', width: isMobile ? '80vw' : 400, height: isMobile ? '90vw' : 500, maxWidth: 500, maxHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              key={selectedColor.images[selectedImageIdx]}
              src={selectedColor.images[selectedImageIdx]}
              alt={PRODUCT.name}
              fill
              style={{
                objectFit: 'contain',
                opacity: 1,
                transition: 'opacity 0.7s cubic-bezier(.7,-0.2,.3,1.2)',
                zIndex: 2,
              }}
              priority
            />
          </div>
          {/* Thumbnails: right of image on desktop, below on mobile */}
          <div
            className="flex gap-2 justify-center"
            style={{
              flexDirection: isMobile ? 'row' : 'column',
              marginLeft: isMobile ? 0 : 18,
              marginTop: isMobile ? 12 : 0,
              pointerEvents: 'auto',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: isMobile ? undefined : 56,
              width: isMobile ? '100%' : undefined,
            }}
          >
            {selectedColor.images.map((img, idx) => (
              <button
                key={img}
                onClick={() => setSelectedImageIdx(idx)}
                style={{
                  border: selectedImageIdx === idx ? '2px solid #3B82F6' : '1px solid #bbb',
                  borderRadius: 8,
                  padding: 0,
                  width: 48,
                  height: 48,
                  background: '#fff',
                  marginBottom: isMobile ? 0 : 8,
                  marginRight: isMobile ? 8 : 0,
                  boxShadow: selectedImageIdx === idx ? '0 0 0 2px #3B82F6' : '0 1px 4px 0 rgba(0,0,0,0.07)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  display: 'inline-block',
                }}
                aria-label={`View image ${idx + 1} of ${selectedColor.name}`}
              >
                <Image src={img} alt={PRODUCT.name} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 8 }} />
              </button>
            ))}
          </div>
          {/* Color Picker below image+thumbnails, always */}
          <div className="flex gap-3 mb-4 px-1 justify-center" style={{ marginTop: 12, marginBottom: 24, paddingTop: 8, paddingBottom: 8, minHeight: 48, justifyContent: 'center', pointerEvents: 'auto', width: '100%' }}>
            {colorOptions.map((opt) => (
              <button
                key={opt.name}
                aria-label={opt.name}
                onClick={() => {
                  setSelectedColor(opt);
                  setSelectedImageIdx(0);
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: opt.color,
                  border: selectedColor.name === opt.name ? '2px solid #232323' : '2px solid #bbb',
                  outline: selectedColor.name === opt.name ? '2px solid #3B82F6' : 'none',
                  boxShadow: '0 1px 4px 0 rgba(0,0,0,0.10)',
                  display: 'inline-block',
                  cursor: 'pointer',
                  marginRight: 4,
                  position: 'relative',
                  pointerEvents: 'auto',
                }}
              >
                {/* For white or very light colors, add a gray dot in the center for visibility */}
                {opt.color === '#fff' && (
                  <span style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#bbb',
                    opacity: 0.5,
                  }} />
                )}
              </button>
            ))}
          </div>
        </div>
        {/* Text right */}
        <div
          style={{
            background: 'rgba(0,0,0,0.55)',
            borderRadius: 18,
            padding: isMobile ? '18px 8vw' : '32px 40px',
            color: '#fff',
            minWidth: isMobile ? 220 : 320,
            maxWidth: isMobile ? 420 : 440,
            textAlign: isMobile ? 'center' : 'left',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)',
            marginTop: isMobile ? 24 : 0,
            marginLeft: isMobile ? 0 : 12,
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMobile ? 'center' : 'flex-start',
            justifyContent: 'center',
          }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 10px 0' }}>{PRODUCT.name}</h1>
          {/* Size Dropdown */}
          <div style={{ marginBottom: 18, position: 'relative', width: 180, alignSelf: isMobile ? 'center' : 'flex-start' }}>
            <button
              className="border border-white text-white px-5 py-2 rounded-lg font-semibold flex items-center justify-between w-full bg-black hover:bg-gray-800"
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
                className="absolute left-0 right-0 mt-2 bg-black border border-gray-200 rounded-lg shadow-lg z-20"
                style={{ listStyle: 'none', padding: 0, margin: 0 }}
                role="listbox"
              >
                {sizeOptions.map((size) => (
                  <li
                    key={size}
                    className={`px-5 py-2 cursor-pointer hover:bg-gray-900 ${selectedSize === size ? 'bg-gray-700 font-bold' : ''}`}
                    style={{ fontSize: 16, borderBottom: size !== sizeOptions[sizeOptions.length-1] ? '1px solid #222' : 'none' }}
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
          <p style={{ fontSize: 18, margin: '0 0 18px 0' }}>{PRODUCT.description}</p>
          <div style={{ fontSize: 26, fontWeight: 600, marginBottom: 12 }}>${PRODUCT.price}</div>
          <button
            style={{
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: 8,
              padding: '10px 28px',
              fontWeight: 600,
              fontSize: 18,
              cursor: 'pointer',
              marginTop: 8,
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
              transition: 'background 0.2s, color 0.2s',
              opacity: !selectedSize ? 0.5 : 1,
              pointerEvents: !selectedSize ? 'none' : 'auto',
            }}
            disabled={!selectedSize}
            onClick={handleAddToCart}
          >
            {!selectedSize ? 'Pick a size to add to cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
      {/* Floating Taskbar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          zIndex: 100,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 2vw',
          height: 56,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            position: 'relative',
          }}
        >
          <a href="/contact" style={{ color: '#fff', fontWeight: 600, fontSize: 18, textDecoration: 'none', padding: '6px 18px', borderRadius: 8, transition: 'background 0.2s', letterSpacing: 0.5 }}>Contact</a>
          <a href="/shop" style={{ color: '#fff', fontWeight: 600, fontSize: 18, textDecoration: 'none', padding: '6px 18px', borderRadius: 8, transition: 'background 0.2s', letterSpacing: 0.5 }}>Shop</a>
          <a href="/cart" style={{ color: '#fff', display: 'flex', alignItems: 'center', marginLeft: 8 }}>
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </a>
        </div>
      </div>
  {/* Spacer for scroll area */}
  <div id="empire-hat-scroll-spacer" style={{ height: spacerHeight, width: '100%' }} />
    </>
  );
}

export default EmpireHatPage;