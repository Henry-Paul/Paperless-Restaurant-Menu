-- Add new tables for subscription, payments, tickets, and admin features

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  restaurant_name TEXT,
  phone_number TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  business_registration TEXT,
  gst_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plans table (predefined plans)
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active', -- active, cancelled, past_due
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices/Purchase history
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'paid', -- paid, pending, failed
  invoice_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- general, technical, billing, feature_request
  priority TEXT DEFAULT 'medium', -- low, medium, high
  status TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket replies
CREATE TABLE IF NOT EXISTS ticket_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics/Customer onboarding tracking
CREATE TABLE IF NOT EXISTS customer_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  total_customers INT DEFAULT 0,
  total_orders INT DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  avg_order_value DECIMAL(10, 2) DEFAULT 0,
  last_order_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Google Review QR codes (as add-on)
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS google_review_url TEXT;

-- Add premium features flag to restaurants
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS has_images_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS has_google_review_qr BOOLEAN DEFAULT FALSE;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS has_ordering_enabled BOOLEAN DEFAULT FALSE;

-- Enable RLS for new tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Plans (everyone can view)
CREATE POLICY "Anyone can view plans"
  ON subscription_plans FOR SELECT
  USING (TRUE);

-- Subscriptions
CREATE POLICY "Users can view their subscriptions"
  ON subscriptions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = subscriptions.restaurant_id
    AND restaurants.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their subscriptions"
  ON subscriptions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = subscriptions.restaurant_id
    AND restaurants.user_id = auth.uid()
  ));

-- Invoices
CREATE POLICY "Users can view their invoices"
  ON invoices FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM subscriptions
    JOIN restaurants ON restaurants.id = subscriptions.restaurant_id
    WHERE subscriptions.id = invoices.subscription_id
    AND restaurants.user_id = auth.uid()
  ));

-- Support tickets
CREATE POLICY "Users can view their tickets"
  ON support_tickets FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their tickets"
  ON support_tickets FOR UPDATE
  USING (user_id = auth.uid());

-- Ticket replies
CREATE POLICY "Users can view ticket replies"
  ON ticket_replies FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM support_tickets
    WHERE support_tickets.id = ticket_replies.ticket_id
    AND support_tickets.user_id = auth.uid()
  ));

CREATE POLICY "Users can create replies"
  ON ticket_replies FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM support_tickets
    WHERE support_tickets.id = ticket_replies.ticket_id
    AND support_tickets.user_id = auth.uid()
  ));

-- Customer analytics
CREATE POLICY "Users can view their analytics"
  ON customer_analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = customer_analytics.restaurant_id
    AND restaurants.user_id = auth.uid()
  ));

-- Insert default plans
INSERT INTO subscription_plans (name, slug, price, description, features) VALUES
  ('Starter', 'starter', 0, 'Digital Menu & QR Code - Perfect for getting started', 
   '["Digital Menu", "QR Code Generator", "Manual Item Entry", "Email Support"]'::jsonb),
  ('Professional', 'professional', 29.99, 'Full Menu Management with Ordering - Drive more sales', 
   '["Everything in Starter", "Image Uploads", "Add to Cart", "Order Management", "WhatsApp Orders", "Priority Support"]'::jsonb),
  ('Enterprise', 'enterprise', 99.99, 'Everything + Advanced Features', 
   '["Everything in Professional", "Google Review QR", "Advanced Analytics", "Custom Branding", "API Access", "Dedicated Support"]'::jsonb)
ON CONFLICT (slug) DO NOTHING;
