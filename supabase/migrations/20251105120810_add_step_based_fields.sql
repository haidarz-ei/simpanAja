-- Add step-based auto-save fields to packages table
ALTER TABLE packages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS step_completed INTEGER DEFAULT 0;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS user_session_id TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS device_id TEXT;

-- Create index for status and step_completed
CREATE INDEX IF NOT EXISTS idx_packages_status_step ON packages(status, step_completed);

-- Create index for user_session_id
CREATE INDEX IF NOT EXISTS idx_packages_user_session ON packages(user_session_id);

-- Update existing records to have draft status
UPDATE packages SET status = 'draft' WHERE status IS NULL;
UPDATE packages SET step_completed = 0 WHERE step_completed IS NULL;
