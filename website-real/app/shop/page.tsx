"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import ProductsGrid from "../../components/ProductsGridHome"
import BundleSheet from "../../components/BundleSheet"

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
