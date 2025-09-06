/* eslint-disable @next/next/no-img-element */
"use client"

import { animate } from "animejs"
import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Shop Section Component with popup and mobile-first design
function ShopSection({ showMain }: { showMain: boolean }) {
  const [showCollectionPopup, setShowCollectionPopup] = useState(false)
  const [hasScrolledToShop, setHasScrolledToShop] = useState(false)
  const shopSectionRef = useRef<HTMLDivElement>(null)
  const gridSectionRef = useRef<HTMLDivElement>(null)

  const categories = [
    {
      name: "T-Shirts",
      href: "/tshirts",
      image: "/images/black1.jpeg",
      description: "Fresh and vibrant t-shirts for every occasion",
    },
    {
      name: "Tracksuits",
      href: "/tracksuits",
      image: "/images/black2.jpeg",
      description: "Comfortable tracksuits for active lifestyles",
    },
    {
      name: "Jerseys",
      href: "/jerseys",
      image: "/images/green1.jpeg",
      description: "Premium jerseys for sports enthusiasts",
    },
    {
      name: "Hats",
      href: "/hats",
      image: "/images/white1.jpeg",
      description: "Trendy hats to complete your look",
    },
    {
      name: "Socks",
      href: "/socks",
      image: "/images/red1.jpeg",
      description: "Comfortable and stylish socks for every day",
    },
  ]

  // Function to scroll to the grid section
  const scrollToGrid = () => {
    setShowCollectionPopup(false)
    setTimeout(() => {
      if (gridSectionRef.current) {
        gridSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }, 300) // Small delay to allow popup to close first
  }

  // Intersection Observer for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      // Trigger popup on any scroll action when main video is showing
      if (window.scrollY > 50 && !hasScrolledToShop && showMain) {
        setHasScrolledToShop(true)
        // Show popup immediately after scroll
        setTimeout(() => {
          setShowCollectionPopup(true)
        }, 300)
      }
    }

    // Add scroll listener when component mounts and main content is showing
    if (showMain) {
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasScrolledToShop, showMain])

  return (
    <>
      {/* New Collection 2025 Popup */}
      {showCollectionPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(10px)",
          }}
          onClick={() => setShowCollectionPopup(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 md:p-8 max-w-sm md:max-w-md mx-auto transform animate-bounce"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "popupSlideIn 0.6s ease-out",
            }}
          >
            <div className="text-center">
              <div className="text-4xl md:text-6xl mb-4">✨</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                New Collection
              </h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-emerald-600 mb-4">
                2025
              </h3>
              <p className="text-gray-600 text-sm md:text-base mb-6">
                Discover our latest streetwear collection featuring premium quality and cutting-edge designs
              </p>
              <button
                onClick={scrollToGrid}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300 text-sm md:text-base"
              >
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shop Section */}
      <div 
        ref={shopSectionRef}
        className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50"
      >
        {/* Header */}
        <div className="pt-16 md:pt-24 pb-8 md:pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
              Fresh Collection
            </h1>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium apparel and accessories
            </p>
          </div>
        </div>

        {/* Categories Grid - Mobile First */}
        <div 
          ref={gridSectionRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="group"
                style={{
                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <Link href={category.href} className="block">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 md:p-6">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        {category.description}
                      </p>
                      <div className="mt-3 md:mt-4 flex items-center text-emerald-600 font-medium group-hover:text-emerald-700 text-sm md:text-base">
                        Shop Now
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Section - Mobile Optimized */}
        <div className="bg-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our Collection?
              </h2>
              <p className="text-sm md:text-lg text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8">
                We curate only the finest quality apparel with attention to detail, comfort, and style. Each piece is
                selected to ensure you look and feel your best.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
                  <p className="text-gray-600 text-sm md:text-base">Carefully selected materials for lasting comfort and durability</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                  <p className="text-gray-600 text-sm md:text-base">Quick and reliable shipping to get your items to you fast</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Customer Love</h3>
                  <p className="text-gray-600 text-sm md:text-base">Thousands of satisfied customers who love our products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes popupSlideIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}

export default function Home() {
  const [showScrollArrow, setShowScrollArrow] = useState(false)
  const [showMain, setShowMain] = useState(false)
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const [menuButtonState, setMenuButtonState] = useState<"burger" | "close">("burger")
  
  // White screen intro animation states
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
    "#2D7D32", // U - Darker mint green for better contrast
    "#45B7D1", // I - Blueberry blue
    "#388E3C", // T - Darker lime green for better contrast
    "#F57F17", // S - Darker banana yellow for better contrast
    "#7B1FA2", // T - Darker grape purple for better contrast
    "#FF7675", // A - Apple red
    "#74B9FF", // N - Berry blue
    "#00B894", // D - Avocado green
  ]
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
        } catch {
          try {
            // Strategy 2: Wait a bit and try again
            await new Promise(resolve => setTimeout(resolve, 100))
            await video.play()
            console.log('Video autoplay succeeded on retry 1!')
          } catch {
            try {
              // Strategy 3: Set currentTime and try again
              video.currentTime = 0
              await video.play()
              console.log('Video autoplay succeeded on retry 2!')
            } catch {
              try {
                // Strategy 4: Load and play
                video.load()
                await video.play()
                console.log('Video autoplay succeeded on retry 3!')
              } catch {
                // Strategy 5: Final attempt with longer delay
                setTimeout(async () => {
                  try {
                    video.muted = true
                    video.playsInline = true
                    await video.play()
                    console.log('Video autoplay succeeded on final retry!')
                  } catch {
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
          } catch {
            // If failed, try again with delay
            setTimeout(async () => {
              try {
                video.muted = true
                video.playsInline = true
                await video.play()
                console.log('Video autoplay succeeded on showMain retry!')
              } catch {
                // Final attempt
                setTimeout(async () => {
                  try {
                    video.load()
                    video.muted = true
                    video.playsInline = true
                    await video.play()
                    console.log('Video autoplay succeeded on showMain final retry!')
                  } catch {
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

  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // White screen intro animation with font flipping
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
            background: "#fff", // White background instead of texture
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10001,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "opacity, transform",
            padding: "0 20px", // Added horizontal padding for mobile
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
                fontSize: "clamp(2rem, 8vw, 4rem)", // Responsive font size
                fontWeight: "300",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                margin: "0 0 40px 0",
                fontFamily: showFontFlip ? fonts[currentFontIndex] : "Arial, sans-serif",
                textAlign: "center",
                transition: showFontFlip ? "font-family 0.1s ease" : "none",
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap", // Allow wrapping on very small screens
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
              fontSize: "clamp(0.8rem, 3vw, 1rem)", // Responsive font size
              color: "rgba(0, 0, 0, 0.6)", // Dark text on white background
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
            src="https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/Videos/homescreen.mp4"
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
        <ShopSection showMain={showMain} />
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
