"use client";

import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { useRouter } from "next/navigation";
import StaggeredMenu from "../../components/StagerredMenu";
import { motion } from "framer-motion";
import { OrderService, TicketService } from "@/lib/services/api";
import type { User } from "@supabase/supabase-js";

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

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  category: string;
}

export default function AccountPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'profile-settings' | 'notifications' | 'security' | 'tickets'>('profile');
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  })
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    marketing: true,
    orderUpdates: true
  })
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [saving, setSaving] = useState(false)
  const [showTicketModal, setShowTicketModal] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      console.log('Supabase user data:', data.user) // Debug log
      setUser(data.user ?? null)
      setIsSignedIn(!!data.user)
      
      // Load user profile data from metadata
      if (data.user?.user_metadata) {
        setProfileData({
          firstName: data.user.user_metadata.firstName || '',
          lastName: data.user.user_metadata.lastName || '',
          email: data.user.email || '',
          phone: data.user.user_metadata.phone || '',
          address: data.user.user_metadata.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'US'
          }
        })
        
        setNotifications(data.user.user_metadata.notifications || {
          email: true,
          sms: false,
          marketing: true,
          orderUpdates: true
        })
      }
      
      setIsLoaded(true)
    })()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      console.log('Auth state change - user:', u) // Debug log
      setUser(u)
      setIsSignedIn(!!u)
      setIsLoaded(true)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // Still loading
    
    if (!isSignedIn) {
      // User not signed in, stop loading
      setLoading(false);
      return;
    }

    // Fetch user orders and tickets
    const fetchUserData = async () => {
      try {
        // Fetch orders
        const ordersResponse = await OrderService.getOrders();
        if (ordersResponse.success) {
          setOrders(ordersResponse.data);
        } else {
          setError("Failed to fetch orders");
        }
        
        // Fetch tickets
        const ticketsResponse = await TicketService.getTickets();
        if (ticketsResponse.success) {
          setTickets(ticketsResponse.data);
        }
      } catch (err) {
        console.error("Data fetch error:", err);
        setError("Unable to connect to server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (isSignedIn) {
      fetchUserData();
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileUpdate = async (updatedData: typeof profileData) => {
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        email: updatedData.email,
        data: {
          firstName: updatedData.firstName,
          lastName: updatedData.lastName,
          phone: updatedData.phone,
          address: updatedData.address
        }
      })
      
      if (error) throw error
      
      setProfileData(updatedData)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationUpdate = async (updatedNotifications: typeof notifications) => {
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          notifications: updatedNotifications
        }
      })
      
      if (error) throw error
      
      setNotifications(updatedNotifications)
      alert('Notification preferences updated!')
    } catch (error) {
      console.error('Error updating notifications:', error)
      alert('Failed to update notification preferences.')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = async (currentPassword: string, newPassword: string) => {
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      
      alert('Password updated successfully!')
    } catch (error) {
      console.error('Error updating password:', error)
      alert('Failed to update password. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCreateTicket = async (ticketData: {
    subject: string;
    description: string;
    category: string;
    priority: string;
  }) => {
    setSaving(true)
    try {
      const response = await TicketService.createTicket(ticketData)
      
      if (response.success) {
        setTickets(prev => [response.data, ...prev])
        setShowTicketModal(false)
        alert('Support ticket created successfully!')
      } else {
        alert('Failed to create ticket. Please try again.')
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
      alert('Failed to create ticket. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Show loading only while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
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
            logoUrl="/images/newlogo.png"
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
      <div className="min-h-screen bg-white text-gray-900">
        {/* Subtle Background Pattern */}
        <div className="fixed inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50"></div>
        </div>

        <div className="relative flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                Account Access
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                Please sign in to view your account details and order history.
              </p>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                <p className="text-gray-700 mb-4 font-medium">
                  Sign in to access:
                </p>
                <ul className="text-left text-gray-600 space-y-2 mb-6">
                  <li>• Order history</li>
                  <li>• Account settings</li>
                  <li>• Profile management</li>
                  <li>• Saved addresses</li>
                </ul>
                <button
                  onClick={() => router.push('/signin')}
                  className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
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
            logoUrl="/images/newlogo.png"
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
      <div className="min-h-screen bg-white text-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your account...</p>
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
            logoUrl="/images/newlogo.png"
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
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
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
                      {user?.user_metadata?.full_name?.charAt(0) || user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extralight tracking-wider mb-4 text-gray-900">
              Welcome back,
            </h1>
            <p className="text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-gray-900 to-gray-600 font-light">
              {user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'}
            </p>
            <p className="text-gray-600 mt-4 text-lg">
              {user?.email}
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-gray-100 rounded-2xl p-2 border border-gray-200 overflow-x-auto">
              <div className="flex space-x-2 min-w-max">
                {(['profile', 'orders', 'profile-settings', 'notifications', 'security', 'tickets'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-black text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {tab === 'profile-settings' ? 'Profile Settings' :
                     tab === 'notifications' ? 'Notifications' :
                     tab === 'security' ? 'Security' :
                     tab === 'tickets' ? 'Tickets' :
                     tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
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
                <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-lg">
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Account Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                          {user?.user_metadata?.full_name || user?.user_metadata?.name || 'Not provided'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                          {user?.user_metadata?.role || 'Standard User'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-md">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{orders.length}</div>
                      <div className="text-gray-700">Total Orders</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 shadow-md">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(0)}
                      </div>
                      <div className="text-gray-700">Total Spent</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-6 shadow-md">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600 mb-2">
                        {user?.user_metadata?.role === "admin" ? "VIP" : "Member"}
                      </div>
                      <div className="text-gray-700">Status</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-lg">
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Order History</h2>
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
                      {error}
                    </div>
                  )}

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 mb-6 text-lg">No orders yet</p>
                      <button
                        onClick={() => router.push("/shop")}
                        className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-semibold text-gray-900">Order #{order.orderNumber}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 text-lg">${order.totalAmount.toFixed(2)}</p>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                order.orderStatus === "delivered" 
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : order.orderStatus === "shipped"
                                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                                  : order.orderStatus === "cancelled"
                                  ? "bg-red-100 text-red-700 border border-red-200"
                                  : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                              }`}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-gray-700 mb-3">
                              Items: {order.items.map(item => `${item.name} (x${item.quantity})`).join(", ")}
                            </p>
                            <button className="text-black hover:text-gray-700 font-medium transition-colors">
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

            {/* Profile Settings Tab */}
            {activeTab === 'profile-settings' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-lg">
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Profile Settings</h2>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target as HTMLFormElement)
                    const updatedData = {
                      firstName: formData.get('firstName') as string,
                      lastName: formData.get('lastName') as string,
                      email: formData.get('email') as string,
                      phone: formData.get('phone') as string,
                      address: {
                        street: formData.get('street') as string,
                        city: formData.get('city') as string,
                        state: formData.get('state') as string,
                        zipCode: formData.get('zipCode') as string,
                        country: formData.get('country') as string
                      }
                    }
                    handleProfileUpdate(updatedData)
                  }} className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          defaultValue={profileData.firstName}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Enter your first name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          defaultValue={profileData.lastName}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={profileData.email}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        defaultValue={profileData.phone}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-xl font-medium text-gray-900 mb-4">Address Information</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address
                          </label>
                          <input
                            type="text"
                            id="street"
                            name="street"
                            defaultValue={profileData.address.street}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Enter your street address"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              defaultValue={profileData.address.city}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                              placeholder="City"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                              State
                            </label>
                            <input
                              type="text"
                              id="state"
                              name="state"
                              defaultValue={profileData.address.state}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                              placeholder="State"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              id="zipCode"
                              name="zipCode"
                              defaultValue={profileData.address.zipCode}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                              placeholder="ZIP"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <select
                            id="country"
                            name="country"
                            defaultValue={profileData.address.country}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-lg">
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Email Notifications</h3>
                          <p className="text-gray-600 text-sm">Receive updates via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.email}
                            onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                          <p className="text-gray-600 text-sm">Receive text messages for important updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.sms}
                            onChange={(e) => setNotifications(prev => ({ ...prev, sms: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Marketing Communications</h3>
                          <p className="text-gray-600 text-sm">Get notified about sales, new products, and promotions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.marketing}
                            onChange={(e) => setNotifications(prev => ({ ...prev, marketing: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Order Updates</h3>
                          <p className="text-gray-600 text-sm">Get notified about order status changes and shipping updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.orderUpdates}
                            onChange={(e) => setNotifications(prev => ({ ...prev, orderUpdates: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <button
                        onClick={() => handleNotificationUpdate(notifications)}
                        disabled={saving}
                        className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Saving...' : 'Save Preferences'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-lg">
                  <h2 className="text-3xl font-light text-gray-900 mb-8">Security Settings</h2>
                  
                  <div className="space-y-8">
                    {/* Change Password */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                      <h3 className="text-xl font-medium text-gray-900 mb-4">Change Password</h3>
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.target as HTMLFormElement)
                        const currentPassword = formData.get('currentPassword') as string
                        const newPassword = formData.get('newPassword') as string
                        const confirmPassword = formData.get('confirmPassword') as string
                        
                        if (newPassword !== confirmPassword) {
                          alert('New passwords do not match')
                          return
                        }
                        
                        handlePasswordUpdate(currentPassword, newPassword)
                      }} className="space-y-4">
                        
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Enter current password"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Enter new password"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Confirm new password"
                            required
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={saving}
                            className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {saving ? 'Updating...' : 'Update Password'}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Change Email */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                      <h3 className="text-xl font-medium text-gray-900 mb-4">Change Email Address</h3>
                      <p className="text-gray-600 mb-4">Current email: {user?.email}</p>
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.target as HTMLFormElement)
                        const newEmail = formData.get('newEmail') as string
                        
                        const confirmChange = confirm('Are you sure you want to change your email? You will need to verify the new email address.')
                        if (confirmChange) {
                          supabase.auth.updateUser({ email: newEmail })
                            .then(({ error }) => {
                              if (error) {
                                alert('Failed to update email: ' + error.message)
                              } else {
                                alert('Email update initiated. Please check your new email for verification.')
                              }
                            })
                        }
                      }} className="space-y-4">
                        
                        <div>
                          <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-2">
                            New Email Address
                          </label>
                          <input
                            type="email"
                            id="newEmail"
                            name="newEmail"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Enter new email address"
                            required
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={saving}
                            className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Update Email
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                      <h3 className="text-xl font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                      <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-300">
                        Enable 2FA
                      </button>
                    </div>

                    {/* Sign Out Button */}
                    <div className="pt-8 border-t border-gray-200">
                      <button
                        onClick={handleSignOut}
                        className="w-full p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 hover:bg-red-100 transition-all duration-300 font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-lg">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-light text-gray-900">Support Tickets</h2>
                      <p className="text-gray-600 mt-2">View and manage your support tickets. You can also submit tickets through our <a href="/contact" className="text-blue-600 hover:text-blue-800 underline">contact page</a>.</p>
                    </div>
                    <button 
                      onClick={() => setShowTicketModal(true)}
                      className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300"
                    >
                      New Ticket
                    </button>
                  </div>
                  
                  {tickets.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 mb-6 text-lg">No support tickets yet</p>
                      <p className="text-gray-500 text-sm">When you create a support ticket, it will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tickets.map((ticket) => (
                        <div key={ticket.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                              <p className="text-sm text-gray-600">
                                Ticket #{ticket.id} • {ticket.category}
                              </p>
                              <p className="text-sm text-gray-500">
                                Created: {new Date(ticket.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                ticket.status === "resolved" 
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : ticket.status === "in-progress"
                                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                                  : ticket.status === "closed"
                                  ? "bg-gray-100 text-gray-700 border border-gray-200"
                                  : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                              }`}>
                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </span>
                              <div className="mt-2">
                                <span className={`inline-block px-2 py-1 rounded text-xs ${
                                  ticket.priority === "high" 
                                    ? "bg-red-100 text-red-600"
                                    : ticket.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-green-100 text-green-600"
                                }`}>
                                  {ticket.priority} priority
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-gray-700 mb-3">{ticket.description}</p>
                            <button className="text-black hover:text-gray-700 font-medium transition-colors">
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
          </motion.div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-light text-gray-900">Create Support Ticket</h3>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const ticketData = {
                  subject: formData.get('subject') as string,
                  description: formData.get('description') as string,
                  category: formData.get('category') as string,
                  priority: formData.get('priority') as string
                }
                handleCreateTicket(ticketData)
              }} className="space-y-6">
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Order Support">Order Support</option>
                      <option value="Returns">Returns & Refunds</option>
                      <option value="Product Question">Product Question</option>
                      <option value="Technical Issue">Technical Issue</option>
                      <option value="Account Issue">Account Issue</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                      defaultValue="medium"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Please provide detailed information about your issue..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Creating...' : 'Create Ticket'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
          logoUrl="/images/newlogo.png"
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
