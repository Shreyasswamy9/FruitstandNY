import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Admin-protected migration endpoint to ensure user_metadata.address.street2 exists
// Usage:
//   POST /api/admin/migrations/add-street2
//   Headers: x-admin-key: <ADMIN_MAINTENANCE_KEY>
// Returns a summary of updated/skipped/errors.

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  // Simple header-based protection (avoid exposing publicly). Set ADMIN_MAINTENANCE_KEY in env.
  const adminKey = request.headers.get('x-admin-key')
  if (!process.env.ADMIN_MAINTENANCE_KEY || adminKey !== process.env.ADMIN_MAINTENANCE_KEY) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let page = 1
  const perPage = 1000
  let totalProcessed = 0
  let updated = 0
  let skipped = 0
  let errors = 0
  const errorUsers: Array<{ id: string; reason: string }> = []

  try {
    while (true) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage })
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      const users = data?.users || []
      if (users.length === 0) break

      for (const user of users) {
        totalProcessed++
        try {
          const metadata: Record<string, any> = { ...(user.user_metadata || {}) }

          // Only normalize when address exists and is an object
          const addr = metadata.address
          if (addr && typeof addr === 'object') {
            if (typeof addr.street2 !== 'string') {
              metadata.address = { ...addr, street2: '' }

              const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
                user_metadata: metadata,
              })
              if (updErr) {
                errors++
                errorUsers.push({ id: user.id, reason: updErr.message })
              } else {
                updated++
              }
            } else {
              skipped++
            }
          } else {
            // No address to normalize
            skipped++
          }
        } catch (e: any) {
          errors++
          errorUsers.push({ id: user.id, reason: e?.message || 'unknown error' })
        }
      }

      // next page
      page++
    }

    return NextResponse.json({ success: true, totalProcessed, updated, skipped, errors, errorUsers })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'unexpected error' }, { status: 500 })
  }
}
