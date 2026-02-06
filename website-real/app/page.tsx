"use client"

import { animate } from "animejs"
import { useRef, useEffect, useState, useContext } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader"
import SignupPromoModal from "@/components/SignupPromoModal"
import { LogoVisibilityContext } from "@/components/ClientRootLayout"

interface EditorialPhoto {
  id: string
  image: string
  location: string
}

const editorialPhotos: EditorialPhoto[] = [
  { id: "1", image: "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY@main/website-real/public/images/editorial/FRUITSTANDEDITSr1-11.JPG", location: "LOWER EAST SIDE" },
  { id: "2", image: "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY@main/website-real/public/images/editorial/FRUITSTANDEDITSr1-15.JPG", location: "CHINATOWN" },
  { id: "3", image: "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY@main/website-real/public/images/editorial/FRUITSTANDEDITSr1-155.JPG", location: "WILLIAMSBURG" },
  { id: "4", image: "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY@main/website-real/public/images/editorial/FRUITSTANDEDITSr1-21.JPG", location: "DUMBO" },
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
    image: "/images/products/gala-tshirt/suttonplacesnow/GN11.png",
    price: "$106.25",
    link: "/shop?bundle=tshirt-bundle",
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
  const [showSignupPromo, setShowSignupPromo] = useState(false)
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
    const firstCard = container.querySelector<HTMLElement>(".carousel-card")
    const computedStyles = window.getComputedStyle(container)
    const gapValue = parseInt(computedStyles.columnGap || computedStyles.gap || "0", 10)
    const cardWidth = firstCard?.offsetWidth ?? container.clientWidth
    const scrollAmount = cardWidth + gapValue

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
        <section className="w-full pb-12 pt-10 md:pb-16 md:pt-14">
          <div className="relative mx-auto w-full max-w-[520px] md:max-w-6xl">
            <div
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto px-6 pb-5 md:gap-6 md:overflow-visible md:px-0 lg:gap-8 scrollbar-hide snap-x snap-center scroll-smooth md:justify-center"
              style={{ scrollBehavior: "smooth", scrollPaddingInline: "var(--scroll-padding)" }}
            >
              {/* Added NEW ITEMS banner as per design */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-full max-w-[228px] md:max-w-none md:w-[20rem] hidden md:block">
                <div
                  className="bg-black text-white text-[10px] tracking-[0.2em] py-2 text-center"
                  style={{ fontFamily: 'var(--font-avenir-medium)', fontWeight: 500 }}
                >
                  NEW ITEMS
                </div>
              </div>

              {newItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="carousel-card group flex shrink-0 snap-center flex-col overflow-hidden rounded-[22px] border border-[#dcd2c6] bg-gradient-to-b from-[#f7f0e6] to-white shadow-[0_20px_34px_rgba(24,24,24,0.08)] transition-transform duration-300 hover:-translate-y-[6px]"
                >
                  <div className="relative aspect-[3/4] w-full bg-[#f5efe4]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-contain transition duration-300"
                    />
                  </div>
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              className="absolute left-2 top-1/2 z-10 md:hidden flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d0c3b3] bg-white text-[#181818] shadow-[0_18px_34px_rgba(24,24,24,0.12)] transition hover:bg-[#f8f1e6]"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              className="absolute right-2 top-1/2 z-10 md:hidden flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d0c3b3] bg-white text-[#181818] shadow-[0_18px_34px_rgba(24,24,24,0.12)] transition hover:bg-[#f8f1e6]"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
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
                  <p
                    className="px-4 text-xs uppercase tracking-[0.18em] text-[#6f6f6f] md:px-0"
                    style={{ fontFamily: 'var(--font-avenir-medium)', fontWeight: 500 }}
                  >
                    {photo.location}, MANHATTAN
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scrollbar Hide Styles */}
        <style>{`
          .carousel-card {
            flex: 0 0 calc((min(100vw, 520px) - 46px) / 2);
            max-width: 228px;
            width: calc((min(100vw, 520px) - 46px) / 2);
          }
          @media (min-width: 640px) {
            .carousel-card {
              flex-basis: 16rem;
              max-width: 16rem;
              width: 16rem;
            }
          }
          @media (min-width: 768px) {
            .carousel-card {
              flex: 0 0 auto;
              max-width: none;
              width: 18rem;
            }
          }
          @media (min-width: 1024px) {
            .carousel-card {
              width: 20rem;
            }
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </>
  )
}
