/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
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
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
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
      <div className="min-h-screen bg-gray-50">
        <Navbar isShopDropdownOpen={isShopDropdownOpen} setIsShopDropdownOpen={setIsShopDropdownOpen} />
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isShopDropdownOpen={isShopDropdownOpen} setIsShopDropdownOpen={setIsShopDropdownOpen} />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
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
      </div>
    </div>
  );
}
