/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import StaggeredMenu from "../../components/StagerredMenu";
import { motion } from "framer-motion";
import { OrderService } from "@/lib/services/api";

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  orderStatus: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function AccountPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // Still loading
    
    if (!isSignedIn) {
      // User not signed in, stop loading
      setLoading(false);
      return;
    }

    // Fetch user orders
    const fetchOrders = async () => {
      try {
        const response = await OrderService.getOrders();
        if (response.success) {
          setOrders(response.data);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        console.error("Orders fetch error:", err);
        setError("Unable to connect to server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (isSignedIn) {
      fetchOrders();
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSignOut = () => {
    router.push("/");
  };

  // Show loading only while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
        
        {/* StaggeredMenu Component */}
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 10001, pointerEvents: menuOpen ? "auto" : "none" }}>
          <StaggeredMenu
            position="right"
            colors={['#18191a', '#232324']}
            className="custom-staggered-menu"
            items={[
              { label: "Home", ariaLabel: "Go to homepage", link: "/" },
              { label: "Shop", ariaLabel: "Browse collections", link: "/shop" },
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
            menuButtonColor="#ffffff"
            openMenuButtonColor="#000000"
            changeMenuColorOnOpen={true}
            accentColor="#ff6b6b"
            onMenuOpen={() => setMenuOpen(true)}
            onMenuClose={() => setMenuOpen(false)}
          />
        </div>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Animated Background */}
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-teal-900/20"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Account Access
              </h1>
              <p className="text-gray-400 mb-8 text-lg">
                Please sign in to view your account details and order history.
              </p>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <p className="text-gray-300 mb-4">
                  Sign in to access:
                </p>
                <ul className="text-left text-gray-400 space-y-2 mb-6">
                  <li>• Order history</li>
                  <li>• Account settings</li>
                  <li>• Profile management</li>
                  <li>• Saved addresses</li>
                </ul>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* StaggerredMenu Component */}
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 10001, pointerEvents: menuOpen ? "auto" : "none" }}>
          <StaggeredMenu
            position="right"
            colors={['#18191a', '#232324']}
            className="custom-staggered-menu"
            items={[
              { label: "Home", ariaLabel: "Go to homepage", link: "/" },
              { label: "Shop", ariaLabel: "Browse collections", link: "/shop" },
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
            menuButtonColor="#ffffff"
            openMenuButtonColor="#000000"
            changeMenuColorOnOpen={true}
            accentColor="#ff6b6b"
            onMenuOpen={() => setMenuOpen(true)}
            onMenuClose={() => setMenuOpen(false)}
          />
        </div>
      </div>
    );
  }

  // Show loading while fetching orders for authenticated users
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your account...</p>
          </div>
        </div>
        
        {/* StaggeredMenu Component */}
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 10001, pointerEvents: menuOpen ? "auto" : "none" }}>
          <StaggeredMenu
            position="right"
            colors={['#18191a', '#232324']}
            className="custom-staggered-menu"
            items={[
              { label: "Home", ariaLabel: "Go to homepage", link: "/" },
              { label: "Shop", ariaLabel: "Browse collections", link: "/shop" },
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
            menuButtonColor="#ffffff"
            openMenuButtonColor="#000000"
            changeMenuColorOnOpen={true}
            accentColor="#ff6b6b"
            onMenuOpen={() => setMenuOpen(true)}
            onMenuClose={() => setMenuOpen(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-teal-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="mb-6">
              <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                {/* Apple shape container */}
                <div className="w-full h-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 relative overflow-hidden"
                     style={{
                       borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                       transform: 'rotate(-15deg)'
                     }}>
                  {/* Apple indentation at top */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"
                       style={{
                         width: '8px',
                         height: '6px',
                         backgroundColor: 'rgb(15 23 42)',
                         borderRadius: '0 0 50% 50%'
                       }}></div>
                  
                  {/* Apple stem */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2"
                       style={{
                         width: '2px',
                         height: '8px',
                         backgroundColor: '#8B4513'
                       }}></div>
                  
                  {/* Apple leaf */}
                  <div className="absolute top-0 left-1/2 transform translate-x-2 -translate-y-1"
                       style={{
                         width: '6px',
                         height: '4px',
                         backgroundColor: '#22C55E',
                         borderRadius: '0 100% 0 100%',
                         transform: 'rotate(45deg)'
                       }}></div>
                  
                  {/* Shine effect */}
                  <div className="absolute top-2 left-2 w-3 h-4 bg-white/30 rounded-full transform rotate-45"></div>
                  
                  {/* User initial */}
                  <div className="absolute inset-0 flex items-center justify-center"
                       style={{ transform: 'rotate(15deg)' }}>
                    <span className="text-xl font-bold text-white drop-shadow-lg">
                      {user?.firstName?.charAt(0) || user?.fullName?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extralight tracking-wider mb-4 text-white">
              Welcome back,
            </h1>
            <p className="text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 font-light">
              {user?.firstName || user?.fullName || 'User'}
            </p>
            <p className="text-gray-400 mt-4 text-lg">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
              {(['profile', 'orders', 'settings'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-white text-black'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content Sections */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Profile Info */}
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
                  <h2 className="text-3xl font-light text-white mb-8">Account Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <div className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                          {user?.fullName || 'Not provided'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <div className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                          {user?.emailAddresses[0]?.emailAddress}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
                        <div className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                          {typeof user?.publicMetadata?.role === "string" ? user.publicMetadata.role : 'Standard User'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Member Since</label>
                        <div className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">{orders.length}</div>
                      <div className="text-gray-300">Total Orders</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(0)}
                      </div>
                      <div className="text-gray-300">Total Spent</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-teal-500/20 to-teal-600/20 backdrop-blur-sm rounded-2xl p-6 border border-teal-500/20">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-400 mb-2">
                        {user?.publicMetadata?.role === "admin" ? "VIP" : "Member"}
                      </div>
                      <div className="text-gray-300">Status</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
                  <h2 className="text-3xl font-light text-white mb-8">Order History</h2>
                  
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl mb-6">
                      {error}
                    </div>
                  )}

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 mb-6 text-lg">No orders yet</p>
                      <button
                        onClick={() => router.push("/shop")}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-semibold text-white">Order #{order.orderNumber}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-white text-lg">${order.totalAmount.toFixed(2)}</p>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                order.orderStatus === "delivered" 
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : order.orderStatus === "shipped"
                                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                  : order.orderStatus === "cancelled"
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              }`}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="border-t border-white/10 pt-4">
                            <p className="text-gray-300 mb-3">
                              Items: {order.items.map(item => `${item.name} (x${item.quantity})`).join(", ")}
                            </p>
                            <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                              View Details →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
                  <h2 className="text-3xl font-light text-white mb-8">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-white">Update Profile</h3>
                            <p className="text-gray-400 text-sm">Change your personal information</p>
                          </div>
                        </div>
                      </button>

                      <button className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-white">Security Settings</h3>
                            <p className="text-gray-400 text-sm">Manage your password and security</p>
                          </div>
                        </div>
                      </button>

                      <button className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                            <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-5 5v-5zM4 19h10v-1a3 3 0 00-3-3H7a3 3 0 00-3 3v1zM9 12a3 3 0 100-6 3 3 0 000 6z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-white">Notifications</h3>
                            <p className="text-gray-400 text-sm">Email and push notification preferences</p>
                          </div>
                        </div>
                      </button>

                      {user?.publicMetadata?.role === "admin" && (
                        <button
                          onClick={() => router.push("/admin")}
                          className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl text-left hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 group"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-white">Admin Dashboard</h3>
                              <p className="text-gray-400 text-sm">Access administrative features</p>
                            </div>
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Sign Out Button */}
                    <div className="pt-8 border-t border-white/10">
                      <button
                        onClick={handleSignOut}
                        className="w-full p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-400 hover:bg-red-500/30 transition-all duration-300 font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* StaggeredMenu Component */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 10001, pointerEvents: menuOpen ? "auto" : "none" }}>
        <StaggeredMenu
          position="right"
          colors={['#18191a', '#232324']}
          className="custom-staggered-menu"
          items={[
            { label: "Home", ariaLabel: "Go to homepage", link: "/" },
            { label: "Shop", ariaLabel: "Browse our shop", link: "/shop" },
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
          menuButtonColor="#ffffff"
          openMenuButtonColor="#000000"
          changeMenuColorOnOpen={true}
          accentColor="#ff6b6b"
          onMenuOpen={() => setMenuOpen(true)}
          onMenuClose={() => setMenuOpen(false)}
        />
      </div>

      {/* Custom styles for StaggeredMenu visibility */}
      <style jsx global>{`
        /* Ensure menu button header is always clickable */
        .custom-staggered-menu .staggered-menu-header {
          pointer-events: auto !important;
          position: relative !important;
          z-index: 10003 !important;
        }

        /* Let the StaggeredMenu component handle color changes naturally */
        .custom-staggered-menu .staggered-menu-button {
          /* Allow dynamic color changes */
        }

        .custom-staggered-menu .staggered-menu-button span {
          /* Allow dynamic color changes */
        }

        /* Animation delays for background elements */
        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
