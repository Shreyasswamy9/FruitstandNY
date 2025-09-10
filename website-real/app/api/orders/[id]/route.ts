import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/database';
import { Order } from '@/database';

// GET /api/orders/[id] - Get a specific order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const order = await Order.findOne({
      _id: id,
      user: session.user.id
    }).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update order status (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const { orderStatus, trackingNumber } = body;

    const allowedStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (orderStatus && !allowedStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order status' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    
    if (orderStatus) {
      updateData.orderStatus = orderStatus;
      
      // Set timestamps based on status
      if (orderStatus === 'shipped' && trackingNumber) {
        updateData.shippedAt = new Date();
        updateData.trackingNumber = trackingNumber;
      } else if (orderStatus === 'delivered') {
        updateData.deliveredAt = new Date();
      } else if (orderStatus === 'cancelled') {
        updateData.cancelledAt = new Date();
      }
    }

    const { id } = await params;

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
