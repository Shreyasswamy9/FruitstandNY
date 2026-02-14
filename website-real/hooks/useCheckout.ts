import { useCallback, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/app/supabase-client';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export type CheckoutItem = {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
};

export type GuestCheckoutPayload = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    street?: string;
    street2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
};

export type CustomerCheckoutPayload = {
  email?: string;
  name?: string;
  phone?: string;
};

export type CreatePaymentIntentArgs = {
  items: CheckoutItem[];
  shipping: number;
  tax: number;
  paymentIntentId?: string | null;
  guestData?: GuestCheckoutPayload;
  customerData?: CustomerCheckoutPayload;
  discountCode?: string | null;
};

export type CreatePaymentIntentResult = {
  clientSecret: string;
  paymentIntentId: string;
  orderNumber?: string;
};

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = useCallback(async (args: CreatePaymentIntentArgs): Promise<CreatePaymentIntentResult> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/payment-intent', {
        method: 'POST',
        headers,
        body: JSON.stringify(args),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message = typeof payload?.error === 'string'
          ? payload.error
          : 'Unable to initialise payment. Please try again.';
        setError(message);
        throw new Error(message);
      }

      const data = (await response.json()) as CreatePaymentIntentResult;
      if (!data?.clientSecret || !data?.paymentIntentId) {
        throw new Error('Incomplete payment intent response from server.');
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error creating payment intent.';
      setError(message);
      throw err instanceof Error ? err : new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createPaymentIntent,
    loading,
    error,
    setError,
  } as const;
};

export type CreateCheckoutSessionArgs = {
  items: CheckoutItem[];
  shipping: number;
  tax: number;
  discountCode?: string | null;
};

export type CreateCheckoutSessionResult = {
  sessionId: string;
  url: string;
};

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = useCallback(async (args: CreateCheckoutSessionArgs): Promise<CreateCheckoutSessionResult> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message = typeof payload?.error === 'string'
          ? payload.error
          : 'Unable to start checkout. Please try again.';
        setError(message);
        throw new Error(message);
      }

      const data = (await response.json()) as CreateCheckoutSessionResult;
      if (!data?.sessionId || !data?.url) {
        throw new Error('Incomplete checkout session response from server.');
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error creating checkout session.';
      setError(message);
      throw err instanceof Error ? err : new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createCheckoutSession,
    loading,
    error,
    setError,
  } as const;
};