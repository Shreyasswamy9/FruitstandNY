import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/database';
import { Cart, Product } from '@/database';
import { ICartItem } from '@/database/Cart';
import { PopulatedCart, PopulatedCartItem } from '@/lib/types/cart';

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession();
    const sessionId = request.headers.get('x-session-id');

    let cart;

    if (session?.user?.id) {
      // Authenticated user
      cart = await Cart.findOne({ user: session.user.id })
        .populate('items.product', 'name price images active')
        .lean();
    } else if (sessionId) {
      // Guest user
      cart = await Cart.findOne({ sessionId })
        .populate('items.product', 'name price images active')
        .lean();
    }

    if (!cart) {
      return NextResponse.json({
        success: true,
        data: {
          items: [],
          totalAmount: 0
        }
      });
    }

    // Filter out inactive products
    if (cart.items) {
      const populatedCart = cart as unknown as PopulatedCart;
      populatedCart.items = populatedCart.items.filter((item: PopulatedCartItem) => item.product?.active);
      cart = populatedCart;
    }

    return NextResponse.json({
      success: true,
      data: cart
    });

  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession();
    const sessionId = request.headers.get('x-session-id');
    const body = await request.json();

    const { productId, quantity, size, color } = body;

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid product or quantity' },
        { status: 400 }
      );
    }

    // Verify product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.active) {
      return NextResponse.json(
        { success: false, error: 'Product not found or unavailable' },
        { status: 404 }
      );
    }

    // Check inventory
    if (product.inventory.quantity < quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient inventory' },
        { status: 400 }
      );
    }

    let cart;

    if (session?.user?.id) {
      // Authenticated user
      cart = await Cart.findOne({ user: session.user.id });
    } else if (sessionId) {
      // Guest user
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      // Create new cart
      cart = new Cart({
        user: session?.user?.id || undefined,
        sessionId: !session?.user?.id ? sessionId : undefined,
        items: []
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex((item: ICartItem) => 
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
    );

    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
        price: product.price
      });
    }

    await cart.save();

    // Populate product details for response
    await cart.populate('items.product', 'name price images active');

    return NextResponse.json({
      success: true,
      data: cart
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession();
    const sessionId = request.headers.get('x-session-id');
    const body = await request.json();

    const { productId, quantity, size, color } = body;

    if (!productId || quantity < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid product or quantity' },
        { status: 400 }
      );
    }

    let cart;

    if (session?.user?.id) {
      cart = await Cart.findOne({ user: session.user.id });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    // Find the item in cart
    const itemIndex = cart.items.findIndex((item: ICartItem) => 
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    if (quantity === 0) {
      // Remove item from cart
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name price images active');

    return NextResponse.json({
      success: true,
      data: cart
    });

  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession();
    const sessionId = request.headers.get('x-session-id');

    if (session?.user?.id) {
      await Cart.findOneAndDelete({ user: session.user.id });
    } else if (sessionId) {
      await Cart.findOneAndDelete({ sessionId });
    }

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Cart clear error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
