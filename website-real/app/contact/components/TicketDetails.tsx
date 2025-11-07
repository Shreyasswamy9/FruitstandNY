"use client"

import React, { useState } from 'react'
import type { UserTicket } from '../types'

interface Props {
  ticket: UserTicket
  onAddMessage: (ticketId: string, message: string) => Promise<boolean> | boolean
}

export default function TicketDetails({ ticket, onAddMessage }: Props) {
  const [newMessage, setNewMessage] = useState('')
  const handleSend = async () => {
    if (!newMessage.trim()) return
    const ok = await onAddMessage(ticket.ticketId, newMessage.trim())
    if (ok) setNewMessage('')
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-300">
      <div className="space-y-4 mb-6">
        {ticket.messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${message.sender === 'user' ? 'bg-blue-50 ml-8 border border-blue-200' : 'bg-gray-50 mr-8 border border-gray-200'}`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">{message.sender === 'user' ? 'You' : 'Support Team'}</span>
              <span className="text-sm text-gray-600">{new Date(message.timestamp).toLocaleString()}</span>
            </div>
            <p className="text-gray-800">{message.message}</p>
          </div>
        ))}
      </div>

      {ticket.status !== 'closed' && (
        <div className="space-y-4">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 resize-none"
            placeholder="Add a message to this ticket..."
          />
          <button
            onClick={handleSend}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            Send Message
          </button>
        </div>
      )}
    </div>
  )
}
