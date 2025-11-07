import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: Promise<{ ticketId: string }> }) {
  try {
    const resolvedParams = await params
    const { ticketId } = resolvedParams
    const body = await request.json()
    const { message } = body

    if (!message || !message.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Message is required' 
      }, { status: 400 })
    }

    // Create new message (mock implementation)
    const newMessage = {
      id: `msg_${Date.now()}`,
      message: message.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      ticketId
    }

    console.log('New message added to ticket:', newMessage)

    return NextResponse.json({ 
      success: true, 
      message: newMessage 
    })

  } catch (error) {
    console.error('Error adding message to ticket:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add message' 
    }, { status: 500 })
  }
}