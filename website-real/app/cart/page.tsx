/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState } from "react"
import StaggeredMenu from "../../components/StagerredMenu"
import { motion } from "framer-motion"
import { useCart } from "../../components/CartContext"
import Image from "next/image"
import { useCheckout } from "../../hooks/useCheckout"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' | 'shipping' } | null>(null)
  const [couponError, setCouponError] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showGuestCheckout, setShowGuestCheckout] = useState(false)
  const [guestFormErrors, setGuestFormErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: ""
  })
  const [guestData, setGuestData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US"
    },
    marketing: {
      emailUpdates: false,
      analytics: true
    }
  })
  const { items, removeFromCart, clearCart, addToCart } = useCart();
  const { redirectToCheckout, loading: checkoutLoading, error: checkoutError } = useCheckout();
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Coupon validation function
  const validateCoupon = async (code: string) => {
    setCouponLoading(true);
    setCouponError("");
    
    // Simulate API call - replace with actual coupon validation logic
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Mock coupon codes for demonstration
      const validCoupons = {
        'SAVE10': { discount: 10, type: 'percentage' as const },
        'WELCOME20': { discount: 20, type: 'percentage' as const },
        'SAVE5': { discount: 5, type: 'fixed' as const },
        'FREESHIP': { discount: 0, type: 'shipping' as const },
        'STUDENT15': { discount: 15, type: 'percentage' as const },
      };
      
      const coupon = validCoupons[code.toUpperCase() as keyof typeof validCoupons];
      
      if (coupon) {
        setAppliedCoupon({ code: code.toUpperCase(), ...coupon });
        setCouponCode("");
        setCouponError("");
      } else {
        setCouponError("Invalid coupon code. Please try again.");
      }
    } catch{
      setCouponError("Error validating coupon. Please try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const item = items.find(i => i.productId === productId);
    if (item) {
      // Remove the item first
      removeFromCart(productId);
      // Add it back with new quantity
      addToCart({ ...item, quantity: newQuantity });
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal >= 20 ? 0 : 8.99;
  const isPriorityShipping = subtotal >= 125;
  
  // Apply coupon discount
  let discount = 0;
  let discountedSubtotal = subtotal;
  let freeShipping = shipping === 0;
  
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = subtotal * (appliedCoupon.discount / 100);
      discountedSubtotal = subtotal - discount;
    } else if (appliedCoupon.type === 'fixed') {
      discount = Math.min(appliedCoupon.discount, subtotal);
      discountedSubtotal = subtotal - discount;
    } else if (appliedCoupon.type === 'shipping') {
      freeShipping = true;
    }
  }
  
  const finalShipping = freeShipping ? 0 : shipping;
  const tax = discountedSubtotal * 0.08875; // NY tax rate
  const total = discountedSubtotal + finalShipping + tax;

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // Check if user is authenticated
    if (!isSignedIn && !showGuestCheckout) {
      setShowSignInModal(true);
      return;
    }

    // For guest checkout, validate essential info
    if (showGuestCheckout) {
      if (!validateGuestForm()) {
        // Error messages are already set by validateGuestForm()
        return;
      }
    }

    // Check if user has completed their profile (you'll need to add this to your user model)
    // For now, we'll assume all authenticated users can checkout
    // if (!session?.user?.profileComplete) {
    //   router.push("/account/complete-profile?redirect=cart");
    //   return;
    // }

    try {
      if (showGuestCheckout) {
        // Guest checkout with collected data
        await redirectToCheckout({
          items: items,
          shipping: finalShipping,
          tax: tax,
          guestData: {
            email: guestData.email,
            firstName: guestData.firstName,
            lastName: guestData.lastName,
            phone: guestData.phone,
            address: guestData.address,
          },
        });
      } else {
        // Authenticated user checkout
        await redirectToCheckout({
          items: items,
          shipping: finalShipping,
          tax: tax,
          customerData: user ? {
            email: user.emailAddresses[0]?.emailAddress || "",
            name: user.fullName || "",
            // Add more user data if available from session
          } : undefined,
        });
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateZipCode = (zipCode: string): string => {
    if (!zipCode) return "ZIP code is required";
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(zipCode)) return "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)";
    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone) return ""; // Phone is optional
    const phoneRegex = /^[\+]?[1-9][\d]{0,2}?[-\s\.]?[\(]?\d{3}[\)]?[-\s\.]?\d{3}[-\s\.]?\d{4}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) return "Please enter a valid phone number";
    return "";
  };

  const validateRequired = (value: string, fieldName: string): string => {
    if (!value || value.trim() === "") return `${fieldName} is required`;
    return "";
  };

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "email":
        return validateEmail(value);
      case "firstName":
        return validateRequired(value, "First name");
      case "lastName":
        return validateRequired(value, "Last name");
      case "phone":
        return validatePhone(value);
      case "address.street":
        return validateRequired(value, "Street address");
      case "address.city":
        return validateRequired(value, "City");
      case "address.state":
        return validateRequired(value, "State");
      case "address.zipCode":
        return validateZipCode(value);
      default:
        return "";
    }
  };

  const handleGuestInputChange = (field: string, value: string | boolean) => {
    // Clear error for this field when user starts typing
    if (typeof value === "string") {
      const errorKey = field.includes(".") ? field.split(".")[1] : field;
      setGuestFormErrors(prev => ({
        ...prev,
        [errorKey]: ""
      }));
    }

    // Update the form data
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setGuestData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof guestData] as object),
          [child]: value
        }
      }));
    } else {
      setGuestData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateGuestForm = (): boolean => {
    const errors = {
      email: validateField("email", guestData.email),
      firstName: validateField("firstName", guestData.firstName),
      lastName: validateField("lastName", guestData.lastName),
      phone: validateField("phone", guestData.phone),
      street: validateField("address.street", guestData.address.street),
      city: validateField("address.city", guestData.address.city),
      state: validateField("address.state", guestData.address.state),
      zipCode: validateField("address.zipCode", guestData.address.zipCode)
    };

    setGuestFormErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some(error => error !== "");
  };

  const handleGuestCheckoutSubmit = async () => {
    if (!validateGuestForm()) {
      return; // Don't proceed if validation fails
    }

    // Proceed with checkout if validation passes
    await handleCheckout();
  };

  const handleContinueAsGuest = () => {
    setShowGuestCheckout(true);
    setShowSignInModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            Shopping Cart
          </motion.h1>
          <p className="text-gray-600 mt-2">
            {items.length === 0 ? "Your cart is empty" : `${items.length} item${items.length !== 1 ? 's' : ''} in your cart`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven`t added any items to your cart yet. Start shopping to fill it up!
            </p>
            <motion.a
              href="/shop"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-2">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                      style={{ willChange: "transform", backfaceVisibility: "hidden" }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        
                        {/* Product Details - Full width on mobile */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
                            {item.size && (
                              <span className="text-sm text-gray-500">Size: {item.size}</span>
                            )}
                            {item.color && (
                              <span className="text-sm text-gray-500">Color: {item.color}</span>
                            )}
                          </div>
                          <p className="text-lg font-bold text-gray-900 mt-2">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        
                        {/* Mobile: Quantity and actions in a row */}
                        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:space-y-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            
                            <span className="text-lg font-semibold min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Item Total and Remove - Mobile: side by side, Desktop: stacked */}
                          <div className="flex items-center space-x-3 sm:flex-col sm:space-x-0 sm:space-y-2 sm:items-end">
                            <p className="text-lg font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Clear Cart Button */}
                <div className="p-4 sm:p-6 border-t border-gray-200">
                  <button
                    onClick={clearCart}
                    className="w-full py-3 border border-red-300 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-8"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Coupon Code Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Promo Code</h3>
                  
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium text-green-700">
                          {appliedCoupon.code} applied
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Enter promo code"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                          disabled={couponLoading}
                        />
                        <button
                          onClick={() => validateCoupon(couponCode)}
                          disabled={!couponCode.trim() || couponLoading}
                          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {couponLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            'Apply'
                          )}
                        </button>
                      </div>
                      
                      {couponError && (
                        <p className="text-red-500 text-xs mt-1">{couponError}</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedCoupon && discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {finalShipping === 0 ? (
                        appliedCoupon?.type === 'shipping' ? (
                          <span className="text-green-600">FREE (Promo)</span>
                        ) : isPriorityShipping ? (
                          'FREE PRIORITY'
                        ) : (
                          'FREE'
                        )
                      ) : (
                        `$${finalShipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {finalShipping === 0 && isPriorityShipping && appliedCoupon?.type !== 'shipping' && (
                    <p className="text-sm text-purple-600 font-medium">
                      ⚡ Priority shipping included!
                    </p>
                  )}
                  
                  {finalShipping === 0 && !isPriorityShipping && appliedCoupon?.type !== 'shipping' && (
                    <p className="text-sm text-green-600 font-medium">
                      🎉 You qualify for free shipping!
                    </p>
                  )}
                  
                  {appliedCoupon?.type === 'shipping' && (
                    <p className="text-sm text-green-600 font-medium">
                      🎫 Free shipping from promo code!
                    </p>
                  )}
                  
                  {subtotal < 20 && subtotal > 0 && appliedCoupon?.type !== 'shipping' && (
                    <p className="text-sm text-gray-500">
                      Add ${(20 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                  
                  {subtotal >= 20 && subtotal < 125 && appliedCoupon?.type !== 'shipping' && (
                    <p className="text-sm text-purple-500">
                      Add ${(125 - subtotal).toFixed(2)} more for priority shipping!
                    </p>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.15 }}
                  onClick={handleCheckout}
                  disabled={items.length === 0 || checkoutLoading}
                  className="w-full mt-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ willChange: "transform" }}
                >
                  {checkoutLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : !isSignedIn && !showGuestCheckout ? (
                    'Sign In to Checkout'
                  ) : (
                    'Proceed to Checkout'
                  )}
                </motion.button>
                
                {!isSignedIn && !showGuestCheckout && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-800 mb-1">Choose Your Checkout Method</h4>
                        <p className="text-xs text-blue-700 mb-3">
                          Create an account for faster future checkouts and exclusive offers, or continue as a guest.
                        </p>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => router.push("/auth/signin?redirect=cart")}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Sign In / Create Account
                          </button>
                          <button
                            onClick={handleContinueAsGuest}
                            className="px-4 py-2 border border-blue-300 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            Continue as Guest
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                
                {checkoutError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{checkoutError}</p>
                  </div>
                )}
                
                <motion.a
                  href="/shop"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.15 }}
                  className="w-full mt-4 py-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-center block"
                  style={{ willChange: "transform" }}
                >
                  Continue Shopping
                </motion.a>

                {/* Guest Checkout Form - Moved below Continue Shopping */}
                {showGuestCheckout && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-gray-800">Guest Checkout Information</h4>
                      <button
                        onClick={() => setShowGuestCheckout(false)}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Contact Information */}
                      <div>
                        <h5 className="text-xs font-medium text-gray-700 mb-2">CONTACT INFORMATION</h5>
                        <div className="space-y-3">
                          <input
                            type="email"
                            placeholder="Email address *"
                            value={guestData.email}
                            onChange={(e) => handleGuestInputChange("email", e.target.value)}
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                              guestFormErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            required
                          />
                          {guestFormErrors.email && (
                            <p className="text-red-500 text-xs mt-1">{guestFormErrors.email}</p>
                          )}
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="First name *"
                              value={guestData.firstName}
                              onChange={(e) => handleGuestInputChange("firstName", e.target.value)}
                              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                                guestFormErrors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                              }`}
                              required
                            />
                            {guestFormErrors.firstName && (
                              <p className="text-red-500 text-xs mt-1">{guestFormErrors.firstName}</p>
                            )}
                            <input
                              type="text"
                              placeholder="Last name *"
                              value={guestData.lastName}
                              onChange={(e) => handleGuestInputChange("lastName", e.target.value)}
                              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                                guestFormErrors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                              }`}
                              required
                            />
                            {guestFormErrors.lastName && (
                              <p className="text-red-500 text-xs mt-1">{guestFormErrors.lastName}</p>
                            )}
                          </div>
                          <input
                            type="tel"
                            placeholder="Phone number"
                            value={guestData.phone}
                            onChange={(e) => handleGuestInputChange("phone", e.target.value)}
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                              guestFormErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                          />
                          {guestFormErrors.phone && (
                            <p className="text-red-500 text-xs mt-1">{guestFormErrors.phone}</p>
                          )}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h5 className="text-xs font-medium text-gray-700 mb-2">SHIPPING ADDRESS</h5>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Street address *"
                            value={guestData.address.street}
                            onChange={(e) => handleGuestInputChange("address.street", e.target.value)}
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                              guestFormErrors.street ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            required
                          />
                          {guestFormErrors.street && (
                            <p className="text-red-500 text-xs mt-1">{guestFormErrors.street}</p>
                          )}
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <input
                                type="text"
                                placeholder="City *"
                                value={guestData.address.city}
                                onChange={(e) => handleGuestInputChange("address.city", e.target.value)}
                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                                  guestFormErrors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                                required
                              />
                              {guestFormErrors.city && (
                                <p className="text-red-500 text-xs mt-1">{guestFormErrors.city}</p>
                              )}
                            </div>
                            <div>
                              <input
                                type="text"
                                placeholder="State *"
                                value={guestData.address.state}
                                onChange={(e) => handleGuestInputChange("address.state", e.target.value)}
                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                                  guestFormErrors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                                required
                              />
                              {guestFormErrors.state && (
                                <p className="text-red-500 text-xs mt-1">{guestFormErrors.state}</p>
                              )}
                            </div>
                            <div>
                              <input
                                type="text"
                                placeholder="ZIP *"
                                value={guestData.address.zipCode}
                                onChange={(e) => handleGuestInputChange("address.zipCode", e.target.value)}
                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                                  guestFormErrors.zipCode ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                                required
                              />
                              {guestFormErrors.zipCode && (
                                <p className="text-red-500 text-xs mt-1">{guestFormErrors.zipCode}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Marketing Preferences */}
                      <div className="pt-3 border-t border-gray-200">
                        <div className="space-y-2">
                          <label className="flex items-start">
                            <input
                              type="checkbox"
                              checked={guestData.marketing.emailUpdates}
                              onChange={(e) => handleGuestInputChange("marketing.emailUpdates", e.target.checked)}
                              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black mt-0.5"
                            />
                            <span className="ml-2 text-xs text-gray-600">
                              Email me about new products and exclusive offers
                            </span>
                          </label>
                          <label className="flex items-start">
                            <input
                              type="checkbox"
                              checked={guestData.marketing.analytics}
                              onChange={(e) => handleGuestInputChange("marketing.analytics", e.target.checked)}
                              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black mt-0.5"
                            />
                            <span className="ml-2 text-xs text-gray-600">
                              Help improve our service with anonymous usage data
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            Want faster checkout next time?
                          </p>
                          <button
                            onClick={() => router.push("/auth/signup?redirect=cart")}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Create Account
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Complete Guest Checkout Button */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.15 }}
                      onClick={handleGuestCheckoutSubmit}
                      disabled={items.length === 0 || checkoutLoading}
                      className="w-full mt-6 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ willChange: "transform" }}
                    >
                      {checkoutLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        'Complete Guest Checkout'
                      )}
                    </motion.button>
                  </div>
                )}
                
                {/* Security Badges */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center mb-4">Secure checkout guaranteed</p>
                  <div className="flex justify-center space-x-4 opacity-60">
                    <div className="text-xs text-gray-400">🔒 SSL Secured</div>
                    <div className="text-xs text-gray-400">✓ Safe Payment</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* StaggeredMenu Component */}
      <div 
        style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          width: "100vw", 
          height: "100vh", 
          zIndex: 10001, 
          pointerEvents: menuOpen ? "auto" : "none",
          opacity: 1,
          visibility: "visible"
        }}
      >
        <StaggeredMenu
          position="right"
          colors={['#18191a', '#232324']}
          className="custom-staggered-menu"
          items={[
            { label: "Home", ariaLabel: "Go to homepage", link: "/" },
            { label: "Shop", ariaLabel: "Browse our products", link: "/shop" },
            { label: "Contact", ariaLabel: "Contact us", link: "/contact" },
            { label: "Account", ariaLabel: "Access your account", link: "/account" }
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

      {/* Optimized styles for StaggeredMenu performance */}
      <style jsx>{`
        .custom-staggered-menu {
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .custom-staggered-menu .staggered-menu-header {
          pointer-events: auto !important;
          position: relative !important;
          z-index: 10003 !important;
        }

        .custom-staggered-menu .sm-toggle {
          background: rgba(0, 0, 0, 0.8) !important;
          border: 2px solid rgba(255, 255, 255, 0.2) !important;
          color: #fff !important;
          border-radius: 12px !important;
          min-width: 80px !important;
          height: 44px !important;
          backdrop-filter: blur(10px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
          padding: 0 16px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease !important;
          pointer-events: auto !important;
          cursor: pointer !important;
          will-change: transform, background-color !important;
          transform: translateZ(0) !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .custom-staggered-menu .sm-toggle:hover {
          background: rgba(0, 0, 0, 0.9) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          color: #fff !important;
          transform: translateZ(0) scale(1.05) !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
        }

        .custom-staggered-menu[data-open] .sm-toggle {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 2px solid rgba(0, 0, 0, 0.2) !important;
          color: #000 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
        }

        .custom-staggered-menu[data-open] .sm-toggle:hover {
          background: rgba(255, 255, 255, 1) !important;
          border-color: rgba(0, 0, 0, 0.3) !important;
          color: #000 !important;
          transform: translateZ(0) scale(1.05) !important;
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

        /* Hardware acceleration for better performance */
        .custom-staggered-menu .sm-panel,
        .custom-staggered-menu .sm-prelayer,
        .custom-staggered-menu .sm-toggle {
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
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
