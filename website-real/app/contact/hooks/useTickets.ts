"use client"

import { useCallback, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { SubmitTicketPayload, UserTicket } from '../types'

interface UseTicketsOptions {
  user: User | null
  session: Session | null
}

export function useTickets({ user, session }: UseTicketsOptions) {
  const [tickets, setTickets] = useState<UserTicket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper to build auth headers while keeping type narrow (HeadersInit)
  const buildAuthHeaders = useCallback((): HeadersInit => {
    if (user && session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` }
    }
    return {}
  }, [user, session])

  const fetchTickets = useCallback(async (email?: string) => {
    const targetEmail = user?.email || email
    if (!targetEmail) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/tickets?email=${encodeURIComponent(targetEmail)}`, {
        headers: buildAuthHeaders()
      })
      const data = await response.json()
      if (response.ok) {
        setTickets(data.tickets || [])
      } else {
        setError(data.error || 'Failed to load tickets')
      }
    } catch (error) {
      console.error('Fetch tickets error:', error)
      setError('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }, [user?.email, buildAuthHeaders])

  const submitTicket = useCallback(async (payload: SubmitTicketPayload) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json', ...buildAuthHeaders() }
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })
    const data = await response.json()
    if (response.ok) {
      // Append new ticket if returned
      if (data.ticket) {
        setTickets(prev => [data.ticket, ...prev])
      }
      return { success: true, data }
    }
    return { success: false, error: data.error || 'Failed to submit ticket' }
  }, [buildAuthHeaders])

  const addMessage = useCallback(async (ticketId: string, message: string) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json', ...buildAuthHeaders() }
    const response = await fetch(`/api/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message })
    })
    if (response.ok) {
      // refresh tickets
      fetchTickets()
      return true
    }
    return false
  }, [fetchTickets, buildAuthHeaders])

  return { tickets, loading, error, fetchTickets, submitTicket, addMessage }
}
