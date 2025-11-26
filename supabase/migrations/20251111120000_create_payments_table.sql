-- Create payments table to separate payment data from packages
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  method TEXT CHECK (method IN ('ewallet', 'transfer', 'cash')),
  delivery_method TEXT CHECK (delivery_method IN ('locker', 'admin', 'self')),
  selected_office TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  transaction_id TEXT UNIQUE,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for payments table
CREATE INDEX IF NOT EXISTS idx_payments_package_id ON payments(package_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payments(method);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous access (development only)
CREATE POLICY "Allow all operations for anonymous users on payments" ON payments
  FOR ALL USING (true);

-- Create updated_at trigger for payments
CREATE OR REPLACE FUNCTION update_payments_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_payments_updated_at_column();

-- Migrate existing payment data from packages to payments table
INSERT INTO payments (
  package_id,
  amount,
  method,
  delivery_method,
  selected_office,
  status,
  payment_date
)
SELECT
  id as package_id,
  COALESCE(payment_total_cost, 0) as amount,
  CASE
    WHEN payment_method = 'ewallet' THEN 'ewallet'
    WHEN payment_method = 'transfer' THEN 'transfer'
    WHEN payment_method = 'cash' THEN 'cash'
    ELSE NULL
  END as method,
  CASE
    WHEN payment_delivery_method = 'locker' THEN 'locker'
    WHEN payment_delivery_method = 'admin' THEN 'admin'
    WHEN payment_delivery_method = 'self' THEN 'self'
    ELSE NULL
  END as delivery_method,
  payment_selected_office as selected_office,
  CASE
    WHEN payment_status = 'pending' THEN 'pending'
    WHEN payment_status = 'paid' THEN 'paid'
    WHEN payment_status = 'failed' THEN 'failed'
    ELSE 'pending'
  END as status,
  payment_completed_at as payment_date
FROM packages
WHERE payment_total_cost IS NOT NULL
   OR payment_method IS NOT NULL
   OR payment_delivery_method IS NOT NULL
   OR payment_selected_office IS NOT NULL
   OR payment_status IS NOT NULL
   OR payment_completed_at IS NOT NULL;
