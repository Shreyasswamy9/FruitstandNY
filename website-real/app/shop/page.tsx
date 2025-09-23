"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Navbar from "../../components/Navbar"
import ProductsGrid from "../../components/ProductsGridHome"

export default function ShopPage() {
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false)

  return (
  <div className="min-h-screen" style={{ background: '#fff' }}>
      {/* Navbar */}
      <Navbar isShopDropdownOpen={isShopDropdownOpen} setIsShopDropdownOpen={setIsShopDropdownOpen} />

      {/* Header */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
          >
            Fresh Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover our handpicked selection of premium apparel and accessories
          </motion.p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="pb-16">
        <ProductsGrid />
      </div>

      {/* Featured Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Why Choose Our Collection?</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              We curate only the finest quality apparel with attention to detail, comfort, and style. Each piece is
              selected to ensure you look and feel your best.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600 text-sm sm:text-base">Carefully selected materials for lasting comfort and durability</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                <p className="text-gray-600 text-sm sm:text-base">Quick and reliable shipping to get your items to you fast</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Customer Love</h3>
                <p className="text-gray-600 text-sm sm:text-base">Thousands of satisfied customers who love our products</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
