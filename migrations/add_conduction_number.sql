-- Migration: Add conduction_number field to vehicles table
-- Date: January 30, 2026
-- Description: Adds conduction_number as an alternative vehicle identifier
-- that can be used when plate_number is not yet available

-- Add conduction_number column to vehicles table
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS conduction_number VARCHAR(50) UNIQUE;

-- Add comment explaining the field
COMMENT ON COLUMN vehicles.conduction_number IS 'Alternative vehicle identifier used when plate number is not yet available (e.g., during registration process)';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vehicles_conduction_number 
ON vehicles(conduction_number) 
WHERE conduction_number IS NOT NULL;

-- Optional: Update existing records if needed
-- UPDATE vehicles SET conduction_number = 'TEMP-' || id WHERE conduction_number IS NULL;

-- Verification query
-- SELECT id, plate_number, conduction_number, make, model FROM vehicles LIMIT 10;
