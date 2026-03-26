import { NextRequest, NextResponse } from 'next/server';
import { SupabaseOrderService } from '@/lib/services/supabase-existing';
import { readCartMetadata } from '@/lib/stripeCartMetadata';
import { hasEmailEvent, recordEmailEvent } from '@/lib/email/emailEvents';
import Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type OrderCartItem = {
  id?: string
  productId?: string
  variantId?: string
  name?: string
  title?: string
  quantity?: number | string
  qty?: number | string
  size?: string
  selectedSize?: string
  color?: string
};

const PRODUCT_SET_COMPONENTS: Record<string, string[]> = {
  '0f5810c1-abec-4e70-a077-33c839b4de2b': [
    '91c47e89-efd4-4961-aadf-d4f7bf6e13b7',
    '859d396c-0cd7-4d62-9a95-135ce8efbb82',
  ],
};

function safeJsonParse<T = unknown>(value: unknown, fallback: T): T {
  try {
    if (typeof value === 'string') return JSON.parse(value) as T
    if (value === undefined || value === null) return fallback
    return value as T
  } catch {
    return fallback
  }
}

async function getSupabaseAdminClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}

async function decrementStock(
  cartItems: OrderCartItem[],
  supabaseAdmin: SupabaseClient,
  orderId: string | number,
): Promise<void> {
  const outcomes: { target: string; qty: number; ok: boolean; reason?: string }[] = [];
  const PG_UNDEFINED_FUNCTION = '42883';

  const rpcDecrementVariant = async (variantId: string, qty: number, label: string): Promise<void> => {
    const { error } = await supabaseAdmin.rpc('decrement_variant_stock', {
      p_variant_id: variantId,
      p_qty: qty,
    });
    if (error) {
      const isMissing = (error as { code?: string }).code === PG_UNDEFINED_FUNCTION;
      const reason = isMissing
        ? 'RPC decrement_variant_stock not found'
        : (error.message ?? 'Unknown RPC error');
      console.error(`[order ${orderId}] decrementStock FAIL variant=${variantId} qty=${qty}: ${reason}`);
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
        ? 'RPC decrement_product_stock not found'
        : (error.message ?? 'Unknown RPC error');
      console.error(`[order ${orderId}] decrementStock FAIL product=${productId} qty=${qty}: ${reason}`);
      outcomes.push({ target: `product:${productId}`, qty, ok: false, reason });
    } else {
      console.log(`[order ${orderId}] decrementStock OK product=${productId} qty=${qty} item="${label}"`);
      outcomes.push({ target: `product:${productId}`, qty, ok: true });
    }
  };

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
    const variantId = item.variantId ?? null;
    const productId = item.id ?? item.productId ?? null;
    const size = item.size ?? item.selectedSize ?? null;
    const color = item.color ?? null;
    const label = item.name ?? item.title ?? productId ?? 'unknown';

    if (variantId) {
      await rpcDecrementVariant(variantId, qty, label);
    } else if (productId) {
      const found = await decrementVariantByAttrs(productId, size, color, qty, label);
      if (!found) await rpcDecrementProduct(productId, qty, label);
    }

    if (productId && PRODUCT_SET_COMPONENTS[productId]) {
      for (const componentId of PRODUCT_SET_COMPONENTS[productId]) {
        const cLabel = `${label} [component ${componentId}]`;
        const found = await decrementVariantByAttrs(componentId, size, color, qty, cLabel);
        if (!found) await rpcDecrementProduct(componentId, qty, cLabel);
      }
    }
  }

  const failures = outcomes.filter((o) => !o.ok);
  if (failures.length > 0) {
    const summary = failures.map((f) => `${f.target} qty=${f.qty}: ${f.reason}`).join('; ');
    throw new Error(`[order ${orderId}] Stock decrement had ${failures.length} failure(s): ${summary}`);
  }
}

export async function GET(request: NextRequest) {
  const paymentIntentId = request.nextUrl.searchParams.get('payment_intent');

  if (!paymentIntentId) {
    return NextResponse.json({ error: 'payment_intent is required' }, { status: 400 });
  }

  try {
    const order = await SupabaseOrderService.getOrderByPaymentIntent(paymentIntentId);

    if (order) {
      return NextResponse.json({
        data: {
          orderNumber: order.order_number,
          totalAmount: order.total_amount,
          status: order.status,
          items: (order.order_items || []).map((item: any) => ({
            id: item.product_id || item.id,
            name: item.product_name || item.name || 'Product',
            price: Number(item.price || item.unit_price || 0),
            quantity: Number(item.quantity || 1),
          })),
          currency: 'USD',
        },
      });
    }
  } catch (error) {
    // Continue to Stripe fallback if Supabase lookup fails
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String((error as { message: unknown }).message ?? '');
      if (!message.toLowerCase().includes('no rows')) {
        console.error('Orders by payment intent lookup failed:', error);
      }
    } else {
      console.error('Orders by payment intent lookup failed:', error);
    }
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
  expand: ['payment_method'],
});

const billingAddress = (paymentIntent.payment_method as Stripe.PaymentMethod)
  ?.billing_details?.address ?? null;
const billingEmail = (paymentIntent.payment_method as Stripe.PaymentMethod)
  ?.billing_details?.email ?? null;

    // Only return order data for payment intents that have actually succeeded.
    // Abandoned intents (e.g. created when a user browses the cart) must not
    // be treated as completed purchases.
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not completed', data: null }, { status: 404 });
    }

    const syncedOrder = await SupabaseOrderService.syncOrderFromPaymentIntent(paymentIntent, billingAddress, billingEmail);
    if (!syncedOrder) {
      return NextResponse.json({ error: 'Order not found yet. It may still be processing.', data: null }, { status: 404 });
    }

    // Decrement stock for this order (local API fallback for when webhook doesn't fire)
    try {
      const alreadyDecremented = await hasEmailEvent(syncedOrder.id, 'stock_decremented');
      if (!alreadyDecremented) {
        const metadata = paymentIntent.metadata ?? {};
        const cartJson = readCartMetadata(metadata) ?? '[]';
        const cartItems = safeJsonParse<OrderCartItem[]>(cartJson, []);
        const adminClient = await getSupabaseAdminClient();
        if (adminClient && cartItems.length > 0) {
          await decrementStock(cartItems, adminClient, syncedOrder.id);
          await recordEmailEvent(syncedOrder.id, 'stock_decremented');
          console.log(`[order ${syncedOrder.id}] Stock decremented via /api/orders/by-payment-intent`);
        }
      }
    } catch (err) {
      console.error(`[order ${syncedOrder.id}] Failed to decrement stock:`, err);
      // Don't fail the entire request if stock decrement fails
    }

    return NextResponse.json({
      data: {
        orderNumber: syncedOrder.order_number,
        totalAmount: syncedOrder.total_amount,
        status: syncedOrder.status,
        items: (syncedOrder.order_items || []).map((item: any) => ({
          id: item.product_id || item.id,
          name: item.product_name || item.name || 'Product',
          price: Number(item.price || item.unit_price || 0),
          quantity: Number(item.quantity || 1),
        })),
        currency: 'USD',
      },
    });
  } catch (error) {
    console.error('Stripe payment intent retrieval failed:', error);
    return NextResponse.json({ error: 'Unable to find order for payment intent' }, { status: 500 });
  }
}