"use client"

import { useState } from "react"
import Navbar from "../../components/Navbar"

export default function AccountPage() {
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isShopDropdownOpen={isShopDropdownOpen} setIsShopDropdownOpen={setIsShopDropdownOpen} />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
            <p className="text-gray-600">Manage your account preferences and settings here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
