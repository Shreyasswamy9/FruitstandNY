"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import ProductsGrid from "../../components/ProductsGridHome"
import BundleSheet from "../../components/BundleSheet"
import Link from "next/link"

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [bundleOpen, setBundleOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: '#fbf6f0' }}>

      {/* Category Navigation */}
      <div
        className="shop-category-nav pb-12 px-4 sm:px-6 lg:px-8"
        style={{
          position: 'relative',
          pointerEvents: 'none',
          // Push pills below the fixed 92px logo (top 14px + height 92px + extra spacing)
          paddingTop: '130px',
          // Ensure pills sit above logo so clicks go to buttons even if bounding boxes overlap
          zIndex: 60
        }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center gap-1 sm:gap-2 lg:gap-3 flex-nowrap"
            style={{ pointerEvents: 'auto', flexWrap: 'nowrap' }}
          >
            {['Tops', 'Tracksuits', 'Jerseys', 'Hats', 'Extras'].map((category, index) => {
              const isActive = activeCategory === category;
              return (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{
                    scale: 0.98,
                    y: 0,
                    transition: { duration: 0.1 }
                  }}
                  className={`category-pill px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 border-2 rounded-full font-medium text-xs sm:text-sm lg:text-base transition-all duration-300 ease-out ${isActive
                    ? 'bg-black text-white border-black shadow-lg'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-black hover:text-white hover:border-black'
                    }`}
                  style={{ pointerEvents: 'auto' }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveCategory(activeCategory === category ? null : category);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveCategory(activeCategory === category ? null : category);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  aria-label={`Filter products by ${category}`}
                >
                  {category}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Shop CTA: Pick a bundle or build your own */}
      <div className="px-4 sm:px-6 lg:px-8 -mt-6 mb-3" style={{ position: 'relative', zIndex: 2 }}>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setBundleOpen(true)}
            className="glass-banner w-full relative rounded-2xl p-3 sm:p-4 font-semibold active:scale-[0.99]"
            aria-label="Pick a bundle or build your own"
          >
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-lg">Pick a bundle or build your own</span>
              <span className="banner-pill text-[11px] sm:text-xs font-medium px-2 py-1 rounded-full">Save more together</span>
            </div>
            <span className="block text-[11px] sm:text-xs mt-1">Curated combos or your perfect mix - tap to start</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <motion.div
        key={activeCategory || 'all'}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pb-16"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <ProductsGrid categoryFilter={activeCategory} showBackgroundVideo={false} />
      </motion.div>

      {/* Brand Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Brand Logo/Name */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">FRUITSTAND<sup>®</sup></h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Organic New York Culture™
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
              <Link href="/cookie-policy" className="text-gray-600 hover:text-gray-900 transition-colors">Cookie Policy</Link>
              <Link href="/return-policy" className="text-gray-600 hover:text-gray-900 transition-colors">Return Policy</Link>
              <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="text-gray-600 hover:text-gray-900 transition-colors">Terms and Conditions</Link>
            </div>

            {/* Social Media */}
            <div className="flex justify-center gap-6 mb-8">
              <a href="https://www.instagram.com/fruitstandny?igsh=MWNqcmFwdGRvaWQzOQ==" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.004 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z" />
                </svg>
              </a>
              <a href="https://x.com/FruitStandNY" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/FRUITSTANDNY" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-200 pt-8">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} FRUITSTAND<sup>®</sup>. All rights reserved.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Designed and crafted with care in New York, NY
              </p>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Category Pills Styling */}
      <style jsx global>{`
        /* Category Pills Styling */
        .category-pill {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: auto;
          z-index: 10;
          flex: 1 1 0;
          max-width: 140px;
          white-space: nowrap;
          text-align: center;
        }
        
        .category-pill:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        
        .category-pill:active {
          transform: scale(0.98) translateY(0px);
          transition: all 0.1s ease;
        }
        
        .category-pill:focus {
          outline: 2px solid rgba(0, 0, 0, 0.2);
          outline-offset: 2px;
        }
        
        /* Animation for active state */
        .category-pill.active {
          animation: pill-activate 0.3s ease-out;
        }
        
        @keyframes pill-activate {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        /* Ripple effect on click */
        .category-pill::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.1);
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s;
          z-index: 0;
        }
        
        .category-pill:active::before {
          width: 200px;
          height: 200px;
        }
        
        .category-pill > * {
          position: relative;
          z-index: 1;
        }
        
        @media (max-width: 768px) {
          .category-pill {
            padding: 6px 12px;
            font-size: 12px;
          }
        }
        
        @media (max-width: 480px) {
          .category-pill {
            padding: 5px 9px;
            font-size: 11px;
            min-width: 0;
          }
        }
      `}</style>
      {/* Bundle Sheet */}
      <BundleSheet open={bundleOpen} onClose={() => setBundleOpen(false)} />
    </div>
  )
}
