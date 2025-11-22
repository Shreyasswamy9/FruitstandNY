import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/app/supabase-client';

// Create a service-role client for admin operations (creating orders)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Persist order to Supabase (orders + order_items)
    try {
      // 1. Create Order
      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id: null, // Guest has no user_id
          order_number: orderNumber,
          status: 'pending',
          payment_status: 'pending',
          total_amount: orderData.total || 0,
          subtotal: orderData.subtotal || 0,
          tax_amount: orderData.tax || 0,
          shipping_amount: orderData.shipping || 0,
          discount_amount: 0,
          shipping_name: `${firstName} ${lastName}`,
          shipping_email: email,
          shipping_phone: phone || '',
          shipping_address_line1: address.street || '',
          shipping_address_line2: address.street2 || '',
          shipping_city: address.city || '',
          shipping_state: address.state || '',
          shipping_postal_code: address.zipCode || '',
          shipping_country: address.country || 'US',
        })
        .select()
        .single();

      if (orderError) {
        console.error('Failed to create guest order:', orderError);
        throw orderError;
      }

      // 2. Create Order Items
      const orderItems = (orderData.items || []).map((it: any) => ({
        order_id: order.id,
        product_id: it.id || it.productId || null,
        variant_id: null, // We don't have variant_id lookup here yet, could be added if critical
        product_name: it.name || it.title || '',
        product_image_url: (it.image || (it.product?.images && it.product.images[0]) || null),
        variant_details: {
          size: it.size || it.selectedSize || null,
          color: it.color || null
        },
        quantity: it.quantity || 1,
        unit_price: it.price || it.unitPrice || 0,
        total_price: (it.price || it.unitPrice || 0) * (it.quantity || 1)
      }));

      const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Failed to create guest order items:', itemsError);
        // Non-fatal for now, but ideally we'd rollback
      }

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

      console.log('Guest checkout persisted to Supabase, order id:', order.id);

      return NextResponse.json({
        success: true,
        message: 'Guest checkout data processed and saved to Supabase',
        order: { id: order.id, order_number: order.order_number, total: order.total_amount }
      });

    } catch (dbError: any) {
      console.error('Failed to persist guest order to Supabase:', dbError);
      return NextResponse.json(
        { error: 'Failed to persist guest order to Supabase', details: dbError.message },
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

function getRegionFromState(state: string): string {
  const regions: { [key: string]: string } = {
    // Northeast
    'ME': 'Northeast', 'NH': 'Northeast', 'VT': 'Northeast', 'MA': 'Northeast',
    'RI': 'Northeast', 'CT': 'Northeast', 'NY': 'Northeast', 'NJ': 'Northeast',
    'PA': 'Northeast',

    // Southeast
    'DE': 'Southeast', 'MD': 'Southeast', 'DC': 'Southeast', 'VA': 'Southeast',
    'WV': 'Southeast', 'KY': 'Southeast', 'TN': 'Southeast', 'NC': 'Southeast',
    'SC': 'Southeast', 'GA': 'Southeast', 'FL': 'Southeast', 'AL': 'Southeast',
    'MS': 'Southeast', 'AR': 'Southeast', 'LA': 'Southeast',

    // Midwest
    'OH': 'Midwest', 'MI': 'Midwest', 'IN': 'Midwest', 'WI': 'Midwest',
    'IL': 'Midwest', 'MN': 'Midwest', 'IA': 'Midwest', 'MO': 'Midwest',
    'ND': 'Midwest', 'SD': 'Midwest', 'NE': 'Midwest', 'KS': 'Midwest',

    // Southwest
    'TX': 'Southwest', 'OK': 'Southwest', 'NM': 'Southwest', 'AZ': 'Southwest',

    // West
    'CO': 'West', 'WY': 'West', 'MT': 'West', 'ID': 'West', 'UT': 'West',
    'NV': 'West', 'WA': 'West', 'OR': 'West', 'CA': 'West', 'AK': 'West',
    'HI': 'West'
  };

  return regions[state.toUpperCase()] || 'Unknown';
}

function getZipType(zipCode: string): string {
  if (!zipCode) return 'Unknown';

  const firstDigit = zipCode.charAt(0);

  // Basic ZIP code analysis
  const zipTypes: { [key: string]: string } = {
    '0': 'Northeast',
    '1': 'Northeast',
    '2': 'Southeast',
    '3': 'Southeast',
    '4': 'Midwest',
    '5': 'Midwest',
    '6': 'Southwest',
    '7': 'Southwest',
    '8': 'West',
    '9': 'West'
  };

  return zipTypes[firstDigit] || 'Unknown';
}