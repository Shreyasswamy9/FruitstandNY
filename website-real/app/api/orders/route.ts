/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import dbConnect from '@/lib/database';
import { Order, Cart, Product } from '@/database';
import { IOrderItem, IShippingAddress } from '@/database/Order';

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Order.countDocuments({ user: session.user.id });

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession();
    const sessionId = request.headers.get('x-session-id');
    const body = await request.json();

    const {
      email,
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentId
    } = body;

    // Validate required fields
    if (!email || !shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user's cart
    let cart;
    if (session?.user?.id) {
      cart = await Cart.findOne({ user: session.user.id }).populate('items.product');
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId }).populate('items.product');
    }

    if (!cart || !cart.items.length) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate inventory and prepare order items
    const orderItems: IOrderItem[] = [];
    let subtotal = 0;

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product);
      
      if (!product || !product.active) {
        return NextResponse.json(
          { success: false, error: `Product ${product?.name || 'unknown'} is no longer available` },
          { status: 400 }
        );
      }

      if (product.inventory.quantity < cartItem.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient inventory for ${product.name}` },
          { status: 400 }
        );
      }
      orderItems.push({
        product: new mongoose.Types.ObjectId(product._id),
        name: product.name,
        quantity: cartItem.quantity,
        size: cartItem.size,
        color: cartItem.color,
        price: cartItem.price,
        image: product.images[0]
      });

      subtotal += cartItem.price * cartItem.quantity;
    }

    // Calculate shipping and tax (simple logic - you can make this more sophisticated)
    const shippingCost = subtotal >= 100 ? 0 : 10; // Free shipping over $100
    const taxRate = 0.08; // 8% tax rate
    const tax = subtotal * taxRate;
    const totalAmount = subtotal + shippingCost + tax;

    // Create the order
    const order = new Order({
      user: session?.user?.id || undefined,
      email,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      paymentId,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      subtotal,
      shippingCost,
      tax,
      totalAmount
    });

    await order.save();

    // Update product inventory
    for (const cartItem of cart.items) {
      await Product.findByIdAndUpdate(
        cartItem.product,
        { $inc: { 'inventory.quantity': -cartItem.quantity } }
      );
    }

    // Clear the cart
    await Cart.findByIdAndDelete(cart._id);

    return NextResponse.json({
      success: true,
      data: order
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
