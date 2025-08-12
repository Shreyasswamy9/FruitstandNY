"use client";

import { motion } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";

export default function Home() {
  const [videoEnded, setVideoEnded] = useState(false);
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
      <div style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", background: "#000", zIndex: 9999, overflow: "hidden" }}>
        <video
          ref={videoRef}
          id="intro-video"
          style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", objectFit: "cover", backgroundColor: "#000" }}
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
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center overflow-hidden">
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Centered Canvas-like Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 select-none pointer-events-none">
        {/* Animated, spaced-out Brand Name */}
        <motion.h1
          className="text-emerald-300 font-black text-5xl md:text-7xl lg:text-8xl tracking-[0.5em] uppercase text-center drop-shadow-lg mb-8 flex justify-center"
          style={{ letterSpacing: "0.25em" }}
          variants={container}
          initial="hidden"
          animate="show"
        >
          {"FRUITSTAND".split("").map((char, i) => (
            <motion.span key={i} variants={letter} className="inline-block mx-1">
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>
        {/* Subtitle below brand name, animated in */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 1.2 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-wide text-white font-serif italic drop-shadow-lg mb-2">
            New Collection 2025
          </h2>
        </motion.div>
      </div>
    </div>
  );
}

