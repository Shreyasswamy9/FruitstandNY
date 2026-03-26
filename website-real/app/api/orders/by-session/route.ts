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
  const sessionId = request.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
  }

  try {
    const order = await SupabaseOrderService.getOrderByStripeSession(sessionId);

    if (!order) {
      // 1. Fetch session from Stripe
      console.log('Order not found in DB for session:', sessionId);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      // Get shipping from the payment intent, not the session
      let shippingAddress = null;

      if (session.payment_intent) {
        const paymentIntentId = typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent.id;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.shipping?.address) {
          shippingAddress = paymentIntent.shipping.address;
        }
      }

      console.log('Resolved shipping:', JSON.stringify(shippingAddress));


      // 2. If paid, attempt to sync/create the order immediately (Hybrid approach)
      if (session && session.payment_status === 'paid') {
        console.log('Session is paid, attempting interactive sync for session:', sessionId);
        const syncedOrder = await SupabaseOrderService.syncOrderFromStripeSession(session, shippingAddress);
        if (syncedOrder) {
          console.log('Successfully synced order:', syncedOrder.order_number);

          // Decrement stock for this order (local API fallback for when webhook doesn't fire)
          try {
            const alreadyDecremented = await hasEmailEvent(syncedOrder.id, 'stock_decremented');
            if (!alreadyDecremented) {
              const cartJson = readCartMetadata(session.metadata ?? {}) ?? '[]';
              const cartItems = safeJsonParse<OrderCartItem[]>(cartJson, []);
              const adminClient = await getSupabaseAdminClient();
              if (adminClient && cartItems.length > 0) {
                await decrementStock(cartItems, adminClient, syncedOrder.id);
                await recordEmailEvent(syncedOrder.id, 'stock_decremented');
                console.log(`[order ${syncedOrder.id}] Stock decremented via /api/orders/by-session`);
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
        } else {
          console.log('Sync returned null for session:', sessionId);
        }
      } else {
        console.log('Session payment status:', session?.payment_status);
      }

      return NextResponse.json({ 
        error: 'Order not found yet. It may still be processing.',
        data: null 
      }, { status: 404 });
    }

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
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String((error as { message: unknown }).message ?? '');
      if (message.toLowerCase().includes('no rows')) {
        return NextResponse.json({ data: null }, { status: 404 });
      }
    }
    console.error('Orders by session lookup failed:', error);
    return NextResponse.json({ error: 'Unable to find order for session' }, { status: 500 });
  }
}
