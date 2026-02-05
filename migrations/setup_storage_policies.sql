-- Setup Storage Policies for Image Buckets
-- This enables authenticated users to upload, view, and manage images

-- Fuel Receipts Bucket Policies
-- Allow authenticated users to upload receipts
CREATE POLICY "Allow authenticated uploads to fuel-receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'fuel-receipts');

-- Allow authenticated users to read receipts
CREATE POLICY "Allow authenticated reads from fuel-receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'fuel-receipts');

-- Allow authenticated users to update receipts
CREATE POLICY "Allow authenticated updates to fuel-receipts"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'fuel-receipts');

-- Allow authenticated users to delete receipts
CREATE POLICY "Allow authenticated deletes from fuel-receipts"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'fuel-receipts');

-- Maintenance Images Bucket Policies
-- Allow authenticated users to upload maintenance images
CREATE POLICY "Allow authenticated uploads to maintenance-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'maintenance-images');

-- Allow authenticated users to read maintenance images
CREATE POLICY "Allow authenticated reads from maintenance-images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'maintenance-images');

-- Allow authenticated users to update maintenance images
CREATE POLICY "Allow authenticated updates to maintenance-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'maintenance-images');

-- Allow authenticated users to delete maintenance images
CREATE POLICY "Allow authenticated deletes from maintenance-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'maintenance-images');

-- Trip Images Bucket Policies
-- Allow authenticated users to upload trip images
CREATE POLICY "Allow authenticated uploads to trip-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'trip-images');

-- Allow authenticated users to read trip images
CREATE POLICY "Allow authenticated reads from trip-images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'trip-images');

-- Allow authenticated users to update trip images
CREATE POLICY "Allow authenticated updates to trip-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'trip-images');

-- Allow authenticated users to delete trip images
CREATE POLICY "Allow authenticated deletes from trip-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'trip-images');
