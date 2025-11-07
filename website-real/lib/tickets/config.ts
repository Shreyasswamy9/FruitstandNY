// Centralized table names for tickets. Change these to match your Supabase schema.
// If you already have different table names (e.g., 'tickets'), update here or set env vars.

export const TICKETS_TABLE = process.env.TICKETS_TABLE || 'tickets'
export const TICKET_MESSAGES_TABLE = process.env.TICKET_MESSAGES_TABLE || 'ticket_messages'
