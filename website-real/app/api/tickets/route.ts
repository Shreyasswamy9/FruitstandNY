import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { TICKETS_TABLE, TICKET_MESSAGES_TABLE } from '@/lib/tickets/config'

// Use a service role key for server-side operations (RLS bypass where required)
// Falls back gracefully if env vars are missing (will surface auth errors)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Narrow types for contact-page ticket responses (email-based queries)
type ContactTicketMessage = {
  id: string
  message: string
  sender: 'user' | 'support'
  timestamp: string
}

type ContactTicket = {
  ticketId: string
  subject: string
  category: string
  priority: string
  status: string
  createdAt: string
  updatedAt: string
  messages: ContactTicketMessage[]
  userEmail: string
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')
    
    // Require authentication for any ticket retrieval
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Handle email-based queries (must match authenticated user's email)
    if (email) {
      if (!user.email || user.email.toLowerCase() !== email.toLowerCase()) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
      }
      // Fetch tickets for this email
      const { data: ticketsData, error: ticketsError } = await supabase
        .from(TICKETS_TABLE)
        .select('id, ticket_id, subject, category, priority, status, created_at, updated_at, user_email, user_name, user_phone')
        .eq('user_email', email)
        .order('created_at', { ascending: false })

      if (ticketsError) {
        return NextResponse.json({ success: false, error: 'Failed to fetch tickets' }, { status: 500 })
      }

  // For each ticket gather its messages
  const mapped: ContactTicket[] = []
      for (const t of ticketsData || []) {
        const { data: messagesData, error: messagesError } = await supabase
          .from(TICKET_MESSAGES_TABLE)
          .select('id, message, sender_type, created_at, ticket_id')
          .eq('ticket_id', t.id)
          .order('created_at', { ascending: true })

        if (messagesError) {
          // If messages fail, continue with empty array (non-fatal for listing)
          mapped.push({
            ticketId: t.ticket_id,
            subject: t.subject,
            category: t.category,
            priority: t.priority,
            status: t.status,
            createdAt: t.created_at,
            updatedAt: t.updated_at,
            messages: [],
            userEmail: t.user_email,
          })
          continue
        }

        mapped.push({
          ticketId: t.ticket_id,
          subject: t.subject,
          category: t.category,
          priority: t.priority,
          status: t.status,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
          messages: (messagesData || []).map(m => ({
            id: m.id,
            message: m.message,
            sender: m.sender_type === 'admin' ? 'support' : 'user',
            timestamp: m.created_at
          })),
          userEmail: t.user_email,
        })
      }

      return NextResponse.json({ success: true, tickets: mapped })
    }

    // Return persisted tickets for authenticated user (account page format)
    const { data: userTickets, error: userTicketsError } = await supabase
      .from(TICKETS_TABLE)
      .select('id, ticket_id, subject, description, category, priority, status, created_at, updated_at, user_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (userTicketsError) {
      return NextResponse.json({ success: false, error: 'Failed to fetch user tickets' }, { status: 500 })
    }

    const mapped = (userTickets || []).map(t => ({
      id: t.ticket_id, // expose public ticket identifier
      subject: t.subject,
      description: t.description,
      status: t.status,
      priority: t.priority,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
      category: t.category,
      userId: t.user_id
    }))

    return NextResponse.json({ success: true, data: mapped })

  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch tickets' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Require authentication for all ticket creation
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Handle contact form submissions (now auth-required) -> persist ticket + initial message
    if (body.userName && body.userEmail) {
      const {
        userName,
        userEmail,
        userPhone,
        subject,
        description,
        category,
        orderId,
        productId,
        attachments
      } = body

      if (!userName || !userEmail || !subject || !description || !category) {
        return NextResponse.json({ success: false, error: 'Missing required fields: userName, userEmail, subject, description, category' }, { status: 400 })
      }

      // Ensure provided email matches authenticated user
      if (!user.email || user.email.toLowerCase() !== String(userEmail).toLowerCase()) {
        return NextResponse.json({ success: false, error: 'Forbidden: email mismatch' }, { status: 403 })
      }

      // Derive priority from category (server-side authoritative mapping)
      const derivePriority = (cat: string): string => {
        switch (cat) {
          case 'billing':
          case 'technical-issue':
            return 'high'
          case 'order-issue':
          case 'shipping':
          case 'return-refund':
            return 'medium'
          case 'product-inquiry':
          case 'other':
          default:
            return 'low'
        }
      }

      const computedPriority = derivePriority(category)

      // Insert ticket
      const { data: ticket, error: ticketError } = await supabase
        .from(TICKETS_TABLE)
        .insert([{
          user_id: user.id,
          user_name: userName || user.user_metadata?.name || '',
          user_email: userEmail,
          user_phone: userPhone,
          subject,
          category,
          priority: computedPriority,
          description,
          order_id: orderId || null,
          product_id: productId || null,
          status: 'open',
          attachments: attachments || [],
        }])
        .select('id, ticket_id, subject, category, priority, status, created_at, updated_at, user_email, user_name, user_phone, description, attachments')
        .single()

      if (ticketError) {
        return NextResponse.json({ success: false, error: 'Failed to create ticket' }, { status: 500 })
      }

      // Insert initial message (optional failure tolerated but logged)
      const { data: initialMessage } = await supabase
        .from(TICKET_MESSAGES_TABLE)
        .insert([{
          ticket_id: ticket.id, // FK to tickets uuid
          sender_type: 'user',
          message: description,
          attachments: [],
          is_internal: false,
        }])
        .select('id, message, sender_type, created_at')
        .single()

      const mappedTicket = {
        ticketId: ticket.ticket_id,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
        userEmail: ticket.user_email,
        userName: ticket.user_name,
        userPhone: ticket.user_phone,
        orderId: orderId || null,
        productId: productId || null,
        attachments: ticket.attachments || [],
        messages: initialMessage ? [{
          id: initialMessage.id,
          message: initialMessage.message,
          sender: initialMessage.sender_type === 'admin' ? 'support' : 'user',
          timestamp: initialMessage.created_at,
        }] : []
      }

      return NextResponse.json({ success: true, ticket: mappedTicket })
    }

  const { subject, description, category } = body

    // Validate required fields for account page
    if (!subject || !description || !category) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: subject, description, category' 
      }, { status: 400 })
    }

    // Derive priority for account page submissions too
    const derivePriority = (cat: string): string => {
      switch (cat) {
        case 'billing':
        case 'technical-issue':
          return 'high'
        case 'order-issue':
        case 'shipping':
        case 'return-refund':
          return 'medium'
        case 'product-inquiry':
        case 'other':
        default:
          return 'low'
      }
    }
    const computedPriority = derivePriority(category)

    // Persist new ticket for authenticated user
    const { data: ticket, error: ticketError } = await supabase
      .from(TICKETS_TABLE)
      .insert([{
        user_id: user.id,
        user_name: user.user_metadata?.name || '',
        user_email: user.email,
        subject,
        category,
        priority: computedPriority,
        description,
        status: 'open',
        attachments: [],
      }])
      .select('id, ticket_id, subject, description, category, priority, status, created_at, updated_at, user_id')
      .single()

    if (ticketError) {
      return NextResponse.json({ success: false, error: 'Failed to create ticket' }, { status: 500 })
    }

    const mapped = {
      id: ticket.ticket_id,
      subject: ticket.subject,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at,
      userId: ticket.user_id
    }

    return NextResponse.json({ success: true, data: mapped })

  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create ticket' 
    }, { status: 500 })
  }
}