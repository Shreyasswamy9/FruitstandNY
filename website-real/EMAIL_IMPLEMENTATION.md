# Mailchimp Transactional Email Integration - Implementation Summary

## Overview
This implementation adds Mailchimp Transactional (Mandrill) email sending capabilities to your Next.js app, integrated with the existing Stripe webhook to send order confirmation emails.

---

## 1. Files Created

### `lib/email/transactional.ts`
Main email sending service that interfaces with Mailchimp Transactional API.

**Key features:**
- Exports `sendTransactionalTemplate()` function
- Handles template-based email sending with merge variables
- Uses environment variables for API key and sender information
- Returns success/error status with message IDs

**Environment variables required:**
- `MAILCHIMP_TX_API_KEY` - Your Mailchimp Transactional API key
- `MAIL_FROM_EMAIL` - Sender email address
- `MAIL_FROM_NAME` - Sender name (optional, defaults to "FruitstandNY")
- `MAIL_REPLY_TO` - Reply-to email (optional, defaults to from_email)

### `lib/email/emailEvents.ts`
Idempotency tracking service to prevent duplicate email sends.

**Key features:**
- `hasEmailEvent(orderId, type)` - Checks if email already sent
- `recordEmailEvent(orderId, type)` - Records email send event
- Uses Supabase with service role key for server-side access
- Handles unique constraint violations gracefully

**Environment variables required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

### `supabase-email-events.sql`
Database schema for email event tracking.

**Run this in your Supabase SQL editor:**
- Creates `email_events` table with unique constraint on (order_id, type)
- Includes indexes for performance
- Optional foreign key constraint (commented out)

---

## 2. Files Modified

### `package.json`
**Added dependency:**
```json
"@mailchimp/mailchimp_transactional": "^1.0.58"
```

### `app/api/webhooks/stripe/route.ts`
**Changes made:**

1. **Added imports:**
   ```typescript
   import { sendTransactionalTemplate } from '@/lib/email/transactional'
   import { hasEmailEvent, recordEmailEvent } from '@/lib/email/emailEvents'
   ```

2. **Added email sending in three locations:**
   - After updating existing order in `handleSuccessfulPayment()`
   - After syncing new order in `handleSuccessfulPayment()`
   - After handling payment intent in `handlePaymentIntentSucceeded()`

3. **Added helper functions at end of file:**
   - `sendOrderConfirmationEmail()` - Sends email from checkout session
   - `sendOrderConfirmationEmailFromPaymentIntent()` - Sends email from payment intent

**Email logic:**
- Checks idempotency before sending
- Extracts customer email from multiple sources (session, metadata, customer details)
- Extracts customer name similarly
- Calculates order total from order or Stripe data
- Constructs order URL using `APP_BASE_URL` or `NEXT_PUBLIC_APP_URL`
- Sends "order_confirmation" template with merge vars
- Records event if successful

**Merge variables sent:**
- `ORDER_NUMBER` - Order number
- `ORDER_TOTAL` - Formatted total amount (e.g., "$125.00")
- `ORDER_URL` - Full URL to order page
- `CUSTOMER_NAME` - Customer's name

---

## 3. Setup Instructions

### Step 1: Install Dependencies
```bash
cd website-real
npm install
```

### Step 2: Create Supabase Table
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the contents of `supabase-email-events.sql`

### Step 3: Configure Environment Variables
Add these to your `.env.local` or deployment environment:

```bash
# Mailchimp Transactional (Mandrill)
MAILCHIMP_TX_API_KEY=your_mandrill_api_key_here
MAIL_FROM_EMAIL=orders@fruitstandny.com
MAIL_FROM_NAME=FruitstandNY
MAIL_REPLY_TO=support@fruitstandny.com

# App URL for order links
APP_BASE_URL=https://fruitstandny.com
# Or use existing NEXT_PUBLIC_APP_URL if you have it

# Supabase (likely already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 4: Create Mailchimp Template
1. Log into Mailchimp Transactional (Mandrill)
2. Go to Templates → Create Template
3. Name it exactly: `order_confirmation`
4. Use these merge variables in your template:
   - `*|ORDER_NUMBER|*`
   - `*|ORDER_TOTAL|*`
   - `*|ORDER_URL|*`
   - `*|CUSTOMER_NAME|*`

Example template:
```html
Hi *|CUSTOMER_NAME|*,

Thank you for your order!

Order Number: *|ORDER_NUMBER|*
Order Total: *|ORDER_TOTAL|*

View your order: *|ORDER_URL|*

Thanks,
FruitstandNY Team
```

### Step 5: Test
1. Deploy your changes or restart dev server
2. Complete a test order through Stripe
3. Check that the webhook processes successfully
4. Verify email is sent via Mailchimp dashboard
5. Verify `email_events` table has a record

---

## 4. How It Works

### Flow for Checkout Session
1. Stripe sends `checkout.session.completed` webhook
2. Webhook handler updates/creates order in Supabase
3. `sendOrderConfirmationEmail()` is called
4. Checks if email already sent via `hasEmailEvent()`
5. If not sent, extracts customer data from session
6. Sends email via `sendTransactionalTemplate()`
7. Records event via `recordEmailEvent()` if successful

### Flow for Payment Intent
1. Stripe sends `payment_intent.succeeded` webhook
2. Webhook handler updates/creates order in Supabase
3. `sendOrderConfirmationEmailFromPaymentIntent()` is called
4. Similar flow to checkout session

### Idempotency
- Before sending any email, checks `email_events` table
- If record exists for (order_id, type), skips send
- After successful send, inserts record
- Unique constraint prevents duplicates at database level
- Handles race conditions gracefully

---

## 5. Additional Email Types

To add more email types (shipping notifications, etc.):

1. Add type to `EmailEventType` in `lib/email/emailEvents.ts`:
   ```typescript
   type EmailEventType = 'order_confirmation' | 'order_shipped' | 'order_delivered'
   ```

2. Create new template in Mailchimp with exact name

3. Add sending function similar to existing ones

4. Call from appropriate location in your code

---

## 6. Monitoring & Debugging

**Check email events:**
```sql
SELECT * FROM email_events ORDER BY created_at DESC LIMIT 50;
```

**Check for duplicate attempts:**
```sql
SELECT order_id, type, COUNT(*) 
FROM email_events 
GROUP BY order_id, type 
HAVING COUNT(*) > 1;
```

**Webhook logs:**
- Check Vercel/deployment logs for webhook processing
- Look for "Order confirmation email sent to..." success messages
- Look for "Failed to send order confirmation email..." error messages

**Mailchimp logs:**
- Go to Mailchimp Transactional dashboard
- Check Outbound → Activity for sent emails
- View delivery status, opens, clicks, etc.

---

## 7. Error Handling

The implementation includes robust error handling:

- Missing environment variables: Logs error, returns failure
- Email already sent: Logs info, skips send
- Mailchimp API errors: Logs error, returns failure status
- Supabase errors: Logs error, fails open (allows retry)
- Missing customer email: Logs error, skips send

Emails that fail to send will NOT block order creation. The webhook will continue processing.

---

## 8. Environment Variables Reference

| Variable | Required | Purpose | Example |
|----------|----------|---------|---------|
| `MAILCHIMP_TX_API_KEY` | Yes | Mailchimp API key | `md-abc123...` |
| `MAIL_FROM_EMAIL` | Yes | Sender email | `orders@fruitstandny.com` |
| `MAIL_FROM_NAME` | No | Sender name | `FruitstandNY` |
| `MAIL_REPLY_TO` | No | Reply-to email | `support@fruitstandny.com` |
| `APP_BASE_URL` | Recommended | Base URL for links | `https://fruitstandny.com` |
| `NEXT_PUBLIC_APP_URL` | Alternative | Alt base URL | `https://fruitstandny.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key | `eyJ...` |

---

## Complete! 🎉

Your Stripe webhook now automatically sends order confirmation emails via Mailchimp Transactional with full idempotency protection.
