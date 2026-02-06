-- Create email_events table for tracking sent transactional emails
-- This ensures idempotency (emails are only sent once per order)

CREATE TABLE IF NOT EXISTS email_events (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_order_email_type UNIQUE (order_id, type)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_events_order_id ON email_events(order_id);
CREATE INDEX IF NOT EXISTS idx_email_events_type ON email_events(type);
CREATE INDEX IF NOT EXISTS idx_email_events_created_at ON email_events(created_at);

-- Add comment for documentation
COMMENT ON TABLE email_events IS 'Tracks transactional emails sent for orders to ensure idempotency';
COMMENT ON COLUMN email_events.order_id IS 'Foreign key reference to orders table';
COMMENT ON COLUMN email_events.type IS 'Type of email sent (e.g., order_confirmation, order_shipped, order_delivered, order_cancelled)';
COMMENT ON COLUMN email_events.created_at IS 'Timestamp when the email was sent';

-- Optional: Add foreign key constraint if your orders table uses BIGINT for id
-- Uncomment the line below if you want to enforce referential integrity
-- ALTER TABLE email_events ADD CONSTRAINT fk_email_events_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
