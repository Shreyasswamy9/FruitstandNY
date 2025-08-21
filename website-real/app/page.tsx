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
    imageRefs.current.forEach((img, i) => {
      if (img) {
        animate(img, {
          opacity: [0, 1],
          translateX: [-80, 0 + i * 28],
          rotate: -8 + i * 8,
          scale: [0.92, 1 + i * 0.04],
          duration: 500 + i * 100,
          easing: "easeOutExpo",
          delay: i * 50,
        })
      }
    })
  }, [hoveredNav])

  return (
    <div style={{ position: "relative", width: 520, height: 620 }}>
      {photos.map((src: string, i: number) => (
        <img
          key={src}
          ref={(el) => {
            imageRefs.current[i] = el
          }}
          src={src || "/placeholder.svg"}
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
            transform: `translateX(-80px) skewY(-6deg) rotate(${-8 + i * 8}deg) scale(0.92)`,
          }}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [showMain, setShowMain] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredNav, setHoveredNav] = useState<NavType | null>(null)
  const [menuButtonState, setMenuButtonState] = useState<"burger" | "close">("burger")
  const secondVideoRef = useRef<HTMLVideoElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  const [currentFontIndex, setCurrentFontIndex] = useState(0)
  const [showFontFlip, setShowFontFlip] = useState(true)

  const fonts = [
    "Arial, sans-serif",
    "Georgia, serif",
    "Courier New, monospace",
    "Impact, sans-serif",
    "Times New Roman, serif",
    "Helvetica, sans-serif",
    "Verdana, sans-serif",
  ]

  const fruitColors = [
    "#FF6B6B", // F - Strawberry red
    "#FF8E53", // R - Orange
    "#4ECDC4", // U - Mint green
    "#45B7D1", // I - Blueberry blue
    "#96CEB4", // T - Lime green
    "#FFEAA7", // S - Banana yellow
    "#DDA0DD", // T - Grape purple
    "#FF7675", // A - Apple red
    "#74B9FF", // N - Berry blue
    "#00B894", // D - Avocado green
  ]

  // Handle menu open/close with animation
  const openMenu = () => {
    setMenuOpen(true)
    setMenuButtonState("close")

    // Animate menu button to close icon
    if (menuButtonRef.current) {
      animate(menuButtonRef.current, {
        rotate: [0, 180],
        scale: [1, 1.1, 1],
        duration: 400,
        easing: "easeOutBack",
      })
    }

    // Animate menu overlay in
    if (menuRef.current) {
      animate(menuRef.current, {
        opacity: [0, 1],
        duration: 600,
        easing: "easeInOutQuad",
        complete: () => {
          // Stagger animate menu items
          menuItemsRef.current.forEach((item, i) => {
            if (item) {
              animate(item, {
                opacity: [0, 1],
                translateY: [40, 0],
                scale: [0.8, 1],
                duration: 500,
                easing: "easeOutBack",
                delay: i * 100,
              })
            }
          })
        },
      })
    }
  }

  const closeMenu = () => {
    setMenuButtonState("burger")

    // Animate menu items out first
    menuItemsRef.current.forEach((item, i) => {
      if (item) {
        animate(item, {
          opacity: [1, 0],
          translateY: [0, -20],
          scale: [1, 0.9],
          duration: 300,
          easing: "easeInBack",
          delay: (menuItemsRef.current.length - 1 - i) * 50, // Reverse order
        })
      }
    })

    // Animate menu button back to burger
    if (menuButtonRef.current) {
      animate(menuButtonRef.current, {
        rotate: [180, 360],
        scale: [1, 0.9, 1],
        duration: 400,
        easing: "easeOutBack",
        delay: 200,
      })
    }

    // Animate menu overlay out
    if (menuRef.current) {
      animate(menuRef.current, {
        opacity: [1, 0],
        duration: 400,
        easing: "easeInOutQuad",
        delay: 300,
        complete: () => {
          setMenuOpen(false)
        },
      })
    }
  }

  // Handle navigation clicks
  const handleNavClick = (navItem: string) => {
    // Add a small delay before closing to show the selection
    setTimeout(() => {
      closeMenu()
    }, 200)

    switch (navItem) {
      case "SHOP":
        console.log("🛍️ Opening Shop - Browse our fruit collection!")
        router.push("/shop")
        break
      case "ACCOUNT":
        console.log("👤 Account accessed")
        router.push("/account")
        break
      case "CART":
        console.log("🛒 Cart opened")
        router.push("/cart")
        break
      case "CONTACT":
        console.log("📞 Contact page accessed")
        router.push("/contact")
        break
      default:
        console.log(`Navigating to ${navItem}`)
    }
  }

  useEffect(() => {
    const animateLanding = () => {
      if (titleRef.current && showFontFlip) {
        let flipCount = 0
        const maxFlips = 20

        const fontFlipInterval = setInterval(() => {
          setCurrentFontIndex((prev) => (prev + 1) % fonts.length)
          flipCount++

          if (flipCount >= maxFlips) {
            clearInterval(fontFlipInterval)
            setShowFontFlip(false)

            // Start the fade-in animation after font flipping
            setTimeout(() => {
              if (logoRef.current) {
                animate(logoRef.current, {
                  opacity: [0, 1],
                  scale: [0.8, 1],
                  duration: 1500,
                  easing: "easeOutQuart",
                  delay: 500,
                })
              }

              // Fade in subtitle after logo
              setTimeout(() => {
                if (subtitleRef.current) {
                  animate(subtitleRef.current, {
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 1000,
                    easing: "easeOutQuart",
                  })
                }
              }, 1500)

              // Auto transition to main content
              setTimeout(() => {
                if (logoRef.current) {
                  animate(logoRef.current, {
                    opacity: [1, 0],
                    scale: [1, 1.1],
                    duration: 800,
                    easing: "easeInQuart",
                  })
                }
                if (subtitleRef.current) {
                  animate(subtitleRef.current, {
                    opacity: [1, 0],
                    translateY: [0, -20],
                    duration: 800,
                    easing: "easeInQuart",
                  })
                }

                setTimeout(() => {
                  setShowMain(true)
                }, 800)
              }, 4000)
            }, 500)
          }
        }, 100) // Flip every 100ms
      }
    }

    animateLanding()
  }, [fonts.length, showFontFlip])

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
            background: "#fff",
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
              opacity: showFontFlip ? 1 : 0,
              transform: "scale(0.8)",
            }}
          >
            <h1
              ref={titleRef}
              style={{
                fontSize: "4rem",
                fontWeight: "300",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                margin: "0 0 40px 0",
                fontFamily: showFontFlip ? fonts[currentFontIndex] : "Arial, sans-serif",
                textAlign: "center",
                transition: showFontFlip ? "font-family 0.1s ease" : "none",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {"FRUITSTAND".split("").map((letter, index) => (
                <span
                  key={index}
                  style={{
                    color: fruitColors[index],
                    transition: showFontFlip ? "color 0.1s ease" : "none",
                  }}
                >
                  {letter}
                </span>
              ))}
            </h1>
          </div>

          {/* Minimal subtitle */}
          <p
            ref={subtitleRef}
            style={{
              fontSize: "1rem",
              color: "rgba(0, 0, 0, 0.6)",
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
          position: showMain ? "sticky" : "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          opacity: showMain ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "3px solid rgba(0, 0, 0, 0.3)",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 0 30px rgba(0, 0, 0, 0.1), inset 0 0 30px rgba(0, 0, 0, 0.05)",
            backdropFilter: "blur(1px)",
          }}
        >
          <video
            ref={secondVideoRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
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
      </div>

      {/* Main website content goes here, scrollable */}
      <div style={{ position: "relative", zIndex: 2, marginTop: showMain ? "40vh" : "0" }}>
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
                background: "linear-gradient(120deg, #232323 0%, #b71c1c 100%)",
                opacity: 1, // Start visible, let anime.js handle the fade
              }}
            >
              {/* Left: Animated, skewed, fanned photos */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <PhotoGroup hoveredNav={hoveredNav} />
              </div>
              {/* Right: Navigation buttons */}
              <div
                style={{
                  width: 400,
                  minWidth: 220,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  paddingRight: 60,
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
