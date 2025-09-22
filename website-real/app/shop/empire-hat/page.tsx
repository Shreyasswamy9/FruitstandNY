
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

const empireHatImages = [
  "/images/empirehatfemale.jpg",
  "/images/empirehatsolo.jpg",
  "/images/empirehatmale.jpg",
];

export default function EmpireHatPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [spacerHeight, setSpacerHeight] = useState(2200); // default fallback
  const videoRef = useRef<HTMLVideoElement>(null);
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
    addToCart({
      productId: "empire-hat",
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: empireHatImages[0],
      quantity: 1,
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
        {/* Image left */}
        <div style={{ position: 'relative', width: isMobile ? '80vw' : 400, height: isMobile ? '90vw' : 500, maxWidth: 500, maxHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {empireHatImages.map((img, idx) => (
            <Image
              key={img}
              src={img}
              alt={PRODUCT.name}
              fill
              style={{
                objectFit: 'contain',
                opacity: currentImageIdx === idx ? 1 : 0,
                transition: 'opacity 0.7s cubic-bezier(.7,-0.2,.3,1.2)',
                zIndex: 2,
              }}
              priority={idx === 0}
            />
          ))}
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
            }}
            onClick={handleAddToCart}
          >
            Add to Cart
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