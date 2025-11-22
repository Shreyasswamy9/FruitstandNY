import { NextRequest, NextResponse } from "next/server";
import { SupabaseOrderService } from '@/lib/services/supabase';
import { supabase as supabaseClient } from '@/app/supabase-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderData,
      guestData: {
        email,
        firstName,
        lastName,
        phone,
        address,
        marketing
      }
    } = body;

      // We persist guest checkout to Supabase below. Analytics payload removed (client no longer collects analytics opt-in).

    // Persist order to Supabase (orders + order_items)
    try {
      const orderPayload: Parameters<typeof SupabaseOrderService.createOrder>[0] = {
        email,
        shipping_address: {
          street: address.street || '',
          city: address.city || '',
          state: address.state || '',
          zipCode: address.zipCode || '',
          country: address.country || 'US'
        },
        payment_method: 'stripe',
        payment_status: 'pending',
        order_status: 'pending',
        subtotal: orderData.subtotal || 0,
        shipping_cost: orderData.shipping || 0,
        tax: orderData.tax || 0,
        total_amount: orderData.total || 0,
        currency: orderData.currency || 'USD',
          items: (orderData.items || []).map((it: {
            id?: string;
            productId?: string;
            name?: string;
            title?: string;
            quantity?: number;
            size?: string;
            selectedSize?: string;
            color?: string;
            price?: number;
            unitPrice?: number;
            image?: string;
            product?: { images?: string[] };
          }) => ({
          product_id: it.id || it.productId || null,
          name: it.name || it.title || '',
          quantity: it.quantity || 1,
          size: it.size || it.selectedSize || null,
          color: it.color || null,
          price: it.price || it.unitPrice || 0,
          image: (it.image || (it.product?.images && it.product.images[0]) || null)
        }))
      };

    // Create order in Supabase
    const created = await SupabaseOrderService.createOrder(orderPayload);

      // Record marketing preference if opted in
      if (marketing && marketing.emailUpdates) {
        try {
          await supabaseClient
            .from('marketing_subscribers')
            .insert([{ email, first_name: firstName || '', last_name: lastName || '', phone: phone || '', source: 'guest_checkout', subscribed: true }]);
        } catch (err) {
          console.warn('Failed to insert marketing subscriber:', err);
        }
      }

      console.log('Guest checkout persisted to Supabase, order id:', created.id);

      return NextResponse.json({
        success: true,
        message: 'Guest checkout data processed and saved to Supabase',
        order: { id: created.id, order_number: created.order_number, total: created.total_amount }
      });

    } catch (dbError) {
      console.error('Failed to persist guest order to Supabase:', dbError);
      // Fall back to returning success but indicate persistence failure
      return NextResponse.json(
        { error: 'Failed to persist guest order to Supabase' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Guest checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process guest checkout" },
      { status: 500 }
    );
  }
}

// Helper function removed: region/zip helper functions were previously used for analytics
// but analytics collection was removed from the guest checkout flow. Keep implementation
// history in git if needed in the future.