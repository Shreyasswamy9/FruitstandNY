"use client"

import { useState } from "react"
import StaggeredMenu from "../../components/StagerredMenu"
import { motion } from "framer-motion"
import { useCart } from "../../components/CartContext"

export default function CartPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { items, removeFromCart, clearCart } = useCart();

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      <motion.div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 5 }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg">Your cart is currently empty</p>
              <p className="text-gray-500 mt-2">Add some items to get started!</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8">
              <ul className="divide-y divide-gray-200">
                {items.map(item => (
                  <li key={item.productId} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <div className="font-semibold text-lg">{item.name}</div>
                        <div className="text-gray-500 text-sm">${item.price} × {item.quantity}</div>
                      </div>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-8">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
                <div className="text-xl font-bold">
                  Total: ${items.reduce((sum, i) => sum + i.price * i.quantity, 0)}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

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
          onMenuOpen={() => setMenuOpen(true)}
          onMenuClose={() => setMenuOpen(false)}
        />
        
        {/* Image Placeholder - positioned over the menu panel */}
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "clamp(20px, 4vw, 60px)",
              transform: "translateY(-50%)",
              width: "clamp(200px, 25vw, 350px)",
              height: "clamp(150px, 20vh, 300px)",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "clamp(12px, 3vw, 24px)",
              border: "2px dashed rgba(255, 255, 255, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(12px, 2vw, 16px)",
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: "300",
              textAlign: "center",
              padding: "clamp(16px, 4vw, 32px)",
              backdropFilter: "blur(10px)",
              zIndex: 10002,
            }}
          >
            Featured Collection Image
          </div>
        )}
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
      `}</style>
    </div>
  )
}
