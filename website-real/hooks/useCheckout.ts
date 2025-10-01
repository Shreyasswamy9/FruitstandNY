import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface UseCheckoutProps {
  items: CheckoutItem[];
  shipping: number;
  tax: number;
  guestData?: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  customerData?: {
    email: string;
    name: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
}

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToCheckout = async ({ items, shipping, tax, guestData, customerData }: UseCheckoutProps) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Starting checkout with data:', { items, shipping, tax, guestData, customerData });

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shipping,
          tax,
          guestData,
          customerData,
        }),
      });

      console.log('Checkout API response status:', response.status);
      console.log('Checkout API response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Checkout API error response:', errorData);
        
        // Show user-friendly error message
        const errorMessage = errorData.error || `Network response was not ok: ${response.status}`;
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log('Checkout API response data:', responseData);
      
      const { sessionId } = responseData;

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      console.log('Redirecting to Stripe with sessionId:', sessionId);

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error('Stripe redirect error:', error);
        throw new Error(error.message);
      }
    } catch (err) {
      console.error('Full checkout error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    redirectToCheckout,
    loading,
    error,
  };
};