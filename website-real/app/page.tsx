"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Instagram, Twitter, Facebook } from "lucide-react"
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader"
import SignupPromoModal from "@/components/SignupPromoModal"

interface EditorialPhoto {
  id: string
  image: string
  location: string
}

const editorialPhotos: EditorialPhoto[] = [
  { id: "1", image: "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/images/editorial/FRUITSTANDEDITSr1-11.JPG", location: "LOWER EAST SIDE, MANHATTAN" },
  { id: "2", image: "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/images/editorial/FRUITSTANDEDITSr1-15.JPG", location: "CHINATOWN, MANHATTAN" },
  { id: "3", image: "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/images/editorial/FRUITSTANDEDITSr1-155.JPG", location: "WILLIAMSBURG, BROOKLYN" },
  { id: "4", image: "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/images/editorial/FRUITSTANDEDITSr1-21.JPG", location: "DUMBO, BROOKLYN" },
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

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return

    try {
      if (window.localStorage.getItem("signupPromoSubmitted") === "1") {
        return
      }
      if (window.sessionStorage.getItem("signupPromoShown") === "1") {
        return
      }
    } catch {
      // ignore storage failures
    }

    const onScroll = () => {
      if (window.scrollY > 220) {
        setShowSignupPromo(true)
        try {
          window.sessionStorage.setItem("signupPromoShown", "1")
        } catch {
          // ignore storage failures
        }
        window.removeEventListener("scroll", onScroll)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [isHydrated])

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
      <SignupPromoModal isOpen={showSignupPromo} onClose={() => setShowSignupPromo(false)} />
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
              className="flex justify-center gap-3 overflow-x-auto px-6 pb-5 md:gap-6 md:px-8 lg:px-12 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollBehavior: "smooth" }}
            >
              {newItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="carousel-card group flex shrink-0 snap-start flex-col overflow-hidden rounded-[22px] border border-[#dcd2c6] bg-gradient-to-b from-[#f7f0e6] to-white shadow-[0_20px_34px_rgba(24,24,24,0.08)] transition-transform duration-300 hover:-translate-y-[6px]"
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
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d0c3b3] bg-white text-[#181818] shadow-[0_18px_34px_rgba(24,24,24,0.12)] transition hover:bg-[#f8f1e6]"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d0c3b3] bg-white text-[#181818] shadow-[0_18px_34px_rgba(24,24,24,0.12)] transition hover:bg-[#f8f1e6]"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

        </section>

        {/* Editorial Photos Section */}
        <section className="px-0 md:px-8 py-12 md:py-20">
          <div className="mx-auto w-full max-w-[1600px]">
            <h2 className="mx-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#181818] mb-8 md:mx-0">
              Editorial
            </h2>

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

        {/* Footer */}
        <footer className="border-t border-[#181818]/10 bg-white/60 backdrop-blur px-4 md:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Column 1: Brand */}
              <div>
                <h3 className="text-lg font-semibold uppercase tracking-[0.22em] text-[#181818] mb-4">
                  FRUITSTAND®
                </h3>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#6f6f6f] max-w-xs">
                  New York–based fashion collective dedicated to timeless design and community.
                </p>
              </div>

              {/* Column 2: Quick Links */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#181818] mb-3">
                    Shop
                  </p>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/shop" className="text-xs text-[#6f6f6f] hover:text-[#181818] transition">
                        All Products
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop" className="text-xs text-[#6f6f6f] hover:text-[#181818] transition">
                        New Arrivals
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#181818] mb-3">
                    Support
                  </p>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/contact" className="text-xs text-[#6f6f6f] hover:text-[#181818] transition">
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq" className="text-xs text-[#6f6f6f] hover:text-[#181818] transition">
                        FAQ
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#181818] mb-3">
                    Legal
                  </p>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/privacy-policy" className="text-xs text-[#6f6f6f] hover:text-[#181818] transition">
                        Privacy
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms-and-conditions" className="text-xs text-[#6f6f6f] hover:text-[#181818] transition">
                        Terms
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-[#181818]/10 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6f6f6f]">
                © 2026 FRUITSTAND®. All rights reserved.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/fruitstandny"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#181818]/10 bg-white hover:border-[#181818]/30 hover:bg-[#f5eee4] transition"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 text-[#181818]" />
                </a>
                <a
                  href="https://x.com/fruitstandny"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#181818]/10 bg-white hover:border-[#181818]/30 hover:bg-[#f5eee4] transition"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4 text-[#181818]" />
                </a>
                <a
                  href="https://www.facebook.com/fruitstandny"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#181818]/10 bg-white hover:border-[#181818]/30 hover:bg-[#f5eee4] transition"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4 text-[#181818]" />
                </a>
              </div>
            </div>
          </div>
        </footer>

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
              flex-basis: 18rem;
              max-width: 18rem;
              width: 18rem;
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
