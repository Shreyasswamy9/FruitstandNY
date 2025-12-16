import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { SupabaseClient } from '@supabase/supabase-js'
import { SupabaseOrderService } from '@/lib/services/supabase-existing'
import { generateOrderNumber } from '@/lib/orderNumbers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Helper: safe JSON parse
function safeJsonParse<T = unknown>(value: unknown, fallback: T): T {
  try {
    if (typeof value === 'string') return JSON.parse(value) as T
    if (value === undefined || value === null) return fallback
    return value as T
  } catch {
    return fallback
  }
}

type OrderCartItem = {
  id?: string
  productId?: string
  variantId?: string
  name?: string
  title?: string
  image?: string
  product?: { images?: string[] }
  price?: number | string
  unitPrice?: number | string
  quantity?: number | string
  qty?: number | string
  size?: string
  selectedSize?: string
  color?: string
};

type GuestAddress = {
  street?: string
  street2?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
};

type GuestPayload = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: GuestAddress
};

type CustomerPayload = {
  name?: string
  email?: string
  phone?: string
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;

        // Update order status to paid if order exists
        await handleSuccessfulPayment(session);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Update payment status in existing order
        await updateOrderPaymentStatus(paymentIntent.id, 'paid');
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;

        // Update payment status to failed
        await updateOrderPaymentStatus(failedPayment.id, 'failed');
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: unknown) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing checkout.session.completed for session:', session.id);

    if (session.payment_status !== 'paid') {
      console.warn('Skipping order creation because payment is not completed.', {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        sessionStatus: session.status,
      });
      return;
    }

    // Extract shipping details from Stripe
    const customerDetails = session.customer_details;
    const shippingAddress = customerDetails?.address;

    // Prepare shipping data from Stripe
    const shippingData = {
      shipping_name: customerDetails?.name || 'Unknown',
      shipping_email: session.customer_email || customerDetails?.email || '',
      shipping_phone: customerDetails?.phone || null,
      shipping_address_line1: shippingAddress?.line1 || '',
      shipping_address_line2: shippingAddress?.line2 || null,
      shipping_city: shippingAddress?.city || '',
      shipping_state: shippingAddress?.state || '',
      shipping_postal_code: shippingAddress?.postal_code || '',
      shipping_country: shippingAddress?.country || 'US',
      payment_status: 'paid' as const,
      status: 'confirmed' as const,
    };

    console.log('Extracted shipping data from Stripe:', shippingData);

    // Try to find existing order by stripe session ID
    try {
      const existingOrder = await SupabaseOrderService.getOrderByStripeSession(session.id);
      if (existingOrder) {
        // Update existing order with Stripe shipping data + payment status
        await SupabaseOrderService.updateOrderWithShipping(existingOrder.id, shippingData);
        console.log(`Updated order ${existingOrder.id} with Stripe shipping data and paid status`);
        return;
      }
    } catch (err) {
      // Not fatal — proceed to create order
      console.log('No existing order found (or check failed), will attempt to create one.', err);
    }

    // If we reach here, no order exists: create order + order_items using metadata
    const metadata = session.metadata ?? {};
    const cart = safeJsonParse<OrderCartItem[]>(metadata.cart ?? '[]', []);
    const shipping = Number(metadata.shipping ?? 0);
    const tax = Number(metadata.tax ?? 0);
    // Recalculate subtotal from cart to avoid trusting client-submitted metadata
    const cartItems = Array.isArray(cart) ? cart : [];
    const subtotal = cartItems.reduce((sum, item) => {
      const price = Number(item.price ?? item.unitPrice ?? 0);
      const qty = Number(item.quantity ?? item.qty ?? 1);
      return sum + price * qty;
    }, 0);

    const guestData = safeJsonParse<GuestPayload>(metadata.guest ?? '{}', {});
    const customerData = safeJsonParse<CustomerPayload>(metadata.customer ?? '{}', {});
    const orderNumber = (metadata.order_number as string) || generateOrderNumber();
    const stripePaymentIntent = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

    const createdOrder = await createOrderWithItems({
      orderNumber,
      subtotal,
      tax,
      shipping,
      cartItems,
      guestData,
      customerData,
      stripeSessionId: session.id,
      stripePaymentIntent,
      shippingAddress,
      fallbackSession: session
    });

    if (!createdOrder) {
      console.error('Webhook: Order creation aborted. See logs above for details.');
      return;
    }

    console.log('Webhook: Order created in Supabase with id', createdOrder.id)

    console.log('Webhook processed successfully');

  } catch (err: unknown) {
    console.error('Error handling successful payment:', err);
    throw err;
  }
}

async function updateOrderPaymentStatus(paymentIntentId: string, status: 'paid' | 'failed') {
  try {
    const order = await SupabaseOrderService.getOrderByPaymentIntent(paymentIntentId);
    if (order) {
      await SupabaseOrderService.updatePaymentStatus(order.id, status);
      if (status === 'paid') {
        await SupabaseOrderService.updateOrderStatus(order.id, 'confirmed');
      }
      console.log(`Updated order ${order.id} payment status to ${status}`);
    }
  } catch (error: unknown) {
    console.error('Error updating order payment status:', error);
  }
}

type CreateOrderWithItemsParams = {
  orderNumber: string
  subtotal: number
  tax: number
  shipping: number
  cartItems: OrderCartItem[]
  guestData: GuestPayload
  customerData: CustomerPayload
  stripeSessionId: string
  stripePaymentIntent: string | null
  shippingAddress: Stripe.Address | null | undefined
  fallbackSession: Stripe.Checkout.Session
}

async function createOrderWithItems(params: CreateOrderWithItemsParams): Promise<{ id: string | number } | null> {
  const {
    orderNumber,
    subtotal,
    tax,
    shipping,
    cartItems,
    guestData,
    customerData,
    stripeSessionId,
    stripePaymentIntent,
    shippingAddress,
    fallbackSession,
  } = params

  const supabaseAdmin = await getSupabaseAdminClient()
  if (!supabaseAdmin) {
    console.error('Webhook: Cannot create order because Supabase admin credentials are missing')
    return null
  }

  const orderPayload = {
    user_id: null,
    order_number: orderNumber,
    status: 'confirmed' as const,
    payment_status: 'paid' as const,
    stripe_payment_intent_id: stripePaymentIntent,
    total_amount: subtotal + shipping + tax,
    subtotal,
    tax_amount: tax,
    shipping_amount: shipping,
    discount_amount: 0,
    shipping_name: (guestData?.firstName && guestData?.lastName)
      ? `${guestData.firstName} ${guestData.lastName}`
      : (customerData?.name || fallbackSession.customer_details?.name || ''),
    shipping_email: customerData?.email || fallbackSession.customer_details?.email || guestData?.email || '',
    shipping_phone: guestData?.phone || customerData?.phone || fallbackSession.customer_details?.phone || '',
    shipping_address_line1: shippingAddress?.line1 || guestData?.address?.street || '',
    shipping_address_line2: shippingAddress?.line2 || guestData?.address?.street2 || '',
    shipping_city: shippingAddress?.city || guestData?.address?.city || '',
    shipping_state: shippingAddress?.state || guestData?.address?.state || '',
    shipping_postal_code: shippingAddress?.postal_code || guestData?.address?.zipCode || '',
    shipping_country: shippingAddress?.country || guestData?.address?.country || 'US',
    stripe_checkout_session_id: stripeSessionId,
  }

  const { data: newOrder, error: createErr } = await supabaseAdmin
    .from('orders')
    .insert(orderPayload)
    .select()
    .single()

  if (createErr || !newOrder) {
    console.error('Webhook: Failed to create order in Supabase', createErr)
    return null
  }

  const createdOrder = newOrder as { id: string | number }

  if (cartItems.length > 0) {
    const orderItemRows = cartItems.map((item) => {
      const quantity = Number(item.quantity ?? item.qty ?? 1)
      const unitPrice = Number(item.price ?? item.unitPrice ?? 0)
      return {
        order_id: createdOrder.id,
        product_id: item.id ?? item.productId ?? null,
        variant_id: item.variantId ?? null,
        product_name: item.name ?? item.title ?? '',
        product_image_url: item.image ?? item.product?.images?.[0] ?? null,
        quantity,
        unit_price: unitPrice,
        total_price: unitPrice * quantity,
        variant_details: {
          size: item.size ?? item.selectedSize ?? null,
          color: item.color ?? null,
          price: unitPrice,
          image: item.image ?? null
        }
      }
    })

    const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(orderItemRows)

    if (itemsErr) {
      console.error('Webhook: Failed to insert order items, rolling back order', itemsErr)
      const { error: cleanupErr } = await supabaseAdmin
        .from('orders')
        .delete()
        .eq('id', createdOrder.id)

      if (cleanupErr) {
        console.error('Webhook: Failed to roll back orphaned order after item insertion error', cleanupErr)
      }

      throw new Error('Supabase order_items insert failed')
    }

    console.log(`Webhook: Inserted ${orderItemRows.length} order items for order ${createdOrder.id}`)
  }

  return createdOrder
}

let cachedSupabaseAdmin: SupabaseClient | null = null

async function getSupabaseAdminClient() {
  if (cachedSupabaseAdmin) {
    return cachedSupabaseAdmin
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    console.error('Supabase admin URL or service role key is not configured')
    return null
  }

  const { createClient } = await import('@supabase/supabase-js')
  cachedSupabaseAdmin = createClient(url, serviceKey)
  return cachedSupabaseAdmin
}