/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
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
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    // Fetch user orders
    const fetchOrders = async () => {
      try {
        const response = await OrderService.getOrders();
        if (response.success) {
          setOrders(response.data);
        }
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session, status, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen" style={{ background: '#fff' }}>
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
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
              { label: "Collections", ariaLabel: "Browse collections", link: "/shop" },
              { label: "Cart", ariaLabel: "View your cart", link: "/cart" },
              { label: "Contact", ariaLabel: "Contact us", link: "/contact" },
              { label: "Sign In/Sign Up", ariaLabel: "Sign in to your account", link: "/auth/signin" }
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
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      <motion.div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 5 }}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
                <p className="text-gray-600">Welcome back, {session?.user?.name}!</p>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {session?.user?.name}</p>
                  <p><span className="font-medium">Email:</span> {session?.user?.email}</p>
                  <p><span className="font-medium">Role:</span> {session?.user?.role}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    Update Profile
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    Change Password
                  </button>
                  {session?.user?.role === "admin" && (
                    <button
                      onClick={() => router.push("/admin")}
                      className="block w-full text-left px-4 py-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    >
                      Admin Dashboard
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven&apos;t placed any orders yet.</p>
                <button
                  onClick={() => router.push("/shop")}
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">Order #{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          order.orderStatus === "delivered" 
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.orderStatus === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600 mb-2">
                        Items: {order.items.map(item => `${item.name} (x${item.quantity})`).join(", ")}
                      </p>
                      <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* StaggeredMenu Component */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 10001, pointerEvents: menuOpen ? "auto" : "none" }}>
        <StaggeredMenu
          position="right"
          colors={['#18191a', '#232324']}
          className="custom-staggered-menu"
          items={[
            { label: "Home", ariaLabel: "Go to homepage", link: "/" },
            { label: "Collections", ariaLabel: "Browse collections", link: "/shop" },
            { label: "Cart", ariaLabel: "View your cart", link: "/cart" },
            { label: "Contact", ariaLabel: "Contact us", link: "/contact" },
            { label: "Sign In/Sign Up", ariaLabel: "Sign in to your account", link: "/auth/signin" }
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
        
        {/* Image Placeholder - positioned over the menu panel */}
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "clamp(20px, 4vw, 60px)",
              transform: "translateY(-50%)",
              width: "clamp(200px, 25vw, 350px)",
              height: "clamp(150px, 20vh, 300px)",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "clamp(12px, 3vw, 24px)",
              border: "2px dashed rgba(255, 255, 255, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(12px, 2vw, 16px)",
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: "300",
              textAlign: "center",
              padding: "clamp(16px, 4vw, 32px)",
              backdropFilter: "blur(10px)",
              zIndex: 10002,
            }}
          >
            Featured Collection Image
          </div>
        )}
      </div>

      {/* Custom styles for StaggeredMenu visibility */}
      <style jsx>{`
        /* Ensure menu button header is always clickable */
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

        /* When menu is open, allow interactions with the menu panel */
        .custom-staggered-menu[data-open] {
          pointer-events: auto !important;
        }
        
        /* Force all menu components to be clickable */
        .custom-staggered-menu * {
          pointer-events: auto !important;
        }
        
        /* Override for non-interactive areas when menu is closed */
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
  );
}
