"use client";

import { motion } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";

const navPhotos = {
  SHOP: ["/images/shop.jpg"],
  ACCOUNT: ["/images/home.jpg"],
  CART: ["/images/cart.webp"],
  CONTACT: ["/images/contact.jpeg"],
};

type NavType = "SHOP" | "ACCOUNT" | "CART" | "CONTACT";
interface PhotoGroupProps {
  hoveredNav: NavType | null;
}
function PhotoGroup({ hoveredNav }: PhotoGroupProps) {
  const photos = hoveredNav && navPhotos[hoveredNav as NavType] ? navPhotos[hoveredNav as NavType] : navPhotos["SHOP"];
  return (
    <div style={{ position: "relative", width: 520, height: 620 }}>
      {photos.map((src: string, i: number) => (
        <motion.img
          key={src}
          src={src}
          initial={{ opacity: 0, x: -80, rotate: -8 + i * 8, scale: 0.92 }}
          animate={{
            opacity: 1,
            x: 0 + i * 28,
            rotate: -8 + i * 8,
            scale: 1 + i * 0.04
          }}
          exit={{ opacity: 0, x: -80, scale: 0.92 }}
          transition={{ duration: 0.5 + i * 0.1, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: 40 + i * 48,
            left: 40 + i * 28,
            width: 340,
            height: 340,
            objectFit: "cover",
            borderRadius: 64,
            boxShadow: "0 16px 48px #aaa",
            zIndex: 10 + i,
            transform: `skewY(-6deg) rotate(${-8 + i * 8}deg)`
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [transitioning, setTransitioning] = useState(false);
  const [showMain, setShowMain] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<NavType | null>(null);
  const [menuTransition, setMenuTransition] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle menu open/close with animation
  // Use animation complete to reveal menu after blocks finish
  const openMenu = () => {
    setMenuOpen(true);
    setMenuTransition('open');
  };
  const closeMenu = () => {
    setMenuOpen(false);
    setMenuTransition('closed');
  };

  // When blocks finish opening animation, show menu
  const handleBlocksOpenComplete = () => {
    if (menuTransition === 'opening') {
      setMenuOpen(true);
      setMenuTransition('open');
    }
  };
  // When blocks finish closing animation, hide menu
  const handleBlocksCloseComplete = () => {
    if (menuTransition === 'closing') {
      setMenuTransition('closed');
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => {
        video.playbackRate = 1.25;
        video.play().catch(err => {
          console.warn("Autoplay failed:", err);
        });
      };
      video.addEventListener("canplaythrough", handleCanPlay);
      return () => video.removeEventListener("canplaythrough", handleCanPlay);
    }
  }, []);

  const handleVideoEnd = () => {
    setTransitioning(true);
    setTimeout(() => {
      setShowMain(true);
    }, 700); // Duration of transition
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100vw", background: "#fff", zIndex: 9999, overflow: "auto" }}>
      {/* First video: crossfade and slide out */}
      <motion.video
        ref={videoRef}
        id="intro-video"
        style={{ width: "100vw", height: "100vh", objectFit: "cover", position: "fixed", top: 0, left: 0, zIndex: 2, pointerEvents: "none" }}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        initial={{ opacity: 1 }}
        animate={transitioning ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <source src="https://github.com/Shreyasswamy9/FruitstandNY/raw/main/Videos/fruitstand.mp4" type="video/mp4" />
      </motion.video>
      {/* Second video: crossfade and slide in */}
      <motion.video
        style={{ width: "100vw", height: "100vh", objectFit: "cover", position: "fixed", top: 0, left: 0, zIndex: 1, pointerEvents: "none" }}
        autoPlay
        muted
        playsInline
        preload="auto"
        loop
        initial={{ opacity: 0 }}
        animate={transitioning || showMain ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
  <source src="https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/Videos/websitebackgroundfinal.mp4" type="video/mp4" />
      </motion.video>
      {/* Top header FRUITSTAND text and menu button only after transition */}
      {showMain && (
        <>
          {/* Header */}
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10002,
            pointerEvents: "none",
            height: "80px"
          }}>
            <h1 style={{
              color: "white",
              fontSize: "2.2rem",
              fontWeight: "bold",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textAlign: "center",
              textShadow: "0 2px 8px #000, 0 0px 2px #000",
              margin: 0
            }}>FRUITSTAND</h1>
          </div>
          {/* Menu Button */}
             <div style={{ position: "fixed", top: 20, right: 20, zIndex: 10001 }}>
               <button style={{ padding: "10px 20px", fontSize: 18 }} onClick={openMenu}>Menu</button>
             </div>
             {/* Simple crossfade menu overlay, no blocks */}
             {/* Menu Overlay (crossfade only) */}
             {menuOpen && menuTransition === 'open' && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.6, ease: "easeInOut" }}
                 style={{
                   position: "fixed",
                   top: 0,
                   left: 0,
                   width: "100vw",
                   height: "100vh",
                   zIndex: 20002,
                   display: "flex",
                   background: "linear-gradient(120deg, #232323 0%, #b71c1c 100%)",
                   transition: "background 0.7s ease"
                 }}
               >
                 {/* Left: Animated, skewed, fanned photos */}
                 <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                   <PhotoGroup hoveredNav={hoveredNav} />
                 </div>
                 {/* Right: Navigation buttons */}
                 <div style={{ width: 400, minWidth: 220, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", paddingRight: 60 }}>
                   {["SHOP", "ACCOUNT", "CART", "CONTACT"].map(nav => (
                     <button
                       key={nav}
                       style={{
                         margin: "18px 0",
                         padding: "18px 38px",
                         fontSize: 28,
                         fontWeight: "bold",
                         background: hoveredNav === nav ? "#fff" : "#f5f5f5",
                         color: "#333",
                         border: "none",
                         borderRadius: 12,
                         boxShadow: hoveredNav === nav ? "0 4px 24px #bbb" : "0 2px 8px #ccc",
                         cursor: "pointer",
                         transition: "all 0.3s"
                       }}
                       onMouseEnter={() => setHoveredNav(nav as NavType)}
                       onMouseLeave={() => setHoveredNav(null)}
                     >
                       {nav}
                     </button>
                   ))}
                   <button style={{ marginTop: 40, padding: "10px 24px", fontSize: 18 }} onClick={closeMenu}>Close</button>
                 </div>
               </motion.div>
             )}
        </>
      )}
      {/* Main website content goes here, scrollable */}
      <div style={{ position: "relative", zIndex: 2, marginTop: "100vh" }}>
        {/* Example content, replace with your actual site */}
        <div style={{ height: "200vh", color: "white", padding: "40px" }}>
          <h2>Welcome to FruitstandNY</h2>
          <p>Scroll down to explore the collection and interact with the site.</p>
        </div>
      </div>
    </div>
  );
}