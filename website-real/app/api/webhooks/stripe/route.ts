import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { SupabaseOrderService } from '@/lib/services/supabase-existing'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

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

    if (!customerDetails || !shippingAddress) {
      console.error('No shipping details found in session');
      return;
    }

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
      console.log('No existing order found', err);
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