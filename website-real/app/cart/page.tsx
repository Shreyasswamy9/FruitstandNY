"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion";
import { useCart } from "../../components/CartContext";
import Image from "next/image"
import Price from '@/components/Price'
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader"
import { Elements, ExpressCheckoutElement } from "@stripe/react-stripe-js"
import type { Appearance } from "@stripe/stripe-js"
import { stripePromise, useCheckout, useStripeCheckout, type CheckoutItem, type CustomerCheckoutPayload } from "../../hooks/useCheckout"
import { supabase } from "../supabase-client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { trackInitiateCheckout, type MetaPixelContent, generateEventId } from "@/lib/analytics/meta-pixel"

const ORDER_NUMBER_STORAGE_KEY = 'latestOrderNumber';

type DiscountDefinition = {
  type: 'percent' | 'amount';
  value: number;
  label?: string;
  active: boolean;
};

const DISCOUNT_CODES: Record<string, DiscountDefinition> = {
  FS2026: {
    type: 'percent',
    value: 25,
    label: '25% off with FS2026',
    active: true,
  },
};

// Simplified Payment Section for logged-in users only
/* UNUSED - Keeping for future reference
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

const _PaymentSection: React.FC<PaymentSectionProps> = ({
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
*/

export default function CartPage() {
  const { items, removeFromCart, clearCart, setLineQuantity } = useCart();
  const { createPaymentIntent, loading: _intentLoading, error: checkoutError, setError: setCheckoutError } = useCheckout();
  const { createCheckoutSession, loading: sessionLoading } = useStripeCheckout();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const clientSecretRef = useRef<string | null>(null);
  const orderNumberRef = useRef<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [_paymentProcessing, _setPaymentProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [_elementsReady, _setElementsReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string | null>(null);
  const [discountMessage, setDiscountMessage] = useState<string | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const hasTrackedInitiateCheckout = useRef(false);

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

  const _resolveOrderNumber = useCallback((): string | null => {
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

  const resolveDiscount = useCallback((code: string, currentSubtotal: number) => {
    const normalized = code.trim().toUpperCase();
    const definition = DISCOUNT_CODES[normalized];
    if (!definition || !definition.active) return null;
    const rawAmount = definition.type === 'percent'
      ? (currentSubtotal * definition.value) / 100
      : definition.value;
    const amount = Math.max(0, Math.min(rawAmount, currentSubtotal));
    return {
      code: normalized,
      amount,
      label: definition.label ?? 'Discount applied.',
    };
  }, []);

  const appliedDiscount = useMemo(() => {
    if (!appliedDiscountCode) return null;
    return resolveDiscount(appliedDiscountCode, subtotal);
  }, [appliedDiscountCode, resolveDiscount, subtotal]);

  const discountAmount = appliedDiscount?.amount ?? 0;
  
  // Tax will be calculated at checkout based on shipping address
  // Don't include tax in cart total to avoid showing incorrect amount
  const tax = 0; // Tax calculated at checkout
  const total = Math.max(subtotal + shipping - discountAmount, 0); // Total before tax

  // Track InitiateCheckout when user lands on cart with items
  useEffect(() => {
    if (hasTrackedInitiateCheckout.current) return;
    if (!items.length) return;

    const contents: MetaPixelContent[] = items.map((item) => ({
      id: item.lineId || item.productId,
      quantity: item.quantity,
      item_price: Number(item.price ?? 0),
      title: item.name,
    }));

    trackInitiateCheckout({
      contents,
      value: total,
      currency: "USD",
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      eventId: generateEventId(),
    });

    hasTrackedInitiateCheckout.current = true;
  }, [items, total]);

  const handleApplyDiscount = useCallback(() => {
    const normalized = discountCode.trim().toUpperCase();
    if (!normalized) {
      setDiscountError('Enter a discount code.');
      setDiscountMessage(null);
      return;
    }

    const resolved = resolveDiscount(normalized, subtotal);
    if (!resolved) {
      setDiscountError('No active discounts right now.');
      setDiscountMessage(null);
      setAppliedDiscountCode(null);
      return;
    }

    setAppliedDiscountCode(resolved.code);
    setDiscountMessage(resolved.label);
    setDiscountError(null);
  }, [discountCode, resolveDiscount, subtotal]);

  const handleClearDiscount = useCallback(() => {
    setAppliedDiscountCode(null);
    setDiscountCode('');
    setDiscountMessage(null);
    setDiscountError(null);
  }, []);

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
      _setElementsReady(false);
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

        console.log('CartPage: Creating payment intent', {
          itemsCount: normalizedItems.length,
          shipping,
          tax,
          isSignedIn: !!user,
          hasCustomerPayload: !!customerPayload,
        });

        const result = await createPaymentIntent({
          items: normalizedItems,
          shipping,
          tax,
          paymentIntentId: paymentIntentId ?? undefined,
          customerData: customerPayload,
          discountCode: appliedDiscountCode,
        });

        if (!active) return;
        const secretChanged = result.clientSecret !== clientSecretRef.current;
        clientSecretRef.current = result.clientSecret;
        setClientSecret(result.clientSecret);
        setPaymentIntentId(result.paymentIntentId);
        rememberOrderNumber(result.orderNumber);
        _setElementsReady(!secretChanged);
        setPaymentMessage(null);
        setCheckoutError(null);
        console.log('CartPage: Payment intent loaded successfully');
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : 'Unable to initialise payment.';
        console.error('CartPage: Payment intent creation error', message);
        setPaymentMessage(message);
      }
    })();

    return () => {
      active = false;
    };
  }, [normalizedItems, shipping, tax, createPaymentIntent, user, rememberOrderNumber, setCheckoutError, paymentIntentId, appliedDiscountCode]);

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
      
      // For logged-in users, use customer data; for guests, pass empty but still include the field
      const customerPayload: CustomerCheckoutPayload | undefined = user
        ? {
            email: user.email || undefined,
            name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
            phone: user.user_metadata?.phone || undefined,
          }
        : undefined;

      const result = await createCheckoutSession({
        items: normalizedItems,
        shipping,
        tax,
        discountCode: appliedDiscountCode,
        customerData: customerPayload,
      });

      if (result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to start checkout.';
      setPaymentMessage(message);
    }
  }, [createCheckoutSession, normalizedItems, sessionLoading, shipping, tax, appliedDiscountCode, user]);

  return (
    <div className="min-h-screen bg-[#fbf6f0]">
      <ProductPageBrandHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-25 sm:py-20">
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
            {/* Checkout Section */}
            <div className="order-1 xl:order-2 xl:col-span-1 flex flex-col gap-6">
              {/* Total Box */}
              <div className="rounded-3xl bg-[#f7ede0] text-gray-900 p-5 shadow-lg border border-white/60">
                <p className="text-[11px] uppercase tracking-[0.35em] text-gray-700/70">Estimated total</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">${total.toFixed(2)}</p>
                <p className="mt-2 text-xs text-gray-700/70">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} item{items.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? 's' : ''} • plus tax (calculated at checkout)
                </p>
                {/* Free Shipping Progress - Always visible */}
                <div className="mt-3 pt-3 border-t border-gray-300/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-700">Free shipping at $120</span>
                    {subtotal >= 120 ? (
                      <span className="text-xs font-semibold text-green-700 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Free shipping unlocked!
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-900">${(120 - subtotal).toFixed(2)} to go</span>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-linear-to-r from-gray-700 to-gray-900 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / 120) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Express Checkout - Always visible */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Express checkout</h3>
                  <p className="text-xs sm:text-xs text-gray-500 mt-1">Pay with Apple Pay, Google Pay, Amazon Pay, or Link.</p>
                </div>
                {clientSecret && elementsOptions ? (
                  <Elements stripe={stripePromise} options={elementsOptions} key={clientSecret}>
                    <div className="space-y-4">
                      <ExpressCheckoutElement
                        onConfirm={async () => {
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
                      <div className="flex items-center gap-3 text-gray-300 text-[11px] uppercase tracking-[0.35em]">
                        <span className="h-px bg-gray-200 flex-1" />
                        <span>— OR —</span>
                        <span className="h-px bg-gray-200 flex-1" />
                      </div>
                      <button
                        type="button"
                        onClick={isSignedIn ? () => router.push('/cart/checkout-redirect') : handleGuestCheckout}
                        className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={sessionLoading || items.length === 0}
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
                ) : (
                  <div className="space-y-4">
                    {paymentMessage ? (
                      <>
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="font-semibold mb-2">Payment Error</p>
                          <p>{paymentMessage}</p>
                        </div>
                        <button
                          type="button"
                          onClick={isSignedIn ? () => router.push('/cart/checkout-redirect') : handleGuestCheckout}
                          className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={sessionLoading || items.length === 0}
                        >
                          Continue to Checkout →
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-500"></div>
                          <span>Loading payment options...</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {paymentMessage && clientSecret && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                    {paymentMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary (Receipt Style) */}
            <div className="order-2 xl:order-1 xl:col-span-2">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                </div>
                
                {/* Items List */}
                <div className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.lineId ?? item.productId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex gap-4">
                        {/* Item Image */}
                        {item.isBundle ? (
                          <div className="relative w-20 h-20 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
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
                            className="relative w-20 h-20 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 hover:ring-2 hover:ring-black hover:ring-opacity-50 transition-all cursor-pointer"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover hover:scale-105 transition-transform"
                              sizes="80px"
                            />
                          </Link>
                        )}
                        
                        {/* Item Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            {item.isBundle ? (
                              <h3 className="text-base font-semibold text-gray-900 truncate">{item.name}</h3>
                            ) : (
                              <Link 
                                href={`/shop/${item.productId}`}
                                className="block hover:text-blue-600 transition-colors"
                              >
                                <h3 className="text-base font-semibold text-gray-900 truncate hover:text-blue-600">
                                  {item.name}
                                </h3>
                              </Link>
                            )}
                            <div className="flex gap-2 text-xs text-gray-500 mt-1 flex-wrap">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                              {item.isBundle && item.bundleSize && <span>Size: {item.bundleSize}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.lineId ?? item.productId, item.quantity - 1)}
                              className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-xs"
                            >
                              −
                            </button>
                            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.lineId ?? item.productId, item.quantity + 1)}
                              className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-xs"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleRemove(item.lineId ?? item.productId)}
                              className="ml-auto text-red-500 hover:text-red-700 text-xs font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        
                        {/* Item Price */}
                        <div className="text-right flex flex-col justify-between">
                          <p className="text-xs text-gray-500"><Price price={item.price} /></p>
                          <p className="text-lg font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Totals Section */}
                <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <div>
                      <span>Shipping</span>
                      {shipping === 0 && (
                        <p className="text-xs text-green-600">Free shipping unlocked!</p>
                      )}
                    </div>
                    <span className="font-medium">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span className="text-xs italic">Calculated at checkout</span>
                  </div>

                  <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-600">Discount code</p>
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(event) => setDiscountCode(event.target.value)}
                        placeholder="Enter code"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyDiscount}
                        className="rounded-lg border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                      >
                        Apply
                      </button>
                    </div>
                    {(discountMessage || discountError) && (
                      <p className={`mt-2 text-xs ${discountError ? 'text-red-600' : 'text-green-700'}`}>
                        {discountError ?? discountMessage}
                      </p>
                    )}
                    {appliedDiscount && (
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-700">
                        <span>Applied: {appliedDiscount.code}</span>
                        <button
                          type="button"
                          onClick={handleClearDiscount}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between text-sm text-green-700">
                      <span>Discount ({appliedDiscount.code})</span>
                      <span>- ${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Clear Cart Button */}
                <div className="p-4 sm:p-6 border-t border-gray-200">
                  <button
                    onClick={handleClearCart}
                    className="w-full py-2 text-sm border border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
