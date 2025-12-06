import { NextRequest, NextResponse } from "next/server";
import { supabase as supabaseClient } from '@/app/supabase-client';

// This route no longer creates orders or order_items in Supabase.
// It validates request, optionally records marketing opt-in (non-blocking),
// and returns the metadata object to be embedded in the Stripe Checkout session.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      orderData = {},
      guestData = {}
    } = body;

    const items = Array.isArray(orderData.items) ? orderData.items : [];
    const shipping = orderData.shipping ?? 0;
    const tax = orderData.tax ?? 0;
    const subtotal = orderData.subtotal ?? 0;

    // Preserve marketing opt-in, but do not block checkout if it fails
    try {
      const marketing = (guestData as any).marketing;
      if (marketing && marketing.emailUpdates && supabaseClient) {
        // Fire-and-forget or await but ignore errors so checkout proceeds
        try {
          await supabaseClient
            .from('marketing_subscribers')
            .insert([{
              email: guestData.email || '',
              first_name: guestData.firstName || '',
              last_name: guestData.lastName || '',
              phone: guestData.phone || '',
              source: 'guest_checkout',
              subscribed: true
            }]);
        } catch (err) {
          console.warn('Marketing insert failed (non-blocking):', err);
        }
      }
    } catch (err) {
      // Ensure any marketing errors do not block checkout
      console.warn('Marketing opt-in handling error (ignored):', err);
    }

    const metadata = {
      cart: JSON.stringify(items || []),
      shipping: String(shipping ?? 0),
      tax: String(tax ?? 0),
      subtotal: String(subtotal ?? 0),
      guest: JSON.stringify(guestData || {})
    };

    return NextResponse.json({
      success: true,
      metadata
    });
  } catch (error: any) {
    console.error('Guest checkout validation error:', error);
    return NextResponse.json(
      { error: 'Failed to process guest checkout' },
      { status: 400 }
    );
  }
}