-- Add device_id column to packages table
ALTER TABLE packages ADD COLUMN IF NOT EXISTS device_id text;

-- Create index for device_id
CREATE INDEX IF NOT EXISTS idx_packages_device_id ON packages(device_id);
