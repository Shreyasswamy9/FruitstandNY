"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import StaggeredMenu from "../../../components/StagerredMenu"

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  preferences: {
    emailMarketing: boolean
    smsMarketing: boolean
    analytics: boolean
  }
}

export default function CompleteProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US"
    },
    preferences: {
      emailMarketing: true,
      smsMarketing: false,
      analytics: true
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "account"

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/signin?redirect=account/complete-profile${redirectTo !== "account" ? `?redirect=${redirectTo}` : ""}`)
      return
    }

    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
        email: session.user.email || ""
      }))
    }
  }, [session, status, router, redirectTo])

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ProfileData] as object),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Here you would send the profile data to your API
      const response = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          ...formData
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save profile")
      }

      // Redirect based on where user came from
      if (redirectTo === "cart") {
        router.push("/cart")
      } else {
        router.push("/account")
      }
    } catch (err) {
      setError("Failed to save profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignIn = (provider: string) => {
    signIn(provider, { 
      callbackUrl: `/account/complete-profile${redirectTo !== "account" ? `?redirect=${redirectTo}` : ""}` 
    })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
            <p className="text-gray-600">
              Help us provide you with a personalized shopping experience
            </p>
          </div>

          {!session && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Sign In Options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleSocialSignIn("google")}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
                <button
                  onClick={() => handleSocialSignIn("apple")}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Continue with Apple
                </button>
              </div>
              <div className="mt-6 text-center">
                <span className="bg-white px-4 text-gray-500">or fill out manually</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address.street}
                    onChange={(e) => handleInputChange("address.street", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.address.city}
                      onChange={(e) => handleInputChange("address.city", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.address.state}
                      onChange={(e) => handleInputChange("address.state", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.address.zipCode}
                      onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences.emailMarketing}
                    onChange={(e) => handleInputChange("preferences.emailMarketing", e.target.checked)}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Receive email updates about new products and exclusive offers
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences.smsMarketing}
                    onChange={(e) => handleInputChange("preferences.smsMarketing", e.target.checked)}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Receive SMS notifications for order updates and promotions
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences.analytics}
                    onChange={(e) => handleInputChange("preferences.analytics", e.target.checked)}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Allow us to use anonymized data to improve your shopping experience
                  </span>
                </label>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving Profile...
                </div>
              ) : (
                redirectTo === "cart" ? "Complete Profile & Checkout" : "Save Profile"
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* StaggeredMenu Component */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 10001, pointerEvents: menuOpen ? "auto" : "none" }}>
        <StaggeredMenu
          position="right"
          colors={['#18191a', '#232324']}
          className="custom-staggered-menu"
          items={[
            { label: "Home", ariaLabel: "Go to homepage", link: "/" },
            { label: "Shop", ariaLabel: "Browse our products", link: "/shop" },
            { label: "Cart", ariaLabel: "View your cart", link: "/cart" },
            { label: "Contact", ariaLabel: "Contact us", link: "/contact" }
          ]}
          socialItems={[
            { label: "Instagram", link: "https://instagram.com" },
            { label: "Twitter", link: "https://twitter.com" }
          ]}
          displaySocials={true}
          displayItemNumbering={true}
          logoUrl="/images/Fruitscale Logo.png"
          menuButtonColor="#000"
          openMenuButtonColor="#000"
          changeMenuColorOnOpen={false}
          accentColor="#ff6b6b"
          onMenuOpen={() => setMenuOpen(true)}
          onMenuClose={() => setMenuOpen(false)}
        />
      </div>

      <style jsx>{`
        .custom-staggered-menu .staggered-menu-header {
          pointer-events: auto !important;
          position: relative !important;
          z-index: 10003 !important;
        }

        .custom-staggered-menu .sm-toggle {
          background: rgba(255, 255, 255, 0.9) !important;
          border: 2px solid rgba(0, 0, 0, 0.1) !important;
          color: #000 !important;
          border-radius: 12px !important;
          min-width: 80px !important;
          height: 44px !important;
          backdrop-filter: blur(10px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          padding: 0 16px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.3s ease !important;
          pointer-events: auto !important;
          cursor: pointer !important;
        }

        .custom-staggered-menu .sm-toggle:hover {
          background: rgba(255, 255, 255, 1) !important;
          border-color: rgba(0, 0, 0, 0.2) !important;
          transform: scale(1.05) !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
        }

        .custom-staggered-menu[data-open] .sm-toggle {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.9) !important;
          color: white !important;
        }

        .custom-staggered-menu[data-open] {
          pointer-events: auto !important;
        }
        
        .custom-staggered-menu * {
          pointer-events: auto !important;
        }
        
        .custom-staggered-menu:not([data-open]) .staggered-menu-panel {
          pointer-events: none !important;
        }

        @media (max-width: 768px) {
          .custom-staggered-menu .sm-toggle {
            min-width: 60px !important;
            height: 36px !important;
            font-size: 12px !important;
            padding: 0 12px !important;
          }
        }

        @media (max-width: 480px) {
          .custom-staggered-menu .sm-toggle {
            min-width: 50px !important;
            height: 32px !important;
            font-size: 11px !important;
            padding: 0 10px !important;
          }
        }
      `}</style>
    </div>
  )
}