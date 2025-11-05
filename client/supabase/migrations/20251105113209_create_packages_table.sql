-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_code TEXT UNIQUE NOT NULL,
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  sender_city TEXT NOT NULL,
  sender_province TEXT NOT NULL,
  sender_postal_code TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  receiver_phone TEXT NOT NULL,
  receiver_address TEXT NOT NULL,
  receiver_city TEXT NOT NULL,
  receiver_province TEXT NOT NULL,
  receiver_postal_code TEXT NOT NULL,
  package_weight TEXT NOT NULL,
  package_length TEXT NOT NULL,
  package_width TEXT NOT NULL,
  package_height TEXT NOT NULL,
  package_description TEXT,
  courier TEXT NOT NULL,
  service_type TEXT NOT NULL,
  estimated_cost INTEGER NOT NULL,
  packing_options JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for tracking code
CREATE INDEX IF NOT EXISTS idx_packages_tracking_code ON packages(tracking_code);

-- Create index for status
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);

-- Create index for created_at
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON packages(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on packages" ON packages FOR ALL USING (true);
