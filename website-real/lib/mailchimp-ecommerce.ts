// eslint-disable-next-line @typescript-eslint/no-require-imports
const mailchimp = require('@mailchimp/mailchimp_marketing') as {
  setConfig: (config: { apiKey: string; server: string }) => void
  ecommerce: {
    getStore: (storeId: string) => Promise<unknown>
    addStore: (body: {
      id: string
      list_id: string
      name: string
      currency_code: string
      money_format: string
      domain: string
    }) => Promise<{ id: string; list_id: string }>
    addStoreOrder: (
      storeId: string,
      body: {
        id: string
        customer: {
          id: string
          email_address: string
          opt_in_status: boolean
          first_name: string
          last_name: string
        }
        financial_status: string
        currency_code: string
        order_total: number
        shipping_total: number
        tax_total: number
        lines: Array<{
          id: string
          product_id: string
          product_variant_id: string
          quantity: number
          price: number
        }>
      }
    ) => Promise<unknown>
  }
}

const STORE_ID = process.env.MAILCHIMP_STORE_ID || 'fruitstandny'

function getConfiguredClient() {
  const apiKey = process.env.MAILCHIMP_API_KEY
  const server = process.env.MAILCHIMP_SERVER_PREFIX

  if (!apiKey || !server) {
    return null
  }

  mailchimp.setConfig({ apiKey, server })
  return mailchimp
}

type OrderItem = {
  id?: string | null
  productId?: string | null
  variantId?: string | null
  name?: string | null
  title?: string | null
  product_name?: string | null
  quantity?: number | string | null
  qty?: number | string | null
  unit_price?: number | string | null
  price?: number | string | null
  unitPrice?: number | string | null
}

type Order = {
  id: string | number
  order_number?: string | null
  total_amount?: number | null
  subtotal?: number | null
  tax_amount?: number | null
  shipping_amount?: number | null
  shipping_name?: string | null
  shipping_email?: string | null
  order_items?: OrderItem[]
}

export async function trackOrderInMailchimp(order: Order, fallbackCartItems?: OrderItem[]) {
  const client = getConfiguredClient()
  if (!client) {
    console.log('Mailchimp e-commerce not configured (missing MAILCHIMP_API_KEY or MAILCHIMP_SERVER_PREFIX), skipping order tracking')
    return
  }

  try {
    const items = (order.order_items?.length ? order.order_items : fallbackCartItems) ?? []
    const email = order.shipping_email || ''
    const nameParts = (order.shipping_name || '').trim().split(/\s+/)
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    const orderNumber = order.order_number || String(order.id)

    // Amounts are stored in dollars in the DB (payment-intent flow multiplies by 100 for Stripe)
    const orderTotal = order.total_amount ?? 0
    const shippingTotal = order.shipping_amount ?? 0
    const taxTotal = order.tax_amount ?? 0

    const lines = items.map((item, index) => ({
      id: String(item.id || `line_${index}`),
      product_id: String(item.productId || item.id || `product_${index}`),
      product_variant_id: String(item.variantId || item.id || `variant_${index}`),
      quantity: Number(item.quantity ?? item.qty ?? 1),
      price: Number(item.unit_price ?? item.price ?? item.unitPrice ?? 0),
    }))

    await client.ecommerce.addStoreOrder(STORE_ID, {
      id: orderNumber,
      customer: {
        id: email || `guest_${orderNumber}`,
        email_address: email,
        opt_in_status: false,
        first_name: firstName,
        last_name: lastName,
      },
      financial_status: 'paid',
      currency_code: 'USD',
      order_total: orderTotal,
      shipping_total: shippingTotal,
      tax_total: taxTotal,
      lines,
    })

    console.log(`Mailchimp: Order ${orderNumber} tracked successfully`)
  } catch (error: unknown) {
    // Non-fatal — don't break the order flow if Mailchimp is unavailable
    console.error('Mailchimp: Failed to track order:', error)
  }
}
