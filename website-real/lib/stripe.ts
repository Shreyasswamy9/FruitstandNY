import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Client-side Stripe instance
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Server-side Stripe instance (use account default API version)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default stripePromise;