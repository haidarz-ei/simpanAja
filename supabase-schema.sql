-- Create packages table for simpanAja application
CREATE TABLE IF NOT EXISTS packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Sender information
  sender_name TEXT,
  sender_phone TEXT,
  sender_address TEXT,
  sender_city TEXT,
  sender_province TEXT,
  sender_district TEXT,
  sender_postal_code TEXT,

  -- Receiver information
  receiver_name TEXT,
  receiver_phone TEXT,
  receiver_address TEXT,
  receiver_city TEXT,
  receiver_province TEXT,
  receiver_district TEXT,
  receiver_postal_code TEXT,

  -- Package information
  package_weight TEXT,
  package_description TEXT,
  package_length TEXT,
  package_width TEXT,
  package_height TEXT,

  -- Additional options
  packing_option TEXT, -- e.g., 'bubble wrap', 'fragile'
  delivery_method TEXT CHECK (delivery_method IN ('pickup', 'delivery')),
  payment_method TEXT CHECK (payment_method IN ('transfer', 'cash')),

  -- Status fields
  is_complete BOOLEAN DEFAULT FALSE,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed')),
  tracking_code TEXT,

  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE,

  -- Soft delete flag
  deleted BOOLEAN DEFAULT FALSE,

  -- Session tracking for anonymous users
  user_session_id TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_packages_user_session_id ON packages(user_session_id);
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON packages(created_at);
CREATE INDEX IF NOT EXISTS idx_packages_deleted ON packages(deleted);
CREATE INDEX IF NOT EXISTS idx_packages_is_complete ON packages(is_complete);

-- Enable Row Level Security (RLS)
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous access (development only)
-- In production, implement proper authentication
CREATE POLICY "Allow all operations for anonymous users" ON packages
  FOR ALL USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_packages_updated_at
    BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
