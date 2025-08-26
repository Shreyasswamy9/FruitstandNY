/* eslint-disable @next/next/no-img-element */
"use client"

import { animate } from "animejs"
import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const navPhotos = {
  SHOP: ["/images/shop.jpg"],
  ACCOUNT: ["/images/home.jpg"],
  CART: ["/images/cart.webp"],
  CONTACT: ["/images/contact.jpeg"],
}

type NavType = "SHOP" | "ACCOUNT" | "CART" | "CONTACT"
interface PhotoGroupProps {
  hoveredNav: NavType | null
}
function PhotoGroup({ hoveredNav }: PhotoGroupProps) {
  const photos = hoveredNav && navPhotos[hoveredNav as NavType] ? navPhotos[hoveredNav as NavType] : navPhotos["SHOP"]
  const imageRefs = useRef<(HTMLImageElement | null)[]>([])

  useEffect(() => {
    // Animate images when hoveredNav changes
    imageRefs.current.forEach((img: HTMLImageElement | null, i: number) => {
      if (img) {
        animate(img, {
          opacity: [0, 1],
            scale: [0.92, 1.08],
          duration: 500 + i * 100,
          easing: "easeOutExpo",
          delay: i * 50,
        })
      }
    })
  }, [hoveredNav])

  return (
    <div
      style={{
        position: "relative",
        width: "clamp(400px, 40vw, 900px)",
        height: "clamp(480px, 60vw, 1200px)",
      }}
    >
      {photos.map((src: string, i: number) => (
        <img
          key={src}
          ref={(el) => {
            imageRefs.current[i] = el
          }}
          src={src || "/placeholder.svg"}
          alt={`Product image ${i + 1}`}
          style={{
            width: "clamp(400px, 55vw, 900px)",
            height: "clamp(400px, 55vw, 900px)",
            objectFit: "cover",
            borderRadius: 64,
            boxShadow: "0 16px 48px #aaa",
            zIndex: 10 + i,
            opacity: 0,
              transform: `translateX(-80px) scale(0.92)`,
          }}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const [showMain, setShowMain] = useState(false)
  // Show scroll arrow after 5 seconds when main video is visible
  useEffect(() => {
    let arrowTimeout: NodeJS.Timeout;
    if (showMain) {
      arrowTimeout = setTimeout(() => {
        setShowScrollArrow(true);
      }, 5000);
    } else {
      setShowScrollArrow(false);
    }
    return () => {
      if (arrowTimeout) clearTimeout(arrowTimeout);
    };
  }, [showMain]);
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredNav, setHoveredNav] = useState<NavType | null>(null)
  const [menuButtonState, setMenuButtonState] = useState<"burger" | "close">("burger")
  const secondVideoRef = useRef<HTMLVideoElement>(null)

  // Ensure video autoplays on all browsers after intro
  useEffect(() => {
    if (showMain && secondVideoRef.current) {
      const video = secondVideoRef.current;
      video.muted = true;
      video.playsInline = true;
      // Wait for the video to be visible, then play
      setTimeout(() => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setTimeout(() => {
              video.play();
            }, 500);
          });
        }
      }, 100); // slight delay to ensure visibility
    }
  }, [showMain]);

  // Ensure Safari autoplay works by programmatically playing the video if needed
  useEffect(() => {
    if (secondVideoRef.current) {
      const video = secondVideoRef.current;
      // Safari requires muted for autoplay
      video.muted = true;
      // Try to play programmatically
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If autoplay fails, try again after a short delay
          setTimeout(() => {
            video.play();
          }, 500);
        });
      }
    }
  }, [showMain]);
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  const [currentLangIndex, setCurrentLangIndex] = useState(0)
  const [showLangFlip, setShowLangFlip] = useState(true)

  // Translations for 'Fruitstand' in different languages
  const fruitstandTranslations = [
    "Fruitstand", // English
    "水果摊",      // Chinese
    "Frutaria",   // Portuguese
    "Frutería",   // Spanish
    "फलस्टैंड",   // Hindi
    "Stall de fruits", // French
    "Obststand",  // German
    "Fruttivendolo", // Italian
    "フルーツスタンド", // Japanese
    "فروٹ اسٹینڈ", // Urdu
  ];

  useEffect(() => {
    if (titleRef.current && showLangFlip) {
      let flipCount = 0;
      const maxFlips = fruitstandTranslations.length * 2;
      const langFlipInterval = setInterval(() => {
        setCurrentLangIndex((prev: number) => (prev + 1) % fruitstandTranslations.length);
        flipCount++;
        if (flipCount >= maxFlips) {
          clearInterval(langFlipInterval);
          setShowLangFlip(false);
          // Immediately start the fade-in animation after language flipping
          if (logoRef.current) {
            animate(logoRef.current, {
              opacity: [0, 1],
              scale: [0.8, 1],
              duration: 600,
              easing: "easeOutQuart",
              delay: 0,
            });
          }
          // Fade in subtitle after logo
          setTimeout(() => {
            if (subtitleRef.current) {
              animate(subtitleRef.current, {
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 1000,
                easing: "easeOutQuart",
              });
            }
          }, 600);
          // Auto transition to main content
          setTimeout(() => {
            if (logoRef.current) {
              animate(logoRef.current, {
                opacity: [1, 0],
                scale: [1, 1.1],
                duration: 800,
                easing: "easeInQuart",
              });
            }
            if (subtitleRef.current) {
              animate(subtitleRef.current, {
                opacity: [1, 0],
                translateY: [0, -20],
                duration: 800,
                easing: "easeInQuart",
              });
            }
            setTimeout(() => {
              setShowMain(true);
            }, 800);
          }, 4000);
        }
      }, 170); // Flip every 600ms
    }
  }, [fruitstandTranslations.length, showLangFlip]);
  // Function to close the menu
  const closeMenu = () => {
    setMenuOpen(false);
    setMenuButtonState("burger");
    setHoveredNav(null);
  };

  // Function to open the menu
  const openMenu = () => {
    setMenuOpen(true);
    setMenuButtonState("close");
  };

  // Handle navigation clicks
  const handleNavClick = (navItem: string) => {
    // Add a small delay before closing to show the selection
    setTimeout(() => {
      closeMenu();
    }, 200);

    switch (navItem) {
      case "SHOP":
        console.log("🛍️ Opening Shop - Browse our fruit collection!");
        router.push("/shop");
        break;
      case "ACCOUNT":
        console.log("👤 Account accessed");
        router.push("/account");
        break;
      case "CART":
        console.log("🛒 Cart opened");
        router.push("/cart");
        break;
      case "CONTACT":
        console.log("📞 Contact page accessed");
        router.push("/contact");
        break;
      default:
        console.log(`Navigating to ${navItem}`);
    }
  };


  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100vw",
        background: "#fff",
        zIndex: 9999,
        overflow: "auto",
      }}
    >
      {!showMain && (
        <div
          style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: `url('/images/black-plain-concrete-textured.jpg') center center / cover no-repeat`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10001,
          }}
        >
          <div
            ref={logoRef}
            style={{
              opacity: showLangFlip ? 1 : 0,
              transform: "scale(0.8)",
            }}
          >
            <h1
              ref={titleRef}
              style={{
                fontSize: "4rem",
                fontWeight: "400",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                margin: "0 0 40px 0",
                color: "#fff",
                textAlign: "center",
                transition: "none",
                display: "flex",
                justifyContent: "center",
                // To customize the font, change the fontFamily below:
                fontFamily: "Arial, Helvetica, sans-serif", // <-- Customize font here
              }}
            >
              {fruitstandTranslations[currentLangIndex]}
            </h1>
          </div>

          {/* Minimal subtitle */}
          <p
            ref={subtitleRef}
            style={{
              fontSize: "1rem",
              color: "rgba(255, 255, 255, 0.6)",
              textAlign: "center",
              opacity: 0,
              transform: "translateY(20px)",
              fontWeight: "300",
              letterSpacing: "0.2em",
              margin: 0,
              textTransform: "uppercase",
              fontFamily: "Arial, sans-serif",
            }}
          >
            New York Streetwear
          </p>
        </div>
      )}

      <div
        style={{
          position: showMain ? "relative" : "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          opacity: showMain ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
          padding: 0,
          margin: 0,
          boxSizing: "border-box",
        }}
      >
        <video
          ref={secondVideoRef}
          style={{
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            display: "block",
            margin: 0,
            padding: 0,
            border: "none",
            borderRadius: 0,
            boxShadow: "none",
          }}
          autoPlay
          muted
          playsInline
          preload="auto"
          loop
        >
          <source
            src="https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/Videos/websitebackgroundfinal.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Scroll Down Arrow */}
      {showScrollArrow && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: 48,
            transform: "translateX(-50%)",
            zIndex: 10,
            pointerEvents: "none",
            animation: "arrowJump 1s infinite",
          }}
        >
          <span
            style={{
              fontSize: 48,
              color: "#ffe066",
              textShadow: "0 2px 12px #232323",
              userSelect: "none",
            }}
          >
            ↓
          </span>
        </div>
      )}

  {/* Main website content goes here, scrollable */}
  <div style={{ position: "relative", zIndex: 2, marginTop: showMain ? "0" : "0" }}>
        {/* Example content, replace with your actual site */}
        <div
          style={{
            minHeight: "100vh",
            color: "black",
            padding: "40px",
            background: "linear-gradient(135deg, #714f4fff, #3c1212ff)",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              textAlign: "center",
              paddingTop: "40px",
            }}
          >
            <h2
              style={{
                fontSize: "3rem",
                marginBottom: "20px",
                background: "linear-gradient(135deg, #ff6b6b, #4ecdc4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Welcome to FruitstandNY
            </h2>
            <div
              style={{
                padding: "40px",
                background: "rgba(141, 97, 97, 0.1)",
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
                margin: "40px 0",
              }}
            >
              <div>
                <h3>🏠 Home</h3>
                <p>
                  Welcome to our fresh fruit experience! Scroll down to explore or use the menu to navigate to different
                  sections of our site.
                </p>
                <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
                  <div style={{ padding: "20px", background: "rgba(255,255,255,0.1)", borderRadius: "10px" }}>
                    🍎 Fresh Fruits
                  </div>
                  <div style={{ padding: "20px", background: "rgba(255,255,255,0.1)", borderRadius: "10px" }}>
                    👕 Streetwear
                  </div>
                  <div style={{ padding: "20px", background: "rgba(255,255,255,0.1)", borderRadius: "10px" }}>
                    🚚 Fast Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top header FRUITSTAND text and menu button only after transition */}
      {showMain && (
        <>
          {/* Header */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10002,
              pointerEvents: "none",
              height: "80px",
            }}
          ></div>
          {/* Animated Menu Button */}
          <div style={{ position: "fixed", top: 20, right: 20, zIndex: 10001 }}>
            <button
              ref={menuButtonRef}
              style={{
                width: 60,
                height: 60,
                background: "rgba(0, 0, 0, 0.1)",
                border: "2px solid rgba(0, 0, 0, 0.3)",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
              onClick={openMenu}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)"
                e.currentTarget.style.transform = "scale(1.05)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)"
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              {/* Hamburger lines */}
              <div
                style={{
                  width: "24px",
                  height: "2px",
                  background: "black",
                  borderRadius: "2px",
                  transform: menuButtonState === "close" ? "rotate(45deg) translateY(6px)" : "none",
                  transition: "all 0.3s ease",
                }}
              />
              <div
                style={{
                  width: "24px",
                  height: "2px",
                  background: "black",
                  borderRadius: "2px",
                  opacity: menuButtonState === "close" ? 0 : 1,
                  transition: "all 0.3s ease",
                }}
              />
              <div
                style={{
                  width: "24px",
                  height: "2px",
                  background: "black",
                  borderRadius: "2px",
                  transform: menuButtonState === "close" ? "rotate(-45deg) translateY(-6px)" : "none",
                  transition: "all 0.3s ease",
                }}
              />
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
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(120deg, #232323 0%, #b71c1c 100%)",
                opacity: 1,
                gap: "60px",
              }}
            >
              {/* Images: Centered */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 320,
                  maxWidth: 600,
                  height: "70vh",
                }}
              >
                <PhotoGroup hoveredNav={hoveredNav} />
              </div>
              {/* Menu: Centered, side by side with images */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: 320,
                  maxWidth: 600,
                  height: "70vh",
                }}
              >
                {["SHOP", "ACCOUNT", "CART", "CONTACT"].map((nav, index) => (
                  <button
                    key={nav}
                    ref={(el) => {
                      menuItemsRef.current[index] = el
                    }}
                    style={{
                      margin: "18px 0",
                      padding: "18px 38px",
                      fontSize: 28,
                      fontWeight: "bold",
                      background: hoveredNav === nav ? "#fff" : "#f5f5f5",
                      color: "#333",
                      border: "none",
                      borderRadius: 12,
                      boxShadow: hoveredNav === nav ? "0 8px 32px rgba(255,255,255,0.3)" : "0 4px 16px rgba(0,0,0,0.2)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      opacity: 1,
                      transform: "translateY(0px) scale(1)",
                    }}
                    onMouseEnter={() => setHoveredNav(nav as NavType)}
                    onMouseLeave={() => setHoveredNav(null)}
                    onClick={() => handleNavClick(nav)}
                  >
                    {nav === "SHOP" && "🛍️ "}
                    {nav === "ACCOUNT" && "👤 "}
                    {nav === "CART" && "🛒 "}
                    {nav === "CONTACT" && "📞 "}
                    {nav}
                  </button>
                ))}
                <button
                  ref={(el) => {
                    menuItemsRef.current[4] = el
                  }}
                  style={{
                    marginTop: 40,
                    padding: "12px 28px",
                    fontSize: 18,
                    background: "rgba(0, 0, 0, 0.1)",
                    color: "black",
                    border: "2px solid rgba(0, 0, 0, 0.3)",
                    borderRadius: 25,
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    opacity: 1,
                    transform: "translateY(0px) scale(1)",
                  }}
                  onClick={closeMenu}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)"
                    e.currentTarget.style.transform = "scale(1.05)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)"
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                >
                  ✕ Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
