-- Add user_id column to packages table for proper user authentication
ALTER TABLE packages ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index for user_id
CREATE INDEX IF NOT EXISTS idx_packages_user_id ON packages(user_id);

-- Note: existing records will have NULL user_id by default.
