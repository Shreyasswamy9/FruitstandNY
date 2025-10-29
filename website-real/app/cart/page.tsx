/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState } from "react"
import Link from "next/link"
// import StaggeredMenu from "../../components/StagerredMenu"
import { motion } from "framer-motion"
import { useCart } from "../../components/CartContext"
import Image from "next/image"
import { useCheckout } from "../../hooks/useCheckout"
import { supabase } from "../supabase-client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

export default function CartPage() {
  // const [menuOpen, setMenuOpen] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' | 'shipping' } | null>(null)
  const [couponError, setCouponError] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showGuestCheckout, setShowGuestCheckout] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }>>([])
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false)

  // Country codes for phone numbers
  const countryCodes = [
    { code: "+1", country: "US", name: "United States" },
    { code: "+1", country: "CA", name: "Canada" },
    { code: "+44", country: "GB", name: "United Kingdom" },
    { code: "+33", country: "FR", name: "France" },
    { code: "+49", country: "DE", name: "Germany" },
    { code: "+39", country: "IT", name: "Italy" },
    { code: "+34", country: "ES", name: "Spain" },
    { code: "+31", country: "NL", name: "Netherlands" },
    { code: "+32", country: "BE", name: "Belgium" },
    { code: "+41", country: "CH", name: "Switzerland" },
    { code: "+43", country: "AT", name: "Austria" },
    { code: "+45", country: "DK", name: "Denmark" },
    { code: "+46", country: "SE", name: "Sweden" },
    { code: "+47", country: "NO", name: "Norway" },
    { code: "+358", country: "FI", name: "Finland" },
    { code: "+91", country: "IN", name: "India" },
    { code: "+86", country: "CN", name: "China" },
    { code: "+81", country: "JP", name: "Japan" },
    { code: "+82", country: "KR", name: "South Korea" },
    { code: "+61", country: "AU", name: "Australia" },
    { code: "+64", country: "NZ", name: "New Zealand" },
    { code: "+55", country: "BR", name: "Brazil" },
    { code: "+52", country: "MX", name: "Mexico" },
    { code: "+27", country: "ZA", name: "South Africa" }
  ];
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
    phoneCountryCode: "+1",
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
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [user, setUser] = React.useState<User | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      setUser(data.user ?? null)
      setIsSignedIn(!!data.user)
    })()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      setIsSignedIn(!!u)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])
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

  // Calculate available offers to entice more purchases
  const getAvailableOffers = () => {
    const offers = [];
    
    // Free shipping offer
    if (subtotal < 20 && subtotal > 0) {
      const needed = 20 - subtotal;
      offers.push({
        type: 'shipping',
        message: `Add $${needed.toFixed(2)} more for FREE shipping!`,
        savings: 8.99,
        threshold: 20,
        current: subtotal
      });
    }
    
    // Priority shipping offer
    if (subtotal >= 20 && subtotal < 125) {
      const needed = 125 - subtotal;
      offers.push({
        type: 'priority',
        message: `Add $${needed.toFixed(2)} more for FREE priority shipping!`,
        savings: 15.99,
        threshold: 125,
        current: subtotal
      });
    }
    
    // Bulk discount offers
    if (subtotal < 50) {
      const needed = 50 - subtotal;
      offers.push({
        type: 'bulk',
        message: `Spend $${needed.toFixed(2)} more and save 10% with code SAVE10!`,
        savings: subtotal * 0.1 + needed * 0.1,
        threshold: 50,
        current: subtotal
      });
    }
    
    if (subtotal < 100) {
      const needed = 100 - subtotal;
      offers.push({
        type: 'bulk',
        message: `Spend $${needed.toFixed(2)} more and save 20% with code WELCOME20!`,
        savings: subtotal * 0.2 + needed * 0.2,
        threshold: 100,
        current: subtotal
      });
    }
    
    return offers;
  };

  const availableOffers = getAvailableOffers();

  // Address autocomplete function
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 2) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    try {
      // Try to use the Places API first
      try {
        const response = await fetch(`/api/places?query=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.suggestions && data.suggestions.length > 0) {
            setAddressSuggestions(data.suggestions);
            setShowAddressSuggestions(true);
            return;
          }
        }
      } catch (apiError) {
        console.log('Places API not available, using fallback');
      }

      // Fallback to expanded mock address database
      const mockAddressDatabase = [
        // New York addresses
        { street: "123 Main Street", city: "New York", state: "NY", zipCode: "10001" },
        { street: "456 Broadway", city: "New York", state: "NY", zipCode: "10012" },
        { street: "789 Fifth Avenue", city: "New York", state: "NY", zipCode: "10022" },
        { street: "321 Park Avenue", city: "New York", state: "NY", zipCode: "10016" },
        { street: "654 Wall Street", city: "New York", state: "NY", zipCode: "10005" },
        { street: "987 Madison Avenue", city: "New York", state: "NY", zipCode: "10021" },
        { street: "147 Central Park West", city: "New York", state: "NY", zipCode: "10023" },
        { street: "258 West 14th Street", city: "New York", state: "NY", zipCode: "10011" },
        { street: "369 East 76th Street", city: "New York", state: "NY", zipCode: "10021" },
        { street: "741 Amsterdam Avenue", city: "New York", state: "NY", zipCode: "10025" },
        
        // Los Angeles addresses
        { street: "1001 Wilshire Boulevard", city: "Los Angeles", state: "CA", zipCode: "90017" },
        { street: "2020 Santa Monica Boulevard", city: "Los Angeles", state: "CA", zipCode: "90404" },
        { street: "3030 Sunset Boulevard", city: "Los Angeles", state: "CA", zipCode: "90026" },
        { street: "4040 Hollywood Boulevard", city: "Los Angeles", state: "CA", zipCode: "90028" },
        { street: "5050 Melrose Avenue", city: "Los Angeles", state: "CA", zipCode: "90038" },
        
        // Chicago addresses
        { street: "100 North Michigan Avenue", city: "Chicago", state: "IL", zipCode: "60601" },
        { street: "200 South State Street", city: "Chicago", state: "IL", zipCode: "60604" },
        { street: "300 West Roosevelt Road", city: "Chicago", state: "IL", zipCode: "60607" },
        
        // Miami addresses
        { street: "1500 Ocean Drive", city: "Miami Beach", state: "FL", zipCode: "33139" },
        { street: "2600 Biscayne Boulevard", city: "Miami", state: "FL", zipCode: "33137" },
        
        // Common street patterns that match any input
        { street: `${query.charAt(0).toUpperCase() + query.slice(1)} Street`, city: "New York", state: "NY", zipCode: "10001" },
        { street: `${query.charAt(0).toUpperCase() + query.slice(1)} Avenue`, city: "New York", state: "NY", zipCode: "10003" },
        { street: `${query.charAt(0).toUpperCase() + query.slice(1)} Boulevard`, city: "Los Angeles", state: "CA", zipCode: "90210" },
        { street: `${query.charAt(0).toUpperCase() + query.slice(1)} Drive`, city: "Chicago", state: "IL", zipCode: "60601" },
        { street: `${query.charAt(0).toUpperCase() + query.slice(1)} Lane`, city: "Miami", state: "FL", zipCode: "33101" }
      ];

      // Smart filtering with multiple match criteria
      const filteredSuggestions = mockAddressDatabase.filter(addr => {
        const queryLower = query.toLowerCase();
        return (
          addr.street.toLowerCase().includes(queryLower) ||
          addr.city.toLowerCase().includes(queryLower) ||
          addr.state.toLowerCase().includes(queryLower) ||
          addr.zipCode.includes(query) ||
          // Partial word matching
          addr.street.toLowerCase().split(' ').some(word => word.startsWith(queryLower)) ||
          addr.city.toLowerCase().split(' ').some(word => word.startsWith(queryLower))
        );
      }).slice(0, 8); // Limit to 8 suggestions

      setAddressSuggestions(filteredSuggestions);
      setShowAddressSuggestions(filteredSuggestions.length > 0);

    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
    }
  };

  const selectAddressSuggestion = (suggestion: { street: string; city: string; state: string; zipCode: string }) => {
    setGuestData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        street: suggestion.street,
        city: suggestion.city,
        state: suggestion.state,
        zipCode: suggestion.zipCode
      }
    }));
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // Check if user is authenticated
    if (!isSignedIn && !showGuestCheckout) {
      // Redirect to Supabase sign-in page
      router.push('/signin')
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
            phone: guestData.phoneCountryCode + guestData.phone,
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
            email: user.email || "",
            name: user.user_metadata?.full_name || user.user_metadata?.name || "",
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
      <div className="bg-white shadow-sm border-b pt-20 sm:pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
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
                        {/* Product Image - Clickable */}
                        <Link 
                          href={`/shop/${item.productId}`}
                          className="relative w-20 h-20 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 hover:ring-2 hover:ring-black hover:ring-opacity-50 transition-all duration-200 cursor-pointer"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-200"
                            sizes="80px"
                          />
                        </Link>
                        
                        {/* Product Details - Full width on mobile */}
                        <div className="flex-1 min-w-0">
                          <Link 
                            href={`/shop/${item.productId}`}
                            className="block hover:text-blue-600 transition-colors duration-200"
                          >
                            <h3 className="text-lg font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">
                              {item.name}
                            </h3>
                          </Link>
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
                
                {/* Available Offers Section */}
                {availableOffers.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 mb-6">
                    <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center">
                      <span className="mr-2">🎉</span>
                      Available Offers - Save More!
                    </h4>
                    <div className="space-y-3">
                      {availableOffers.map((offer, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border border-purple-100">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 font-medium">{offer.message}</p>
                              <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${(offer.current / offer.threshold) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="ml-3 text-right">
                              <p className="text-xs text-gray-500">Save up to</p>
                              <p className="text-sm font-bold text-green-600">${offer.savings.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                        <h4 className="text-sm font-semibold text-blue-800 mb-1">Sign In or Continue as Guest</h4>
                        <p className="text-xs text-blue-700 mb-3">
                          Sign in for faster checkout and exclusive offers, or continue as a guest.
                        </p>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => router.push('/signin')}
                            className="w-full px-4 py- bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Sign In for Faster Checkout
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
                          <div className="flex space-x-2">
                            <select
                              value={guestData.phoneCountryCode}
                              onChange={(e) => handleGuestInputChange("phoneCountryCode", e.target.value)}
                              className="w-20 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                              title="Select country code"
                            >
                              {countryCodes.map((country) => (
                                <option key={`${country.code}-${country.country}`} value={country.code}>
                                  {country.code}
                                </option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              placeholder="Phone number"
                              value={guestData.phone}
                              onChange={(e) => handleGuestInputChange("phone", e.target.value)}
                              className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                                guestFormErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                              }`}
                            />
                          </div>
                          {guestFormErrors.phone && (
                            <p className="text-red-500 text-xs mt-1">{guestFormErrors.phone}</p>
                          )}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h5 className="text-xs font-medium text-gray-700 mb-2">SHIPPING ADDRESS</h5>
                        <div className="space-y-3">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Street address * (start typing for suggestions)"
                              value={guestData.address.street}
                              onChange={(e) => {
                                handleGuestInputChange("address.street", e.target.value);
                                fetchAddressSuggestions(e.target.value);
                              }}
                              onFocus={() => {
                                if (guestData.address.street.length >= 3) {
                                  fetchAddressSuggestions(guestData.address.street);
                                }
                              }}
                              onBlur={() => {
                                // Delay hiding suggestions to allow selection
                                setTimeout(() => setShowAddressSuggestions(false), 200);
                              }}
                              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                                guestFormErrors.street ? 'border-red-500 bg-red-50' : 'border-gray-300'
                              }`}
                              required
                            />
                            {showAddressSuggestions && addressSuggestions.length > 0 && (
                              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {addressSuggestions.map((suggestion, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => selectAddressSuggestion(suggestion)}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="font-medium">{suggestion.street}</div>
                                    <div className="text-gray-500 text-xs">
                                      {suggestion.city}, {suggestion.state} {suggestion.zipCode}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
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
                            onClick={() => router.push('/signup')}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium">
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

    </div>
  )
}
