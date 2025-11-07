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
    // Try to find existing order by stripe session ID
    try {
      const existingOrder = await SupabaseOrderService.getOrderByStripeSession(session.id);
      if (existingOrder) {
        // Update existing order to paid status
        await SupabaseOrderService.updatePaymentStatus(existingOrder.id, 'paid');
        await SupabaseOrderService.updateOrderStatus(existingOrder.id, 'confirmed');
        console.log(`Updated existing order ${existingOrder.id} to paid status`);
        return;
      }
    } catch (err) {
      console.log('No existing order found, will create new one if needed', err);
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