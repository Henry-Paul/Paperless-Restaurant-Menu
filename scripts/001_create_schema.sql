-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  plan TEXT NOT NULL DEFAULT 'starter',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'Uncategorized',
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  order_status TEXT DEFAULT 'pending',
  payment_method TEXT,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create qr_codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  qr_code_type TEXT NOT NULL,
  qr_code_data TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Restaurants policies
CREATE POLICY "Users can view their own restaurants"
  ON restaurants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create restaurants"
  ON restaurants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own restaurants"
  ON restaurants FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own restaurants"
  ON restaurants FOR DELETE
  USING (auth.uid() = user_id);

-- Menu items policies
CREATE POLICY "Anyone can view restaurant menu items"
  ON menu_items FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can create menu items for their restaurants"
  ON menu_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = menu_items.restaurant_id
    AND restaurants.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own menu items"
  ON menu_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = menu_items.restaurant_id
    AND restaurants.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own menu items"
  ON menu_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = menu_items.restaurant_id
    AND restaurants.user_id = auth.uid()
  ));

-- Orders policies
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users can view their restaurant orders"
  ON orders FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = orders.restaurant_id
    AND restaurants.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their restaurant orders"
  ON orders FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = orders.restaurant_id
    AND restaurants.user_id = auth.uid()
  ));

-- QR codes policies
CREATE POLICY "Users can view their restaurant QR codes"
  ON qr_codes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = qr_codes.restaurant_id
    AND restaurants.user_id = auth.uid()
  ));

CREATE POLICY "Users can create QR codes for their restaurants"
  ON qr_codes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = qr_codes.restaurant_id
    AND restaurants.user_id = auth.uid()
  ));

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_restaurants_updated_at
BEFORE UPDATE ON restaurants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON menu_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
