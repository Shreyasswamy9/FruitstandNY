"use client"

import { animate } from "animejs"
import { useRef, useEffect, useState, useContext } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader"
import { LogoVisibilityContext } from "@/components/ClientRootLayout"

interface EditorialPhoto {
  id: string
  image: string
  location: string
}

const editorialPhotos: EditorialPhoto[] = [
  { id: "1", image: "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY@main/website-real/public/images/editorial/FRUITSTANDEDITSr1-11.JPG", location: "LOWER EAST SIDE" },
  { id: "2", image: "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY@main/website-real/public/images/editorial/FRUITSTANDEDITSr1-15.JPG", location: "CHINATOWN" },
  { id: "3", image: "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY@main/website-real/public/images/editorial/FRUITSTANDEDITSr1-155.JPG", location: "LOWER EAST SIDE" },
  { id: "4", image: "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY@main/website-real/public/images/editorial/FRUITSTANDEDITSr1-21.JPG", location: "LOWER EAST SIDE" },
]

const newItems = [
  {
    id: "tracksuit",
    name: "RETRO TRACK SUIT",
    image: "/images/products/tracksuits/ELMHURST TARO CUSTARD/TP.png",
    price: "$165",
    link: "/shop/tracksuit",
  },
  {
    id: "gala-tee",
    name: "GALA TEE",
    image: "/images/products/gala-tshirt/broadwaynoir/GN4.png",
    price: "$40",
    link: "/shop/gala-tshirt",
  },
  {
    id: "shirt-combo",
    name: "SHIRT COMBO",
    image: "/images/products/Teebundle/Five T-Shirts.png",
    price: "$106.25",
    link: "/shop/tshirt-bundle",
  },
  {
    id: "fuji-tee",
    name: "FUJI LONG SLEEVE",
    image: "/images/products/fuji-tshirt/Arboretum/F2.png",
    price: "$80",
    link: "/shop/fuji-tshirt",
  },
]

export default function Home() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [showMain, setShowMain] = useState(true)
  const { setHideLogo } = useContext(LogoVisibilityContext)
  const [currentLangIndex, setCurrentLangIndex] = useState(0)
  const [showLangFlip, setShowLangFlip] = useState(false)

  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const introTriggeredRef = useRef(false)

  const fruitstandTranslations = [
    "FRUITSTAND",
    "水果摊",
    "Frutaria",
    "Frutería",
    "फलस्टैंड",
    "Stall de fruits",
    "Obststand",
    "Fruttivendolo",
    "フルーツスタンド",
    "فروٹ اسٹینڈ",
  ]

  // Handle hydration and intro - only on first load
  useEffect(() => {
    setIsHydrated(true)
    if (typeof window !== "undefined") {
      const introPlayed = !!window.sessionStorage.getItem("introPlayed")
      if (!introPlayed) {
        setShowMain(false)
        setShowLangFlip(true)
        introTriggeredRef.current = true
      }
    }
  }, [])

  // Watch for intro replay (when logo is clicked)
  useEffect(() => {
    const handleIntroReset = () => {
      if (isHydrated) {
        setShowMain(false)
        setShowLangFlip(true)
        setCurrentLangIndex(0)
        introTriggeredRef.current = true
      }
    }

    window.addEventListener("introReset", handleIntroReset)
    return () => window.removeEventListener("introReset", handleIntroReset)
  }, [isHydrated])

  // Hide logo and cart bar during intro
  useEffect(() => {
    setHideLogo(!showMain)
  }, [showMain, setHideLogo])

  // Language flip animation
  useEffect(() => {
    if (titleRef.current && showLangFlip) {
      let flipCount = 0
      const maxFlips = fruitstandTranslations.length * 2
      const langFlipInterval = setInterval(() => {
        setCurrentLangIndex((prev) => (prev + 1) % fruitstandTranslations.length)
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
              if (typeof window !== "undefined") {
                window.sessionStorage.setItem("introPlayed", "1")
              }
            }, 800)
            return () => clearTimeout(showId)
          }, 2000)

          return () => {
            clearTimeout(subtitleId)
            clearTimeout(toMainId as unknown as number)
          }
        }
      }, 100)
      return () => clearInterval(langFlipInterval)
    }
  }, [fruitstandTranslations.length, showLangFlip])

  // Signup promo popup temporarily disabled (Mailchimp not set up)
  // useEffect(() => {
  //   if (!isHydrated || typeof window === "undefined") return
  //
  //   try {
  //     if (window.localStorage.getItem("signupPromoSubmitted") === "1") {
  //       return
  //     }
  //     if (window.sessionStorage.getItem("signupPromoShown") === "1") {
  //       return
  //     }
  //   } catch {
  //     // ignore storage failures
  //   }
  //
  //   const onScroll = () => {
  //     if (window.scrollY > 220) {
  //       setShowSignupPromo(true)
  //       try {
  //         window.sessionStorage.setItem("signupPromoShown", "1")
  //       } catch {
  //         // ignore storage failures
  //       }
  //       window.removeEventListener("scroll", onScroll)
  //     }
  //   }
  //
  //   window.addEventListener("scroll", onScroll, { passive: true })
  //   return () => window.removeEventListener("scroll", onScroll)
  // }, [isHydrated])

  // Carousel scroll handlers
  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current || typeof window === "undefined") return

    const container = carouselRef.current
    const currentScroll = container.scrollLeft
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0
    const scrollAmount = viewportWidth

    if (!scrollAmount) return

    const newScroll =
      direction === "left"
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount

    container.scrollTo({ left: newScroll, behavior: "smooth" })
  }

  return (
    <>
      {/* <SignupPromoModal isOpen={showSignupPromo} onClose={() => setShowSignupPromo(false)} /> */}
      
      {/* Intro Screen */}
      {(!isHydrated || !showMain) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100dvh",
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
              opacity: isHydrated && showLangFlip ? 1 : 0,
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
                fontFamily: "Arial, Helvetica, sans-serif",
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
            New York
          </p>
        </div>
      )}

      <ProductPageBrandHeader />
      <div className="w-full bg-[#fbf6f0]">
        {/* Hero Video Section - Sized to accommodate carousel */}
        {isHydrated && (
          <section className="relative w-full min-h-[80vh] overflow-hidden">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              poster="/images/home.jpg"
            >
              <source
                src="https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/Videos/homevideo.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70" />
          </section>
        )}

        {/* New Items Carousel */}
        <section className="w-full py-0">
          {/* Carousel Container with Arrows */}
          <div className="relative w-full flex items-stretch">
            {/* Left Arrow - Mobile Only */}
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              className="absolute left-0 top-0 bottom-14 md:hidden z-10 flex items-center justify-center text-[#181818] -translate-x-10 w-8"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
            </button>

            {/* Main Carousel Content */}
            <div className="relative w-full">
              {/* Scrollable Carousel */}
              <div
                ref={carouselRef}
                className="new-items-carousel overflow-x-auto scrollbar-hide md:overflow-visible"
                style={{
                  scrollBehavior: "smooth",
                  minHeight: "400px",
                }}
              >
                <div className="flex border-l border-r border-t border-[#181818] md:border md:rounded-none">
                  {newItems.map((item, index) => (
                    <Link
                      key={item.id}
                      href={item.link}
                      className="carousel-card flex shrink-0 flex-col items-center justify-center border-l border-[#181818] first:border-l-0 md:border-l md:first:border-l-0 bg-[#f7f2ea]"
                    >
                      <div className="relative w-full h-full flex items-center justify-center bg-[#f7f2ea]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom Label Bar */}
              <div className="w-full h-14 bg-[#181818] flex items-center justify-center border-l border-r border-b border-[#181818] md:border">
                <span className="text-white text-sm font-semibold tracking-widest uppercase text-center">
                  NEW ITEMS
                </span>
              </div>
            </div>

            {/* Right Arrow - Mobile Only */}
            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              className="absolute right-0 top-0 bottom-14 md:hidden z-10 flex items-center justify-center text-[#181818] translate-x-10 w-8"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
        </section>

        {/* Editorial Photos Section */}
        <section className="px-0 md:px-8 py-12 md:py-20">
          <div className="mx-auto w-full max-w-[1600px]">

            <div className="grid grid-cols-1 gap-6 px-0 md:grid-cols-4 md:gap-4">
              {editorialPhotos.map((photo) => (
                <div key={photo.id} className="flex flex-col">
                  {/* Image */}
                  <div className="relative w-full h-[70vh] overflow-hidden bg-[#e8e0d5] mb-3 md:h-auto md:aspect-[4/5] md:rounded-2xl">
                    <Image
                      src={photo.image}
                      alt={photo.location}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  {/* Location Label */}
                  <p className="px-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f6f6f] md:px-0">
                    {photo.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scrollbar Hide Styles */}
        <style>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          /* New Items Carousel */
          .new-items-carousel {
            scroll-snap-type: x mandatory;
            scroll-padding: 0;
            display: flex;
          }

          .carousel-card {
            width: 50vw;
            flex: 0 0 50vw;
            scroll-snap-align: start;
            scroll-snap-stop: always;
            height: 100%;
            min-height: 400px;
          }

          @media (min-width: 768px) {
            .carousel-card {
              flex: 1 1 0%;
              scroll-snap-align: none;
              scroll-snap-stop: unset;
              min-height: 500px;
            }

            .new-items-carousel > div {
              display: flex !important;
              width: 100%;
            }

            .new-items-carousel {
              display: flex;
              scroll-snap-type: none;
              overflow: visible !important;
              width: 100%;
            }

            .carousel-card:nth-child(n+5) {
              display: none;
            }
          }

          @media (min-width: 1024px) {
            .carousel-card {
              flex: 1 1 0%;
            }

            .carousel-card:nth-child(n+5) {
              display: none;
            }
          }
        `}</style>
      </div>
    </>
  )
}
