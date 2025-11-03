import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { Ticket, ITicketMessage } from '@/database';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/tickets/[ticketId]/messages - Add message to ticket
export async function POST(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    await dbConnect();
    
    const { ticketId } = params;
    const body = await request.json();
    const { message, attachments = [] } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Get user info
    let userId = null;
    let userName = 'Guest';
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        userId = user.id;
        userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
      }
    }

    // Find the ticket
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Verify user can access this ticket
    if (userId && ticket.userId !== userId && ticket.userEmail !== (await supabase.auth.getUser(authHeader?.split(' ')[1] || '')).data.user?.email) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Add message
    const messageId = new Date().getTime().toString();
    const newMessage: ITicketMessage = {
      id: messageId,
      senderId: userId || 'guest',
      senderName: userName,
      senderRole: 'user',
      message: message.trim(),
      attachments,
      timestamp: new Date(),
      isInternal: false
    };

    ticket.messages.push(newMessage);
    ticket.lastResponseAt = new Date();
    ticket.status = 'waiting-response'; // Update status when user responds
    
    await ticket.save();

    return NextResponse.json({
      success: true,
      message: 'Message added successfully',
      ticketMessage: newMessage
    });

  } catch (error) {
    console.error('Error adding message:', error);
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    );
  }
}

// GET /api/tickets/[ticketId]/messages - Get messages for ticket
export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    await dbConnect();
    
    const { ticketId } = params;
    
    // Get user info for authorization
    let userId = null;
    let userEmail = null;
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        userId = user.id;
        userEmail = user.email;
      }
    }

    // Find the ticket
    const ticket = await Ticket.findOne({ ticketId }).lean();
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Type assertion for the ticket
    const ticketData = ticket as any;

    // Verify user can access this ticket
    if (userId && ticketData.userId !== userId && ticketData.userEmail !== userEmail) {
      // Also check if email matches for guest users
      const emailParam = new URL(request.url).searchParams.get('email');
      if (ticketData.userEmail !== emailParam) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }
    }

    // Filter out internal messages
    const publicMessages = ticketData.messages.filter((msg: any) => !msg.isInternal);

    return NextResponse.json({
      success: true,
      messages: publicMessages,
      ticket: {
        ticketId: ticketData.ticketId,
        subject: ticketData.subject,
        status: ticketData.status,
        priority: ticketData.priority,
        category: ticketData.category,
        createdAt: ticketData.createdAt,
        updatedAt: ticketData.updatedAt
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}