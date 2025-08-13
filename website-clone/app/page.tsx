"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import AuthModal from "@/components/auth-modal"
import UserMenu from "@/components/user-menu"
import { createClient } from "@/lib/client"
import { LogIn } from "lucide-react"

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [currentFontIndex, setCurrentFontIndex] = useState(0)

  const fontStyles = [
    "font-bold text-8xl md:text-9xl",
    "font-light italic text-8xl md:text-9xl font-serif",
    "font-mono text-7xl md:text-8xl tracking-wider",
    "font-semibold text-8xl md:text-9xl tracking-widest",
    "font-thin text-8xl md:text-9xl font-serif",
    "font-extrabold text-8xl md:text-9xl uppercase",
  ]

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Error checking user:", error)
      }
    }
    checkUser()
  }, [])

  useEffect(() => {
    if (!animationComplete) {
      const interval = setInterval(() => {
        setCurrentFontIndex((prev) => {
          if (prev >= fontStyles.length - 1) {
            clearInterval(interval)
            setTimeout(() => setAnimationComplete(true), 500)
            return prev
          }
          return prev + 1
        })
      }, 150)

      return () => clearInterval(interval)
    }
  }, [animationComplete, fontStyles.length])

  if (!animationComplete) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Corner Auth Icon */}
        <div className="fixed top-6 right-6 z-50">
          <Button
            onClick={() => setShowAuthModal(true)}
            size="icon"
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-12 h-12 shadow-lg"
          >
            <LogIn className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-center">
          <h1 className={`text-white transition-all duration-150 ${fontStyles[currentFontIndex]}`}>FRUITSTAND</h1>
        </div>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    )
  }

  return (
    <div className="bg-stone-100 text-black min-h-screen">
      {/* Corner Auth Icon */}
      <div className="fixed top-6 right-6 z-50">
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Button
            onClick={() => setShowAuthModal(true)}
            size="icon"
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-12 h-12 shadow-lg"
          >
            <LogIn className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="bg-stone-100/95 backdrop-blur-sm border-b border-stone-300">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                🍊
              </div>
              <div className="text-xl font-bold text-black">FRUITSTAND</div>
            </div>
            <div className="hidden md:flex space-x-8 text-black">
              <button className="hover:text-orange-600 transition-colors">Lookbook</button>
              <button className="hover:text-orange-600 transition-colors">Size</button>
              <button className="hover:text-orange-600 transition-colors">Subscribe</button>
              <button className="hover:text-orange-600 transition-colors">Contact</button>
              <button className="hover:text-orange-600 transition-colors">About</button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-black hover:text-orange-600">🛒</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Scrolling Ticker */}
      <div className="bg-orange-500 text-white py-2 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap">
          <span className="inline-block px-8">
            🍊 QUEENS NY 11101 🍊 FRUITSTAND 🍊 3730 REVIEW AVE 🍊 QUEENS NY 11101 🍊 FRUITSTAND 🍊 3730 REVIEW AVE 🍊
            QUEENS NY 11101 🍊 FRUITSTAND 🍊 3730 REVIEW AVE
          </span>
        </div>
      </div>

      {/* Hero Video Section */}
      <section className="relative h-screen bg-stone-200">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-100/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-black/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/30 transition-colors">
            <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
          </div>
        </div>
        <img src="/urban-bridge-handshake.png" alt="Hero background" className="w-full h-full object-cover" />
      </section>

      {/* Products Section */}
      <section className="py-20 bg-stone-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img src="/colorful-fruitstand-tshirt.png" alt="Mandarin Tee" className="w-full h-96 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Mandarin 柑子 Logo Tee</h3>
                <p className="text-gray-600 mb-4">$65.00</p>
                <select className="w-full p-2 border border-gray-300 rounded mb-4">
                  <option>Select Size</option>
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                  <option>XL</option>
                </select>
                <Button className="w-full bg-black text-white hover:bg-gray-800">Add To Cart</Button>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img src="/placeholder-508ef.png" alt="Blank Tees" className="w-full h-96 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Golden Delicious Blank Tees</h3>
                <p className="text-gray-600 mb-4">$25.00 EACH</p>
                <p className="text-sm text-gray-500 mb-4">3 FOR $60</p>
                <Button
                  variant="outline"
                  className="w-full border-black text-black hover:bg-black hover:text-white bg-transparent"
                >
                  View Options
                </Button>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img src="/vintage-tees.png" alt="Vintage Tees" className="w-full h-96 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Vintage Collection</h3>
                <p className="text-gray-600 mb-4">$45.00</p>
                <Button className="w-full bg-black text-white hover:bg-gray-800">Shop Now</Button>
              </div>
            </div>

            {/* Product 4 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img src="/placeholder-rcfo2.png" alt="Accessories" className="w-full h-96 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Accessories & Bags</h3>
                <p className="text-gray-600 mb-4">From $35.00</p>
                <Button className="w-full bg-black text-white hover:bg-gray-800">Explore</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-200 border-t border-stone-300 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-orange-600">
                    T-Shirts
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Hoodies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Accessories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Sale
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Info</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Size Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Shipping
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Newsletter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Location</h4>
              <p className="text-gray-600">
                3730 Review Ave
                <br />
                Queens, NY 11101
                <br />
                NYC
              </p>
            </div>
          </div>
          <div className="text-center text-gray-500 pt-8 border-t border-stone-300">
            <p>&copy; 2025 FRUITSTAND. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
