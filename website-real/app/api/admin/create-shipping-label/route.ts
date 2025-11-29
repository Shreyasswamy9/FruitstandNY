import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAndPurchaseLabel, ShippoAddress } from '@/lib/shippo';

// POST /api/admin/create-shipping-label
// Create a Shippo shipping label for an order
export async function POST(request: NextRequest) {
    try {
        const { orderId } = await request.json();

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

        // Get the order with shipping details
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            console.error('Error fetching order:', orderError);
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Check if label already exists
        if (order.tracking_number) {
            return NextResponse.json({
                success: true,
                message: 'Shipping label already exists',
                data: {
                    tracking_number: order.tracking_number,
                    tracking_url: order.tracking_url,
                    label_url: order.label_url
                }
            });
        }

        // Prepare shipping address for Shippo
        const toAddress: ShippoAddress = {
            name: order.shipping_name,
            street1: order.shipping_address_line1,
            street2: order.shipping_address_line2 || null,
            city: order.shipping_city,
            state: order.shipping_state,
            zip: order.shipping_postal_code,
            country: order.shipping_country || 'US',
            phone: order.shipping_phone || null,
            email: order.shipping_email
        };

        console.log('Creating Shippo label for order:', orderId);
        console.log('Shipping to:', toAddress);

        // Create shipment and purchase label
        const label = await createAndPurchaseLabel(toAddress);

        console.log('Shippo label created:', label.tracking_number);

        // Update order with tracking information
        const { data: updatedOrder, error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
                tracking_number: label.tracking_number,
                tracking_url: label.tracking_url_provider,
                label_url: label.label_url,
                carrier: label.carrier,
                shipping_service: label.service_level,
                status: 'shipped'
            })
            .eq('id', orderId)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating order with tracking:', updateError);
            throw updateError;
        }

        return NextResponse.json({
            success: true,
            message: 'Shipping label created successfully',
            data: {
                tracking_number: label.tracking_number,
                tracking_url: label.tracking_url_provider,
                label_url: label.label_url,
                carrier: label.carrier,
                service_level: label.service_level
            }
        });

    } catch (error: any) {
        console.error('Error creating shipping label:', error);
        return NextResponse.json(
            {
                error: 'Failed to create shipping label',
                details: error.message
            },
            { status: 500 }
        );
    }
}
