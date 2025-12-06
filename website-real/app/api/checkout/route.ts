import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function generateNumericOrderNumber(): string {
  // seconds since epoch + 4 random digits -> compact numeric id
  const seconds = Math.floor(Date.now() / 1000);
  const random4 = Math.floor(1000 + Math.random() * 9000);
  return `${seconds}${random4}`;
}

export async function POST(request: NextRequest) {
  console.log('Checkout API: Request received');

  try {
    // 1. Validate Environment Variables
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const baseUrlRaw = process.env.NEXT_PUBLIC_BASE_URL;

    // Log configuration status (DO NOT log actual keys)
    const isTestKey = stripeKey?.startsWith('sk_test_');
    console.log('Checkout API: Configuration Check', {
      hasStripeKey: !!stripeKey,
      keyType: isTestKey ? 'TEST' : (stripeKey ? 'LIVE' : 'MISSING'),
      hasBaseUrl: !!baseUrlRaw,
      baseUrlValue: baseUrlRaw // Safe to log base URL
    });

    if (!stripeKey || !baseUrlRaw) {
      const missing = [];
      if (!stripeKey) missing.push('STRIPE_SECRET_KEY');
      if (!baseUrlRaw) missing.push('NEXT_PUBLIC_BASE_URL');

      console.error('Checkout API: Missing environment variables:', missing);
      return NextResponse.json(
        { error: `Server configuration error: Missing ${missing.join(', ')}` },
        { status: 500 }
      );
    }

    // 2. Initialize Stripe client only (no Supabase client or DB writes in this route)
    const stripe = new Stripe(stripeKey);
    const baseUrl = baseUrlRaw.replace(/\/$/, '');

    // 3. Parse Request
    let requestData: any;
    try {
      requestData = await request.json();
    } catch (e) {
      console.error('Checkout API: Failed to parse JSON body', e);
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    console.log('Checkout API: Request data parsed');
    const { items = [], shipping = 0, tax = 0, guestData = null, customerData = null } = requestData;

    // 4. Auth (Optional) - preserved for logging only
    const authHeader = request.headers.get('authorization');
    console.log('Checkout API: Auth header present:', !!authHeader);
    let userId: string | null = null;
    if (authHeader) {
      try {
        // Attempt to extract token and inspect (no Supabase client call here to avoid DB ops)
        const token = authHeader.replace('Bearer ', '');
        // Note: keep token handling lightweight; actual user validation can occur in webhook if needed
        console.log('Checkout API: Received auth token (length):', token.length);
      } catch (e) {
        console.warn('Checkout API: Auth token processing error', e);
      }
    } else {
      console.log('Checkout API: No auth header, creating guest order (deferred to webhook)');
    }

    // 5. Calculate Totals
    const safeShipping = typeof shipping === 'number' ? shipping : Number(shipping || 0);
    const safeTax = typeof tax === 'number' ? tax : Number(tax || 0);
    type CartItem = { price: number; quantity: number; name: string; image?: string; productId?: string; size?: string; color?: string };
    const subtotal = (items as CartItem[]).reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
    const totalAmount = subtotal + safeShipping + safeTax;
    const orderNumber = generateNumericOrderNumber();

    console.log('Checkout API: Order details calculated', { orderNumber, totalAmount });

    // 6. Prepare Stripe line items (unchanged except image handling)
    const lineItems = (items as CartItem[]).map((item) => {
      let imageUrl = item.image;
      if (imageUrl && !imageUrl.startsWith('http')) {
        const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
        imageUrl = `${baseUrl}${cleanPath}`;
      }

      if (imageUrl) {
        try {
          imageUrl = encodeURI(imageUrl);
        } catch (e) {
          console.error('Checkout API: Error encoding image URL', imageUrl, e);
          imageUrl = undefined;
        }
      }

      // Only include images when the final URL is an absolute HTTP(S) URL.
      const imageIsAbsolute = typeof imageUrl === 'string' && /^https?:\/\//i.test(imageUrl);

      const productData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData = {
        name: item.name,
        metadata: {
          productId: item.productId || '',
          size: item.size || '',
          color: item.color || '',
        },
      };
      if (imageIsAbsolute && imageUrl) {
        productData.images = [imageUrl];
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: productData,
          unit_amount: Math.round(Number(item.price || 0) * 100),
        },
        quantity: Number(item.quantity || 1),
      };
    });

    if (safeShipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: Math.round(safeShipping * 100),
        },
        quantity: 1,
      });
    }

    if (safeTax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Tax' },
          unit_amount: Math.round(safeTax * 100),
        },
        quantity: 1,
      });
    }

    // 7. Create Stripe Session with metadata containing full order payload (no DB writes here)
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems as Stripe.Checkout.SessionCreateParams.LineItem[],
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: {
        // Required by your webhook to create the order after payment
        cart: JSON.stringify(items || []),
        tax: String(safeTax),
        shipping: String(safeShipping),
        subtotal: String(subtotal),
        guest: JSON.stringify(guestData || {}),
        customer: JSON.stringify(customerData || {}),
        order_number: orderNumber,
        // Include any minimal identifiers needed by webhook (avoid secrets)
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      billing_address_collection: 'required',
    };

    const customerInfo = customerData || guestData;
    if (customerInfo?.email) {
      sessionConfig.customer_email = customerInfo.email;
      if (customerInfo.name) {
        sessionConfig.customer_creation = 'always';
      }
    }

    console.log('Checkout API: Creating Stripe session...');
    const session = await stripe.checkout.sessions.create(sessionConfig);
    console.log('Checkout API: Stripe session created', session.id);

    // 8. IMPORTANT: DO NOT create or update any Supabase order here.
    // All order persistence must happen in the webhook on checkout.session.completed.

    // 9. Return only the Stripe session id
    return NextResponse.json({
      sessionId: session.id
    });

  } catch (error) {
    console.error('Checkout API: Unhandled error', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: message,
      },
      { status: 500 }
    );
  }
}
