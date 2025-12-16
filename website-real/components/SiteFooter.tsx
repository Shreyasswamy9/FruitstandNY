"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              FRUITSTAND<sup>®</sup>
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Organic New York Culture™
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
            <Link href="/cookie-policy" className="text-gray-600 hover:text-gray-900 transition-colors">Cookie Policy</Link>
            <Link href="/return-policy" className="text-gray-600 hover:text-gray-900 transition-colors">Return Policy</Link>
            <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="text-gray-600 hover:text-gray-900 transition-colors">Terms and Conditions</Link>
          </div>

          <div className="flex justify-center gap-6 mb-8">
            <a
              href="https://www.instagram.com/fruitstandny?igsh=MWNqcmFwdGRvaWQzOQ=="
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.004 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z" />
              </svg>
            </a>
            <a
              href="https://x.com/FruitStandNY"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="X"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/FRUITSTANDNY"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-500 text-sm">
              © {currentYear} FRUITSTAND<sup>®</sup>. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Designed and crafted with care in New York, NY
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
