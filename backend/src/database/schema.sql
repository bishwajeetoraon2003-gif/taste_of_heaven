-- ==========================================================================
-- TASTE OF HEAVEN - SUPABASE & POSTGRESQL DATABASE SCHEMA
-- ==========================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Role-Based Authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
  is_confirmed BOOLEAN DEFAULT true,
  confirmation_token VARCHAR(255),
  reset_password_token VARCHAR(255),
  reset_password_expires TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('starters', 'mains', 'specials', 'desserts', 'cocktails')),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  rating NUMERIC(3, 2) DEFAULT 4.9,
  veg BOOLEAN DEFAULT false,
  popular BOOLEAN DEFAULT false,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  allergens VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  reference_code VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  guest_name VARCHAR(100) NOT NULL,
  guest_email VARCHAR(150) NOT NULL,
  guest_phone VARCHAR(50) NOT NULL,
  guests_count INTEGER NOT NULL CHECK (guests_count > 0),
  reservation_date DATE NOT NULL,
  reservation_time VARCHAR(20) NOT NULL,
  table_atmosphere VARCHAR(50) DEFAULT 'Metropolis Skyline View',
  special_notes TEXT,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'seated', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  reference_code VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50),
  order_type VARCHAR(20) DEFAULT 'delivery' CHECK (order_type IN ('delivery', 'pickup')),
  subtotal NUMERIC(10, 2) NOT NULL,
  tax_and_service NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'out_for_delivery', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL,
  title VARCHAR(150) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal NUMERIC(10, 2) NOT NULL
);

-- 6. CONTACT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR SPEED AND OPTIMIZATION
CREATE INDEX IF NOT EXISTS idx_menu_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- ==========================================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES FOR PUBLIC (ANON) AND AUTH USERS
-- ==========================================================================

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- 1. MENU ITEMS POLICIES
-- Anyone (anon & authenticated) can view/read menu items
DROP POLICY IF EXISTS "Public read menu items" ON menu_items;
CREATE POLICY "Public read menu items" ON menu_items
  FOR SELECT TO public USING (true);

-- Admin full access to menu items
DROP POLICY IF EXISTS "Admin full access menu items" ON menu_items;
CREATE POLICY "Admin full access menu items" ON menu_items
  FOR ALL TO public USING (true) WITH CHECK (true);

-- 2. RESERVATIONS POLICIES
-- Anyone (anon public guests) can insert reservations
DROP POLICY IF EXISTS "Public insert reservations" ON reservations;
CREATE POLICY "Public insert reservations" ON reservations
  FOR INSERT TO public WITH CHECK (true);

-- Anyone can read reservations
DROP POLICY IF EXISTS "Public select reservations" ON reservations;
CREATE POLICY "Public select reservations" ON reservations
  FOR SELECT TO public USING (true);

-- 3. ORDERS POLICIES
-- Anyone (anon public guests) can create orders
DROP POLICY IF EXISTS "Public insert orders" ON orders;
CREATE POLICY "Public insert orders" ON orders
  FOR INSERT TO public WITH CHECK (true);

-- Anyone can read orders
DROP POLICY IF EXISTS "Public select orders" ON orders;
CREATE POLICY "Public select orders" ON orders
  FOR SELECT TO public USING (true);

-- 4. ORDER ITEMS POLICIES
-- Anyone (anon public guests) can insert order items
DROP POLICY IF EXISTS "Public insert order items" ON order_items;
CREATE POLICY "Public insert order items" ON order_items
  FOR INSERT TO public WITH CHECK (true);

-- Anyone can read order items
DROP POLICY IF EXISTS "Public select order items" ON order_items;
CREATE POLICY "Public select order items" ON order_items
  FOR SELECT TO public USING (true);

-- 5. CONTACT INQUIRIES POLICIES
-- Anyone (anon public guests) can submit inquiries
DROP POLICY IF EXISTS "Public insert contact inquiries" ON contact_inquiries;
CREATE POLICY "Public insert contact inquiries" ON contact_inquiries
  FOR INSERT TO public WITH CHECK (true);

-- Public select contact inquiries
DROP POLICY IF EXISTS "Public select contact inquiries" ON contact_inquiries;
CREATE POLICY "Public select contact inquiries" ON contact_inquiries
  FOR SELECT TO public USING (true);

-- Public delete contact inquiries
DROP POLICY IF EXISTS "Public delete contact inquiries" ON contact_inquiries;
CREATE POLICY "Public delete contact inquiries" ON contact_inquiries
  FOR DELETE TO public USING (true);

-- 6. USERS POLICIES
-- Allow insert for user registration
DROP POLICY IF EXISTS "Public insert users" ON users;
CREATE POLICY "Public insert users" ON users
  FOR INSERT TO public WITH CHECK (true);

-- Allow reading users
DROP POLICY IF EXISTS "Public select users" ON users;
CREATE POLICY "Public select users" ON users
  FOR SELECT TO public USING (true);
