import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  console.log('Checkout API: Request received');

  try {
    // 1. Validate Environment Variables
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const baseUrlRaw = process.env.NEXT_PUBLIC_BASE_URL;

    // Log configuration status (DO NOT log actual keys)
    const isTestKey = stripeKey?.startsWith('sk_test_');
    console.log('Checkout API: Configuration Check', {
      hasStripeKey: !!stripeKey,
      keyType: isTestKey ? 'TEST' : (stripeKey ? 'LIVE' : 'MISSING'),
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseServiceKey: !!supabaseServiceKey,
      hasBaseUrl: !!baseUrlRaw,
      baseUrlValue: baseUrlRaw // Safe to log base URL
    });

    if (!stripeKey || !supabaseUrl || !supabaseServiceKey || !baseUrlRaw) {
      const missing = [];
      if (!stripeKey) missing.push('STRIPE_SECRET_KEY');
      if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
      if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
      if (!baseUrlRaw) missing.push('NEXT_PUBLIC_BASE_URL');

      console.error('Checkout API: Missing environment variables:', missing);
      return NextResponse.json(
        { error: `Server configuration error: Missing ${missing.join(', ')}` },
        { status: 500 }
      );
    }

    // 2. Initialize Clients
    const stripe = new Stripe(stripeKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const baseUrl = baseUrlRaw.replace(/\/$/, '');

    // 3. Parse Request
    let requestData;
    try {
      requestData = await request.json();
    } catch (e) {
      console.error('Checkout API: Failed to parse JSON body', e);
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    console.log('Checkout API: Request data parsed');
    const { items, shipping, tax, guestData, customerData } = requestData;

    // 4. Auth (Optional)
    const authHeader = request.headers.get('authorization');
    console.log('Checkout API: Auth header present:', !!authHeader);
    let userId = null;
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (authError) {
          console.warn('Checkout API: Auth check failed', authError);
        } else {
          userId = user?.id;
          console.log('Checkout API: User authenticated', { userId, email: user?.email });
        }
      } catch (e) {
        console.warn('Checkout API: Auth token processing error', e);
      }
    } else {
      console.log('Checkout API: No auth header, creating guest order');
    }

    // 5. Calculate Totals
    const safeShipping = typeof shipping === 'number' ? shipping : 0;
    const safeTax = typeof tax === 'number' ? tax : 0;
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const totalAmount = subtotal + safeShipping + safeTax;
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    console.log('Checkout API: Order details calculated', { orderNumber, totalAmount });

    // 6. Create Order in Supabase
    // Helper to get address field
    const getAddressField = (field: 'street' | 'street2' | 'city' | 'state' | 'zipCode' | 'country') => {
      return guestData?.address?.[field] || customerData?.address?.[field] || '';
    };

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        order_number: orderNumber,
        status: 'pending',
        payment_status: 'pending',
        total_amount: totalAmount,
        subtotal: subtotal,
        tax_amount: safeTax,
        shipping_amount: safeShipping,
        discount_amount: 0,
        shipping_name: customerData?.name || `${guestData?.firstName} ${guestData?.lastName}`,
        shipping_email: customerData?.email || guestData?.email,
        shipping_phone: guestData?.phone || customerData?.phone || '',
        shipping_address_line1: getAddressField('street'),
        shipping_address_line2: getAddressField('street2') || '',
        shipping_city: getAddressField('city'),
        shipping_state: getAddressField('state'),
        shipping_postal_code: getAddressField('zipCode'),
        shipping_country: getAddressField('country') || 'US',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Checkout API: Failed to create order in Supabase', orderError);
      return NextResponse.json(
        { error: 'Failed to create order record' },
        { status: 500 }
      );
    }

    console.log('Checkout API: Order created', order.id);

    // 7. Create Order Items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: null,
      variant_id: null,
      product_name: item.name,
      product_image_url: item.image,
      variant_details: {
        size: item.size,
        color: item.color
      },
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Checkout API: Failed to create order items', itemsError);
      // Continue anyway, as the order exists
    }

    // 8. Prepare Stripe Session
    const lineItems = items.map((item: any) => {
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

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: imageUrl ? [imageUrl] : [],
            metadata: {
              productId: item.productId,
              size: item.size || '',
              color: item.color || '',
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
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

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems as Stripe.Checkout.SessionCreateParams.LineItem[],
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: {
        order_id: order.id,
        order_number: orderNumber,
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

    // 9. Update Order with Session ID
    await supabaseAdmin
      .from('orders')
      .update({ stripe_checkout_session_id: session.id })
      .eq('id', order.id);

    return NextResponse.json({
      sessionId: session.id,
      orderId: order.id,
      orderNumber: orderNumber
    });

  } catch (error: any) {
    console.error('Checkout API: Unhandled error', error);
    console.error('Checkout API: Error stack', error.stack);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error.message || 'Unknown error',
        code: error.code
      },
      { status: 500 }
    );
  }
}
