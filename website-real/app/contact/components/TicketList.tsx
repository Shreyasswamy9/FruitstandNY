"use client"

import React, { useState } from 'react'
import type { UserTicket } from '../types'
import TicketDetails from './TicketDetails'

interface Props {
  tickets: UserTicket[]
  onAddMessage: (ticketId: string, message: string) => Promise<boolean> | boolean
  getStatusColor: (status: string) => string
  getPriorityColor: (priority: string) => string
}

export default function TicketList({ tickets, onAddMessage, getStatusColor, getPriorityColor }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No tickets found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {tickets.map(ticket => {
        const isSelected = selectedId === ticket.ticketId
        return (
          <div key={ticket.ticketId} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-300">
            <div className="flex flex-wrap items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{ticket.subject}</h3>
                <p className="text-gray-600 text-sm">Ticket ID: {ticket.ticketId}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)} border border-current`}>
                  {ticket.status.replace('-', ' ').toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)} border border-current`}>
                  {ticket.priority.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-600">Category:</span>
                <p className="text-gray-900">{ticket.category.replace('-', ' ')}</p>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <p className="text-gray-900">{new Date(ticket.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Last Update:</span>
                <p className="text-gray-900">{new Date(ticket.updatedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Messages:</span>
                <p className="text-gray-900">{ticket.messages.length}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedId(isSelected ? null : ticket.ticketId)}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors"
            >
              {isSelected ? 'Hide Details' : 'View Details'}
            </button>

            {isSelected && (
              <TicketDetails ticket={ticket} onAddMessage={onAddMessage} />
            )}
          </div>
        )
      })}
    </div>
  )
}
