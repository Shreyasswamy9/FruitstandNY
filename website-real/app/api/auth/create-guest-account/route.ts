import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/database';
import bcrypt from 'bcryptjs';
import User from '@/database/User';
import Order from '@/database/Order';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { sessionId, password } = await request.json();

    // Retrieve the checkout session to get customer details
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'line_items'],
    });

    if (!session || !session.customer_details) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    const { email, name, phone } = session.customer_details;

    if (!email) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user account
    const user = await User.create({
      email,
      name: name || '',
      phone: phone || '',
      password: hashedPassword,
      role: 'USER',
    });

    // Link the order to the user
    await Order.findOneAndUpdate(
      { stripeSessionId: sessionId },
      { userId: user._id }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating guest account:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}