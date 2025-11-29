import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get auth header
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }

    const token = authorization.replace('Bearer ', '');

    // Create a server-side Supabase client with the user's auth token
    // This ensures RLS policies work correctly with auth.uid()
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Orders API: Auth error', authError);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    console.log('Orders API: Fetching orders for user', { userId: user.id, email: user.email });

    // Query orders using the authenticated client
    // RLS policy will now work because auth.uid() will return the user's ID
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }
    if (offset) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      console.error('Orders API: Query error', ordersError);
      throw ordersError;
    }

    console.log('Orders API: Found orders', { count: orders?.length || 0, userId: user.id });

    return NextResponse.json({
      success: true,
      data: orders || []
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order (placeholder for now)
export async function POST() {
  try {
    return NextResponse.json({
      success: false,
      error: 'Order creation should be handled through Stripe webhook'
    }, { status: 400 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
