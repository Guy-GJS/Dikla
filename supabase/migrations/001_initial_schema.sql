-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (mirrors auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items table
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  condition TEXT CHECK (condition IN ('חדש', 'כמו חדש', 'מצב טוב', 'סביר')),
  city TEXT,
  neighborhood TEXT,
  price_ask NUMERIC(12, 2) NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('pending_approval', 'approved', 'sold', 'rejected')) DEFAULT 'pending_approval',
  featured BOOLEAN DEFAULT FALSE,
  seller_name TEXT,
  seller_email TEXT,
  seller_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  buyer_first_name TEXT,
  buyer_last_name TEXT,
  buyer_email TEXT,
  buyer_phone TEXT,
  type TEXT CHECK (type IN ('delivery', 'pickup')),
  subtotal NUMERIC(12, 2) NOT NULL,
  pritti_fee NUMERIC(12, 2) NOT NULL,
  shipping_fee NUMERIC(12, 2) DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL,
  status TEXT CHECK (status IN ('initiated', 'paid', 'failed')) DEFAULT 'initiated',
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wanted item leads table
CREATE TABLE wanted_item_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  city TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- Row Level Security (RLS) Policies
-- ================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wanted_item_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Items policies (simplified to avoid RLS recursion)
CREATE POLICY "Anyone can view approved items"
  ON items FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Sellers can view their own items"
  ON items FOR SELECT
  USING (auth.uid() = seller_id);

CREATE POLICY "Anyone can insert items (authenticated or anonymous)"
  ON items FOR INSERT
  WITH CHECK (
    auth.uid() = seller_id 
    OR seller_id IS NULL
    OR auth.uid() IS NOT NULL
  );

CREATE POLICY "Sellers can update their own pending items"
  ON items FOR UPDATE
  USING (auth.uid() = seller_id AND status = 'pending_approval');

-- Note: Admin operations (delete, approve) use supabaseAdmin client
-- which bypasses RLS, so we don't need policies that check profiles table

-- Orders policies
CREATE POLICY "Users can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (
    buyer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Wanted item leads policies
CREATE POLICY "Anyone can insert leads"
  ON wanted_item_leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all leads"
  ON wanted_item_leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Settings policies (public read, admin write)
CREATE POLICY "Anyone can view settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ================================
-- Seed Data
-- ================================

-- Insert default categories (8 categories as specified)
INSERT INTO categories (name, slug, image_url, is_featured, sort_order) VALUES
  ('רהיטים', 'furniture', '/images/categories/furniture.jpg', true, 1),
  ('אלקטרוניקה', 'electronics', '/images/categories/electronics.jpg', true, 2),
  ('בגדים ואביזרים', 'clothing', '/images/categories/clothing.jpg', true, 3),
  ('ספרים ומדיה', 'books-media', '/images/categories/books.jpg', true, 4),
  ('צעצועים ומשחקים', 'toys-games', '/images/categories/toys.jpg', true, 5),
  ('כלי בית', 'household', '/images/categories/household.jpg', true, 6),
  ('ספורט וחוץ', 'sports-outdoor', '/images/categories/sports.jpg', true, 7),
  ('אחר', 'other', '/images/categories/other.jpg', false, 8);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('pritti_fee_percent', '"8"'::jsonb),
  ('pritti_min_fee', '"5"'::jsonb),
  ('pritti_default_shipping', '35'::jsonb),
  ('commission_config', '{"mode": "percentage", "fixed_amount": 5, "percentage": 8, "min_amount": 5}'::jsonb),
  ('social_links', '{"instagram": "#", "facebook": "#"}'::jsonb);

-- Create indexes for better performance
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_category ON items(category_id);
CREATE INDEX idx_items_created_at ON items(created_at DESC);
CREATE INDEX idx_orders_item_id ON orders(item_id);
CREATE INDEX idx_orders_status ON orders(status);

