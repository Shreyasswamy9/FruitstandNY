"use client";
// Hide scrollbar for this page
const hideScrollbarStyle = `
  html, body {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
  html::-webkit-scrollbar, body::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { useCart } from "../../../components/CartContext";

const empireHatImages = [
  "/images/empirehatfemale.jpg",
  "/images/empirehatsolo.jpg",
  "/images/empirehatmale.jpg",
];

const PRODUCT = {
  name: "Empire Hat",
  price: 42,
  description: "A bold, structured hat inspired by the New York City! Stand tall in style.",
};

function EmpireHatPage() {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart, items } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [popupPhase, setPopupPhase] = useState<'center'|'toTaskbar'|null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // GSAP ScrollTrigger for video scrubbing and image transitions
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let duration = 0;
    let updateImage: (() => void) | null = null;
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

      // Image transitions: as video plays, change image at 0%, 33%, 66%
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
    };
    video.addEventListener("loadedmetadata", onLoaded);
    return () => {
      if (video && onLoaded) video.removeEventListener("loadedmetadata", onLoaded);
      if (video && updateImage) video.removeEventListener('timeupdate', updateImage);
      if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.getAll) {
        ScrollTrigger.getAll().forEach(t => {
          try { t.kill(); } catch (e) {}
        });
      }
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
      {/* Floating Taskbar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        zIndex: 100,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2vw',
        height: 56,
        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
      }}>
        <a href="/shop" style={{ color: '#fff', fontWeight: 600, fontSize: 20, textDecoration: 'none', letterSpacing: 1 }}>Shop</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="/contact" style={{ color: '#fff', fontWeight: 500, fontSize: 17, textDecoration: 'none', marginRight: 16 }}>Contact</a>
          <a href="/cart" style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </a>
        </div>
      </div>
      <style>{`
        .empire-hat-btn {
          background: #000;
          color: #fff;
          transition: box-shadow 0.2s, background 0.2s;
          font-size: 1rem;
          padding: 0.75rem 1.25rem;
        }
        .empire-hat-btn:hover {
          box-shadow: 0 0 16px 4px rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.12);
          color: #fff;
        }
        .empire-hat-btn-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 100;
          display: flex;
          flex-direction: row;
          gap: 10px;
        }
        #empire-hat-video-bg {
          width: 100vw !important;
          height: 100dvh !important;
          min-height: 100dvh !important;
          max-height: 100dvh !important;
        }
        .empire-hat-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100dvh;
          z-index: 2;
          pointer-events: none;
          display: flex;
          flex-direction: row;
          gap: 8vw;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 600px) {
          .empire-hat-btn {
            font-size: 0.95rem;
            padding: 0.6rem 0.9rem;
          }
          .empire-hat-btn-container {
            bottom: 8px;
            right: 8px;
            gap: 4px;
          }
          .empire-hat-overlay {
            position: static !important;
            width: 100vw !important;
            height: auto !important;
            min-height: 0 !important;
            max-width: 100vw !important;
            flex-direction: column !important;
            gap: 24px !important;
            align-items: center !important;
            justify-content: flex-start !important;
            padding: 16px !important;
            pointer-events: auto !important;
            overflow: visible !important;
          }
          .empire-hat-overlay > div {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            margin: 0 auto !important;
            width: 100% !important;
          }
          .empire-hat-image-container {
            width: 80% !important;
            max-width: 350px !important;
          }
          body {
            overflow-x: hidden !important;
            overflow-y: auto !important;
            height: auto !important;
            min-height: 100vh !important;
            position: relative !important;
          }
        }
        ${hideScrollbarStyle}
      `}</style>
      {/* Video background with GSAP scroll control */}
      <div id="empire-hat-video-bg" style={{ position: 'fixed', inset: 0, zIndex: -2, width: '100vw', height: '100dvh', minHeight: '100dvh', maxHeight: '100dvh', overflow: 'hidden', background: '#000' }}>
        <video
          ref={videoRef}
          style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
          muted
          playsInline
          preload="auto"
        >
          <source
            src="https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/Videos/applehatfinal.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div
        className="empire-hat-overlay"
        style={{
          paddingTop: 56, // height of the floating taskbar
          paddingBottom: taskbarHeight,
          position: isMobile ? 'relative' : 'fixed',
          top: isMobile ? undefined : 0,
          left: isMobile ? undefined : 0,
          width: '100vw',
          height: isMobile ? 'auto' : '100dvh',
          zIndex: 2,
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '4vw' : '8vw',
          alignItems: isMobile ? 'stretch' : 'center',
          justifyContent: isMobile ? 'flex-start' : 'center',
        }}
      >
        <div style={{
          background: 'rgba(255,255,255,0.0)',
          borderRadius: 20,
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)',
          padding: 18,
          margin: 'auto',
          maxWidth: 900,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: 18,
          alignItems: 'flex-start',
          pointerEvents: 'auto',
          color: '#fff',
        }}>
          {/* Animated product image transitions - grid removed, image larger */}
          <div
            ref={imageContainerRef}
            className="flex flex-col items-start justify-start empire-hat-image-container"
            style={{
              minWidth: 0,
              minHeight: 0,
              width: '60%',
              maxWidth: 500,
              aspectRatio: '4/5',
              position: 'relative',
              overflow: 'visible',
              background: 'none',
              boxShadow: 'none',
            }}
          >
            {empireHatImages.map((img, idx) => (
              <Image
                key={img}
                src={img}
                alt={PRODUCT.name}
                fill
                style={{
                  objectFit: "contain",
                  background: "transparent",
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  opacity: idx === currentImageIdx ? 1 : 0,
                  transform: idx === currentImageIdx ? 'translateY(0)' : 'translateY(60px)',
                  transition: 'opacity 0.7s cubic-bezier(.7,-0.2,.3,1.2), transform 0.7s cubic-bezier(.7,-0.2,.3,1.2)',
                  zIndex: idx === currentImageIdx ? 2 : 1,
                }}
                priority={idx === 0}
              />
            ))}
          </div>
          {/* Product Info */}
          <div className="md:w-1/2 flex flex-col justify-center" style={{color: '#fff', marginLeft: '32px'}}>
            <h1 className="text-3xl font-bold mb-2" style={{color: '#fff'}}>{PRODUCT.name}</h1>
            <p className="text-lg mb-4" style={{color: '#fff'}}>{PRODUCT.description}</p>
            <div className="text-2xl font-semibold mb-6" style={{color: '#fff'}}>${PRODUCT.price}</div>
          </div>
        </div>
      </div>
      {/* Floating buttons fixed to bottom right of the full page */}
      <div className="empire-hat-btn-container">
        <button
          className="empire-hat-btn rounded-lg font-semibold shadow-lg"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
        <button
          className="empire-hat-btn rounded-lg font-semibold shadow-lg"
        >
          Buy Now
        </button>
      </div>
    </>
  );
}

export default EmpireHatPage;
