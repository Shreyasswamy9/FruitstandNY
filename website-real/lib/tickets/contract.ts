// Canonical ticket contract: types and helpers to keep API, DB and admin-import in sync

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed'
export type TicketSender = 'user' | 'admin' | 'system'

export interface TicketAttachment {
  filename: string
  url: string
  size: number
  type: string
}

// Input expected from UI when creating a ticket (account or contact style)
export interface TicketCreateInput {
  subject: string
  description: string
  category: string
  priority?: TicketPriority
  // Optional commerce links
  orderId?: string | null
  productId?: string | null
  // Optional attachments metadata already uploaded to storage
  attachments?: TicketAttachment[]
  // Contact-style (kept for parity even though API now requires auth)
  userName?: string
  userEmail?: string
  userPhone?: string
}

// Row shape persisted in Supabase (support_tickets)
export interface SupportTicketRow {
  id: string // uuid
  ticket_id: string // public ticket id
  user_id?: string | null
  user_name?: string | null
  user_email: string
  user_phone?: string | null
  subject: string
  description: string
  category: string
  priority: TicketPriority
  status: TicketStatus
  order_id?: string | null
  product_id?: string | null
  attachments: TicketAttachment[]
  created_at: string
  updated_at: string
}

export interface TicketMessageRow {
  id: string
  ticket_id: string // FK to support_tickets.id (uuid)
  sender_id?: string | null
  sender_type: TicketSender
  message: string
  attachments: TicketAttachment[]
  is_internal: boolean
  created_at: string
}

// Export shape for the admin server ingestion (stable, versionable)
export interface TicketExportV1 {
  version: 1
  ticket: {
    id: string // public ticket id (ticket_id)
    status: TicketStatus
    priority: TicketPriority
    subject: string
    description: string
    category: string
    createdAt: string
    updatedAt: string
    requester: {
      id?: string | null
      email: string
      name?: string | null
      phone?: string | null
    }
    orderId?: string | null
    productId?: string | null
    attachments: TicketAttachment[]
  }
  messages: Array<{
    id: string
    sender: TicketSender
    message: string
    attachments: TicketAttachment[]
    createdAt: string
  }>
}

export function normalizePriority(p?: string): TicketPriority {
  const v = (p || 'medium').toLowerCase()
  if (v === 'low' || v === 'medium' || v === 'high' || v === 'urgent') return v
  return 'medium'
}

export function normalizeStatus(s?: string): TicketStatus {
  const v = (s || 'open').toLowerCase()
  if (v === 'open' || v === 'in-progress' || v === 'resolved' || v === 'closed') return v
  return 'open'
}

// Create -> Row insert payload (server will add user fields)
export function buildRowInsertFromCreate(input: TicketCreateInput, user: { id: string; email: string; name?: string | null }) {
  return {
    user_id: user.id,
    user_name: input.userName || user.name || '',
    user_email: input.userEmail || user.email,
    user_phone: input.userPhone || null,
    subject: input.subject,
    category: input.category,
    priority: normalizePriority(input.priority),
    description: input.description,
    order_id: input.orderId || null,
    product_id: input.productId || null,
    status: 'open' as TicketStatus,
    attachments: input.attachments || [],
  }
}

// Row + messages -> Export payload for admin import
export function mapRowToExportV1(row: SupportTicketRow, messages: TicketMessageRow[]): TicketExportV1 {
  return {
    version: 1,
    ticket: {
      id: row.ticket_id,
      status: normalizeStatus(row.status),
      priority: normalizePriority(row.priority),
      subject: row.subject,
      description: row.description,
      category: row.category,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      requester: {
        id: row.user_id || null,
        email: row.user_email,
        name: row.user_name || null,
        phone: row.user_phone || null,
      },
      orderId: row.order_id || null,
      productId: row.product_id || null,
      attachments: row.attachments || [],
    },
    messages: (messages || []).map((m) => ({
      id: m.id,
      sender: m.sender_type,
      message: m.message,
      attachments: m.attachments || [],
      createdAt: m.created_at,
    })),
  }
}
