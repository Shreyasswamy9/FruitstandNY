import { createClient } from '@supabase/supabase-js';
import { fromTheme } from 'tailwind-merge';

const ORDER_NUMBER_START = 4000;

let cachedSupabaseAdmin: ReturnType<typeof createClient> | null = null;
let inProcessLastIssued: number | null = null;

function parseNumericOrderNumber(value: unknown): number | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const raw = String(value).trim();
  if (!/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function getSupabaseAdminClient() {
  if (cachedSupabaseAdmin) return cachedSupabaseAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  cachedSupabaseAdmin = createClient(url, serviceRoleKey);
  return cachedSupabaseAdmin;
}

export async function generateOrderNumber(): Promise<string> {
  try {
    const supabaseAdmin = getSupabaseAdminClient();

    if (!supabaseAdmin) {
      const fallback = Math.max(ORDER_NUMBER_START, (inProcessLastIssued ?? ORDER_NUMBER_START - 1) + 1);
      inProcessLastIssued = fallback;
      return String(fallback);
    }

    const { data, error } = await supabaseAdmin.rpc('next_order_number');
    console.log(data, error);

    if (error || data === null) throw error ?? new Error('No data from sequence');

    return String(data);
  } catch {
    const fallback = Math.max(ORDER_NUMBER_START, (inProcessLastIssued ?? ORDER_NUMBER_START - 1) + 1);
    inProcessLastIssued = fallback;
    return String(fallback);
  }
}
