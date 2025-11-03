import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { Ticket } from '@/database';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/admin/tickets - Get all tickets (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user || user.user_metadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let query: any = { isArchived: false };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalTickets = await Ticket.countDocuments(query);

    return NextResponse.json({
      success: true,
      tickets,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTickets / limit),
        totalTickets,
        hasNext: page * limit < totalTickets,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching admin tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/tickets - Update ticket status (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user || user.user_metadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { ticketId, status, assignedTo, internalNote } = body;

    if (!ticketId || !status) {
      return NextResponse.json(
        { error: 'Ticket ID and status are required' },
        { status: 400 }
      );
    }

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Update ticket fields
    ticket.status = status;
    if (assignedTo) {
      ticket.assignedTo = assignedTo;
      ticket.assignedToName = user.user_metadata?.name || user.email;
    }

    // Add internal note if provided
    if (internalNote) {
      const messageId = new Date().getTime().toString();
      ticket.messages.push({
        id: messageId,
        senderId: user.id,
        senderName: user.user_metadata?.name || user.email,
        senderRole: 'admin',
        message: internalNote,
        attachments: [],
        timestamp: new Date(),
        isInternal: true
      });
    }

    await ticket.save();

    return NextResponse.json({
      success: true,
      message: 'Ticket updated successfully',
      ticket: {
        ticketId: ticket.ticketId,
        status: ticket.status,
        assignedTo: ticket.assignedTo,
        assignedToName: ticket.assignedToName,
        updatedAt: ticket.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}