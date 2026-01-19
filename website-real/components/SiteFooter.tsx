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
              <svg className="w-6 h-6" viewBox="0 0 448 512" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M224 141c-58.9 0-107 48.1-107 107s48.1 107 107 107 107-48.1 107-107-48.1-107-107-107zm0 176a69 69 0 1 1 69-69 69 69 0 0 1-69 69zm146.4-194.3a25 25 0 1 1-25-25 25 25 0 0 1 25 25zM398.8 80A111.4 111.4 0 0 0 336 17.2C304.7 6.4 264.8 0 224.1 0h-.2c-40.7 0-80.6 6.4-111.9 17.2A111.4 111.4 0 0 0 49.2 80C38.4 111.3 32 151.2 32 191.9v128.2c0 40.7 6.4 80.6 17.2 111.9A111.4 111.4 0 0 0 112 430.8C143.3 441.6 183.2 448 223.9 448h.2c40.7 0 80.6-6.4 111.9-17.2a111.4 111.4 0 0 0 62.8-62.8c10.8-31.3 17.2-71.2 17.2-111.9V191.9c0-40.7-6.4-80.6-17.2-111.9zM398 320c0 34.5-5.4 68.2-15.3 94.4a71.6 71.6 0 0 1-40.7 40.7c-26.2 9.9-59.9 15.3-94.4 15.3H200c-34.5 0-68.2-5.4-94.4-15.3a71.6 71.6 0 0 1-40.7-40.7C54.9 388.2 49.5 354.5 49.5 320V192c0-34.5 5.4-68.2 15.3-94.4A71.6 71.6 0 0 1 105.5 56.9C131.7 47 165.4 41.6 199.9 41.6h47.2c34.5 0 68.2 5.4 94.4 15.3a71.6 71.6 0 0 1 40.7 40.7c9.9 26.2 15.3 59.9 15.3 94.4z"
                />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@fruitstandny"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="TikTok"
            >
              <svg className="w-6 h-6" viewBox="0 0 448 512" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M448 209.9v92.7c-35.5 0-70.3-7.4-102.9-21.7v122.7a108 108 0 1 1-108-108 111 111 0 0 1 16 1.2v82.8a29 29 0 1 1-29 29V185.3h91.2a102.4 102.4 0 0 0 102.7 102.7z"
                />
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
