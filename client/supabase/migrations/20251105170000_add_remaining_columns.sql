-- Add remaining columns that are in the PackageData interface but missing from database
ALTER TABLE packages
ADD COLUMN IF NOT EXISTS packing_options JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS selected_office text,
ADD COLUMN IF NOT EXISTS is_complete boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS submitted_at timestamptz;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_packages_payment_status ON packages(payment_status);
CREATE INDEX IF NOT EXISTS idx_packages_is_complete ON packages(is_complete);
CREATE INDEX IF NOT EXISTS idx_packages_submitted_at ON packages(submitted_at);
