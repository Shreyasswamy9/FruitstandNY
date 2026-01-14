import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { generateOrderNumber } from '@/lib/orderNumbers';

interface CheckoutItemPayload {
  productId?: string;
  name: string;
  price: number | string;
  quantity: number | string;
  image?: string;
  size?: string;
  color?: string;
}

interface GuestAddress {
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface GuestPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: GuestAddress;
}

interface CustomerPayload {
  email?: string;
  name?: string;
  phone?: string;
}

interface PaymentIntentRequest {
  items?: CheckoutItemPayload[];
  shipping?: number | string;
  tax?: number | string;
  paymentIntentId?: string | null;
  guestData?: GuestPayload | null;
  customerData?: CustomerPayload | null;
}

export async function POST(request: NextRequest) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured on the server.' },
        { status: 500 }
      );
    }

    let payload: PaymentIntentRequest;
    try {
      payload = (await request.json()) as PaymentIntentRequest;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const stripe = new Stripe(stripeSecret);

    const items = Array.isArray(payload.items) ? payload.items : [];
    const shipping = typeof payload.shipping === 'number' ? payload.shipping : Number(payload.shipping || 0);
    const tax = typeof payload.tax === 'number' ? payload.tax : Number(payload.tax || 0);
    const guestData = payload.guestData ?? undefined;
    const customerData = payload.customerData ?? undefined;

    const subtotal = items.reduce((sum, item) => {
      const unitPrice = Number(item.price || 0);
      const qty = Number(item.quantity || 0);
      return sum + unitPrice * qty;
    }, 0);

    const total = subtotal + shipping + tax;
    const amountInCents = Math.round(total * 100);

    if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
      return NextResponse.json(
        { error: 'Cart total must be greater than zero before initiating payment.' },
        { status: 400 }
      );
    }

    const contactEmail = customerData?.email || guestData?.email || undefined;
    const contactName = guestData?.firstName && guestData?.lastName
      ? `${guestData.firstName} ${guestData.lastName}`
      : customerData?.name;

    const orderNumber = generateOrderNumber();
    const metadata = {
      order_number: orderNumber,
      cart: JSON.stringify(items || []),
      subtotal: String(subtotal),
      shipping: String(shipping),
      tax: String(tax),
      guest: JSON.stringify(guestData || {}),
      customer: JSON.stringify(customerData || {}),
    } satisfies Stripe.MetadataParam;

    let paymentIntent: Stripe.PaymentIntent;
    const { paymentIntentId } = payload;

    if (paymentIntentId) {
      // Attempt to retrieve to preserve order number if already set
      let existingIntent: Stripe.PaymentIntent | undefined;
      try {
        existingIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      } catch (error) {
        // Continue with creation if retrieval fails
      }

      const intentMetadata = {
        ...metadata,
        order_number: existingIntent?.metadata?.order_number || metadata.order_number,
      } satisfies Stripe.MetadataParam;

      const shippingDetails = buildStripeShipping(contactName, guestData);

      paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
        amount: amountInCents,
        currency: 'usd',
        metadata: intentMetadata,
        receipt_email: contactEmail,
        shipping: shippingDetails,
      });

      if (!paymentIntent.client_secret) {
        paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      }
    } else {
      const createParams: Stripe.PaymentIntentCreateParams = {
        amount: amountInCents,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        metadata,
        receipt_email: contactEmail,
      };

      const shippingDetails = buildStripeShipping(contactName, guestData);
      if (shippingDetails) {
        createParams.shipping = shippingDetails;
      }

      paymentIntent = await stripe.paymentIntents.create(createParams);
    }

    if (!paymentIntent.client_secret) {
      return NextResponse.json(
        { error: 'Unable to obtain a client secret from Stripe.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderNumber: paymentIntent.metadata?.order_number ?? metadata.order_number,
    });
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent. Please try again.' },
      { status: 500 }
    );
  }
}

function buildStripeShipping(name: string | undefined, guestData?: GuestPayload) {
  if (!guestData?.address) {
    return undefined;
  }

  const address = guestData.address;
  const trimmedName = name?.trim();

  return {
    name: trimmedName && trimmedName.length > 0 ? trimmedName : 'Guest',
    address: {
      line1: address.street || undefined,
      line2: address.street2 || undefined,
      city: address.city || undefined,
      state: address.state || undefined,
      postal_code: address.zipCode || undefined,
      country: address.country || 'US',
    },
    phone: guestData.phone || undefined,
  } satisfies Stripe.PaymentIntentCreateParams.Shipping;
}
