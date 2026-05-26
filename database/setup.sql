-- Crie estas tabelas no seu banco PostgreSQL / Supabase

CREATE TABLE IF NOT EXISTS menu (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  emoji TEXT,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  description TEXT,
  options JSONB DEFAULT '[]',
  option_prices JSONB DEFAULT '[]',
  complements JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  delivery_address TEXT,
  items JSONB NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  type TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  payment_details JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'novo',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
