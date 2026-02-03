"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useCart, type CartItem } from "../../components/CartContext"
import Image from "next/image"
import Price from '@/components/Price'
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader"
import { Elements, ExpressCheckoutElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import type { Appearance, StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js"
import { stripePromise, useCheckout, useStripeCheckout, type CheckoutItem, type CustomerCheckoutPayload } from "../../hooks/useCheckout"
import { supabase } from "../supabase-client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

const ORDER_NUMBER_STORAGE_KEY = 'latestOrderNumber';

// Simplified Payment Section for logged-in users only
type PaymentSectionProps = {
  total: number;
  items: CartItem[];
  processing: boolean;
  setProcessing: (value: boolean) => void;
  message: string | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  elementsReady: boolean;
  setElementsReady: (ready: boolean) => void;
  orderNumber: string | null;
};

const PaymentSection: React.FC<PaymentSectionProps> = ({
  total,
  items,
  processing,
  setProcessing,
  message,
  setMessage,
  elementsReady,
  setElementsReady,
  orderNumber,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  const previewItems = useMemo(() => items.slice(0, 3), [items]);

  const confirmPayment = useCallback(
    async (event?: StripeExpressCheckoutElementConfirmEvent) => {
      const expressEvent = event as StripeExpressCheckoutElementConfirmEvent | undefined;
      (expressEvent as { preventDefault?: () => void } | undefined)?.preventDefault?.();

      if (processing) {
        return;
      }

      if (!stripe || !elements) {
        setMessage('Payment form is still loading. Please try again in a moment.');
        return;
      }

      setProcessing(true);
      setMessage(null);

      const baseReturnUrl =
        typeof window !== 'undefined'
          ? `${window.location.origin}/order/complete`
          : `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/order/complete`;

      let returnUrl = baseReturnUrl;

      if (orderNumber && /^\d{6}$/.test(orderNumber)) {
        if (typeof window !== 'undefined') {
          try {
            window.sessionStorage.setItem(ORDER_NUMBER_STORAGE_KEY, orderNumber);
          } catch (error) {
            console.warn('Unable to persist order number to session storage', error);
          }
        }

        try {
          const composed = new URL(baseReturnUrl);
          composed.searchParams.set('order_number', orderNumber);
          returnUrl = composed.toString();
        } catch {
          const separator = baseReturnUrl.includes('?') ? '&' : '?';
          returnUrl = `${baseReturnUrl}${separator}order_number=${encodeURIComponent(orderNumber)}`;
        }
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message ?? 'We could not process your payment. Please try again.');
      } else if (paymentIntent?.status === 'succeeded') {
        setMessage('Payment approved. Redirecting…');
      }

      setProcessing(false);
    },
    [elements, processing, orderNumber, setMessage, setProcessing, stripe]
  );

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-[#f7ede0] text-gray-900 p-5 shadow-lg border border-white/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-gray-700/70">Total due today</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">${total.toFixed(2)}</p>
            <p className="mt-2 text-xs text-gray-700/70">
              {itemCount} item{itemCount !== 1 ? 's' : ''} • includes tax & shipping
            </p>
          </div>
          <div className="flex -space-x-4">
            {previewItems.map((item) => (
              <div
                key={item.lineId ?? item.productId}
                className="relative h-12 w-12 rounded-xl border border-white/70 overflow-hidden bg-white/60 backdrop-blur"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-700/80">
                    {item.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 rounded-full bg-white px-1 text-[10px] font-semibold text-gray-900">
                  ×{item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Express checkout</h3>
          <p className="text-xs text-gray-500 mt-1">Pay with Apple Pay, Google Pay, Amazon Pay, or Link for faster checkout.</p>
          <div className="mt-4">
            <ExpressCheckoutElement
              onConfirm={confirmPayment}
              options={{
                paymentMethods: {
                  applePay: 'auto',
                  googlePay: 'auto',
                  amazonPay: 'auto',
                  link: 'auto',
                },
                emailRequired: true,
                phoneNumberRequired: true,
                shippingAddressRequired: true,
                allowedShippingCountries: ['US'],
                shippingRates: [
                  {
                    id: 'fsny-free-shipping',
                    amount: 0,
                    displayName: 'Free shipping',
                  },
                ],
                paymentMethodOrder: ['apple_pay', 'google_pay', 'amazon_pay', 'link'],
              }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-gray-300 text-[11px] uppercase tracking-[0.35em]">
          <span className="h-px bg-gray-200 flex-1" />
          <span>— OR —</span>
          <span className="h-px bg-gray-200 flex-1" />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Other payment methods</h4>
          <p className="text-xs text-gray-600 mb-4">Card, bank transfer, and other payment options</p>
          <Link
            href="/cart/checkout-redirect"
            className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-center block"
          >
            Continue to payment →
          </Link>
        </div>

        {message && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default function CartPage() {
  const { items, removeFromCart, clearCart, setLineQuantity } = useCart();
  const { createPaymentIntent, loading: intentLoading, error: checkoutError, setError: setCheckoutError } = useCheckout();
  const { createCheckoutSession, loading: sessionLoading } = useStripeCheckout();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const clientSecretRef = useRef<string | null>(null);
  const orderNumberRef = useRef<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [elementsReady, setElementsReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const router = useRouter();

  // Check auth state
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

  const resolveOrderNumber = useCallback((): string | null => {
    if (orderNumberRef.current) {
      return orderNumberRef.current;
    }
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return window.sessionStorage.getItem(ORDER_NUMBER_STORAGE_KEY);
    } catch (error) {
      console.warn('Unable to read order number from session storage', error);
      return null;
    }
  }, []);

  const rememberOrderNumber = useCallback((value?: string | null) => {
    if (!value || !/^\d{6}$/.test(value)) {
      return;
    }
    orderNumberRef.current = value;
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem(ORDER_NUMBER_STORAGE_KEY, value);
      } catch (error) {
        console.warn('Unable to persist order number to session storage', error);
      }
    }
  }, []);

  const getCartTotal = () => items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);

  const handleRemove = (productId: string) => {
    const item = items.find(i => i.lineId === productId) || items.find(i => i.productId === productId);
    const label = item ? `${item.name}${item.size ? ' — ' + item.size : ''}` : 'this item';
    if (typeof window === 'undefined' || window.confirm(`Remove ${label} from your cart?`)) {
      removeFromCart(productId);
    }
  };

  const handleClearCart = () => {
    if (typeof window === 'undefined' || window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove(id);
      return;
    }

    const item = items.find(i => i.lineId === id) || items.find(i => i.productId === id);
    if (item) {
      setLineQuantity(item.lineId ?? item.productId, newQuantity);
    }
  };

  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = subtotal >= 120 ? 0 : 8.99;
  
  // Tax will be calculated at checkout based on shipping address
  // Don't include tax in cart total to avoid showing incorrect amount
  const tax = 0; // Tax calculated at checkout
  const total = subtotal + shipping; // Total before tax

  const appearance = useMemo<Appearance>(() => ({
    theme: 'stripe',
    variables: {
      colorPrimary: '#111827',
      colorText: '#111827',
      borderRadius: '14px',
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
      spacingUnit: '6px',
    },
    rules: {
      '.Input': { borderRadius: '12px', padding: '14px 12px' },
      '.Block': { borderRadius: '14px' },
      '.Tab': { borderRadius: '12px' },
    },
  }), []);

  const normalizedItems = useMemo<CheckoutItem[]>(() => (
    items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: Number(item.price ?? 0),
      quantity: item.quantity,
      image: item.image,
      size: item.size,
      color: item.color,
    }))
  ), [items]);

  const elementsOptions = useMemo(() => (
    clientSecret ? { clientSecret, appearance } : undefined
  ), [appearance, clientSecret]);

  // Create payment intent for both logged-in users and guests (for express payments)
  useEffect(() => {
    if (!normalizedItems.length) {
      setClientSecret(null);
      setPaymentIntentId(null);
      setElementsReady(false);
      clientSecretRef.current = null;
      return;
    }

    let active = true;

    (async () => {
      try {
        const customerPayload: CustomerCheckoutPayload | undefined = user
          ? {
              email: user.email || undefined,
              name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
              phone: user.user_metadata?.phone || undefined,
            }
          : undefined;

        const result = await createPaymentIntent({
          items: normalizedItems,
          shipping,
          tax,
          paymentIntentId: paymentIntentId ?? undefined,
          customerData: customerPayload,
        });

        if (!active) return;
        const secretChanged = result.clientSecret !== clientSecretRef.current;
        clientSecretRef.current = result.clientSecret;
        setClientSecret(result.clientSecret);
        setPaymentIntentId(result.paymentIntentId);
        rememberOrderNumber(result.orderNumber);
        setElementsReady(!secretChanged);
        setPaymentMessage(null);
        setCheckoutError(null);
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : 'Unable to initialise payment.';
        setPaymentMessage(message);
      }
    })();

    return () => {
      active = false;
    };
  }, [normalizedItems, shipping, tax, createPaymentIntent, user, rememberOrderNumber, setCheckoutError, paymentIntentId]);

  useEffect(() => {
    if (checkoutError) {
      setPaymentMessage(checkoutError);
    }
  }, [checkoutError]);

  // Handle guest checkout with Stripe Checkout
  const handleGuestCheckout = useCallback(async () => {
    if (sessionLoading || normalizedItems.length === 0) return;

    try {
      setPaymentMessage(null);
      const result = await createCheckoutSession({
        items: normalizedItems,
        shipping,
        tax,
      });

      if (result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to start checkout.';
      setPaymentMessage(message);
    }
  }, [createCheckoutSession, normalizedItems, sessionLoading, shipping, tax]);

  return (
    <div className="min-h-screen bg-[#fbf6f0]">
      <ProductPageBrandHeader />
      {/* Header */}
      <div className="border-b bg-[#fbf6f0] pt-24 pb-8 sm:pt-32 sm:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-xl sm:text-2xl font-bold text-[#181818] uppercase tracking-[0.08em]">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-[#6f6f6f] mt-2 uppercase tracking-[0.06em]">
              {items.length === 0 ? "Your cart is empty" : `${items.length} item${items.length !== 1 ? 's' : ''} in your cart`}
            </p>
          </motion.div>
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
              Looks like you haven`&apos;`t added any items to your cart yet. Start shopping to fill it up!
            </p>
            <motion.a
              href="/shop"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Return to Store
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="order-2 xl:order-1 xl:col-span-2">
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
                      key={item.lineId ?? item.productId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                        {item.isBundle ? (
                          <div className="relative w-20 h-20 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 transition-all duration-200">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                            <span className="absolute left-1 top-1 text-[10px] bg-black text-white px-2 py-0.5 rounded">Bundle</span>
                          </div>
                        ) : (
                          <Link 
                            href={`/shop/${item.productId}`}
                            className="relative w-20 h-20 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 hover:ring-2 hover:ring-black hover:ring-opacity-50 transition-all duration-200 cursor-pointer"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-200"
                              sizes="80px"
                            />
                          </Link>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          {item.isBundle ? (
                            <div className="block">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
                              <p className="text-xs text-gray-500">Bundle contents: {Array.isArray(item.bundleItems) ? item.bundleItems.join(', ') : ''}</p>
                              {item.bundleSize && (
                                <p className="text-xs text-gray-500">Size: {item.bundleSize}</p>
                              )}
                            </div>
                          ) : (
                            <Link 
                              href={`/shop/${item.productId}`}
                              className="block hover:text-blue-600 transition-colors duration-200"
                            >
                              <h3 className="text-lg font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                          )}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
                            {item.size && (
                              <span className="text-sm text-gray-500">Size: {item.size}</span>
                            )}
                            {item.color && (
                              <span className="text-sm text-gray-500">Color: {item.color}</span>
                            )}
                          </div>
                          <p className="text-lg font-bold text-gray-900 mt-2">
                            <Price price={item.price} />
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:space-y-4">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                              onClick={() => updateQuantity(item.lineId ?? item.productId, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            
                            <span className="text-lg font-semibold min-w-8 text-center">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item.lineId ?? item.productId, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-3 sm:flex-col sm:space-x-0 sm:space-y-2 sm:items-end">
                            <p className="text-lg font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            
                            <button
                              onClick={() => handleRemove(item.lineId ?? item.productId)}
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
                
                <div className="p-4 sm:p-6 border-t border-gray-200">
                  <button
                    onClick={handleClearCart}
                    className="w-full py-3 border border-red-300 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Checkout Section */}
            <div className="order-1 xl:order-2 xl:col-span-1 flex flex-col gap-6">
              {/* Total Box */}
              <div className="rounded-3xl bg-[#f7ede0] text-gray-900 p-5 shadow-lg border border-white/60">
                <p className="text-[11px] uppercase tracking-[0.35em] text-gray-700/70">Estimated total</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">${total.toFixed(2)}</p>
                <p className="mt-2 text-xs text-gray-700/70">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} item{items.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? 's' : ''} • plus tax (calculated at checkout)
                </p>
                {/* Free Shipping Progress */}
                {subtotal >= 120 ? (
                  <div className="mt-3 pt-3 border-t border-gray-300/50">
                    <div className="flex items-center gap-2 text-green-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-semibold">You unlocked free shipping! 🎉</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 pt-3 border-t border-gray-300/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-700">Free shipping at $120</span>
                      <span className="text-xs font-semibold text-gray-900">${(120 - subtotal).toFixed(2)} to go</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-gray-700 to-gray-900 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / 120) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Account Benefits Card - Only show for non-signed-in users */}
              {!isSignedIn && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl bg-gradient-to-br from-[#f7ede0] to-[#efe5d5] p-3 shadow-sm border border-white/40"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <h3 className="text-xs font-semibold text-gray-900">Get order tracking & faster checkout</h3>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push('/signup?redirect=/cart')}
                      className="flex-1 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => router.push('/signin?redirect=/cart')}
                      className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                </motion.div>
              )}

              {!showPaymentSection ? (
                /* Express Checkout - Initial View */
                <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Express checkout</h3>
                    <p className="text-xs text-gray-500 mt-1">Pay with Apple Pay, Google Pay, Amazon Pay, or Link.</p>
                  </div>

                  {isSignedIn && clientSecret && elementsOptions ? (
                    <div id="express-section">
                      <Elements stripe={stripePromise} options={elementsOptions} key={clientSecret}>
                        <div className="space-y-4">
                          <ExpressCheckoutElement
                            onConfirm={async (event?: StripeExpressCheckoutElementConfirmEvent) => {
                              const stripe = useStripe();
                              const elements = useElements();
                              // Call confirmPayment from PaymentSection logic
                              // This will be handled by the existing logic
                            }}
                            options={{
                              paymentMethods: {
                                applePay: 'auto',
                                googlePay: 'auto',
                                amazonPay: 'auto',
                                link: 'auto',
                              },
                              emailRequired: true,
                              phoneNumberRequired: true,
                              shippingAddressRequired: true,
                              allowedShippingCountries: ['US'],
                              shippingRates: [
                                {
                                  id: 'fsny-free-shipping',
                                  amount: 0,
                                  displayName: 'Free shipping',
                                },
                              ],
                              paymentMethodOrder: ['apple_pay', 'google_pay', 'amazon_pay', 'link'],
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPaymentSection(true)}
                            className="w-full py-3 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            Other payment methods
                          </button>
                        </div>
                      </Elements>
                    </div>
                  ) : !isSignedIn ? (
                    /* Guest - Show express pay buttons */
                    clientSecret && elementsOptions ? (
                      <div id="express-section-guest">
                        <Elements stripe={stripePromise} options={elementsOptions} key={clientSecret}>
                          <div className="space-y-4">
                          <ExpressCheckoutElement
                            onConfirm={async (event?: StripeExpressCheckoutElementConfirmEvent) => {
                              // Express checkout will handle the payment
                            }}
                            options={{
                              paymentMethods: {
                                applePay: 'auto',
                                googlePay: 'auto',
                                amazonPay: 'auto',
                                link: 'auto',
                              },
                              emailRequired: true,
                              phoneNumberRequired: true,
                              shippingAddressRequired: true,
                              allowedShippingCountries: ['US'],
                              shippingRates: [
                                {
                                  id: 'fsny-free-shipping',
                                  amount: 0,
                                  displayName: 'Free shipping',
                                },
                              ],
                              paymentMethodOrder: ['apple_pay', 'google_pay', 'amazon_pay', 'link'],
                            }}
                          />
                            <button
                              type="button"
                              onClick={handleGuestCheckout}
                              disabled={sessionLoading || items.length === 0}
                              className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {sessionLoading ? (
                                <div className="flex items-center justify-center">
                                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white mr-2"></div>
                                  Loading...
                                </div>
                              ) : (
                                `Checkout — $${total.toFixed(2)}`
                              )}
                            </button>
                          </div>
                        </Elements>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={handleGuestCheckout}
                          disabled={sessionLoading || items.length === 0}
                          className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sessionLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white mr-2"></div>
                              Loading...
                            </div>
                          ) : (
                            `Checkout — $${total.toFixed(2)}`
                          )}
                        </button>
                        <button
                          onClick={() => router.push('/signin?redirect=/cart')}
                          className="w-full py-3 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          Sign In for Express Pay
                        </button>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-500"></div>
                        <span>Loading...</span>
                      </div>
                    </div>
                  )}

                  {paymentMessage && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                      {paymentMessage}
                    </div>
                  )}
                </div>
              ) : isSignedIn ? (
                /* Full Payment Section - For logged-in users only */
                clientSecret && elementsOptions ? (
                  <div id="payment-section">
                    <Elements stripe={stripePromise} options={elementsOptions} key={clientSecret}>
                      <PaymentSection
                        total={total}
                        items={items}
                        processing={paymentProcessing}
                        setProcessing={setPaymentProcessing}
                        message={paymentMessage}
                        setMessage={setPaymentMessage}
                        elementsReady={elementsReady}
                        setElementsReady={setElementsReady}
                        orderNumber={resolveOrderNumber()}
                      />
                    </Elements>
                    <button
                      type="button"
                      onClick={() => setShowPaymentSection(false)}
                      className="mt-4 w-full py-3 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Back to express checkout
                    </button>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm flex items-center justify-center text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-500"></div>
                      <span>Loading payment methods…</span>
                    </div>
                  </div>
                )
              ) : null}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <div className="flex flex-col">
                      <span>Shipping</span>
                      {shipping === 0 ? (
                        <span className="text-xs text-green-600 mt-0.5">Free shipping (cart over $120)</span>
                      ) : subtotal < 120 ? (
                        <span className="text-xs text-gray-500 mt-0.5">${(120 - subtotal).toFixed(2)} away from free shipping</span>
                      ) : null}
                    </div>
                    <span className="font-medium">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="text-sm italic">Calculated at checkout</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Tax will be added at checkout</p>
                  </div>
                </div>

                <motion.a
                  href="/shop"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full mt-6 py-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-center block"
                >
                  Continue Shopping
                </motion.a>
                
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
