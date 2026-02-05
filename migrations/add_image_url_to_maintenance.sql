-- Add image_url column to maintenance table for storing maintenance-related images

-- Add image_url column to maintenance table
ALTER TABLE maintenance
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment to the column
COMMENT ON COLUMN maintenance.image_url IS 'URL of the maintenance image stored in Supabase Storage (maintenance-images bucket)';

-- Create index for faster queries filtering by image presence
CREATE INDEX IF NOT EXISTS idx_maintenance_image_url ON maintenance(image_url) WHERE image_url IS NOT NULL;
