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

    // Calculate analytics data from guest information
    const analyticsData = {
      customerType: 'guest',
      email,
      name: `${firstName} ${lastName}`,
      phone,
      location: {
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country
      },
      marketing: {
        emailOptIn: marketing.emailUpdates,
        analyticsOptIn: marketing.analytics
      },
      order: {
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        tax: orderData.tax,
        total: orderData.total,
        timestamp: new Date().toISOString()
      },
      demographics: {
        // You can add demographic analysis based on location, etc.
        region: getRegionFromState(address.state),
        zipType: getZipType(address.zipCode)
      }
    };

    // Persist order to Supabase (orders + order_items)
    try {
      const orderPayload = {
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
        items: (orderData.items || []).map((it: any) => ({
          product_id: it.id || it.productId || null,
          name: it.name || it.title || '',
          quantity: it.quantity || 1,
          size: it.size || it.selectedSize || null,
          color: it.color || null,
          price: it.price || it.unitPrice || 0,
          image: (it.image || (it.product?.images && it.product.images[0]) || null)
        }))
      };

  // createOrder expects a typed object; cast to any to avoid narrow literal type issues
  const created = await SupabaseOrderService.createOrder(orderPayload as any);

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