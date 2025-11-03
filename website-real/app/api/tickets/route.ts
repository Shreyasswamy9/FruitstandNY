import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { Ticket, ITicketMessage } from '@/database';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Function to generate ticket ID
function generateTicketId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TKT-${timestamp}-${random}`.toUpperCase();
}

// POST /api/tickets - Create a new ticket
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const {
      userEmail,
      userName,
      userPhone,
      subject,
      category,
      priority = 'medium',
      description,
      orderId,
      productId,
      attachments = []
    } = body;

    // Validate required fields
    if (!userEmail || !userName || !subject || !category || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user ID if user is authenticated
    let userId = null;
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Generate unique ticket ID
    const ticketId = generateTicketId();

    // Create initial message
    const initialMessageId = new Date().getTime().toString();
    const initialMessage = {
      id: initialMessageId,
      senderId: userId || 'guest',
      senderName: userName,
      senderRole: 'user' as const,
      message: description,
      attachments: attachments,
      timestamp: new Date(),
      isInternal: false
    };

    // Create ticket
    const ticket = new Ticket({
      ticketId,
      userId,
      userEmail,
      userName,
      userPhone,
      subject,
      category,
      priority,
      description,
      messages: [initialMessage],
      orderId,
      productId,
      status: 'open',
      source: 'web'
    });

    const savedTicket = await ticket.save();

    // Return ticket without internal messages
    const publicTicket = {
      ticketId: savedTicket.ticketId,
      subject: savedTicket.subject,
      category: savedTicket.category,
      priority: savedTicket.priority,
      status: savedTicket.status,
      createdAt: savedTicket.createdAt,
      updatedAt: savedTicket.updatedAt,
      messages: savedTicket.messages.filter((msg: ITicketMessage) => !msg.isInternal)
    };

    return NextResponse.json({
      success: true,
      ticket: publicTicket,
      message: 'Ticket created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}

// GET /api/tickets - Get user's tickets
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const url = new URL(request.url);
    const userEmail = url.searchParams.get('email');
    const ticketId = url.searchParams.get('ticketId');
    
    // Get user ID if authenticated
    let userId = null;
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    let query: any = { isArchived: false };

    // If requesting specific ticket
    if (ticketId) {
      query.ticketId = ticketId;
      
      // Ensure user can only access their own tickets
      if (userId) {
        query.$or = [{ userId }, { userEmail }];
      } else if (userEmail) {
        query.userEmail = userEmail;
      } else {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }
    } else {
      // Get all tickets for user
      if (userId) {
        query.$or = [{ userId }, { userEmail }];
      } else if (userEmail) {
        query.userEmail = userEmail;
      } else {
        return NextResponse.json(
          { error: 'Email or authentication required' },
          { status: 400 }
        );
      }
    }

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .select('-messages.isInternal')
      .lean();

    // Filter out internal messages from response
    const publicTickets = tickets.map(ticket => ({
      ...ticket,
      messages: ticket.messages.filter((msg: any) => !msg.isInternal)
    }));

    return NextResponse.json({
      success: true,
      tickets: ticketId ? publicTickets[0] || null : publicTickets
    });

  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}