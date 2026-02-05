# Supabase Storage Bucket Setup for Images

This guide explains how to set up Supabase Storage buckets for storing images captured via camera in the Vehicle Maintenance Management System.

## Storage Buckets Required

### 1. Fuel Receipts Bucket

**Bucket Name:** `fuel-receipts`

**Purpose:** Store fuel transaction receipt images

**Settings:**
- **Public bucket:** Yes (or configure RLS policies for controlled access)
- **Allowed MIME types:** `image/jpeg`, `image/jpg`, `image/png`
- **File size limit:** 5 MB (recommended)

**Folder Structure:**
```
fuel-receipts/
  └── {year}/
      └── {month}/
          └── {day}/
              └── {vehicleId}_{timestamp}.jpg
```

**Example:** `fuel-receipts/2026/02/05/vehicle-123_1707152485847.jpg`

### 2. Maintenance Images Bucket

**Bucket Name:** `maintenance-images`

**Purpose:** Store maintenance-related images (vehicle condition, parts, repairs)

**Settings:**
- **Public bucket:** Yes (or configure RLS policies for controlled access)
- **Allowed MIME types:** `image/jpeg`, `image/jpg`, `image/png`
- **File size limit:** 5 MB (recommended)

**Folder Structure:**
```
maintenance-images/
  └── {year}/
      └── {month}/
          └── {day}/
              └── {vehicleId}_{timestamp}.jpg
```

**Example:** `maintenance-images/2026/02/05/vehicle-456_1707152598123.jpg`

## Setup Instructions

### Step 1: Create the Buckets

Navigate to your Supabase Dashboard → Storage → Create bucket

1. Create **`fuel-receipts`** bucket with the settings described above
2. Create **`maintenance-images`** bucket with the settings described above

### Step 2: Storage Policies (Optional - for restricted access)

If you set the bucket to private, apply these RLS policies:

#### For fuel-receipts bucket

**Allow authenticated users to upload receipts:**
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'fuel-receipts');
```

**Allow authenticated users to read receipts:**
```sql
CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'fuel-receipts');
```

**Allow users to delete their own receipts:**
```sql
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'fuel-receipts');
```

#### For maintenance-images bucket

**Allow authenticated users to upload images:**
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'maintenance-images');
```

**Allow authenticated users to read images:**
```sql
CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'maintenance-images');
```

**Allow users to delete images:**
```sql
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'maintenance-images');
```

### Step 3: CORS Configuration (if needed)

If accessing from different domains, configure CORS in Supabase Settings → API:

```json
{
  "allowedOrigins": ["https://yourdomain.com"],
  "allowedMethods": ["GET", "POST", "PUT", "DELETE"],
  "allowedHeaders": ["*"],
  "maxAge": 3600
}
```

## Camera Capture Implementation

### Features Implemented

#### FuelTransactionForm (receipt_image_url)
- **Purpose:** Capture fuel receipt images for transaction documentation
- **Camera access:** Rear camera via `facingMode: 'environment'`
- **Resolution:** 1920x1080 (ideal)
- **Storage bucket:** `fuel-receipts`
- **Auto-upload:** Images uploaded immediately after capture
- **Field:** `receipt_image_url` in fuel_transactions table

#### MaintenanceForm (image_url)
- **Purpose:** Capture maintenance-related images (vehicle condition, parts, repairs)
- **Camera access:** Rear camera via `facingMode: 'environment'`
- **Resolution:** 1920x1080 (ideal)
- **Storage bucket:** `maintenance-images`
- **Auto-upload:** Images uploaded immediately after capture
- **Field:** `image_url` in maintenance table

### Common Features
- **Rear camera access:** Uses `facingMode: 'environment'` to access device rear camera
- **High quality:** Captures at 1920x1080 resolution (ideal)
- **Auto-upload:** Automatically uploads to Supabase Storage after capture
- **Progress indicator:** Shows upload status with spinner
- **Preview:** Displays captured image before form submission
- **Remove option:** Allows users to retake if needed

### Browser Permissions
Users must grant camera permissions when prompted. The feature requires:
- Modern browser with Media Devices API support
- HTTPS connection (required for camera access)
- User permission to access camera

### Mobile Optimization
- Uses rear camera by default on mobile devices
- Touch-friendly capture button
- Responsive video preview
- Optimized JPEG compression (0.8 quality)

## Testing the Implementation

### For FuelTransactionForm (Receipt Images)
1. **Create bucket:** Set up `fuel-receipts` bucket in Supabase Dashboard
2. **Test camera access:** Open FuelTransactionForm and click "Capture Receipt"
3. **Grant permissions:** Allow camera access when prompted
4. **Capture image:** Click the red capture button
5. **Verify upload:** Check Supabase Storage for the uploaded file in `fuel-receipts/{year}/{month}/{day}/`
6. **Check URL:** Ensure `receipt_image_url` is populated in form data

### For MaintenanceForm (Maintenance Images)
1. **Create bucket:** Set up `maintenance-images` bucket in Supabase Dashboard
2. **Test camera access:** Open MaintenanceForm and click "Capture Image"
3. **Grant permissions:** Allow camera access when prompted
4. **Capture image:** Click the red capture button
5. **Verify upload:** Check Supabase Storage for the uploaded file in `maintenance-images/{year}/{month}/{day}/`
6. **Check URL:** Ensure `image_url` is populated in form data

## Troubleshooting

### Camera not accessible
- Ensure HTTPS connection (camera API requires secure context)
- Check browser permissions in Settings
- Verify device has working camera
- Try different browser if issues persist

### Upload fails
- Verify Supabase credentials in `.env`
- Check bucket exists and is accessible
- Verify storage policies if using private bucket
- Check network connection and Supabase service status

### Image not displaying
- Verify public URL is correct
- Check CORS settings if accessing from different domain
- Ensure bucket is public or RLS policies allow read access

## Security Considerations

1. **Validate file size:** Current implementation allows reasonable JPEG sizes
2. **Content type check:** Only accepts image/jpeg MIME type
3. **Organize by date:** Folder structure prevents naming conflicts
4. **Unique filenames:** Timestamp ensures uniqueness
5. **RLS policies:** Implement if bucket access needs to be restricted
6. **Client-side validation:** Consider adding image validation before upload

## Future Enhancements

- **Image compression:** Further reduce file size on mobile
- **Multiple images:** Allow capturing multiple receipts per transaction
- **Edit/crop:** Add image editing before upload
- **OCR integration:** Auto-extract receipt data using OCR
- **Gallery option:** Allow selecting from device gallery as alternative
- **Delete old receipts:** Implement cleanup policy for old files
