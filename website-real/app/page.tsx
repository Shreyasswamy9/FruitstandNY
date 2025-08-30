/* eslint-disable @next/next/no-img-element */
"use client"

import { animate } from "animejs"
import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type NavType = "SHOP" | "ACCOUNT" | "CART" | "CONTACT"

export default function Home() {
  const [showScrollArrow, setShowScrollArrow] = useState(false)
  const [showMain, setShowMain] = useState(false)
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const [menuButtonState, setMenuButtonState] = useState<"burger" | "close">("burger")
  const secondVideoRef = useRef<HTMLVideoElement>(null)

  // Comprehensive Safari autoplay fix - tries multiple aggressive techniques
  useEffect(() => {
    if (secondVideoRef.current) {
      const video = secondVideoRef.current
      
      // Force Safari to allow autoplay
      video.muted = true
      video.playsInline = true
      video.setAttribute('webkit-playsinline', 'true')
      video.setAttribute('x-webkit-airplay', 'allow')
      
      // Try multiple autoplay strategies
      const forcePlay = async () => {
        try {
          // Strategy 1: Direct play
          await video.play()
          console.log('Video autoplay succeeded!')
        } catch (e) {
          try {
            // Strategy 2: Wait a bit and try again
            await new Promise(resolve => setTimeout(resolve, 100))
            await video.play()
            console.log('Video autoplay succeeded on retry 1!')
          } catch (e2) {
            try {
              // Strategy 3: Set currentTime and try again
              video.currentTime = 0
              await video.play()
              console.log('Video autoplay succeeded on retry 2!')
            } catch (e3) {
              try {
                // Strategy 4: Load and play
                video.load()
                await video.play()
                console.log('Video autoplay succeeded on retry 3!')
              } catch (e4) {
                // Strategy 5: Final attempt with longer delay
                setTimeout(async () => {
                  try {
                    video.muted = true
                    video.playsInline = true
                    await video.play()
                    console.log('Video autoplay succeeded on final retry!')
                  } catch (e5) {
                    console.log('All autoplay strategies failed')
                  }
                }, 500)
              }
            }
          }
        }
      }
      
      // Try to play immediately
      forcePlay()
      
      // Also try on various video events
      const events = ['loadstart', 'canplay', 'canplaythrough', 'loadedmetadata']
      events.forEach(event => {
        video.addEventListener(event, forcePlay, { once: true })
      })
      
      // Try autoplay when page becomes visible or window gains focus
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          setTimeout(forcePlay, 100)
        }
      }
      
      const handleFocus = () => {
        setTimeout(forcePlay, 100)
      }
      
      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('focus', handleFocus)
      
      // Cleanup
      return () => {
        events.forEach(event => {
          video.removeEventListener(event, forcePlay)
        })
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('focus', handleFocus)
      }
    }
  }, [])

  // Show scroll arrow after 5 seconds when main video is visible
  useEffect(() => {
    let arrowTimeout: NodeJS.Timeout | null = null
    if (showMain) {
      // Try to force video autoplay when main content shows
      if (secondVideoRef.current) {
        const video = secondVideoRef.current
        video.muted = true
        video.playsInline = true
        
        // Aggressive autoplay attempt
        const playVideo = async () => {
          try {
            await video.play()
            console.log('Video autoplay succeeded on showMain!')
          } catch (e) {
            // If failed, try again with delay
            setTimeout(async () => {
              try {
                video.muted = true
                video.playsInline = true
                await video.play()
                console.log('Video autoplay succeeded on showMain retry!')
              } catch (e2) {
                // Final attempt
                setTimeout(async () => {
                  try {
                    video.load()
                    video.muted = true
                    video.playsInline = true
                    await video.play()
                    console.log('Video autoplay succeeded on showMain final retry!')
                  } catch (e3) {
                    console.log('Video autoplay failed on showMain')
                  }
                }, 200)
              }
            }, 100)
          }
        }
        
        playVideo()
      }
      
      arrowTimeout = setTimeout(() => {
        setShowScrollArrow(true)
      }, 5000)
    } else {
      setShowScrollArrow(false)
    }
    return () => {
      if (arrowTimeout) clearTimeout(arrowTimeout)
    }
  }, [showMain])

  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  const [currentLangIndex, setCurrentLangIndex] = useState(0)
  const [showLangFlip, setShowLangFlip] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Translations for 'Fruitstand' in different languages (unchanged)
  const fruitstandTranslations = [
    "Fruitstand", // English
    "水果摊", // Chinese
    "Frutaria", // Portuguese
    "Frutería", // Spanish
    "फलस्टैंड", // Hindi
    "Stall de fruits", // French
    "Obststand", // German
    "Fruttivendolo", // Italian
    "フルーツスタンド", // Japanese
    "فروٹ اسٹینڈ", // Urdu
  ]

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])



  useEffect(() => {
    if (titleRef.current && showLangFlip) {
      let flipCount = 0
      const maxFlips = fruitstandTranslations.length * 2
      const langFlipInterval = setInterval(() => {
        setCurrentLangIndex((prev: number) => (prev + 1) % fruitstandTranslations.length)
        flipCount++
        if (flipCount >= maxFlips) {
          clearInterval(langFlipInterval)
          setShowLangFlip(false)
          // Immediately start the fade-in animation after language flipping
          if (logoRef.current) {
            animate(logoRef.current, {
              opacity: [0, 1],
              scale: [0.8, 1],
              duration: 600,
              easing: "easeOutQuart",
              delay: 0,
            })
          }
          // Fade in subtitle after logo
          const subtitleId = setTimeout(() => {
            if (subtitleRef.current) {
              animate(subtitleRef.current, {
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 1000,
                easing: "easeOutQuart",
              })
            }
          }, 600)

          // Auto transition to main content
          const toMainId = setTimeout(() => {
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
            const showId = setTimeout(() => {
              setShowMain(true)
            }, 800)
            // cleanup nested timeout
            const cleanupShow = () => clearTimeout(showId)
            // return for this nested scope
            return cleanupShow
          }, 4000)

          // Cleanup timeouts if unmounted during sequence
          return () => {
            clearTimeout(subtitleId)
            clearTimeout(toMainId as unknown as number)
          }
        }
      }, 170) // Flip every 170ms (unchanged)
      // Ensure cleanup on unmount even if we didn't reach maxFlips
      return () => clearInterval(langFlipInterval)
    }
  }, [fruitstandTranslations.length, showLangFlip])

  // Function to close the menu
  const closeMenu = () => {
    setMenuOpen(false)
    setMenuButtonState("burger")
  }

  // Function to open the menu
  const openMenu = () => {
    setMenuOpen(true)
    setMenuButtonState("close")
  }

  // Handle navigation clicks (unchanged)
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

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        background: "#fff",
        zIndex: 9999,
        overflow: "hidden",
        overflowY: "auto",
        overflowX: "hidden",
        contain: "paint layout size", // isolate top-level container for smoother paints
      }}
    >
      {!showMain && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            background: `url('/images/black-plain-concrete-textured.jpg') center center / cover no-repeat`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10001,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "opacity, transform",
          }}
        >
          <div
            ref={logoRef}
            style={{
              opacity: showLangFlip ? 1 : 0,
              transform: "scale(0.8) translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              willChange: "transform, opacity",
            }}
          >
            <h1
              ref={titleRef}
              style={{
                fontSize: "clamp(2rem, 8vw, 4rem)",
                fontWeight: "400",
                letterSpacing: "clamp(0.1em, 2vw, 0.3em)",
                textTransform: "uppercase",
                margin: "0 0 clamp(20px, 5vw, 40px) 0",
                color: "#fff",
                textAlign: "center",
                transition: "none",
                display: "flex",
                justifyContent: "center",
                fontFamily: "Arial, Helvetica, sans-serif", // <-- Customize font here
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                padding: "0 clamp(10px, 3vw, 20px)",
                maxWidth: "90vw",
                wordWrap: "break-word",
              }}
            >
              {fruitstandTranslations[currentLangIndex]}
            </h1>
          </div>

          {/* Minimal subtitle */}
          <p
            ref={subtitleRef}
            style={{
              fontSize: "clamp(0.8rem, 3vw, 1rem)",
              color: "rgba(255, 255, 255, 0.6)",
              textAlign: "center",
              opacity: 0,
              transform: "translate3d(0, 20px, 0)",
              fontWeight: "300",
              letterSpacing: "clamp(0.1em, 2vw, 0.2em)",
              margin: 0,
              textTransform: "uppercase",
              fontFamily: "Arial, sans-serif",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              willChange: "transform, opacity",
              padding: "0 clamp(10px, 3vw, 20px)",
              maxWidth: "90vw",
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
          width: "100%",
          height: "100vh",
          zIndex: 1,
          opacity: showMain ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
          padding: 0,
          margin: 0,
          boxSizing: "border-box",
          willChange: "opacity",
        }}
      >
        <video
          ref={secondVideoRef}
          style={{
            width: "100%",
            height: "100vh",
            objectFit: "cover",
            display: "block",
            margin: 0,
            padding: 0,
            border: "none",
            borderRadius: 0,
            boxShadow: "none",
            transform: "translateZ(0)",
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            contain: "paint size",
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
            bottom: "clamp(30px, 8vw, 48px)",
            transform: "translateX(-50%)",
            zIndex: 10,
            pointerEvents: "none",
            animation: "arrowJump 1s infinite",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform, opacity",
          }}
        >
          <span
            style={{
              fontSize: "clamp(32px, 10vw, 48px)",
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
      <div style={{ 
        position: "relative", 
        zIndex: 2, 
        marginTop: showMain ? "0" : "0",
        width: "100%",
        overflowX: "hidden",
        margin: 0,
        padding: 0,
      }}>
        {/* Example content, replace with your actual site */}
        <div
          style={{
            minHeight: "100vh",
            color: "black",
            padding: "clamp(20px, 5vw, 40px)",
            background: "linear-gradient(135deg, #714f4fff, #3c1212ff)",
            margin: 0,
            width: "100%",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              textAlign: "center",
              paddingTop: "clamp(20px, 5vw, 40px)",
              width: "100%",
              boxSizing: "border-box",
              paddingLeft: "clamp(20px, 5vw, 40px)",
              paddingRight: "clamp(20px, 5vw, 40px)",
              position: "relative",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(2rem, 8vw, 3rem)",
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
                padding: "clamp(20px, 5vw, 40px)",
                background: "rgba(141, 97, 97, 0.1)",
                borderRadius: "clamp(10px, 3vw, 20px)",
                backdropFilter: "blur(10px)",
                margin: "clamp(20px, 5vw, 40px) 0",
              }}
            >
              <div>
                <h3 style={{ fontSize: "clamp(1.2rem, 5vw, 1.5rem)" }}>🏠 Home</h3>
                <p style={{ fontSize: "clamp(0.9rem, 3vw, 1rem)", lineHeight: "1.6" }}>
                  Welcome to our fresh fruit experience! Scroll down to explore or use the menu to navigate to different
                  sections of our site.
                </p>
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column",
                  gap: "clamp(10px, 3vw, 20px)", 
                  justifyContent: "center", 
                  marginTop: "20px",
                  flexWrap: "wrap"
                }}>
                  <div style={{ 
                    padding: "clamp(15px, 4vw, 20px)", 
                    background: "rgba(255,255,255,0.1)", 
                    borderRadius: "clamp(8px, 2vw, 10px)",
                    fontSize: "clamp(0.8rem, 3vw, 1rem)"
                  }}>
                    🍎 Fresh Fruits
                  </div>
                  <div style={{ 
                    padding: "clamp(15px, 4vw, 20px)", 
                    background: "rgba(255,255,255,0.1)", 
                    borderRadius: "clamp(8px, 2vw, 10px)",
                    fontSize: "clamp(0.8rem, 3vw, 1rem)"
                  }}>
                    👕 Streetwear
                  </div>
                  <div style={{ 
                    padding: "clamp(15px, 4vw, 20px)", 
                    background: "rgba(255,255,255,0.1)", 
                    borderRadius: "clamp(8px, 2vw, 10px)",
                    fontSize: "clamp(0.8rem, 3vw, 1rem)"
                  }}>
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
          <div style={{ position: "fixed", top: "clamp(15px, 4vw, 20px)", right: "clamp(15px, 4vw, 20px)", zIndex: 10001 }}>
            <button
              ref={menuButtonRef}
              style={{
                width: "clamp(50px, 12vw, 60px)",
                height: "clamp(50px, 12vw, 60px)",
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
                willChange: "transform, opacity",
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
                  width: "clamp(20px, 5vw, 24px)",
                  height: "2px",
                  background: "black",
                  borderRadius: "2px",
                  transform: menuButtonState === "close" ? "rotate(45deg) translateY(6px)" : "none",
                  transition: "all 0.3s ease",
                }}
              />
              <div
                style={{
                  width: "clamp(20px, 5vw, 24px)",
                  height: "2px",
                  background: "black",
                  borderRadius: "2px",
                  opacity: menuButtonState === "close" ? 0 : 1,
                  transition: "all 0.3s ease",
                }}
              />
              <div
                style={{
                  width: "clamp(20px, 5vw, 24px)",
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
            <>
              {/* Scroll blocking overlay */}
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100vh",
                  zIndex: 20001,
                  background: "transparent",
                  pointerEvents: "none",
                }}
                onWheel={(e) => e.preventDefault()}
                onTouchMove={(e) => e.preventDefault()}
                onScroll={(e) => e.preventDefault()}
              />
              {/* Menu content */}
            <div
              ref={menuRef}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                zIndex: 20002,
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                justifyContent: isMobile ? "center" : "space-between",
                background: "linear-gradient(120deg, #232323 0%, #b71c1c 100%)",
                opacity: 1,
                willChange: "opacity, transform",
                contain: "paint layout size",
                padding: "clamp(20px, 5vw, 40px)",
                overflow: "hidden",
                gap: isMobile ? "clamp(20px, 5vw, 40px)" : "0",
                overscrollBehavior: "none",
              }}
              onWheel={(e) => e.preventDefault()}
              onTouchMove={(e) => e.preventDefault()}
              onScroll={(e) => e.preventDefault()}
            >
              {/* Left side placeholder */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: isMobile ? "100%" : "clamp(20%, 250px, 30%)",
                  height: isMobile ? "clamp(150px, 30vh, 40vh)" : "100%",
                  contain: "paint layout size",
                  flexShrink: 0,
                  padding: isMobile ? "15px" : "clamp(20px, 3vw, 40px)",
                  marginLeft: isMobile ? "0" : "clamp(30px, 4vw, 60px)",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "clamp(12px, 3vw, 48px)",
                  border: "2px dashed rgba(255, 255, 255, 0.3)",
                }}
              >
                <div style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "clamp(14px, 3vw, 18px)",
                  textAlign: "center",
                  padding: "20px",
                }}>
                  Image Placeholder
                </div>
              </div>
              {/* Menu: Right side */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: isMobile ? "100%" : "clamp(55%, 180px, 65%)",
                  height: isMobile ? "auto" : "100%",
                  flexGrow: 1,
                  paddingRight: isMobile ? "0" : "clamp(30px, 4vw, 60px)",
                  paddingLeft: isMobile ? "0" : "clamp(20px, 3vw, 40px)",
                }}
              >
                {["SHOP", "ACCOUNT", "CART", "CONTACT"].map((nav, index) => (
                  <button
                    key={nav}
                    ref={(el) => {
                      menuItemsRef.current[index] = el
                    }}
                    style={{
                      margin: "clamp(8px, 2vw, 12px) 0",
                      padding: "clamp(12px, 3vw, 15px) clamp(16px, 4vw, 30px)",
                      fontSize: "clamp(16px, 5vw, 24px)",
                      fontWeight: "bold",
                      background: "transparent",
                      color: "rgba(255, 255, 255, 0.9)",
                      border: "none",
                      borderRadius: "0",
                      boxShadow: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      opacity: 1,
                      transform: "translateY(0px) scale(1)",
                      willChange: "transform, opacity",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      minHeight: "clamp(40px, 10vw, 50px)", // Touch-friendly minimum height
                      WebkitTapHighlightColor: "transparent",
                      touchAction: "manipulation",
                    }}
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
                    marginTop: "clamp(15px, 4vw, 25px)",
                    padding: "clamp(12px, 3vw, 15px) clamp(16px, 4vw, 24px)",
                    fontSize: "clamp(12px, 3vw, 16px)",
                    background: "transparent",
                    color: "rgba(255, 255, 255, 0.7)",
                    border: "none",
                    borderRadius: "0",
                    cursor: "pointer",
                    backdropFilter: "none",
                    transition: "all 0.3s ease",
                    opacity: 1,
                    transform: "translateY(0px) scale(1)",
                    willChange: "transform, opacity",
                    minHeight: "clamp(36px, 8vw, 44px)", // Touch-friendly minimum height
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                    textShadow: "none",
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
                  onTouchStart={(e) => {
                    e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)"
                    e.currentTarget.style.transform = "scale(1.05)"
                  }}
                  onTouchEnd={(e) => {
                    setTimeout(() => {
                      e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)"
                      e.currentTarget.style.transform = "scale(1)"
                    }, 100)
                  }}
                >
                  ✕ Close
                </button>
              </div>
            </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
