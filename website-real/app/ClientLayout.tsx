"use client"

import { CartProvider } from "../components/CartContext"
import StaggeredMenu from "../components/StagerredMenu"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      
      {/* Global StaggeredMenu - appears on ALL pages */}
      <div 
        style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          width: "100vw", 
          height: "100vh", 
          zIndex: 10001, 
          pointerEvents: "none" 
        }}
      >
        <StaggeredMenu
          position="right"
          colors={['#18191a', '#232324']}
          className="custom-staggered-menu"
          items={[
            { label: "Home", ariaLabel: "Go to homepage", link: "/" },
            { label: "Shop", ariaLabel: "Browse products", link: "/shop" },
            { label: "Account", ariaLabel: "Access your account", link: "/account" },
            { label: "Cart", ariaLabel: "View your cart", link: "/cart" },
            { label: "Contact", ariaLabel: "Contact us", link: "/contact" }
          ]}
          socialItems={[
            { label: "Instagram", link: "https://instagram.com" },
            { label: "Twitter", link: "https://twitter.com" }
          ]}
          displaySocials={true}
          displayItemNumbering={true}
          logoUrl="/images/Fruitscale Logo.png"
          menuButtonColor="#000000"
          openMenuButtonColor="#000000"
          changeMenuColorOnOpen={false}
          accentColor="#ff6b6b"
          onMenuOpen={() => {}}
          onMenuClose={() => {}}
        />
      </div>

      {/* Global menu styles */}
      <style jsx global>{`
        .custom-staggered-menu .staggered-menu-header {
          pointer-events: auto !important;
          position: relative !important;
          z-index: 10003 !important;
        }

        .custom-staggered-menu .sm-toggle {
          pointer-events: auto !important;
          background: transparent !important;
          border: none !important;
          color: #000000 !important;
          font-size: 16px !important;
          font-weight: 400 !important;
          padding: 8px 12px !important;
        }

        .custom-staggered-menu:not([data-open]) {
          pointer-events: none !important;
        }

        .custom-staggered-menu:not([data-open]) .staggered-menu-header,
        .custom-staggered-menu:not([data-open]) .sm-toggle {
          pointer-events: auto !important;
        }

        .custom-staggered-menu[data-open] {
          pointer-events: auto !important;
        }

        .custom-staggered-menu[data-open] .staggered-menu-panel {
          pointer-events: auto !important;
        }

        .custom-staggered-menu:not([data-open]) .staggered-menu-panel {
          pointer-events: none !important;
        }

        .custom-staggered-menu[data-open] * {
          pointer-events: auto !important;
        }

        @media (max-width: 768px) {
          .custom-staggered-menu .sm-toggle {
            font-size: 12px !important;
            padding: 0 12px !important;
          }
        }
      `}</style>
    </CartProvider>
  )
}