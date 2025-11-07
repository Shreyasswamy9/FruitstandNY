'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (sessionId) {
      const fromAccountCreation = searchParams.get('from') === 'account-creation';
      if (!fromAccountCreation) {
        router.push(`/success/create-account?session_id=${sessionId}`);
        return;
      }
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartCleared'));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [sessionId, router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
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
        {sessionId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="text-sm font-mono text-gray-900 break-all">{sessionId}</p>
          </motion.div>
        )}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-3">
          <Link href="/shop" className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold block">
            Continue Shopping
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}