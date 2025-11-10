-- Add delivery_method column to packages table
ALTER TABLE packages ADD COLUMN IF NOT EXISTS delivery_method text;
