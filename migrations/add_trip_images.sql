-- Add departure_image_url and arrival_image_url columns to trips table for storing trip-related images

-- Add departure_image_url column
ALTER TABLE trips
ADD COLUMN IF NOT EXISTS departure_image_url TEXT;

-- Add arrival_image_url column
ALTER TABLE trips
ADD COLUMN IF NOT EXISTS arrival_image_url TEXT;

-- Add comments to the columns
COMMENT ON COLUMN trips.departure_image_url IS 'URL of the departure image stored in Supabase Storage (trip-images bucket)';
COMMENT ON COLUMN trips.arrival_image_url IS 'URL of the arrival image stored in Supabase Storage (trip-images bucket)';

-- Create indexes for faster queries filtering by image presence
CREATE INDEX IF NOT EXISTS idx_trips_departure_image_url ON trips(departure_image_url) WHERE departure_image_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_trips_arrival_image_url ON trips(arrival_image_url) WHERE arrival_image_url IS NOT NULL;
