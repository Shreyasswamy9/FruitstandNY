'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/app/supabase-client';

function SuccessContent() {
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<{ orderNumber: string; totalAmount: number; status: string } | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [shouldFetchOrder, setShouldFetchOrder] = useState(false);
  const [initialOrderNumber, setInitialOrderNumber] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isActive = true;

    const evaluateCheckoutFlow = async () => {
      const params = new URLSearchParams(window.location.search);
      const sid = params.get('session_id');
      const pid = params.get('payment_intent');
      const fromAccountCreation = params.get('from') === 'account-creation';
      const orderNumberParam = params.get('order_number');

      if (!isActive) {
        return;
      }

      setSessionId(sid);
      setPaymentIntentId(pid);
      if (orderNumberParam) {
        setInitialOrderNumber(orderNumberParam);
      }

      if (!sid && !pid) {
        setLoading(false);
        return;
      }

      if (sid) {
        if (!fromAccountCreation) {
          try {
            const { data, error } = await supabase.auth.getSession();

            if (!isActive) {
              return;
            }

            if (error) {
              console.error('Unable to verify Supabase session:', error);
            }

            const hasActiveSession = Boolean(data?.session);

            if (!hasActiveSession) {
              router.push(`/success/create-account?session_id=${sid}`);
              return;
            }
          } catch (sessionError) {
            if (!isActive) {
              return;
            }

            console.error('Supabase session check failed:', sessionError);
            router.push(`/success/create-account?session_id=${sid}`);
            return;
          }
        }

        setShouldFetchOrder(true);
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartCleared'));
        setLoading(false);
        return;
      }

      if (pid) {
        setShouldFetchOrder(true);
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartCleared'));
        setLoading(false);
      }
    };

    evaluateCheckoutFlow();

    return () => {
      isActive = false;
    };
  }, [router]);

  useEffect(() => {
    if (!shouldFetchOrder) return;
    if (!sessionId && !paymentIntentId) return;
    let isActive = true;

    const loadOrder = async () => {
      try {
        setDetailsError(null);
        const endpoint = sessionId
          ? `/api/orders/by-session?session_id=${encodeURIComponent(sessionId)}`
          : `/api/orders/by-payment-intent?payment_intent=${encodeURIComponent(paymentIntentId!)}`;
        const response = await fetch(endpoint);
        if (!isActive) return;
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          setDetailsError(payload?.error ?? 'Unable to load order details.');
          setOrderDetails(null);
          return;
        }

        const payload = await response.json();
        if (!isActive) return;
        if (payload?.data) {
          setOrderDetails({
            orderNumber: payload.data.orderNumber,
            totalAmount: payload.data.totalAmount,
            status: payload.data.status,
          });
        } else {
          setOrderDetails(null);
        }
      } catch (error) {
        if (!isActive) return;
        setDetailsError('Unable to load order details.');
        setOrderDetails(null);
        console.error('Order details fetch failed:', error);
      }
    };

    loadOrder();

    return () => {
      isActive = false;
    };
  }, [sessionId, paymentIntentId, shouldFetchOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf6f0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf6f0] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-gray-600 mb-6">
          Thank you for your order. We&apos;ve received your payment and will process your order shortly.
        </motion.p>
        {(sessionId || paymentIntentId || initialOrderNumber || orderDetails?.orderNumber) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-sm font-mono text-gray-900 break-all">
              {orderDetails?.orderNumber ?? initialOrderNumber ?? sessionId ?? paymentIntentId}
            </p>
          </motion.div>
        )}
        {detailsError && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="text-xs text-red-500 mb-4">
            {detailsError}
          </motion.p>
        )}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-3">
          <Link href="/shop" className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold block" aria-label="Return to Store">
            Return to Store
          </Link>
          <Link href="/" className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors block">
            Back to Home
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">You will receive an email confirmation shortly with your order details and tracking information.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbf6f0] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}