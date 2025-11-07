-- ===============================================
-- ADDITIONAL TABLES FOR TICKETS & ADMIN
-- ===============================================

-- 1. Support Tickets table
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id TEXT UNIQUE NOT NULL, -- Human readable ID like TKT-20241106-1234
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Ticket details
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- order-issue, product-inquiry, shipping, return-refund, technical-issue, other
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  status TEXT DEFAULT 'open', -- open, in-progress, waiting-response, resolved, closed
  
  -- Related entities
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  
  -- Admin assignment
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- 2. Ticket messages/responses
CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  message TEXT NOT NULL,
  sender_type TEXT DEFAULT 'user', -- user, admin, system
  is_internal BOOLEAN DEFAULT false, -- For admin-only notes
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Ticket attachments
CREATE TABLE ticket_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  message_id UUID REFERENCES ticket_messages(id) ON DELETE SET NULL,
  
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL, -- Supabase storage URL
  file_size INTEGER,
  file_type TEXT,
  
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. User profiles (extend auth.users with additional info)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personal information
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  
  -- Preferences
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  marketing_emails BOOLEAN DEFAULT false,
  
  -- Admin fields
  role TEXT DEFAULT 'customer', -- customer, admin, super_admin
  is_admin BOOLEAN DEFAULT false,
  
  -- Profile
  avatar_url TEXT,
  bio TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Admin activity log
CREATE TABLE admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  action TEXT NOT NULL, -- created, updated, deleted, assigned, etc.
  entity_type TEXT NOT NULL, -- ticket, order, product, user
  entity_id UUID,
  details JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Site settings/configuration
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX idx_support_tickets_category ON support_tickets(category);
CREATE INDEX idx_support_tickets_assigned ON support_tickets(assigned_to);
CREATE INDEX idx_support_tickets_created ON support_tickets(created_at);
CREATE INDEX idx_ticket_messages_ticket ON ticket_messages(ticket_id);
CREATE INDEX idx_ticket_messages_user ON ticket_messages(user_id);
CREATE INDEX idx_ticket_attachments_ticket ON ticket_attachments(ticket_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_admin_activity_entity ON admin_activity_log(entity_type, entity_id);
CREATE INDEX idx_site_settings_key ON site_settings(key);

-- Add updated_at triggers
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate ticket IDs
CREATE OR REPLACE FUNCTION generate_ticket_id()
RETURNS TEXT AS $$
DECLARE
  new_ticket_id TEXT;
  ticket_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate format: TKT-YYYYMMDD-XXXX (e.g., TKT-20241106-1234)
    new_ticket_id := 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Check if ticket ID already exists
    SELECT EXISTS(SELECT 1 FROM support_tickets WHERE ticket_id = new_ticket_id) INTO ticket_exists;
    
    -- If unique, exit loop
    EXIT WHEN NOT ticket_exists;
  END LOOP;
  
  RETURN new_ticket_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate ticket IDs
CREATE OR REPLACE FUNCTION set_ticket_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_id IS NULL THEN
    NEW.ticket_id := generate_ticket_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_ticket_id_trigger
BEFORE INSERT ON support_tickets
FOR EACH ROW
EXECUTE FUNCTION set_ticket_id();

-- Enable RLS on new tables
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tickets
CREATE POLICY "Users can view own tickets" ON support_tickets 
  FOR SELECT USING (user_id = auth.uid() OR user_email = auth.jwt()->>'email');

CREATE POLICY "Users can create tickets" ON support_tickets 
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Admins can view all tickets" ON support_tickets 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update all tickets" ON support_tickets 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for ticket messages
CREATE POLICY "Users can view messages for own tickets" ON ticket_messages 
  FOR SELECT USING (
    ticket_id IN (
      SELECT id FROM support_tickets 
      WHERE user_id = auth.uid() OR user_email = auth.jwt()->>'email'
    ) AND is_internal = false
  );

CREATE POLICY "Users can create messages for own tickets" ON ticket_messages 
  FOR INSERT WITH CHECK (
    ticket_id IN (
      SELECT id FROM support_tickets 
      WHERE user_id = auth.uid() OR user_email = auth.jwt()->>'email'
    ) AND user_id = auth.uid()
  );

CREATE POLICY "Admins can view all messages" ON ticket_messages 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can create messages" ON ticket_messages 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for attachments
CREATE POLICY "Users can view attachments for own tickets" ON ticket_attachments 
  FOR SELECT USING (
    ticket_id IN (
      SELECT id FROM support_tickets 
      WHERE user_id = auth.uid() OR user_email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Users can upload attachments to own tickets" ON ticket_attachments 
  FOR INSERT WITH CHECK (
    ticket_id IN (
      SELECT id FROM support_tickets 
      WHERE user_id = auth.uid() OR user_email = auth.jwt()->>'email'
    ) AND uploaded_by = auth.uid()
  );

CREATE POLICY "Admins can manage all attachments" ON ticket_attachments 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for user profiles
CREATE POLICY "Users can view own profile" ON user_profiles 
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON user_profiles 
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON user_profiles 
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON user_profiles 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for admin activity log
CREATE POLICY "Admins can view activity log" ON admin_activity_log 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can create activity log entries" ON admin_activity_log 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for site settings
CREATE POLICY "Admins can manage site settings" ON site_settings 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Insert some default site settings
INSERT INTO site_settings (key, value, description) VALUES 
  ('site_name', '"FruitstandNY"', 'Site name displayed in header'),
  ('contact_email', '"support@fruitstandny.com"', 'Main contact email'),
  ('support_hours', '"Monday-Friday 9AM-5PM EST"', 'Support hours'),
  ('max_ticket_attachments', '5', 'Maximum attachments per ticket'),
  ('ticket_auto_close_days', '30', 'Days before auto-closing resolved tickets');

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();