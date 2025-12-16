"use client"

import { animate } from "animejs"
import { useRef, useEffect, useState, useContext } from "react"
import { LogoVisibilityContext } from "../components/ClientRootLayout"
import Image from "next/image"
import FeaturedBundle from "../components/FeaturedBundle"
import BundleSheet from "../components/BundleSheet"
import { SignupModal } from "../components/SIgnUpModal"
import { useScrollTrigger } from "../hooks/useScrollTrigger"
import Price from "../components/Price"

export default function Home() {
  const { setHideLogo } = useContext(LogoVisibilityContext)
  // Global style to ensure no white bars on mobile
  // This will override html/body background, margin, and padding
  // Set --app-vh CSS variable to fix mobile 100vh issues
  useEffect(() => {
    function setVhVar() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--app-vh', `${vh}px`);
    }
    setVhVar();
    window.addEventListener('resize', setVhVar);
    window.addEventListener('orientationchange', setVhVar);
    return () => {
      window.removeEventListener('resize', setVhVar);
      window.removeEventListener('orientationchange', setVhVar);
    };
  }, []);

  // Only show intro if not already played this session
  const [showMain, setShowMain] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Handle hydration and check sessionStorage after client-side mount
  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined') {
      const introPlayed = !!window.sessionStorage.getItem('introPlayed');
      setShowMain(introPlayed);
    }
  }, []);
  
  // Hide logo during intro, show after
  useEffect(() => {
    setHideLogo(!showMain)
    if (showMain && typeof window !== 'undefined') {
      window.sessionStorage.setItem('introPlayed', '1');
    }
  }, [showMain, setHideLogo])
  const [showScrollArrow, setShowScrollArrow] = useState(false)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalDismissed, setModalDismissed] = useState(false) // Track if user manually closed modal
  
  const secondVideoRef = useRef<HTMLVideoElement>(null)

  // Hide logo during intro, show after
  useEffect(() => {
    setHideLogo(!showMain)
  }, [showMain, setHideLogo])

  // Enhanced mobile autoplay with immediate interaction handling
  useEffect(() => {
    if (secondVideoRef.current && isHydrated) {
      const video = secondVideoRef.current
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      // Force all autoplay properties (avoid setAttribute for hydration safety)
      video.muted = true
      video.playsInline = true
      video.controls = false
      
      // Set attributes only after hydration to avoid mismatch
      video.setAttribute('webkit-playsinline', 'true')
      video.setAttribute('x-webkit-airplay', 'allow')
      video.setAttribute('playsinline', 'true')
      video.setAttribute('disablepictureinpicture', 'true')
      video.setAttribute('disableremoteplayback', 'true')
      
      // Mobile-specific immediate interaction handling
      if (isMobile) {
        const startVideoOnInteraction = async (e: Event) => {
          e.preventDefault()
          try {
            video.muted = true
            video.controls = false
            await video.play()
            console.log('Video started on mobile interaction')
            // Remove listeners after successful play
            document.removeEventListener('touchstart', startVideoOnInteraction)
            document.removeEventListener('click', startVideoOnInteraction)
            document.removeEventListener('scroll', startVideoOnInteraction)
          } catch (error) {
            console.log('Mobile video play failed:', error)
          }
        }
        
        // Add multiple interaction listeners for mobile
        document.addEventListener('touchstart', startVideoOnInteraction, { once: true, passive: false })
        document.addEventListener('click', startVideoOnInteraction, { once: true })
        document.addEventListener('scroll', startVideoOnInteraction, { once: true, passive: true })
        
        // Also try to play immediately on mobile
        setTimeout(async () => {
          try {
            await video.play()
            console.log('Mobile autoplay succeeded')
          } catch {
            console.log('Mobile autoplay failed - waiting for user interaction')
          }
        }, 100)
      }
      
      // Desktop autoplay strategies
      const forcePlay = async () => {
        try {
          await video.play()
          console.log('Video autoplay succeeded!')
        } catch {
          try {
            await new Promise(resolve => setTimeout(resolve, 100))
            await video.play()
            console.log('Video autoplay succeeded on retry 1!')
          } catch {
            try {
              video.currentTime = 0
              await video.play()
              console.log('Video autoplay succeeded on retry 2!')
            } catch {
              try {
                video.load()
                await video.play()
                console.log('Video autoplay succeeded on retry 3!')
              } catch {
                console.log('Desktop autoplay failed - adding interaction listeners')
                
                const startOnInteraction = async () => {
                  try {
                    video.muted = true
                    video.controls = false
                    await video.play()
                    console.log('Video started after user interaction')
                  } catch (e) {
                    console.log('Failed to start video even after interaction:', e)
                  }
                }
                
                document.addEventListener('click', startOnInteraction, { once: true })
                document.addEventListener('keydown', startOnInteraction, { once: true })
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
  }, [isHydrated])

  // Show scroll arrow after 5 seconds when main video is visible
  useEffect(() => {
    let arrowTimeout: ReturnType<typeof setTimeout> | null = null
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

  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const mainContainerRef = useRef<HTMLDivElement>(null)

  // Use scroll trigger hook to show modal after user scrolls
  const { isTriggered } = useScrollTrigger({ 
    threshold: 600, // Show modal after scrolling 600px
    delay: 3000,    // Wait 3 seconds after scroll threshold
    containerRef: mainContainerRef
  })

  // Handle scroll trigger to show modal
  useEffect(() => {
    if (isTriggered && !isModalOpen && !modalDismissed) {
      setIsModalOpen(true)
    }
  }, [isTriggered, isModalOpen, modalDismissed])

  const [currentLangIndex, setCurrentLangIndex] = useState(0)
  const [showLangFlip, setShowLangFlip] = useState(false) // Initialize as false to match server
  const [openBundlesSheet, setOpenBundlesSheet] = useState(false)

  // Set showLangFlip after hydration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const introPlayed = window.sessionStorage.getItem('introPlayed');
      setShowLangFlip(!introPlayed);
    }
  }, []);

  // Translations for 'Fruitstand' in different languages (unchanged)
  const fruitstandTranslations = [
  "FRUITSTAND", // English
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
          }, 2000)

          // Cleanup timeouts if unmounted during sequence
          return () => {
            clearTimeout(subtitleId)
            clearTimeout(toMainId as unknown as number)
          }
        }
  }, 100) // Flip every 80ms (even faster)
      // Ensure cleanup on unmount even if we didn't reach maxFlips
      return () => clearInterval(langFlipInterval)
    }
  }, [fruitstandTranslations.length, showLangFlip])

  return (
    <>
      <style global jsx>{`
        html, body {
          background: black !important;
          margin: 0 !important;
          padding: 0 !important;
          height: calc(var(--app-vh) * 100) !important;
          min-height: calc(var(--app-vh) * 100) !important;
          width: 100vw !important;
          overflow-x: hidden !important;
          overscroll-behavior: none !important;
        }
        
        /* Hide scrollbars for all elements */
        * {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        
        /* Hide scrollbars for webkit browsers (Chrome, Safari, etc.) */
        *::-webkit-scrollbar {
          display: none;
        }
        
        /* Ensure scrolling still works on the main container */
        html, body, #__next {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        html::-webkit-scrollbar,
        body::-webkit-scrollbar,
        #__next::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div
        ref={mainContainerRef}
        style={{
          position: "relative",
          minHeight: "calc(var(--app-vh) * 100)",
          height: "calc(var(--app-vh) * 100)",
          width: "100vw",
          zIndex: 9999,
          overflow: "hidden",
          overflowY: "auto",
          overflowX: "hidden",
          contain: "paint layout size", // isolate top-level container for smoother paints
          background: "black",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
      {(!isHydrated || !showMain) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "calc(var(--app-vh) * 100)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10001,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "opacity, transform",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
            overflow: "hidden",
          }}
        >
          <Image
            src="/images/black-plain-concrete-textured.jpg"
            alt="Intro background"
            fill
            priority
            style={{
              objectFit: "cover",
              zIndex: -1,
              pointerEvents: "none",
              userSelect: "none",
            }}
            sizes="100vw"
            quality={70}
          />
          <div
            ref={logoRef}
            style={{
              opacity: (isHydrated && showLangFlip) ? 1 : 0,
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
          width: "100vw",
          height: "calc(var(--app-vh) * 100)",
          zIndex: 1,
          opacity: showMain ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
          padding: 0,
          margin: 0,
          boxSizing: "border-box",
          willChange: "opacity",
          background: "black",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Fallback background image for when video doesn't load */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/images/home.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.8,
            zIndex: 1,
          }}
        />
        
        <video
          ref={secondVideoRef}
          suppressHydrationWarning={true}
          style={{
            position: "relative",
            zIndex: 2,
            width: "100vw",
            height: "calc(var(--app-vh) * 100)",
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
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          poster="/images/home.jpg"
          onLoadStart={() => console.log('Video load started')}
          onCanPlay={() => console.log('Video can play')}
          onPlay={() => console.log('Video playing')}
        >
          <source
            src="https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/Videos/homevideo.mp4"
            type="video/mp4"
          />
        </video>
        
        {/* Hide video controls completely */}
        <style>{`
          video::-webkit-media-controls {
            display: none !important;
            -webkit-appearance: none;
          }
          
          video::-webkit-media-controls-play-button {
            display: none !important;
            -webkit-appearance: none;
          }
          
          video::-webkit-media-controls-start-playback-button {
            display: none !important;
            -webkit-appearance: none;
          }
          
          video::-webkit-media-controls-enclosure {
            display: none !important;
          }
          
          video::-webkit-media-controls-panel {
            display: none !important;
          }
          
          video {
            outline: none !important;
          }
        `}</style>
      </div>

      {/* Scroll Down Arrow */}
      {showScrollArrow && (
        <button
          aria-label="Scroll to products"
          onClick={() => {
            const grid = document.getElementById('products-grid-anchor');
            if (grid) {
              grid.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          style={{
            position: "fixed",
            left: "50%",
            bottom: "clamp(10px, 2vw, 18px)",
            transform: "translateX(-50%)",
            zIndex: 10,
            background: 'none',
            border: 'none',
            padding: 0,
            margin: 0,
            cursor: 'pointer',
            animation: "arrowJump 1s infinite",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform, opacity",
            outline: 'none',
          }}
        >
          <svg
            width="clamp(38px, 10vw, 54px)"
            height="clamp(38px, 10vw, 54px)"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              display: 'block',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))',
              userSelect: 'none',
            }}
          >
            <circle cx="24" cy="24" r="22" fill="#fff" fillOpacity="0.92" />
            <path d="M24 15v16M24 31l-7-7M24 31l7-7" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}


  {/* Logo button (top left), matches menu button interactivity and style */}

  {/* Logo button removed from here; will be moved to layout.tsx for global visibility */}

      {/* Product grid and heading after video */}
      {(isHydrated && showMain) && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            marginTop: "0",
            width: "100%",
            margin: 0,
            padding: 0,
            background: "#fbf6f0",
          }}
        >
          <div
            style={{
              maxWidth: 1400,
              margin: "0 auto",
              textAlign: "center",
              padding: "clamp(24px, 6vw, 48px) clamp(8px, 2vw, 32px)",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div 
              id="products-grid-anchor"
              style={{
                width: "100%",
                maxWidth: "1400px",
                margin: "0 auto",
                padding: "0 clamp(16px, 4vw, 20px)",
              }}
            >
              {/* Hero Section */}
              <div 
                className="hero-grid-container"
                style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "clamp(16px, 3vw, 24px)",
                marginBottom: "clamp(48px, 8vw, 80px)",
                minHeight: "clamp(400px, 60vw, 500px)",
              }}
              >
                {/* Large Feature - New Collection */}
                <div style={{
                  position: "relative",
                  borderRadius: "clamp(16px, 3vw, 24px)",
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #0f172a 0%, #111827 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "clamp(24px, 6vw, 48px)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
                onClick={() => window.location.href = "/shop"}
                >
                    <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url('/images/products/hockey Jersey/JN.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.45,
                    filter: 'brightness(0.6)'
                  }}></div>
                  <div style={{ position: 'absolute', left: 24, top: 24, zIndex: 3, background: 'rgba(255,255,255,0.95)', padding: '6px 10px', borderRadius: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#111' }}>New Arrival</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#111', opacity: 0.9 }}>Seasonal spotlight</div>
                  </div>
                  <div style={{
                    position: "relative",
                    zIndex: 2,
                    color: "#fff",
                  }}>
                    <h1 style={{
                      fontSize: "clamp(2rem, 6vw, 4rem)",
                      fontWeight: 900,
                      marginBottom: "12px",
                      lineHeight: 1.02,
                    }}>
                      WINTER COLLECTION DROP
                    </h1>
                    <p style={{
                      fontSize: "clamp(1rem, 2vw, 1.1rem)",
                      opacity: 0.95,
                      marginBottom: "24px",
                    }}>
                      Discover the latest Fruitstand essentials straight from NYC
                    </p>
                    <button style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      padding: "14px 28px",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      boxShadow: '0 6px 20px rgba(239,68,68,0.18)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = '0 10px 30px rgba(239,68,68,0.22)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = '0 6px 20px rgba(239,68,68,0.18)'; }}
                    >
                      Shop Collection
                    </button>
                  </div>
                </div>

                {/* Right Side - Two Stacked Cards */}
                <div style={{
                  display: "grid",
                  gridTemplateRows: "1fr 1fr",
                  gap: "24px",
                }}>
                  {/* Best Sellers */}
                  <div style={{
                    position: "relative",
                    borderRadius: "20px",
                    overflow: "hidden",
                    background: "#111",
                    padding: "32px",
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onClick={() => window.location.href = "/shop/gala-tshirt"}
                  >
                    <div style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "40%",
                      height: "100%",
                      backgroundImage: "url('/images/products/gala-tshirt/broadwaynoir/GN4.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      opacity: 0.8,
                    }}></div>
                    <div style={{
                      position: "relative",
                      zIndex: 2,
                      color: "#fff",
                      maxWidth: "60%",
                    }}>
                      <h3 style={{
                        fontSize: "1.8rem",
                        fontWeight: 600,
                        marginBottom: "12px",
                        lineHeight: 1.2,
                      }}>
                        Best Seller
                      </h3>
                      <p style={{
                        fontSize: "1rem",
                        opacity: 0.9,
                        marginBottom: "20px",
                      }}>
                        Gala Tee
                      </p>
                      <span style={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "#ff6b6b",
                      }}>
                        $40
                      </span>
                    </div>
                  </div>

                  {/* Featured Hat */}
                  <div style={{
                    position: "relative",
                    borderRadius: "20px",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    padding: "32px",
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onClick={() => window.location.href = "/shop/tracksuit"}
                  >
                    <div style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "45%",
                      height: "100%",
                      backgroundImage: "url('/images/products/tracksuits/ELMHURST TARO CUSTARD/TP.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      opacity: 0.9,
                    }}></div>
                    <div style={{
                      position: "relative",
                      zIndex: 2,
                      color: "#111",
                      maxWidth: "55%",
                    }}>
                      <h3 style={{
                        fontSize: "1.4rem",
                        fontWeight: 800,
                        marginBottom: "8px",
                        lineHeight: 1.1,
                        textTransform: 'uppercase'
                      }}>
                        New Drop
                      </h3>
                      <p style={{
                        fontSize: "0.98rem",
                        opacity: 0.95,
                        marginBottom: "12px",
                        fontWeight: 700
                      }}>
                        Retro Track Suit
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: '#111827' }}>
                          <Price price="$165" />
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); window.location.href = '/shop/tracksuit'; }}
                          style={{
                            background: '#111',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 14px',
                            borderRadius: 8,
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Shop Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bundles Section: show one featured, and open popup for all */}
              <div style={{ margin: "0 0 64px 0" }}>
                <FeaturedBundle className="max-w-4xl mx-auto" />
                <div className="text-center mt-6">
                  <button
                    aria-label="Show all bundles"
                    onClick={() => setOpenBundlesSheet(true)}
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-black text-white font-medium shadow-md hover:opacity-90 active:opacity-85"
                  >
                    Show all bundles
                  </button>
                </div>
              </div>

              {/* Global bundle sheet opened from the button above */}
              <BundleSheet open={openBundlesSheet} onClose={() => setOpenBundlesSheet(false)} />

              {/* Products Grid - Modern Layout */}
              <div style={{
                marginBottom: "64px",
              }}>
                <h2 style={{
                  fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                  fontWeight: 600,
                  textAlign: "center",
                  marginBottom: "clamp(24px, 6vw, 48px)",
                  color: "#111",
                  letterSpacing: "-0.02em",
                }}>
                  Shop the Collection
                </h2>
                
                <div 
                  className="products-grid-container"
                  style={{
                  display: "grid",
                  gridTemplateColumns: window.innerWidth <= 768 ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: window.innerWidth <= 768 ? "12px" : "clamp(16px, 4vw, 32px)",
                  marginBottom: "clamp(48px, 8vw, 80px)",
                  padding: window.innerWidth <= 768 ? "0 16px" : "0",
                }}
                >
                  {/* Product Cards */}
                  {[
                      { name: "Gala Tee", price: "$40", image: "/images/products/gala-tshirt/broadwaynoir/GN4.png", hoverImage: "/images/products/gala-tshirt/broadwaynoir/GN5.png", link: "/shop/gala-tshirt" },
                      { name: "Retro Track Suit", price: "$165", image: "/images/products/tracksuits/ELMHURST TARO CUSTARD/TP.png", hoverImage: "/images/products/tracksuits/ELMHURST TARO CUSTARD/TS7.png", link: "/shop/tracksuit" },
                      { name: "Wabisabi™ Scheffel Hall Pears Tee", price: "$45", image: "/images/products/Wasabi Tee/Wabasabi 1.png", hoverImage: "/images/products/Wasabi Tee/Wabsabi 4.png", link: "/shop/wasabi-tee" },
                      { name: "First Edition Tee", price: "$45", image: "/images/products/First Edition Tee/FE1.png", hoverImage: "/images/products/First Edition Tee/FE2.png", link: "/shop/first-edition-tee" },
                  ].map((product, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        borderRadius: window.innerWidth <= 768 ? "12px" : "16px",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        background: "#fff",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                        width: "100%",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)";
                        const img = e.currentTarget.querySelector('img');
                        if (img && product.hoverImage) {
                          img.src = product.hoverImage;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)";
                        const img = e.currentTarget.querySelector('img');
                        if (img) {
                          img.src = product.image;
                        }
                      }}
                      onClick={() => window.location.href = product.link}
                    >
                      <div style={{
                        position: "relative",
                        paddingBottom: window.innerWidth <= 768 ? "130%" : "120%",
                        overflow: "hidden",
                      }}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          unoptimized
                          style={{
                            objectFit: "cover",
                            transition: "all 0.3s ease",
                          }}
                        />
                      </div>
                      <div style={{
                        padding: window.innerWidth <= 768 ? "12px 16px" : "24px",
                      }}>
                        <h3 style={{
                          fontSize: window.innerWidth <= 768 ? "0.95rem" : "1.3rem",
                          fontWeight: 500,
                          marginBottom: window.innerWidth <= 768 ? "4px" : "8px",
                          color: "#111",
                        }}>
                          {product.name}
                        </h3>
                        <p style={{
                          fontSize: window.innerWidth <= 768 ? "0.9rem" : "1.1rem",
                          fontWeight: 600,
                          color: "#666",
                          margin: 0,
                        }}>
                          {product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand Story Section */}
              <div 
                className="brand-story-container"
                style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "clamp(24px, 6vw, 48px)",
                alignItems: "center",
                marginBottom: "clamp(48px, 8vw, 80px)",
                padding: "clamp(24px, 6vw, 48px)",
                borderRadius: "clamp(16px, 3vw, 24px)",
                background: "linear-gradient(135deg, #fbf6f0 0%, #fdf5ec 100%)",
              }}
              >
                <div>
                  <h2 style={{
                    fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
                    fontWeight: 700,
                    marginBottom: "clamp(16px, 4vw, 24px)",
                    color: "#111",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}>
                    Crafted for the Modern Individual
                  </h2>
                  <p style={{
                    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                    lineHeight: 1.6,
                    color: "#666",
                    marginBottom: "clamp(20px, 5vw, 32px)",
                  }}>
                    Every piece in our collection is thoughtfully designed and carefully crafted to meet the demands of contemporary lifestyle while maintaining timeless appeal.
                  </p>
                  {/* Learn More button intentionally removed per design */}
                </div>
                <div style={{
                  position: "relative",
                  borderRadius: "20px",
                  overflow: "hidden",
                  paddingBottom: "120%",
                }}>
                  <Image
                    src="/images/products/First Edition Tee/FE3.png"
                    alt="Brand Story"
                    fill
                    unoptimized
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>

              {/* Mobile Responsive Styles */}
              <style>{`
                /* Enhanced Mobile-First Responsive Design */
                @media (max-width: 768px) {
                  .hero-grid-container {
                    grid-template-columns: 1fr !important;
                    gap: 16px !important;
                    margin-bottom: 48px !important;
                    padding: 0 16px !important;
                  }
                  
                  .products-grid-container {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 16px !important;
                    padding: 0 16px !important;
                    margin-bottom: 48px !important;
                  }
                  
                  .brand-story-container {
                    grid-template-columns: 1fr !important;
                    gap: 24px !important;
                    padding: 32px 20px !important;
                    margin: 0 16px 48px 16px !important;
                    border-radius: 20px !important;
                  }

                  /* Hero Section Mobile Optimizations */
                  .hero-grid-container > div:first-child {
                    padding: 32px 24px !important;
                    min-height: 320px !important;
                    border-radius: 20px !important;
                  }

                  .hero-grid-container > div:first-child h1 {
                    font-size: clamp(1.8rem, 8vw, 2.5rem) !important;
                    margin-bottom: 12px !important;
                  }

                  .hero-grid-container > div:first-child p {
                    font-size: 1rem !important;
                    margin-bottom: 24px !important;
                  }

                  .hero-grid-container > div:first-child button {
                    padding: 14px 28px !important;
                    font-size: 0.95rem !important;
                  }

                  /* Right Side Cards Mobile */
                  .hero-grid-container > div:last-child {
                    gap: 16px !important;
                  }

                  .hero-grid-container > div:last-child > div {
                    padding: 24px 20px !important;
                    border-radius: 16px !important;
                    min-height: 140px !important;
                  }

                  .hero-grid-container > div:last-child h3 {
                    font-size: 1.4rem !important;
                    margin-bottom: 8px !important;
                  }

                  .hero-grid-container > div:last-child p {
                    font-size: 0.9rem !important;
                    margin-bottom: 12px !important;
                  }

                  /* Products Grid Mobile */
                  .products-grid-container > div {
                    border-radius: 12px !important;
                    width: 100% !important;
                  }

                  .products-grid-container > div > div:first-child {
                    padding-bottom: 130% !important;
                  }

                  .products-grid-container > div > div:last-child {
                    padding: 16px !important;
                  }

                  .products-grid-container h3 {
                    font-size: 1.1rem !important;
                    margin-bottom: 6px !important;
                  }

                  .products-grid-container p {
                    font-size: 0.9rem !important;
                    margin: 0 !important;
                  }

                  /* Brand Story Mobile */
                  .brand-story-container h2 {
                    font-size: 2rem !important;
                    margin-bottom: 16px !important;
                    line-height: 1.2 !important;
                  }

                  .brand-story-container p {
                    font-size: 1rem !important;
                    line-height: 1.5 !important;
                    margin-bottom: 24px !important;
                  }

                  .brand-story-container button {
                    padding: 14px 28px !important;
                    font-size: 0.95rem !important;
                  }

                  .brand-story-container > div:last-child {
                    padding-bottom: 100% !important;
                    border-radius: 16px !important;
                  }

                  /* Section Titles Mobile */
                  h2 {
                    font-size: 2rem !important;
                    margin-bottom: 32px !important;
                    padding: 0 16px !important;
                  }
                }
                
                @media (max-width: 480px) {
                  .products-grid-container {
                    grid-template-columns: 1fr !important;
                    gap: 12px !important;
                    padding: 0 16px !important;
                  }

                  .products-grid-container > div > div:first-child {
                  padding-bottom: 140% !important;
                  }

                  /* Extra small mobile adjustments */
                  .hero-grid-container > div:first-child {
                    padding: 28px 20px !important;
                    min-height: 280px !important;
                  }

                  .hero-grid-container > div:first-child h1 {
                    font-size: clamp(1.6rem, 10vw, 2.2rem) !important;
                  }

                  .hero-grid-container > div:last-child > div {
                    padding: 20px 16px !important;
                    min-height: 120px !important;
                  }

                  .brand-story-container {
                    padding: 24px 16px !important;
                    margin: 0 20px 40px 20px !important;
                  }

                  .brand-story-container h2 {
                    font-size: 1.8rem !important;
                  }

                  h2 {
                    font-size: 1.8rem !important;
                    margin-bottom: 24px !important;
                    padding: 0 20px !important;
                  }
                }

                @media (max-width: 360px) {
                  /* Ultra small screens */
                  .hero-grid-container,
                  .products-grid-container,
                  .brand-story-container {
                    margin-left: 12px !important;
                    margin-right: 12px !important;
                  }

                  .hero-grid-container > div:first-child {
                    padding: 24px 16px !important;
                  }

                  .brand-story-container {
                    padding: 20px 12px !important;
                  }
                }

                /* Touch optimizations for mobile */
                @media (hover: none) and (pointer: coarse) {
                  .hero-grid-container > div,
                  .products-grid-container > div,
                  .brand-story-container button {
                    transform: none !important;
                  }

                  .hero-grid-container > div:active,
                  .products-grid-container > div:active {
                    transform: scale(0.98) !important;
                    transition: transform 0.1s ease !important;
                  }
                }
              `}</style>

            </div>
          </div>
        </div>
      )}

      
    </div>

    {/* Signup Modal */}
    <SignupModal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false)
        setModalDismissed(true) // Mark modal as dismissed to prevent it from appearing again
      }}
    />
    </>
  )
}