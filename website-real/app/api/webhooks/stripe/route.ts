import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { SupabaseOrderService } from '@/lib/services/supabase-existing'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)


// Helper: safe JSON parse
function safeJsonParse<T = unknown>(value: unknown, fallback: T): T {
  try {
    if (typeof value === 'string') return JSON.parse(value) as T
    return (value as T) ?? fallback
  } catch {
    return fallback
  }
}

function generateNumericOrderNumber(): string {
  const seconds = Math.floor(Date.now() / 1000);
  const random4 = Math.floor(1000 + Math.random() * 9000);
  return `${seconds}${random4}`;
}

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

    let event;

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
        const session = event.data.object;

        // Update order status to paid if order exists
        await handleSuccessfulPayment(session);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;

        // Update payment status in existing order
        await updateOrderPaymentStatus(paymentIntent.id, 'paid');
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;

        // Update payment status to failed
        await updateOrderPaymentStatus(failedPayment.id, 'failed');
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
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
    const cart = safeJsonParse<any[]>(metadata.cart ?? '[]', []);
    const shipping = Number(metadata.shipping ?? 0);
    const tax = Number(metadata.tax ?? 0);
    // Recalculate subtotal from cart to avoid trusting client-submitted metadata
    const subtotal = (Array.isArray(cart) ? cart : []).reduce((sum, it: any) => {
      const price = Number(it.price ?? it.unitPrice ?? 0);
      const qty = Number(it.quantity ?? it.qty ?? 1);
      return sum + price * qty;
    }, 0);

    const guestData = safeJsonParse<Record<string, any>>(metadata.guest ?? '{}', {});
    const customerData = safeJsonParse<Record<string, any>>(metadata.customer ?? '{}', {});
    const orderNumber = (metadata.order_number as string) || generateNumericOrderNumber();

    // Attempt to create via SupabaseOrderService if it exposes a create method
    let createdOrder: any = null;
    try {
      if (typeof (SupabaseOrderService as any).createOrder === 'function') {
        // If service supports high-level create, prefer it
        createdOrder = await (SupabaseOrderService as any).createOrder({
          order_number: orderNumber,
          subtotal,
          tax,
          shipping,
          cart,
          guestData,
          customerData,
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent,
          payment_status: 'paid',
          status: 'confirmed'
        })
        console.log('Order created via SupabaseOrderService.createOrder:', createdOrder?.id)
      }
    } catch (serviceErr) {
      console.warn('SupabaseOrderService.createOrder failed or not supported, falling back to direct Supabase client.', serviceErr)
    }

    // Fallback: direct Supabase admin client insert
    if (!createdOrder) {
      // Lazy import to avoid adding a global dependency if service handles creation
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
      )

      const orderPayload = {
        user_id: null,
        order_number: orderNumber,
        status: 'confirmed',
        payment_status: 'paid',
        stripe_payment_intent: session.payment_intent,
        total_amount: subtotal + shipping + tax,
        subtotal: subtotal,
        tax_amount: tax,
        shipping_amount: shipping,
        discount_amount: 0,
        shipping_name: (guestData?.firstName && guestData?.lastName) ? `${guestData.firstName} ${guestData.lastName}` : (customerData?.name || session.customer_details?.name || ''),
        shipping_email: customerData?.email || session.customer_details?.email || guestData?.email || '',
        shipping_phone: guestData?.phone || customerData?.phone || session.customer_details?.phone || '',
        shipping_address_line1: shippingAddress?.line1 || (guestData?.address?.street || ''),
        shipping_address_line2: shippingAddress?.line2 || (guestData?.address?.street2 || ''),
        shipping_city: shippingAddress?.city || (guestData?.address?.city || ''),
        shipping_state: shippingAddress?.state || (guestData?.address?.state || ''),
        shipping_postal_code: shippingAddress?.postal_code || (guestData?.address?.zipCode || ''),
        shipping_country: shippingAddress?.country || (guestData?.address?.country || 'US'),
        stripe_checkout_session_id: session.id
      }

      const { data: newOrder, error: createErr } = await supabaseAdmin
        .from('orders')
        .insert(orderPayload)
        .select()
        .single()

      if (createErr || !newOrder) {
        console.error('Webhook: Failed to create order in Supabase', createErr)
        return;
      }
      createdOrder = newOrder
      console.log('Webhook: Order created in Supabase with id', createdOrder.id)

      // Create order items
      const orderItems = (Array.isArray(cart) ? cart : []).map((it: any) => {
        const quantity = Number(it.quantity ?? it.qty ?? 1)
        const unitPrice = Number(it.price ?? it.unitPrice ?? 0)
        return {
          order_id: createdOrder.id,
          product_id: it.id ?? it.productId ?? null,
          variant_id: it.variantId ?? null,
          product_name: it.name ?? it.title ?? '',
          product_image_url: it.image ?? (it.product?.images && it.product.images[0]) ?? null,
          quantity,
          unit_price: unitPrice,
          total_price: unitPrice * quantity,
          variant_details: {
            size: it.size ?? it.selectedSize ?? null,
            color: it.color ?? null,
            price: unitPrice,
            image: it.image ?? null
          }
        }
      })

      if (orderItems.length > 0) {
        const { error: itemsErr } = await supabaseAdmin
          .from('order_items')
          .insert(orderItems)

        if (itemsErr) {
          console.error('Webhook: Failed to insert order items', itemsErr)
        } else {
          console.log(`Webhook: Inserted ${orderItems.length} order items for order ${createdOrder.id}`)
        }
      }
    }

    console.log('Webhook processed successfully');

  } catch (err) {
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
  } catch (error) {
    console.error('Error updating order payment status:', error);
  }
}