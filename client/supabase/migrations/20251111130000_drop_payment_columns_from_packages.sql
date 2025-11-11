-- Drop payment-related columns from packages table after migration to payments table
-- This migration should be run AFTER the payments table is created and data is migrated

-- Drop indexes first
DROP INDEX IF EXISTS idx_packages_payment_delivery_method;
DROP INDEX IF EXISTS idx_packages_payment_method;
DROP INDEX IF EXISTS idx_packages_payment_status;
DROP INDEX IF EXISTS idx_packages_payment_completed_at;

-- Drop payment-related columns from packages table
ALTER TABLE packages
DROP COLUMN IF EXISTS payment_delivery_method,
DROP COLUMN IF EXISTS payment_method,
DROP COLUMN IF EXISTS payment_selected_office,
DROP COLUMN IF EXISTS payment_total_cost,
DROP COLUMN IF EXISTS payment_status,
DROP COLUMN IF EXISTS payment_completed_at;
