-- Add user_id column to packages table for proper user authentication
ALTER TABLE packages ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index for user_id
CREATE INDEX IF NOT EXISTS idx_packages_user_id ON packages(user_id);

-- Update existing records to have null user_id (for anonymous users)
-- This allows existing data to remain while new records will have user_id
