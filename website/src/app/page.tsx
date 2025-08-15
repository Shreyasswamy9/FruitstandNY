"use client";

import { animate } from 'animejs';
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
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  
  useEffect(() => {
    // Animate images when hoveredNav changes
    imageRefs.current.forEach((img, i) => {
      if (img) {
        animate(img, {
          opacity: [0, 1],
          translateX: [-80, 0 + i * 28],
          rotate: -8 + i * 8,
          scale: [0.92, 1 + i * 0.04],
          duration: 500 + i * 100,
          easing: 'easeOutExpo',
          delay: i * 50
        });
      }
    });
  }, [hoveredNav]);

  return (
    <div style={{ position: "relative", width: 520, height: 620 }}>
      {photos.map((src: string, i: number) => (
        <img
          key={src}
          ref={el => { imageRefs.current[i] = el; }}
          src={src}
          alt={`Product image ${i + 1}`}
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
            opacity: 0,
            transform: `translateX(-80px) skewY(-6deg) rotate(${-8 + i * 8}deg) scale(0.92)`
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [showMain, setShowMain] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<NavType | null>(null);
  const [menuButtonState, setMenuButtonState] = useState<'burger' | 'close'>('burger');
  const [currentPage, setCurrentPage] = useState<string>('HOME');
  const secondVideoRef = useRef<HTMLVideoElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const scrollTextRef = useRef<HTMLDivElement>(null);

  // Handle menu open/close with animation
  const openMenu = () => {
    setMenuOpen(true);
    setMenuButtonState('close');
    
    // Animate menu button to close icon
    if (menuButtonRef.current) {
      animate(menuButtonRef.current, {
        rotate: [0, 180],
        scale: [1, 1.1, 1],
        duration: 400,
        easing: 'easeOutBack'
      });
    }
    
    // Animate menu overlay in
    if (menuRef.current) {
      animate(menuRef.current, {
        opacity: [0, 1],
        duration: 600,
        easing: 'easeInOutQuad',
        complete: () => {
          // Stagger animate menu items
          menuItemsRef.current.forEach((item, i) => {
            if (item) {
              animate(item, {
                opacity: [0, 1],
                translateY: [40, 0],
                scale: [0.8, 1],
                duration: 500,
                easing: 'easeOutBack',
                delay: i * 100
              });
            }
          });
        }
      });
    }
  };
  
  const closeMenu = () => {
    setMenuButtonState('burger');
    
    // Animate menu items out first
    menuItemsRef.current.forEach((item, i) => {
      if (item) {
        animate(item, {
          opacity: [1, 0],
          translateY: [0, -20],
          scale: [1, 0.9],
          duration: 300,
          easing: 'easeInBack',
          delay: (menuItemsRef.current.length - 1 - i) * 50 // Reverse order
        });
      }
    });
    
    // Animate menu button back to burger
    if (menuButtonRef.current) {
      animate(menuButtonRef.current, {
        rotate: [180, 360],
        scale: [1, 0.9, 1],
        duration: 400,
        easing: 'easeOutBack',
        delay: 200
      });
    }
    
    // Animate menu overlay out
    if (menuRef.current) {
      animate(menuRef.current, {
        opacity: [1, 0],
        duration: 400,
        easing: 'easeInOutQuad',
        delay: 300,
        complete: () => {
          setMenuOpen(false);
        }
      });
    }
  };

  // Handle navigation clicks
  const handleNavClick = (navItem: string) => {
    setCurrentPage(navItem);
    
    // Add a small delay before closing to show the selection
    setTimeout(() => {
      closeMenu();
    }, 200);
    
    // Placeholder actions for each nav item
    switch(navItem) {
      case 'SHOP':
        console.log('🛍️ Opening Shop - Browse our fruit collection!');
        alert('🛍️ Shop: Welcome to our fruit collection! (Placeholder)');
        break;
      case 'ACCOUNT':
        console.log('👤 Account accessed');
        alert('👤 Account: Login/Register page (Placeholder)');
        break;
      case 'CART':
        console.log('🛒 Cart opened');
        alert('🛒 Cart: Your shopping cart is empty (Placeholder)');
        break;
      case 'CONTACT':
        console.log('📞 Contact page accessed');
        alert('📞 Contact: Get in touch with FruitstandNY! (Placeholder)');
        break;
      default:
        console.log(`Navigating to ${navItem}`);
    }
  };

  useEffect(() => {
    // Slot machine roll animation for each letter
    const animateLanding = () => {
      // Animate each letter with slot machine roll effect
      if (lettersRef.current.length > 0) {
        lettersRef.current.forEach((letter, i) => {
          if (letter) {
            // First make visible
            animate(letter, {
              opacity: [0, 1],
              duration: 200,
              delay: i * 100
            });
            
            // Slot machine roll effect
            animate(letter, {
              translateY: [50, -150, -100, -50, 0], // Multiple bounces like slot machine
              duration: 800,
              easing: 'easeOutBounce',
              delay: i * 100 + 200
            });
            
            // Font weight animation to bold (simulate different characters rolling)
            animate(letter, {
              fontWeight: [300, 400, 500, 600, 700, 800, 900, 700], // Roll through weights
              duration: 600,
              easing: 'easeInOutQuart',
              delay: i * 100 + 400
            });
            
            // Font family cycling for slot machine effect
            const fonts = [
              'Arial, sans-serif',
              'Times New Roman, serif', 
              'Courier New, monospace',
              'Georgia, serif',
              'Verdana, sans-serif',
              'Impact, sans-serif',
              'Comic Sans MS, cursive',
              'Inter, sans-serif' // Final font
            ];
            
            // Animate through different fonts
            fonts.forEach((font, fontIndex) => {
              setTimeout(() => {
                if (letter) {
                  letter.style.fontFamily = font;
                }
              }, (i * 100 + 300) + (fontIndex * 75)); // Cycle through fonts during roll
            });
            
            // Final settle with slight scale effect
            animate(letter, {
              scale: [1, 1.1, 1],
              duration: 300,
              easing: 'easeOutBack',
              delay: i * 100 + 1000
            });
          }
        });
      }
      
      // Animate subtitle after all letters settle
      setTimeout(() => {
        if (subtitleRef.current) {
          animate(subtitleRef.current, {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            easing: 'easeOutQuart'
          });
        }
      }, lettersRef.current.length * 100 + 1500);
      
      // Show scroll indicator last
      setTimeout(() => {
        if (scrollTextRef.current) {
          animate(scrollTextRef.current, {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutQuart',
            complete: () => {
              // Auto transition after animation completes
              setTimeout(() => {
                setShowMain(true);
              }, 2000);
            }
          });
        }
      }, lettersRef.current.length * 100 + 2500);
    };

    // Start animation immediately when component mounts
    animateLanding();
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100vw", background: "#000", zIndex: 9999, overflow: "auto" }}>
      {/* Add pulse animation style */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
          .pulse-line {
            animation: pulse 3s infinite ease-in-out;
          }
        `
      }} />
      
      {/* Animated Text Landing */}
      {!showMain && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "#000", // Pure black like aanstekelijk
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10001
        }}>
          {/* Main Title with Individual Letters - slot machine style */}
          <h1 
            ref={titleRef}
            style={{
              fontSize: "3.5rem", // Reduced from 5rem
              fontWeight: "400",
              letterSpacing: "0.2em", // Reduced from 0.8em
              textTransform: "uppercase",
              margin: "0 0 60px 0",
              display: "flex",
              justifyContent: "center",
              fontFamily: "Arial, sans-serif",
              flexWrap: "wrap" // Allow wrapping on smaller screens
            }}
          >
            {["F", "R", "U", "I", "T", "S", "T", "A", "N", "D"].map((letter, i) => (
              <span
                key={i}
                ref={el => { lettersRef.current[i] = el; }}
                style={{
                  display: "inline-block",
                  color: "#fff",
                  margin: "0 0.1em", // Reduced spacing
                  opacity: 0,
                  fontWeight: "300", // Start light, will animate to bold
                  transform: "translateY(50px)",
                  overflow: "hidden",
                  position: "relative"
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
          
          {/* Subtitle - minimal and clean */}
          <p 
            ref={subtitleRef}
            style={{
              fontSize: "1.2rem",
              color: "rgba(255, 255, 255, 0.7)",
              textAlign: "center",
              opacity: 0,
              transform: "translateY(20px)",
              fontWeight: "300",
              letterSpacing: "0.2em",
              margin: "0 0 120px 0",
              textTransform: "uppercase",
              fontFamily: "Arial, sans-serif"
            }}
          >
            Fresh Organic Local
          </p>
          
          {/* Scroll Indicator - minimal like aanstekelijk */}
          <div 
            ref={scrollTextRef}
            style={{
              position: "absolute",
              bottom: "60px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "0.9rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              opacity: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
              fontFamily: "Arial, sans-serif"
            }}
          >
            <span>Scroll Down</span>
            <div 
              className="pulse-line"
              style={{
                width: "1px",
                height: "40px",
                background: "rgba(255, 255, 255, 0.3)"
              }} 
            />
          </div>
          </div>
        )}
      
      {/* Background video (always playing) */}
      <video
        ref={secondVideoRef}
        style={{ 
          width: "100vw", 
          height: "100vh", 
          objectFit: "cover", 
          position: "fixed", 
          top: 0, 
          left: 0, 
          zIndex: 1, 
          pointerEvents: "none",
          opacity: showMain ? 1 : 0,
          transition: "opacity 1.5s ease-in-out"
        }}
        autoPlay
        muted
        playsInline
        preload="auto"
        loop
      >
        <source src="https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/Videos/websitebackgroundfinal.mp4" type="video/mp4" />
      </video>
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
          {/* Animated Menu Button */}
             <div style={{ position: "fixed", top: 20, right: 20, zIndex: 10001 }}>
               <button 
                 ref={menuButtonRef}
                 style={{ 
                   width: 60,
                   height: 60,
                   background: "rgba(255, 255, 255, 0.1)", 
                   border: "2px solid rgba(255, 255, 255, 0.3)",
                   borderRadius: "50%",
                   cursor: "pointer",
                   display: "flex",
                   flexDirection: "column",
                   alignItems: "center",
                   justifyContent: "center",
                   gap: "4px",
                   backdropFilter: "blur(10px)",
                   transition: "all 0.3s ease",
                   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
                 }} 
                 onClick={openMenu}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                   e.currentTarget.style.transform = "scale(1.05)";
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                   e.currentTarget.style.transform = "scale(1)";
                 }}
               >
                 {/* Hamburger lines */}
                 <div style={{
                   width: "24px",
                   height: "2px",
                   background: "white",
                   borderRadius: "2px",
                   transform: menuButtonState === 'close' ? 'rotate(45deg) translateY(6px)' : 'none',
                   transition: "all 0.3s ease"
                 }} />
                 <div style={{
                   width: "24px",
                   height: "2px",
                   background: "white",
                   borderRadius: "2px",
                   opacity: menuButtonState === 'close' ? 0 : 1,
                   transition: "all 0.3s ease"
                 }} />
                 <div style={{
                   width: "24px",
                   height: "2px",
                   background: "white",
                   borderRadius: "2px",
                   transform: menuButtonState === 'close' ? 'rotate(-45deg) translateY(-6px)' : 'none',
                   transition: "all 0.3s ease"
                 }} />
               </button>
             </div>
             {/* Simple crossfade menu overlay, no blocks */}
             {/* Menu Overlay (crossfade only) */}
             {menuOpen && (
               <div
                 ref={menuRef}
                 style={{
                   position: "fixed",
                   top: 0,
                   left: 0,
                   width: "100vw",
                   height: "100vh",
                   zIndex: 20002,
                   display: "flex",
                   background: "linear-gradient(120deg, #232323 0%, #b71c1c 100%)",
                   opacity: 1 // Start visible, let anime.js handle the fade
                 }}
               >
                 {/* Left: Animated, skewed, fanned photos */}
                 <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                   <PhotoGroup hoveredNav={hoveredNav} />
                 </div>
                 {/* Right: Navigation buttons */}
                 <div style={{ width: 400, minWidth: 220, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", paddingRight: 60 }}>
                   {["SHOP", "ACCOUNT", "CART", "CONTACT"].map((nav, index) => (
                     <button
                       key={nav}
                       ref={el => { menuItemsRef.current[index] = el; }}
                       style={{
                         margin: "18px 0",
                         padding: "18px 38px",
                         fontSize: 28,
                         fontWeight: "bold",
                         background: currentPage === nav ? "#4CAF50" : (hoveredNav === nav ? "#fff" : "#f5f5f5"),
                         color: currentPage === nav ? "#fff" : "#333",
                         border: currentPage === nav ? "2px solid #45a049" : "none",
                         borderRadius: 12,
                         boxShadow: hoveredNav === nav ? "0 8px 32px rgba(255,255,255,0.3)" : "0 4px 16px rgba(0,0,0,0.2)",
                         cursor: "pointer",
                         transition: "all 0.3s ease",
                         opacity: 1, // Start visible, let anime.js animate
                         transform: "translateY(0px) scale(1)" // Start in final position
                       }}
                       onMouseEnter={() => setHoveredNav(nav as NavType)}
                       onMouseLeave={() => setHoveredNav(null)}
                       onClick={() => handleNavClick(nav)}
                     >
                       {nav === 'SHOP' && '🛍️ '}
                       {nav === 'ACCOUNT' && '👤 '}
                       {nav === 'CART' && '🛒 '}
                       {nav === 'CONTACT' && '📞 '}
                       {nav}
                       {currentPage === nav && ' ✓'}
                     </button>
                   ))}
                   <button 
                     ref={el => { menuItemsRef.current[4] = el; }}
                     style={{ 
                       marginTop: 40, 
                       padding: "12px 28px", 
                       fontSize: 18,
                       background: "rgba(255, 255, 255, 0.1)",
                       color: "white",
                       border: "2px solid rgba(255, 255, 255, 0.3)",
                       borderRadius: 25,
                       cursor: "pointer",
                       backdropFilter: "blur(10px)",
                       transition: "all 0.3s ease",
                       opacity: 1, // Start visible for close button too
                       transform: "translateY(0px) scale(1)"
                     }} 
                     onClick={closeMenu}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                       e.currentTarget.style.transform = "scale(1.05)";
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                       e.currentTarget.style.transform = "scale(1)";
                     }}
                   >
                     ✕ Close
                   </button>
                 </div>
               </div>
             )}
        </>
      )}
      {/* Main website content goes here, scrollable */}
      <div style={{ position: "relative", zIndex: 2, marginTop: "100vh" }}>
        {/* Example content, replace with your actual site */}
        <div style={{ minHeight: "200vh", color: "white", padding: "40px", background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)" }}>
          <div style={{ 
            maxWidth: "1200px", 
            margin: "0 auto",
            textAlign: "center",
            paddingTop: "80px"
          }}>
            <h2 style={{ 
              fontSize: "3rem", 
              marginBottom: "20px",
              background: "linear-gradient(135deg, #ff6b6b, #4ecdc4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Welcome to FruitstandNY
            </h2>
            <p style={{ fontSize: "1.2rem", marginBottom: "40px", opacity: 0.8 }}>
              Current Page: <strong style={{ color: "#4CAF50" }}>{currentPage}</strong>
            </p>
            <div style={{
              padding: "40px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              backdropFilter: "blur(10px)",
              margin: "40px 0"
            }}>
              {currentPage === 'HOME' && (
                <div>
                  <h3>🏠 Home</h3>
                  <p>Welcome to our fresh fruit experience! Scroll down to explore or use the menu to navigate.</p>
                </div>
              )}
              {currentPage === 'SHOP' && (
                <div>
                  <h3>🛍️ Shop</h3>
                  <p>Browse our collection of fresh, organic fruits sourced directly from local farms.</p>
                  <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
                    <div style={{ padding: "20px", background: "rgba(255,255,255,0.1)", borderRadius: "10px" }}>🍎 Apples</div>
                    <div style={{ padding: "20px", background: "rgba(255,255,255,0.1)", borderRadius: "10px" }}>🍊 Oranges</div>
                    <div style={{ padding: "20px", background: "rgba(255,255,255,0.1)", borderRadius: "10px" }}>🍌 Bananas</div>
                  </div>
                </div>
              )}
              {currentPage === 'ACCOUNT' && (
                <div>
                  <h3>👤 Account</h3>
                  <p>Login to your account or create a new one to track orders and save favorites.</p>
                  <div style={{ marginTop: "20px" }}>
                    <button style={{ padding: "10px 20px", margin: "0 10px", borderRadius: "5px", border: "none", background: "#4CAF50", color: "white" }}>Login</button>
                    <button style={{ padding: "10px 20px", margin: "0 10px", borderRadius: "5px", border: "2px solid #4CAF50", background: "transparent", color: "#4CAF50" }}>Sign Up</button>
                  </div>
                </div>
              )}
              {currentPage === 'CART' && (
                <div>
                  <h3>🛒 Cart</h3>
                  <p>Your shopping cart is currently empty. Add some fresh fruits to get started!</p>
                  <div style={{ marginTop: "20px", padding: "20px", background: "rgba(255,255,255,0.05)", borderRadius: "10px" }}>
                    <p>Cart Total: $0.00</p>
                    <button style={{ padding: "10px 20px", borderRadius: "5px", border: "none", background: "#4CAF50", color: "white" }}>Continue Shopping</button>
                  </div>
                </div>
              )}
              {currentPage === 'CONTACT' && (
                <div>
                  <h3>📞 Contact</h3>
                  <p>Get in touch with FruitstandNY! We&apos;d love to hear from you.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
                    <div>
                      <p>📧 Email: hello@fruitstandny.com</p>
                      <p>📱 Phone: (555) 123-FRUIT</p>
                    </div>
                    <div>
                      <p>🏪 Visit our store in NYC</p>
                      <p>🚚 Free delivery within 5 miles</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}