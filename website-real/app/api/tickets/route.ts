import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')
    
    // Handle email-based queries (from contact page)
    if (email) {
      // For now, return mock data filtered by email
      const mockTickets = [
        {
          ticketId: 'ticket_001',
          subject: 'Order Issue - Missing Item',
          category: 'Order Support',
          priority: 'medium',
          status: 'open',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          messages: [
            {
              id: 'msg_001',
              message: 'I received my order but one item is missing from the package.',
              sender: 'user',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            }
          ],
          userEmail: email
        },
        {
          ticketId: 'ticket_002',
          subject: 'Refund Request',
          category: 'Returns',
          priority: 'low',
          status: 'in-progress',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          messages: [
            {
              id: 'msg_002',
              message: 'I would like to return an item and get a refund.',
              sender: 'user',
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'msg_003',
              message: 'We have received your refund request and are processing it.',
              sender: 'support',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            }
          ],
          userEmail: email
        }
      ]

      return NextResponse.json({ 
        success: true, 
        tickets: mockTickets.filter(ticket => ticket.userEmail === email) 
      })
    }

    // Handle auth-based queries (from account page)
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Return tickets for authenticated user (account page format)
    const mockTickets = [
      {
        id: 'ticket_001',
        subject: 'Order Issue - Missing Item',
        description: 'I received my order but one item is missing from the package.',
        status: 'open',
        priority: 'medium',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Order Support',
        userId: user.id
      },
      {
        id: 'ticket_002',
        subject: 'Refund Request',
        description: 'I would like to return an item and get a refund.',
        status: 'in-progress',
        priority: 'low',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Returns',
        userId: user.id
      }
    ]

    return NextResponse.json({ 
      success: true, 
      data: mockTickets.filter(ticket => ticket.userId === user.id) 
    })

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
    
    // Handle contact form submissions (with userName, userEmail, etc.)
    if (body.userName && body.userEmail) {
      const { 
        userName, 
        userEmail, 
        userPhone, 
        subject, 
        description, 
        category, 
        priority, 
        orderId, 
        productId,
        attachments 
      } = body

      // Validate required fields for contact form
      if (!userName || !userEmail || !subject || !description || !category) {
        return NextResponse.json({ 
          success: false, 
          error: 'Missing required fields: userName, userEmail, subject, description, category' 
        }, { status: 400 })
      }

      // Create new ticket from contact form
      const newTicket = {
        ticketId: `ticket_${Date.now()}`,
        subject,
        category,
        priority: priority || 'medium',
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userEmail,
        userName,
        userPhone,
        orderId,
        productId,
        attachments: attachments || [],
        messages: [
          {
            id: `msg_${Date.now()}`,
            message: description,
            sender: 'user',
            timestamp: new Date().toISOString()
          }
        ]
      }

      console.log('New ticket created from contact form:', newTicket)

      return NextResponse.json({ 
        success: true, 
        ticket: newTicket 
      })
    }

    // Handle account page submissions (authenticated users)
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { subject, description, category, priority } = body

    // Validate required fields for account page
    if (!subject || !description || !category) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: subject, description, category' 
      }, { status: 400 })
    }

    // Create new ticket from account page
    const newTicket = {
      id: `ticket_${Date.now()}`,
      subject,
      description,
      category,
      priority: priority || 'medium',
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.id
    }

    console.log('New ticket created from account page:', newTicket)

    return NextResponse.json({ 
      success: true, 
      data: newTicket 
    })

  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create ticket' 
    }, { status: 500 })
  }
}