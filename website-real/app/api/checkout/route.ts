import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

console.log('Stripe secret key available:', !!process.env.STRIPE_SECRET_KEY);
console.log('Base URL:', process.env.NEXT_PUBLIC_BASE_URL);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    console.log('Checkout API called');
    const requestData = await request.json();
    console.log('Request data received:', requestData);
    
    const { items, shipping, tax, guestData, customerData } = requestData;

    if (!items || items.length === 0) {
      console.error('No items provided');
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    console.log('Processing items:', items);
    console.log('Guest data:', guestData);
    console.log('Customer data:', customerData);

    // Server-side validation
    const customerInfo = customerData || guestData;
    
    if (customerInfo && customerInfo.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerInfo.email)) {
        console.error('Invalid email format:', customerInfo.email);
        return NextResponse.json(
          { error: 'Invalid email address format. Please enter a valid email address.' },
          { status: 400 }
        );
      }
    }

    // Validate required environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe secret key not configured');
      return NextResponse.json(
        { error: 'Payment system configuration error. Please try again later.' },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.error('Base URL not configured');
      return NextResponse.json(
        { error: 'System configuration error. Please try again later.' },
        { status: 500 }
      );
    }

    // Create line items for Stripe
    type CheckoutItem = {
      name: string;
      image?: string;
      productId: string;
      size?: string;
      color?: string;
      price: number;
      quantity: number;
    };

    const lineItems = items.map((item: CheckoutItem) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [`${process.env.NEXT_PUBLIC_BASE_URL}${item.image}`] : [],
          metadata: {
            productId: item.productId,
            size: item.size || '',
            color: item.color || '',
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if it exists
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Add tax as a line item
    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
          },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    // Prepare session configuration
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems as Stripe.Checkout.SessionCreateParams.LineItem[],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        orderItems: JSON.stringify(items),
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      billing_address_collection: 'required',
    };

    // If customer information is available, pre-fill the form
    if (customerInfo && customerInfo.email) {
      sessionConfig.customer_email = customerInfo.email;
    }

    // Add customer creation if we have enough info for returning customers
    if (customerInfo && customerInfo.email && customerInfo.name) {
      sessionConfig.customer_creation = 'always';
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    
    console.log('Stripe session created successfully:', session.id);
    console.log('Session config used:', sessionConfig);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    console.error('Error details:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}