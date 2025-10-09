'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
//import Link from 'next/link';

export default function CreateAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      router.push('/');
    }
  }, [sessionId, router]);

  const handleSkip = () => {
    router.push(`/success?session_id=${sessionId}&from=account-creation`);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/create-guest-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      // Account created successfully
      router.push('/account');
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create Your Account
        </h1>

        <p className="text-gray-600 mb-6 text-center">
          Your order was successful! Create an account to track your orders and get exclusive offers.
        </p>

        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Choose a Password
            </label>
            <div className="relative">
                <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 
                transition-all duration-200 ease-in-out
                placeholder-gray-400 text-gray-800
                shadow-sm"
                required
                minLength={8}
                placeholder="Enter your password"
                />
            </div>
                <p className="mt-2 text-xs text-gray-500">
                    Password must be at least 8 characters long
                </p>
            </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:bg-gray-400"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <button
              type="button"
              onClick={handleSkip}
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Skip for Now
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}