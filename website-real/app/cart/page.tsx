"use client"

import { useState } from "react"
import Navbar from "../../components/Navbar"
import { useCart } from "../../components/CartContext"

export default function CartPage() {
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false)
  const { items, removeFromCart, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isShopDropdownOpen={isShopDropdownOpen} setIsShopDropdownOpen={setIsShopDropdownOpen} />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg">Your cart is currently empty</p>
              <p className="text-gray-500 mt-2">Add some items to get started!</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8">
              <ul className="divide-y divide-gray-200">
                {items.map(item => (
                  <li key={item.productId} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <div className="font-semibold text-lg">{item.name}</div>
                        <div className="text-gray-500 text-sm">${item.price} × {item.quantity}</div>
                      </div>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-8">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
                <div className="text-xl font-bold">
                  Total: ${items.reduce((sum, i) => sum + i.price * i.quantity, 0)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
