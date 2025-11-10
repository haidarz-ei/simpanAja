-- Add payment-related columns to separate payment data from shipping form data
ALTER TABLE packages
ADD COLUMN IF NOT EXISTS payment_delivery_method TEXT CHECK (payment_delivery_method IN ('locker', 'admin', 'self')),
ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('ewallet', 'transfer', 'cash')),
ADD COLUMN IF NOT EXISTS payment_selected_office TEXT,
ADD COLUMN IF NOT EXISTS payment_total_cost INTEGER,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
ADD COLUMN IF NOT EXISTS payment_completed_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for payment-related columns
CREATE INDEX IF NOT EXISTS idx_packages_payment_delivery_method ON packages(payment_delivery_method);
CREATE INDEX IF NOT EXISTS idx_packages_payment_method ON packages(payment_method);
CREATE INDEX IF NOT EXISTS idx_packages_payment_status ON packages(payment_status);
CREATE INDEX IF NOT EXISTS idx_packages_payment_completed_at ON packages(payment_completed_at);
