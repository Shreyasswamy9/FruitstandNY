import { NextRequest, NextResponse } from 'next/server';
import { SupabaseOrderService } from '@/lib/services/supabase-existing';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
  }

  try {
    const order = await SupabaseOrderService.getOrderByStripeSession(sessionId);

    if (!order) {
      return NextResponse.json({ data: null }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        orderNumber: order.order_number,
        totalAmount: order.total_amount,
        status: order.status,
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
