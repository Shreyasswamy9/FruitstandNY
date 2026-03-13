import { createClient } from '@supabase/supabase-js';

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

    // If admin credentials are missing, keep a process-local monotonic sequence.
    if (!supabaseAdmin) {
      const fallback = Math.max(ORDER_NUMBER_START, (inProcessLastIssued ?? ORDER_NUMBER_START - 1) + 1);
      inProcessLastIssued = fallback;
      return String(fallback);
    }

    const [{ count }, { data: latestRows }] = await Promise.all([
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin
        .from('orders')
        .select('order_number, created_at')
        .order('created_at', { ascending: false })
        .limit(1),
    ]);

    const totalOrders = count ?? 0;
    const candidateFromCount = ORDER_NUMBER_START + totalOrders;

    const latestOrderNumber = parseNumericOrderNumber(
      (latestRows?.[0] as { order_number?: string | number } | undefined)?.order_number
    );

    // Ignore legacy random order numbers that are far outside the sequential window.
    const maxExpectedSequential = ORDER_NUMBER_START + totalOrders + 1000;
    const candidateFromLatest = latestOrderNumber !== null
      && latestOrderNumber >= ORDER_NUMBER_START
      && latestOrderNumber <= maxExpectedSequential
      ? latestOrderNumber + 1
      : ORDER_NUMBER_START;

    const candidateFromProcess = inProcessLastIssued !== null
      ? inProcessLastIssued + 1
      : ORDER_NUMBER_START;

    const nextOrderNumber = Math.max(candidateFromCount, candidateFromLatest, candidateFromProcess);
    inProcessLastIssued = nextOrderNumber;
    return String(nextOrderNumber);
  } catch {
    const fallback = Math.max(ORDER_NUMBER_START, (inProcessLastIssued ?? ORDER_NUMBER_START - 1) + 1);
    inProcessLastIssued = fallback;
    return String(fallback);
  }
}
