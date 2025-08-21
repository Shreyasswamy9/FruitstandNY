"use client"

import { useState } from "react"
import Navbar from "../../components/Navbar"

export default function CartPage() {
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isShopDropdownOpen={isShopDropdownOpen} setIsShopDropdownOpen={setIsShopDropdownOpen} />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">Your cart is currently empty</p>
            <p className="text-gray-500 mt-2">Add some items to get started!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
