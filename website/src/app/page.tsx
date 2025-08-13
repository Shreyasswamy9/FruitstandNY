"use client";

import { motion } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";

export default function Home() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [showMain, setShowMain] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => {
        video.playbackRate = 1.0;
        video.play().catch(err => {
          console.warn("Autoplay failed:", err);
        });
      };
      video.addEventListener("canplaythrough", handleCanPlay);
      return () => video.removeEventListener("canplaythrough", handleCanPlay);
    }
  }, []);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setTimeout(() => {
      setShowTransition(true);
      setTimeout(() => {
        setShowMain(true);
      }, 700); // Duration of slide animation
    }, 200); // Small delay before slide starts
  };

  // Animation variants for staggered letters
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };
  const letter = {
    hidden: { opacity: 0, y: 40, scale: 0.8 },
    show: { opacity: 1, y: 0, scale: 1, transition: { stiffness: 400, damping: 20 } },
  };

  if (!videoEnded) {
    return (
      <div style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", background: "#000", zIndex: 9999 }}>
        <video
          ref={videoRef}
          id="intro-video"
          style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnd}
        >
          <source src="https://github.com/Shreyasswamy9/FruitstandNY/raw/main/Videos/fruitstand.mp4" type="video/mp4" />
        </video>
      </div>
    );
  if (showTransition && !showMain) {
    return (
      <motion.div
        initial={{ y: "100vh" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", background: "#000", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <h1 style={{
          color: "white",
          fontSize: "3rem",
          fontWeight: "bold",
          letterSpacing: "0.15em",
          textAlign: "center",
          zIndex: 10001,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}>FRUITSTAND</h1>
      </motion.div>
    );
  }
  }

  if (showMain) {
    return (
      <motion.div
        initial={{ y: "100vh" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{ position: "relative", minHeight: "100vh", width: "100vw", background: "#000", zIndex: 9999, overflow: "auto" }}
      >
        <video
          style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", objectFit: "cover", zIndex: 0 }}
          autoPlay
          muted
          playsInline
          preload="auto"
          loop
        >
          <source src="https://github.com/Shreyasswamy9/FruitstandNY/raw/main/Videos/fruitstand2.mp4" type="video/mp4" />
        </video>
        {/* Menu button top right */}
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 10001 }}>
          <button style={{ padding: "10px 20px", fontSize: 18 }}>Menu</button>
        </div>
        {/* Main website content goes here, scrollable */}
        <div style={{ position: "relative", zIndex: 1, marginTop: "100vh" }}>
          {/* Example content, replace with your actual site */}
          <div style={{ height: "200vh", color: "white", padding: "40px" }}>
            <h2>Welcome to FruitstandNY</h2>
            <p>Scroll down to explore the collection and interact with the site.</p>
          </div>
        </div>
      </motion.div>
    );
  }
}

