import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// POST /api/admin/update-order-status
// Manually update order payment status (for testing)
export async function POST(request: NextRequest) {
    try {
        const { orderId, paymentStatus, orderStatus } = await request.json();

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID required' },
                { status: 400 }
            );
        }

        // Use service role to bypass RLS
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const updateData: any = {};
        if (paymentStatus) updateData.payment_status = paymentStatus;
        if (orderStatus) updateData.status = orderStatus;

        const { data, error } = await supabaseAdmin
            .from('orders')
            .update(updateData)
            .eq('id', orderId)
            .select()
            .single();

        if (error) {
            console.error('Error updating order:', error);
            throw error;
        }

        console.log('Order updated:', data);

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json(
            { error: 'Failed to update order status' },
            { status: 500 }
        );
    }
}
