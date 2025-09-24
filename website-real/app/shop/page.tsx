"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import ProductsGrid from "../../components/ProductsGridHome"
import StaggeredMenu from "../../components/StagerredMenu"

export default function ShopPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
  <div className="min-h-screen" style={{ background: '#fff' }}>

      {/* Category Navigation */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 10 }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4"
            style={{ pointerEvents: 'auto' }}
          >
            {['T-Shirts', 'Jackets', 'Tracksuits', 'Jerseys', 'Hats'].map((category, index) => {
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
                  className={`category-pill px-6 py-3 border-2 rounded-full font-medium transition-all duration-300 ease-out ${
                    isActive 
                      ? 'bg-black text-white border-black shadow-lg' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-black hover:text-white hover:border-black'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveCategory(activeCategory === category ? null : category);
                    console.log(`Filter by ${category}`);
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

      {/* Products Grid */}
      <motion.div 
        key={activeCategory || 'all'}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pb-16"
        style={{ position: 'relative', zIndex: 5, pointerEvents: 'auto' }}
      >
        <ProductsGrid categoryFilter={activeCategory} />
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">FRUITSTAND</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Premium streetwear and lifestyle apparel designed for the modern individual.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
              <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</a>
              <a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
              <a href="/shipping" className="text-gray-600 hover:text-gray-900 transition-colors">Shipping</a>
              <a href="/returns" className="text-gray-600 hover:text-gray-900 transition-colors">Returns</a>
              <a href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</a>
            </div>

            {/* Social Media */}
            <div className="flex justify-center gap-6 mb-8">
              <a href="https://instagram.com" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.004 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z"/>
                </svg>
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://facebook.com" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-200 pt-8">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Fruitstand. All rights reserved.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Designed and crafted with care in New York, NY
              </p>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* StaggeredMenu Component */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 10001, pointerEvents: menuOpen ? "auto" : "none" }}>
        <StaggeredMenu
          position="right"
          colors={['#18191a', '#232324']}
          className="custom-staggered-menu"
          items={[
            { label: "Home", ariaLabel: "Go to homepage", link: "/" },
            { label: "Collections", ariaLabel: "Browse collections", link: "/shop" },
            { label: "Cart", ariaLabel: "View your cart", link: "/cart" },
            { label: "Contact", ariaLabel: "Contact us", link: "/contact" },
            { label: "Sign In/Sign Up", ariaLabel: "Sign in to your account", link: "/auth/signin" }
          ]}
          socialItems={[
            { label: "Instagram", link: "https://instagram.com" },
            { label: "Twitter", link: "https://twitter.com" }
          ]}
          displaySocials={true}
          displayItemNumbering={true}
          logoUrl="/images/Fruitscale Logo.png"
          menuButtonColor="#000"
          openMenuButtonColor="#000"
          changeMenuColorOnOpen={false}
          accentColor="#ff6b6b"
          onMenuOpen={() => {setMenuOpen(true)}}
          onMenuClose={() => setMenuOpen(false)}
        />
      </div>

      {/* Custom styles for StaggeredMenu visibility */}
      <style jsx>{`
        /* Ensure menu button header is always clickable */
        .custom-staggered-menu .staggered-menu-header {
          pointer-events: auto !important;
          position: relative !important;
          z-index: 10003 !important;
        }

        .custom-staggered-menu .sm-toggle {
          background: rgba(255, 255, 255, 0.9) !important;
          border: 2px solid rgba(0, 0, 0, 0.1) !important;
          color: #000 !important;
          border-radius: 12px !important;
          min-width: 80px !important;
          height: 44px !important;
          backdrop-filter: blur(10px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          padding: 0 16px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.3s ease !important;
          pointer-events: auto !important;
          cursor: pointer !important;
        }

        .custom-staggered-menu .sm-toggle:hover {
          background: rgba(255, 255, 255, 1) !important;
          border-color: rgba(0, 0, 0, 0.2) !important;
          transform: scale(1.05) !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
        }

        .custom-staggered-menu[data-open] .sm-toggle {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.9) !important;
          color: white !important;
        }

        /* When menu is open, allow interactions with the menu panel */
        .custom-staggered-menu[data-open] {
          pointer-events: auto !important;
        }
        
        /* Force all menu components to be clickable */
        .custom-staggered-menu * {
          pointer-events: auto !important;
        }
        
        /* Override for non-interactive areas when menu is closed */
        .custom-staggered-menu:not([data-open]) .staggered-menu-panel {
          pointer-events: none !important;
        }

        @media (max-width: 768px) {
          .custom-staggered-menu .sm-toggle {
            min-width: 60px !important;
            height: 36px !important;
            font-size: 12px !important;
            padding: 0 12px !important;
          }
        }

        @media (max-width: 480px) {
          .custom-staggered-menu .sm-toggle {
            min-width: 50px !important;
            height: 32px !important;
            font-size: 11px !important;
            padding: 0 10px !important;
          }
        }
        
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
            padding: 8px 16px;
            font-size: 14px;
          }
        }
        
        @media (max-width: 480px) {
          .category-pill {
            padding: 6px 12px;
            font-size: 13px;
            min-width: fit-content;
          }
        }
      `}</style>
    </div>
  )
}
