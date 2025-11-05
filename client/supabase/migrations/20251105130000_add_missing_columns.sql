-- Add missing columns for auto-save functionality
ALTER TABLE packages
ADD COLUMN IF NOT EXISTS user_session_id text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'in_progress',
ADD COLUMN IF NOT EXISTS step_completed integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS deleted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS last_updated timestamptz DEFAULT now();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_packages_user_session_id ON packages(user_session_id);
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_step_completed ON packages(step_completed);
CREATE INDEX IF NOT EXISTS idx_packages_deleted ON packages(deleted);
CREATE INDEX IF NOT EXISTS idx_packages_last_updated ON packages(last_updated);

-- Update existing records to have proper defaults
UPDATE packages SET status = 'in_progress' WHERE status IS NULL;
UPDATE packages SET step_completed = 0 WHERE step_completed IS NULL;
UPDATE packages SET deleted = false WHERE deleted IS NULL;
