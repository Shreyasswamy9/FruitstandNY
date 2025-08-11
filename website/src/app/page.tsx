'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ShopDropdown from './components/ShopDropdown';

export default function Home() {
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      console.log('Scroll position:', window.scrollY); // Debug log
      if (window.scrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-screen overflow-y-auto">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src="/video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better text readability */}
      <div className="fixed inset-0 bg-black/20 z-10"></div>

      {/* Brand Name - Top center like in your image */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-emerald-300 font-black text-4xl md:text-5xl tracking-widest uppercase"
            >
              FRUITSTAND
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation - Appears after scroll */}
      <AnimatePresence>
        {hasScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-40"
          >
            <Navbar 
              isShopDropdownOpen={isShopDropdownOpen}
              setIsShopDropdownOpen={setIsShopDropdownOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="relative z-20 pt-16">
        {/* New Collection Section - Bottom center like in your image */}
        <div className="h-screen flex items-end justify-center pb-32">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center"
          >
            <div className="text-center">
              <h1 className="text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] font-light tracking-wide text-white mb-6 font-serif italic">
                New Collection
              </h1>
              <h2 className="text-9xl md:text-[10rem] lg:text-[13rem] xl:text-[16rem] font-bold tracking-wide text-white font-serif italic">
                2025
              </h2>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
