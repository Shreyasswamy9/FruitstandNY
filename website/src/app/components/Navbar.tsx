'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ShopDropdown from './ShopDropdown';

interface NavbarProps {
  isShopDropdownOpen: boolean;
  setIsShopDropdownOpen: (open: boolean) => void;
}

export default function Navbar({ isShopDropdownOpen, setIsShopDropdownOpen }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleShopHover = (open: boolean) => {
    if (window.innerWidth > 768) {
      setIsShopDropdownOpen(open);
    }
  };

  const handleShopClick = () => {
    if (window.innerWidth <= 768) {
      setIsShopDropdownOpen(!isShopDropdownOpen);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - Shop Button */}
          <div className="relative">
            <button
              onMouseEnter={() => handleShopHover(true)}
              onMouseLeave={() => handleShopHover(false)}
              onClick={handleShopClick}
              className="text-emerald-300 hover:text-emerald-200 transition-colors duration-200 font-serif text-xl italic font-light"
            >
              Shop
            </button>
            <AnimatePresence>
              {isShopDropdownOpen && (
                <ShopDropdown />
              )}
            </AnimatePresence>
          </div>

          {/* Center - Empty space for layout balance */}
          <div className="flex-1"></div>

          {/* Right - Shopping Bag */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-white hover:text-gray-300 transition-colors duration-200">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-gray-300 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-black/20 backdrop-blur-sm"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={handleShopClick}
                  className="block w-full text-left text-white hover:text-gray-300 px-3 py-2 text-base font-medium"
                >
                  Shop
                </button>
                {isShopDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="pl-6 space-y-1"
                  >
                    <Link href="/tshirts" className="block text-white hover:text-gray-300 px-3 py-2 text-sm">
                      T-Shirts
                    </Link>
                    <Link href="/tracksuits" className="block text-white hover:text-gray-300 px-3 py-2 text-sm">
                      Tracksuits
                    </Link>
                    <Link href="/jerseys" className="block text-white hover:text-gray-300 px-3 py-2 text-sm">
                      Jerseys
                    </Link>
                    <Link href="/hats" className="block text-white hover:text-gray-300 px-3 py-2 text-sm">
                      Hats
                    </Link>
                    <Link href="/socks" className="block text-white hover:text-gray-300 px-3 py-2 text-sm">
                      Socks
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
