"use client"

import { animate } from "animejs"
import { useRef, useEffect, useState, useContext } from "react"
import { LogoVisibilityContext } from "../components/ClientRootLayout"
import Image from "next/image"
import { SignupModal } from "../components/SIgnUpModal"
import { useScrollTrigger } from "../hooks/useScrollTrigger"
import StaggeredMenu from "../components/StagerredMenu"

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
    if (secondVideoRef.current) {
      const video = secondVideoRef.current
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      // Force all autoplay attributes
      video.muted = true
      video.playsInline = true
      video.controls = false
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
  }, [])

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
  const [showLangFlip, setShowLangFlip] = useState(() => {
    if (typeof window !== 'undefined') {
      return !window.sessionStorage.getItem('introPlayed');
    }
    return true;
  });

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
      {!showMain && (
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
          webkit-playsinline="true"
          x-webkit-airplay="allow"
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
      {showMain && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            marginTop: "0",
            width: "100%",
            margin: 0,
            padding: 0,
            background: "#fff",
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
                  background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "clamp(24px, 6vw, 48px)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                onClick={() => window.location.href = "/shop"}
                >
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url('/images/classicteecovermodels.jpeg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.9,
                  }}></div>
                  <div style={{
                    position: "relative",
                    zIndex: 2,
                    color: "#fff",
                  }}>
                    <h1 style={{
                      fontSize: "clamp(2rem, 6vw, 4rem)",
                      fontWeight: 700,
                      marginBottom: "16px",
                      lineHeight: 1.1,
                      textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                    }}>
                      New Collection
                    </h1>
                    <p style={{
                      fontSize: "clamp(1rem, 2vw, 1.2rem)",
                      opacity: 0.95,
                      marginBottom: "32px",
                      textShadow: "0 1px 8px rgba(0,0,0,0.2)",
                    }}>
                      Discover our latest arrivals
                    </p>
                    <button style={{
                      background: "rgba(255,255,255,0.95)",
                      color: "#111",
                      border: "none",
                      padding: "16px 32px",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.95)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                    >
                      Shop Now
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
                  onClick={() => window.location.href = "/shop/hockey-jersey"}
                  >
                    <div style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "40%",
                      height: "100%",
                      backgroundImage: "url('/images/hockeyjerseymale1.jpeg')",
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
                        Hockey Jersey
                      </p>
                      <span style={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "#ff6b6b",
                      }}>
                        $90
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
                  onClick={() => window.location.href = "/shop/empire-hat"}
                  >
                    <div style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "45%",
                      height: "100%",
                      backgroundImage: "url('/images/empirehatsolo.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      opacity: 0.9,
                    }}></div>
                    <div style={{
                      position: "relative",
                      zIndex: 2,
                      color: "#fff",
                      maxWidth: "55%",
                    }}>
                      <h3 style={{
                        fontSize: "1.6rem",
                        fontWeight: 600,
                        marginBottom: "12px",
                        lineHeight: 1.2,
                      }}>
                        New Drop
                      </h3>
                      <p style={{
                        fontSize: "1rem",
                        opacity: 0.95,
                        marginBottom: "16px",
                      }}>
                        Empire Hat
                      </p>
                      <span style={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                      }}>
                        $42
                      </span>
                    </div>
                  </div>
                </div>
              </div>

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
                  gridTemplateColumns: "repeat(auto-fit, minmax(clamp(240px, 45vw, 280px), 1fr))",
                  gap: "clamp(16px, 4vw, 32px)",
                  marginBottom: "clamp(48px, 8vw, 80px)",
                }}
                >
                  {/* Product Cards */}
                  {[
                    { name: "Classic Tee", price: "$55", image: "/images/classicteemale1.jpeg", hoverImage: "/images/classicteefemale1.jpeg", link: "/shop/classic-tee" },
                    { name: "Tracksuit", price: "$120", image: "/images/B&Wtracksuitmale1.jpeg", hoverImage: "/images/maroontracksuitmale1.jpeg", link: "/shop/tracksuit" },
                    { name: "Denim Hat", price: "$40", image: "/images/denimhatmale1.jpeg", hoverImage: "/images/denimhatfemale1.jpeg", link: "/shop/denim-hat" },
                    { name: "White Hat", price: "$40", image: "/images/whitehatmale1.jpeg", hoverImage: "/images/whitehatsolo.jpeg", link: "/shop/white-hat" },
                  ].map((product, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        borderRadius: "16px",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        background: "#fff",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
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
                        paddingBottom: "120%",
                        overflow: "hidden",
                      }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "all 0.3s ease",
                          }}
                        />
                      </div>
                      <div style={{
                        padding: "24px",
                      }}>
                        <h3 style={{
                          fontSize: "1.3rem",
                          fontWeight: 500,
                          marginBottom: "8px",
                          color: "#111",
                        }}>
                          {product.name}
                        </h3>
                        <p style={{
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          color: "#666",
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
                background: "linear-gradient(135deg, #f8f9fa 0%, #fff 100%)",
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
                  <button
                    style={{
                      background: "#111",
                      color: "#fff",
                      border: "none",
                      padding: "clamp(12px, 3vw, 16px) clamp(24px, 6vw, 32px)",
                      borderRadius: "12px",
                      fontSize: "clamp(0.9rem, 2vw, 1rem)",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#333";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#111";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                    onClick={() => window.location.href = "/contact"}
                  >
                    Learn More
                  </button>
                </div>
                <div style={{
                  position: "relative",
                  borderRadius: "20px",
                  overflow: "hidden",
                  paddingBottom: "120%",
                }}>
                  <img
                    src="/images/beigehatfemale1.jpeg"
                    alt="Brand Story"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
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
                    font-size: 1rem !important;
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
                    gap: 20px !important;
                    padding: 0 20px !important;
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

      {/* StaggeredMenu Component */}
      {showMain && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 10001, pointerEvents: "auto" }}>
          <StaggeredMenu
            position="right"
            colors={['#18191a', '#232324']}
            className="custom-staggered-menu"
            items={[
              { label: "Shop", ariaLabel: "Browse our shop", link: "/shop" },
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
            menuButtonColor="#fff"
            openMenuButtonColor="#000"
            changeMenuColorOnOpen={true}
            accentColor="#ff6b6b"
            onMenuOpen={() => {}}
            onMenuClose={() => {}}
          />
        </div>
      )}

      {/* Custom styles for StaggeredMenu visibility */}
      <style>{`
        .custom-staggered-menu .staggered-menu-header {
          pointer-events: auto !important;
          position: relative !important;
          z-index: 10003 !important;
        }

        .custom-staggered-menu .sm-toggle {
          background: transparent !important;
          border: none !important;
          color: #000000 !important;
          font-size: 16px !important;
          font-weight: 400 !important;
          padding: 8px 12px !important;
          border-radius: 0 !important;
          min-width: auto !important;
          height: auto !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          transition: color 0.2s ease !important;
          pointer-events: auto !important;
          cursor: pointer !important;
        }

        .custom-staggered-menu .sm-toggle:hover {
          color: #333333 !important;
          background: transparent !important;
          transform: none !important;
          box-shadow: none !important;
        }

        .custom-staggered-menu[data-open] .sm-toggle {
          color: #000000 !important;
          background: transparent !important;
        }
      `}</style>
    </div>
    <footer style={{
      width: '100vw',
      fontSize: '0.92rem',
      color: '#111',
      padding: '32px 16px 18px 16px',
      paddingBottom: '50px', // Add extra padding to account for cart bar
      background: 'white',
      letterSpacing: '0.01em',
      fontWeight: 400,
      boxShadow: '0 -2px 12px 0 rgba(0,0,0,0.03)',
      position: 'relative',
    }}>
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          © 2024 Fruitstand LLC,<br />
          All Rights Reserved
        </div>
        <div style={{ textAlign: 'center' }}>
          <a
            href="/contact"
            style={{
              background: '#111',
              color: '#fff',
              padding: '10px 22px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '1rem',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)',
              transition: 'background 0.2s',
              display: 'inline-block',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#333')}
            onMouseOut={e => (e.currentTarget.style.background = '#111')}
          >
            Contact Us
          </a>
        </div>
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-center">
        <div style={{ flex: 1, textAlign: 'center' }}>
          © 2024 Fruitstand LLC,<br />
          All Rights Reserved
        </div>
        <a
          href="/contact"
          style={{
            position: 'absolute',
            right: 32,
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#111',
            color: '#fff',
            padding: '10px 22px',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '1rem',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#333')}
          onMouseOut={e => (e.currentTarget.style.background = '#111')}
        >
          Contact Us
        </a>
      </div>
    </footer>
    
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