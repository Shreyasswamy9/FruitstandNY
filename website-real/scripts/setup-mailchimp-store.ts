/**
 * One-time script to register FruitstandNY as a store in Mailchimp's e-commerce API.
 * Run once after setting your environment variables:
 *
 *   MAILCHIMP_API_KEY=your-key
 *   MAILCHIMP_SERVER_PREFIX=us1   (the server prefix from your Mailchimp API key, e.g. us1, us6)
 *   MAILCHIMP_LIST_ID=your-list-id  (your Mailchimp audience ID)
 *
 * Usage:
 *   npx tsx scripts/setup-mailchimp-store.ts
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mailchimp = require('@mailchimp/mailchimp_marketing') as {
  setConfig: (config: { apiKey: string; server: string }) => void
  ecommerce: {
    getStore: (storeId: string) => Promise<{ id: string; list_id: string }>
    addStore: (body: {
      id: string
      list_id: string
      name: string
      currency_code: string
      money_format: string
      domain: string
    }) => Promise<{ id: string; list_id: string }>
  }
}

const STORE_ID = process.env.MAILCHIMP_STORE_ID || 'fruitstandny'
const API_KEY = process.env.MAILCHIMP_API_KEY
const SERVER = process.env.MAILCHIMP_SERVER_PREFIX
const LIST_ID = process.env.MAILCHIMP_LIST_ID

async function main() {
  if (!API_KEY || !SERVER) {
    console.error('Error: MAILCHIMP_API_KEY and MAILCHIMP_SERVER_PREFIX must be set.')
    process.exit(1)
  }

  if (!LIST_ID) {
    console.error('Error: MAILCHIMP_LIST_ID must be set (your Mailchimp audience ID).')
    process.exit(1)
  }

  mailchimp.setConfig({ apiKey: API_KEY, server: SERVER })

  // Check if store already exists
  try {
    const existing = await mailchimp.ecommerce.getStore(STORE_ID)
    console.log(`Store already exists: ${existing.id} — nothing to do.`)
    return
  } catch {
    // 404 means it doesn't exist yet — continue to create
  }

  const store = await mailchimp.ecommerce.addStore({
    id: STORE_ID,
    list_id: LIST_ID,
    name: 'FruitstandNY',
    currency_code: 'USD',
    money_format: '$',
    domain: 'https://fruitstandny.com',
  })

  console.log(`Mailchimp store created successfully: ${store.id}`)
  console.log(`Connected to audience list: ${store.list_id}`)
}

main().catch((err) => {
  console.error('Setup failed:', err)
  process.exit(1)
})
