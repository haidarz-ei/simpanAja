-- Add district columns for sender and receiver addresses
ALTER TABLE packages
ADD COLUMN IF NOT EXISTS sender_district text,
ADD COLUMN IF NOT EXISTS receiver_district text;

-- Create indexes for district columns
CREATE INDEX IF NOT EXISTS idx_packages_sender_district ON packages(sender_district);
CREATE INDEX IF NOT EXISTS idx_packages_receiver_district ON packages(receiver_district);
