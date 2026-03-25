import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { SupabaseClient } from '@supabase/supabase-js'
import { SupabaseOrderService } from '@/lib/services/supabase-existing'
import { generateOrderNumber } from '@/lib/orderNumbers'
import { readCartMetadata } from '@/lib/stripeCartMetadata'
import { sendTransactionalTemplate } from '@/lib/email/transactional'
import { hasEmailEvent, recordEmailEvent } from '@/lib/email/emailEvents'
import { trackOrderInMailchimp } from '@/lib/mailchimp-ecommerce'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const runtime = 'nodejs'

// Tax calculation helper - NY-based business
function calculateCorrectTax(subtotal: number, shippingState?: string | null): number {
  const TAX_RATES: Record<string, number> = {
    'NY': 0.08875, // New York state tax rate
    // Add other state rates as needed
    // For now, only NY has tax since that's where the business is located
  };
  
  // Only charge tax if shipping to NY (where we have nexus)
  const rate = (shippingState && TAX_RATES[shippingState]) ? TAX_RATES[shippingState] : 0;
  return Math.round(subtotal * rate * 100) / 100;
}

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
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    const bodyBuffer = Buffer.from(await request.arrayBuffer());

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        bodyBuffer,
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

        await handlePaymentIntentSucceeded(paymentIntent);
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

    // Extract shipping details with explicit precedence:
    // 1) Stripe shipping from payment intent (primary source for actual shipping address)
    // 2) guest metadata address captured pre-checkout
    // 3) customer_details address (billing/auto-collected fallback only)
    const customerDetails = session.customer_details;
    type SessionShippingDetails = {
      name?: string | null;
      phone?: string | null;
      address?: Stripe.Address | null;
    };
    
    // Get shipping details from payment intent (this is where Stripe stores the actual shipping address)
    let shippingDetails: SessionShippingDetails | null = null;
    try {
      const stripePaymentIntent = typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id;
      
      if (stripePaymentIntent) {
        const paymentIntent = await stripe.paymentIntents.retrieve(stripePaymentIntent);
        if (paymentIntent.shipping) {
          shippingDetails = paymentIntent.shipping;
        }
      }
    } catch (err) {
      console.warn('Webhook: Could not retrieve payment intent for shipping details', err);
    }
    
    // Fallback to session.shipping_details if payment intent shipping not found
    if (!shippingDetails) {
      shippingDetails = (session as Stripe.Checkout.Session & {
        shipping_details?: SessionShippingDetails | null;
      }).shipping_details || null;
    }
    
    const metadata = session.metadata ?? {};
    const guestData = safeJsonParse<GuestPayload>(metadata.guest ?? '{}', {});
    const customerData = safeJsonParse<CustomerPayload>(metadata.customer ?? '{}', {});

    const hasGuestAddress = !!(
      guestData?.address?.street ||
      guestData?.address?.city ||
      guestData?.address?.state ||
      guestData?.address?.zipCode
    );

    const shippingAddress = shippingDetails?.address
      ? {
          line1: shippingDetails.address.line1,
          line2: shippingDetails.address.line2,
          city: shippingDetails.address.city,
          state: shippingDetails.address.state,
          postal_code: shippingDetails.address.postal_code,
          country: shippingDetails.address.country,
        }
      : hasGuestAddress
        ? {
            line1: guestData.address?.street || null,
            line2: guestData.address?.street2 || null,
            city: guestData.address?.city || null,
            state: guestData.address?.state || null,
            postal_code: guestData.address?.zipCode || null,
            country: guestData.address?.country || null,
          }
        : customerDetails?.address;

    // Extract billing address from customer_details (always collected by Stripe)
    const billingAddress = customerDetails?.address;

    const guestName = guestData?.firstName && guestData?.lastName
      ? `${guestData.firstName} ${guestData.lastName}`
      : undefined;

    const shippingName = shippingDetails?.name || guestName || customerData?.name || customerDetails?.name || 'Unknown';
    const shippingEmail = session.customer_email || customerData?.email || guestData?.email || customerDetails?.email || '';
    const shippingPhone = shippingDetails?.phone || guestData?.phone || customerData?.phone || customerDetails?.phone || null;

    const shippingSource = shippingDetails?.address
      ? 'stripe_shipping_details'
      : hasGuestAddress
        ? 'guest_metadata'
        : customerDetails?.address
          ? 'customer_details_fallback'
          : 'none';

    if (shippingSource === 'customer_details_fallback') {
      console.warn('Webhook: Using customer_details as shipping fallback for session', session.id);
    }

    if (shippingSource === 'none') {
      console.error('Webhook: No shipping address source available for session', session.id);
    }

    // Prepare shipping and billing data from Stripe
    const shippingData = {
      shipping_name: shippingName,
      shipping_email: shippingEmail,
      shipping_phone: shippingPhone,
      shipping_address_line1: shippingAddress?.line1 || '',
      shipping_address_line2: shippingAddress?.line2 || null,
      shipping_city: shippingAddress?.city || '',
      shipping_state: shippingAddress?.state || '',
      shipping_postal_code: shippingAddress?.postal_code || '',
      shipping_country: shippingAddress?.country || 'US',
      // Billing address fields
      billing_address_line1: billingAddress?.line1 || '',
      billing_address_line2: billingAddress?.line2 || null,
      billing_city: billingAddress?.city || '',
      billing_state: billingAddress?.state || '',
      billing_postal_code: billingAddress?.postal_code || '',
      billing_country: billingAddress?.country || 'US',
      payment_status: 'paid' as const,
      status: 'confirmed' as const,
    };

    console.log('Extracted shipping data from Stripe:', {
      ...shippingData,
      _shipping_source: shippingSource,
    });

    // Try to find existing order by stripe session ID
    try {
      const existingOrder = await SupabaseOrderService.getOrderByStripeSession(session.id).catch(() => null);
      if (existingOrder) {
        // Update existing order with Stripe shipping data + payment status
        await SupabaseOrderService.updateOrderWithShipping(existingOrder.id, shippingData);
        console.log(`Updated order ${existingOrder.id} with Stripe shipping data and paid status`);
        
        // Send order confirmation email
        await sendOrderConfirmationEmail(existingOrder, session);
        await trackOrderInMailchimp(existingOrder);

        return;
      }
    } catch (err) {
      // Not fatal
    }

    console.log('No existing order found, will attempt to sync/create one.');

    // If we reach here, no order exists or update failed — sync using the session
    // Pass the fully resolved shippingAddress (with fallback logic) to syncOrderFromStripeSession
    const syncResult = await SupabaseOrderService.syncOrderFromStripeSession(session, shippingAddress);

    if (!syncResult) {
      console.error('Webhook: Order sync failed.');
      return;
    }

    console.log('Webhook: Order synced in Supabase with id', syncResult.id)

    // Decrement stock for each purchased item (guarded against duplicate webhook runs)
    const alreadyDecremented = await hasEmailEvent(syncResult.id, 'stock_decremented');
    if (!alreadyDecremented) {
      const cartJson = readCartMetadata(session.metadata ?? {}) ?? '[]';
      const cartItemsForDecrement = safeJsonParse<OrderCartItem[]>(cartJson, []);
      const adminClient = await getSupabaseAdminClient();
      if (adminClient && cartItemsForDecrement.length > 0) {
        await decrementStock(cartItemsForDecrement, adminClient, syncResult.id);
        await recordEmailEvent(syncResult.id, 'stock_decremented');
      }
    }

    // Send order confirmation email for newly created order
    await sendOrderConfirmationEmail(syncResult, session);
    await trackOrderInMailchimp(syncResult);

    console.log('Webhook processed successfully');

  } catch (err: unknown) {
    console.error('Error handling successful payment:', err);
    throw err;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    if (paymentIntent.status !== 'succeeded') {
      return;
    }

    const metadata = paymentIntent.metadata ?? {};

    // If there's no cart or order_number in PI metadata, this PI was created by a
    // Checkout Session (metadata lives on the session, not the PI). Skip here —
    // checkout.session.completed will handle order creation with the correct amounts.
    const cartJson = readCartMetadata(metadata) ?? '[]';
    const cartItems = safeJsonParse<OrderCartItem[]>(cartJson, []);
    if (cartItems.length === 0 && !metadata.order_number) {
      console.log('Skipping payment_intent.succeeded — no cart metadata found on PI, checkout.session.completed will handle this order.');
      return;
    }

    const guestData = safeJsonParse<GuestPayload>(metadata.guest ?? '{}', {});
    const customerData = safeJsonParse<CustomerPayload>(metadata.customer ?? '{}', {});

    const subtotalFromMetadata = Number(metadata.subtotal);
    const subtotal = Number.isFinite(subtotalFromMetadata)
      ? subtotalFromMetadata
      : cartItems.reduce((sum, item) => {
          const price = Number(item.price ?? item.unitPrice ?? 0);
          const qty = Number(item.quantity ?? item.qty ?? 1);
          return sum + price * qty;
        }, 0);

    const shippingAmount = Number.isFinite(Number(metadata.shipping))
      ? Number(metadata.shipping)
      : 0;
    const taxAmount = Number.isFinite(Number(metadata.tax))
      ? Number(metadata.tax)
      : 0;

    // CRITICAL: Use Stripe's amount as ground truth for total
    // If metadata sums don't match, log warning but use Stripe amount
    const metadataTotal = subtotal + shippingAmount + taxAmount;
    const stripeAmountDollars = paymentIntent.amount / 100;
    
    if (Math.abs(metadataTotal - stripeAmountDollars) > 0.01) {
      console.warn(`Payment intent ${paymentIntent.id}: Metadata total $${metadataTotal} differs from Stripe amount $${stripeAmountDollars}. Using Stripe amount.`);
    }

    const shippingDetails = paymentIntent.shipping ?? null;
    const shippingAddress = shippingDetails?.address;

    const nameFromGuest = guestData?.firstName && guestData?.lastName
      ? `${guestData.firstName} ${guestData.lastName}`
      : undefined;

    const shippingName = (shippingDetails?.name || customerData?.name || nameFromGuest || 'Guest').trim() || 'Guest';

    // For Link / Apple Pay / Google Pay, email and billing address come from the charge's billing_details
    let chargeEmail = '';
    let chargeBillingAddress: Stripe.Address | null = null;
    if (paymentIntent.latest_charge) {
      try {
        const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string);
        chargeEmail = charge.billing_details.email || '';
        if (charge.billing_details.address) {
          chargeBillingAddress = charge.billing_details.address;
        }
      } catch {
        // non-fatal
      }
    }

    const shippingEmail = customerData?.email || guestData?.email || paymentIntent.receipt_email || chargeEmail || '';

    if (!shippingEmail) {
      console.error(`No email found for payment intent ${paymentIntent.id} — confirmation email will not be sent`)
    }

    const shippingPhone = shippingDetails?.phone || guestData?.phone || customerData?.phone || null;

    const shippingPayload = {
      shipping_name: shippingName,
      shipping_email: shippingEmail,
      shipping_phone: shippingPhone,
      shipping_address_line1: shippingAddress?.line1 || guestData?.address?.street || '',
      shipping_address_line2: shippingAddress?.line2 || guestData?.address?.street2 || '',
      shipping_city: shippingAddress?.city || guestData?.address?.city || '',
      shipping_state: shippingAddress?.state || guestData?.address?.state || '',
      shipping_postal_code: shippingAddress?.postal_code || guestData?.address?.zipCode || '',
      shipping_country: shippingAddress?.country || guestData?.address?.country || 'US',
      // Add billing address
      billing_address_line1: chargeBillingAddress?.line1 || '',
      billing_address_line2: chargeBillingAddress?.line2 || '',
      billing_city: chargeBillingAddress?.city || '',
      billing_state: chargeBillingAddress?.state || '',
      billing_postal_code: chargeBillingAddress?.postal_code || '',
      billing_country: chargeBillingAddress?.country || 'US',
    };

    const existingOrder = await SupabaseOrderService.getOrderByPaymentIntent(paymentIntent.id).catch(() => null);

    if (existingOrder) {
      await SupabaseOrderService.updateOrderWithShipping(existingOrder.id, {
        ...shippingPayload,
        payment_status: 'paid',
        status: 'confirmed',
      });

      // Decrement stock (guarded against duplicate runs)
      const alreadyDecremented = await hasEmailEvent(existingOrder.id, 'stock_decremented');
      if (!alreadyDecremented) {
        const adminClient = await getSupabaseAdminClient();
        if (adminClient && cartItems.length > 0) {
          await decrementStock(cartItems, adminClient, existingOrder.id);
          await recordEmailEvent(existingOrder.id, 'stock_decremented');
        }
      }

      // Send order confirmation email
      await sendOrderConfirmationEmailFromPaymentIntent(
        existingOrder,
        paymentIntent,
        shippingEmail,
        shippingName
      );
      await trackOrderInMailchimp(existingOrder, cartItems);

      return;
    }

    const orderNumber = metadata.order_number || await generateOrderNumber();
    
    // Recalculate tax based on actual shipping state (NY-based business)
    const shippingState = shippingDetails?.address?.state || guestData?.address?.state;
    const correctTax = calculateCorrectTax(subtotal, shippingState);

    const newOrder = await createOrderFromPaymentIntent({
      orderNumber,
      subtotal,
      tax: correctTax,
      shipping: shippingAmount,
      cartItems,
      guestData,
      customerData,
      paymentIntentId: paymentIntent.id,
      stripeAmount: paymentIntent.amount / 100,
      shippingDetails,
      billingAddress: chargeBillingAddress,
      shippingName,
      shippingEmail,
      shippingPhone,
    });
    
    // Decrement stock for new order
    if (newOrder) {
      const alreadyDecremented = await hasEmailEvent(newOrder.id, 'stock_decremented');
      if (!alreadyDecremented) {
        const adminClient = await getSupabaseAdminClient();
        if (adminClient && cartItems.length > 0) {
          await decrementStock(cartItems, adminClient, newOrder.id);
          await recordEmailEvent(newOrder.id, 'stock_decremented');
        }
      }

      // Send order confirmation email for new order
      await sendOrderConfirmationEmailFromPaymentIntent(
        newOrder,
        paymentIntent,
        shippingEmail,
        shippingName
      );
      await trackOrderInMailchimp(newOrder, cartItems);
    }
  } catch (error) {
    console.error('Error handling payment_intent.succeeded:', error);
    throw error;
  }
}

async function updateOrderPaymentStatus(paymentIntentId: string, status: 'paid' | 'failed') {
  try {
    const order = await SupabaseOrderService.getOrderByPaymentIntent(paymentIntentId).catch(() => null);
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

type CreateOrderFromPaymentIntentParams = {
  orderNumber: string
  subtotal: number
  tax: number
  shipping: number
  cartItems: OrderCartItem[]
  guestData: GuestPayload
  customerData: CustomerPayload
  paymentIntentId: string
  stripeAmount: number
  shippingDetails: Stripe.PaymentIntent.Shipping | null
  billingAddress: Stripe.Address | null | undefined
  shippingName: string
  shippingEmail: string
  shippingPhone: string | null
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

async function createOrderFromPaymentIntent(params: CreateOrderFromPaymentIntentParams): Promise<{ id: string | number } | null> {
  const {
    orderNumber,
    subtotal,
    tax,
    shipping,
    cartItems,
    guestData,
    customerData,
    paymentIntentId,
    stripeAmount,
    shippingDetails,
    billingAddress,
    shippingName,
    shippingEmail,
    shippingPhone,
  } = params

  const supabaseAdmin = await getSupabaseAdminClient()
  if (!supabaseAdmin) {
    console.error('Webhook: Cannot create order (payment intent) because Supabase admin credentials are missing')
    return null
  }

  const address = shippingDetails?.address

  const orderPayload = {
    user_id: null,
    order_number: orderNumber,
    status: 'confirmed' as const,
    payment_status: 'paid' as const,
    stripe_payment_intent_id: paymentIntentId,
    stripe_checkout_session_id: null as string | null,
    // CRITICAL: Use Stripe's actual amount as source of truth, not metadata calculation
    total_amount: stripeAmount,
    subtotal,
    tax_amount: tax,
    shipping_amount: shipping,
    discount_amount: 0,
    shipping_name: shippingName,
    shipping_email: shippingEmail,
    shipping_phone: shippingPhone,
    shipping_address_line1: address?.line1 || guestData?.address?.street || '',
    shipping_address_line2: address?.line2 || guestData?.address?.street2 || '',
    shipping_city: address?.city || guestData?.address?.city || '',
    shipping_state: address?.state || guestData?.address?.state || '',
    shipping_postal_code: address?.postal_code || guestData?.address?.zipCode || '',
    shipping_country: address?.country || guestData?.address?.country || 'US',
    // Billing address
    billing_address_line1: billingAddress?.line1 || '',
    billing_address_line2: billingAddress?.line2 || '',
    billing_city: billingAddress?.city || '',
    billing_state: billingAddress?.state || '',
    billing_postal_code: billingAddress?.postal_code || '',
    billing_country: billingAddress?.country || 'US',
  }

  const { data: newOrder, error: createErr } = await supabaseAdmin
    .from('orders')
    .insert(orderPayload)
    .select()
    .single()

  if (createErr || !newOrder) {
    console.error('Webhook: Failed to create order from PaymentIntent in Supabase', createErr)
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
      console.error('Webhook: Failed to insert order items for payment intent order, rolling back order', itemsErr)
      const { error: cleanupErr } = await supabaseAdmin
        .from('orders')
        .delete()
        .eq('id', createdOrder.id)

      if (cleanupErr) {
        console.error('Webhook: Failed to roll back payment intent order after item insertion error', cleanupErr)
      }

      throw new Error('Supabase order_items insert failed for payment intent order')
    }

    console.log(`Webhook: Inserted ${orderItemRows.length} order items for payment intent order ${createdOrder.id}`)
  }

  return createdOrder
}

/**
 * Maps a "set" product ID to the individual component product IDs that make it up.
 * When a set is purchased, stock is decremented for both the set AND each component.
 * The same size and color from the set cart item are used to find the matching component variant.
 */
const PRODUCT_SET_COMPONENTS: Record<string, string[]> = {
  // Retro Track Suit → Track Top + Track Pants
  '0f5810c1-abec-4e70-a077-33c839b4de2b': [
    '91c47e89-efd4-4961-aadf-d4f7bf6e13b7', // Track Top
    '859d396c-0cd7-4d62-9a95-135ce8efbb82', // Track Pants
  ],
};

type DecrementOutcome = { target: string; qty: number; ok: boolean; reason?: string };

/**
 * Atomically decrement stock for each purchased item via Postgres RPC.
 *
 * Transactional behaviour:
 *   - All decrement attempts run and results are collected.
 *   - If ANY decrement fails this function throws, so the caller must NOT record
 *     stock_decremented — Stripe will retry the webhook.
 *   - stock_decremented is recorded by callers ONLY after this returns without error.
 *
 * RPC dependency:
 *   - Requires decrement_variant_stock and decrement_product_stock in Supabase.
 *   - If a function is missing (Postgres error 42883) the error is logged with a
 *     migration hint and counted as a failure → webhook returns 500 → Stripe retries.
 *
 * Variant identity preference:
 *   - variantId on the cart item → direct RPC by variant id (no extra query).
 *   - No variantId but size/color present → one lookup then RPC by variant id.
 *   - No variant info → product-level RPC fallback.
 */
async function decrementStock(
  cartItems: OrderCartItem[],
  supabaseAdmin: SupabaseClient,
  orderId: string | number,
): Promise<void> {
  const outcomes: DecrementOutcome[] = [];
  // PostgreSQL error code for "function does not exist"
  const PG_UNDEFINED_FUNCTION = '42883';

  const rpcDecrementVariant = async (variantId: string, qty: number, label: string): Promise<void> => {
    const { error } = await supabaseAdmin.rpc('decrement_variant_stock', {
      p_variant_id: variantId,
      p_qty: qty,
    });
    if (error) {
      const isMissing = (error as { code?: string }).code === PG_UNDEFINED_FUNCTION;
      const reason = isMissing
        ? 'RPC decrement_variant_stock not found — run supabase-migrations/001_stock_rpc_and_uniqueness.sql'
        : (error.message ?? 'Unknown RPC error');
      console.error(`[order ${orderId}] decrementStock FAIL variant=${variantId} qty=${qty} item="${label}": ${reason}`);
      outcomes.push({ target: `variant:${variantId}`, qty, ok: false, reason });
    } else {
      console.log(`[order ${orderId}] decrementStock OK variant=${variantId} qty=${qty} item="${label}"`);
      outcomes.push({ target: `variant:${variantId}`, qty, ok: true });
    }
  };

  const rpcDecrementProduct = async (productId: string, qty: number, label: string): Promise<void> => {
    const { error } = await supabaseAdmin.rpc('decrement_product_stock', {
      p_product_id: productId,
      p_qty: qty,
    });
    if (error) {
      const isMissing = (error as { code?: string }).code === PG_UNDEFINED_FUNCTION;
      const reason = isMissing
        ? 'RPC decrement_product_stock not found — run supabase-migrations/001_stock_rpc_and_uniqueness.sql'
        : (error.message ?? 'Unknown RPC error');
      console.error(`[order ${orderId}] decrementStock FAIL product=${productId} qty=${qty} item="${label}": ${reason}`);
      outcomes.push({ target: `product:${productId}`, qty, ok: false, reason });
    } else {
      console.log(`[order ${orderId}] decrementStock OK product=${productId} qty=${qty} item="${label}"`);
      outcomes.push({ target: `product:${productId}`, qty, ok: true });
    }
  };

  // Looks up the best-matching variant for (productId, size, color) and decrements it.
  // Returns true if a variant row was found (decrement attempted), false → fall back to product.
  const decrementVariantByAttrs = async (
    productId: string,
    size: string | null,
    color: string | null,
    qty: number,
    label: string,
  ): Promise<boolean> => {
    if (!size && !color) return false;
    let q = supabaseAdmin
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)
      .limit(1);
    if (size) q = q.eq('size', size);
    if (color) q = q.eq('color', color);
    const { data } = await q.maybeSingle();
    if (!data) return false;
    await rpcDecrementVariant(data.id, qty, label);
    return true;
  };

  for (const item of cartItems) {
    const qty = Math.max(1, Number(item.quantity ?? item.qty ?? 1));
    // Prefer variantId carried from checkout/payment-intent metadata.
    const variantId = item.variantId ?? null;
    const productId = item.id ?? item.productId ?? null;
    const size = item.size ?? item.selectedSize ?? null;
    const color = item.color ?? null;
    const label = item.name ?? item.title ?? productId ?? 'unknown';

    // --- Primary decrement ---
    if (variantId) {
      // Direct path — no extra lookup needed.
      await rpcDecrementVariant(variantId, qty, label);
    } else if (productId) {
      // Size/color fallback only when variantId is truly absent.
      const found = await decrementVariantByAttrs(productId, size, color, qty, label);
      if (!found) await rpcDecrementProduct(productId, qty, label);
    }

    // --- Set components (e.g. tracksuit → top + pants) ---
    // Always runs so both components get decremented by the full qty.
    if (productId && PRODUCT_SET_COMPONENTS[productId]) {
      for (const componentId of PRODUCT_SET_COMPONENTS[productId]) {
        const cLabel = `${label} [component ${componentId}]`;
        const found = await decrementVariantByAttrs(componentId, size, color, qty, cLabel);
        if (!found) await rpcDecrementProduct(componentId, qty, cLabel);
      }
    }
  }

  // Throw after all attempts so callers skip recording stock_decremented on failure.
  const failures = outcomes.filter((o) => !o.ok);
  if (failures.length > 0) {
    const summary = failures.map((f) => `${f.target} qty=${f.qty}: ${f.reason}`).join('; ');
    throw new Error(`[order ${orderId}] Stock decrement had ${failures.length} failure(s): ${summary}`);
  }
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

/**
 * Send order confirmation email from checkout session
 */
async function sendOrderConfirmationEmail(
  order: { id: string | number; order_number?: string; total_amount?: number; subtotal?: number; tax_amount?: number; shipping_amount?: number; discount_amount?: number; created_at?: string },
  session: Stripe.Checkout.Session
) {
  try {
    const orderId = order.id
    const orderNumber = order.order_number || 'Unknown'
    
    // Check if email already sent for this order
    const alreadySent = await hasEmailEvent(orderId, 'order_confirmation')
    if (alreadySent) {
      console.log(`Order confirmation email already sent for order ${orderId}`)
      return
    }
    
    // Determine customer email from session
    const customerEmail = session.customer_email || 
                         session.customer_details?.email ||
                         (session.metadata?.guest ? JSON.parse(session.metadata.guest).email : null) ||
                         (session.metadata?.customer ? JSON.parse(session.metadata.customer).email : null)
    
    if (!customerEmail) {
      console.error(`No customer email found for order ${orderId}`)
      return
    }
    
    // Determine customer name
    const customerName = session.customer_details?.name ||
                        (session.metadata?.guest ? 
                          (() => {
                            const guest = JSON.parse(session.metadata.guest)
                            return `${guest.firstName || ''} ${guest.lastName || ''}`.trim()
                          })() : null) ||
                        (session.metadata?.customer ? JSON.parse(session.metadata.customer).name : null) ||
                        'Valued Customer'
    
    const fmt = (n: number | null | undefined, fallbackCents: number | null | undefined) =>
      `$${(n != null ? n : (fallbackCents ?? 0) / 100).toFixed(2)}`

    const orderTotal    = fmt(order.total_amount, session.amount_total)
    const orderSubtotal = fmt(order.subtotal, session.amount_subtotal)
    const orderTax      = fmt(order.tax_amount, session.total_details?.amount_tax ?? null)
    const orderShipping = fmt(order.shipping_amount, session.total_details?.amount_shipping ?? null)
    const orderDiscount = fmt(order.discount_amount, session.total_details?.amount_discount ?? null)
    const orderDate     = new Date(order.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://fruitstandny.com').replace(/\/$/, '')
    const orderUrl = `${baseUrl}/account`

    // Send email
    const result = await sendTransactionalTemplate({
      templateName: 'order_confirmation',
      toEmail: customerEmail,
      toName: customerName,
      mergeVars: {
        CUSTOMER_NAME: customerName,
        ORDER_NUMBER: orderNumber,
        ORDER_DATE: orderDate,
        ORDER_TOTAL: orderTotal,
        ORDER_SUBTOTAL: orderSubtotal,
        ORDER_TAX_TOTAL: orderTax,
        ORDER_SHIP_TOTAL: orderShipping,
        ORDER_DISCOUNT_TOTAL: orderDiscount,
        ORDER_URL: orderUrl,
      },
    })
    
    if (result.success) {
      // Record that email was sent
      await recordEmailEvent(orderId, 'order_confirmation')
      console.log(`Order confirmation email sent to ${customerEmail} for order ${orderNumber}`)
    } else {
      console.error(`Failed to send order confirmation email: ${result.error}`)
    }
  } catch (error) {
    console.error('Error in sendOrderConfirmationEmail:', error)
  }
}

/**
 * Send order confirmation email from payment intent
 */
async function sendOrderConfirmationEmailFromPaymentIntent(
  order: { id: string | number; order_number?: string; total_amount?: number; subtotal?: number; tax_amount?: number; shipping_amount?: number; discount_amount?: number; created_at?: string },
  paymentIntent: Stripe.PaymentIntent,
  customerEmail: string,
  customerName: string
) {
  try {
    const orderId = order.id
    const orderNumber = order.order_number || 'Unknown'
    
    // Check if email already sent for this order
    const alreadySent = await hasEmailEvent(orderId, 'order_confirmation')
    if (alreadySent) {
      console.log(`Order confirmation email already sent for order ${orderId}`)
      return
    }
    
    if (!customerEmail) {
      console.error(`No customer email found for order ${orderId}`)
      return
    }
    
    const meta = paymentIntent.metadata ?? {}
    const fmt = (n: number | null | undefined, fallbackCents: number | null | undefined) =>
      `$${(n != null ? n : (fallbackCents ?? 0) / 100).toFixed(2)}`

    const orderTotal    = fmt(order.total_amount, paymentIntent.amount)
    const orderSubtotal = fmt(order.subtotal, Number.isFinite(Number(meta.subtotal)) ? Number(meta.subtotal) * 100 : null)
    const orderTax      = fmt(order.tax_amount, Number.isFinite(Number(meta.tax)) ? Number(meta.tax) * 100 : null)
    const orderShipping = fmt(order.shipping_amount, Number.isFinite(Number(meta.shipping)) ? Number(meta.shipping) * 100 : null)
    const orderDiscount = fmt(order.discount_amount, Number.isFinite(Number(meta.discount_amount)) ? Number(meta.discount_amount) * 100 : null)
    const orderDate     = new Date(order.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://fruitstandny.com').replace(/\/$/, '')
    const orderUrl = `${baseUrl}/account`

    // Send email
    const result = await sendTransactionalTemplate({
      templateName: 'order_confirmation',
      toEmail: customerEmail,
      toName: customerName || 'Valued Customer',
      mergeVars: {
        CUSTOMER_NAME: customerName || 'Valued Customer',
        ORDER_NUMBER: orderNumber,
        ORDER_DATE: orderDate,
        ORDER_TOTAL: orderTotal,
        ORDER_SUBTOTAL: orderSubtotal,
        ORDER_TAX_TOTAL: orderTax,
        ORDER_SHIP_TOTAL: orderShipping,
        ORDER_DISCOUNT_TOTAL: orderDiscount,
        ORDER_URL: orderUrl,
      },
    })
    
    if (result.success) {
      // Record that email was sent
      await recordEmailEvent(orderId, 'order_confirmation')
      console.log(`Order confirmation email sent to ${customerEmail} for order ${orderNumber}`)
    } else {
      console.error(`Failed to send order confirmation email: ${result.error}`)
    }
  } catch (error) {
    console.error('Error in sendOrderConfirmationEmailFromPaymentIntent:', error)
  }
}