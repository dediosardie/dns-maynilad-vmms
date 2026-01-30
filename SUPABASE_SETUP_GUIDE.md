# Supabase Setup Guide

## Step-by-Step Setup Instructions

### Prerequisites
- Supabase account (free tier is sufficient)
- Node.js 16+ installed
- Git installed

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in or create account
4. Click "New Project"
5. Fill in project details:
   - **Name**: Vehicle Maintenance System
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your location
6. Click "Create new project"
7. Wait 2-3 minutes for project initialization

## 2. Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGc...
   ```
3. Save these for step 4

## 3. Run Database Schema

1. In Supabase dashboard, click **SQL Editor** in left sidebar
2. Click "New query"
3. Copy entire contents of `database_schema.sql` file
4. Paste into SQL editor
5. Click "Run" button (or press Ctrl+Enter)
6. Wait for execution (should take 5-10 seconds)
7. Verify success - you should see "Success. No rows returned"

### Verify Tables Created

1. Click **Table Editor** in left sidebar
2. You should see these tables:
   - vehicles
   - drivers
   - maintenance
   - trips
   - fuel_transactions
   - fuel_efficiency_metrics
   - incidents
   - incident_photos
   - insurance_claims
   - documents
   - compliance_alerts
   - disposal_requests
   - disposal_auctions
   - bids
   - disposal_transfers
   - users

## 4. Configure Application

1. In your project root, create `.env` file:
   ```bash
   touch .env
   ```

2. Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```

3. Update `src/supabaseClient.ts`:
   ```typescript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

   if (!supabaseUrl || !supabaseAnonKey) {
     throw new Error('Missing Supabase environment variables')
   }

   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

## 5. Install Dependencies

```bash
npm install @supabase/supabase-js
```

## 6. Test Connection

Create a test file to verify connection:

```typescript
// test-connection.ts
import { supabase } from './src/supabaseClient'

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('count')
    
    if (error) throw error
    
    console.log('✅ Supabase connected successfully!')
    console.log('Vehicle count:', data)
  } catch (error) {
    console.error('❌ Connection failed:', error)
  }
}

testConnection()
```

Run test:
```bash
npx tsx test-connection.ts
```

## 7. Insert Sample Data (Optional)

In Supabase SQL Editor, run:

```sql
-- Insert sample vehicles
INSERT INTO vehicles (plate_number, make, model, year, vin, ownership_type, status, insurance_expiry, registration_expiry) VALUES
('ABC-1234', 'Toyota', 'Hilux', 2022, '1HGCM82633A123456', 'owned', 'active', '2025-12-31', '2025-12-31'),
('XYZ-5678', 'Ford', 'Ranger', 2021, '1HGCM82633A654321', 'leased', 'active', '2026-06-30', '2026-06-30'),
('DEF-9012', 'Isuzu', 'D-Max', 2023, '1HGCM82633A789012', 'owned', 'active', '2026-03-15', '2026-03-15');

-- Insert sample drivers
INSERT INTO drivers (full_name, license_number, license_expiry, status) VALUES
('John Doe', 'DL123456', '2025-12-31', 'active'),
('Jane Smith', 'DL789012', '2026-06-30', 'active'),
('Bob Johnson', 'DL345678', '2025-09-15', 'active');

-- Verify data
SELECT * FROM vehicles;
SELECT * FROM drivers;
```

## 8. Configure Row Level Security (RLS)

### Option A: Disable RLS for Development (Quick Start)

```sql
-- Run in SQL Editor
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE drivers DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance DISABLE ROW LEVEL SECURITY;
ALTER TABLE trips DISABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE disposal_requests DISABLE ROW LEVEL SECURITY;
```

**⚠️ WARNING**: Only use this for local development. Enable RLS for production!

### Option B: Configure RLS for Production (Recommended)

The schema already includes basic RLS policies. To customize:

1. Go to **Authentication** → **Policies** in Supabase dashboard
2. Click on a table (e.g., vehicles)
3. Click "New Policy"
4. Choose template or create custom policy

Example: Allow all authenticated users to read vehicles:
```sql
CREATE POLICY "Allow authenticated read" 
ON vehicles 
FOR SELECT 
TO authenticated 
USING (true);
```

## 9. Enable Storage (For File Uploads)

1. Go to **Storage** in Supabase dashboard
2. Click "New bucket"
3. Create these buckets:
   - `documents` - for compliance documents
   - `incident-photos` - for incident photos
   - `receipts` - for fuel receipts
4. For each bucket:
   - Click bucket name
   - Click "Policies"
   - Click "New policy"
   - Select "Allow public read access" (or customize as needed)

Example storage policy:
```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Allow public read
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'documents');
```

## 10. Enable Realtime (Optional)

For live data updates:

1. Go to **Database** → **Replication**
2. Enable replication for tables you want to subscribe to:
   - vehicles
   - trips
   - compliance_alerts
   - incidents
3. Click "Enable" for each table

Usage in code:
```typescript
// Subscribe to vehicle changes
const subscription = supabase
  .channel('vehicles-channel')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'vehicles' },
    (payload) => {
      console.log('Change received!', payload)
      // Update local state
    }
  )
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

## 11. Configure Authentication (Optional)

If you need user authentication:

1. Go to **Authentication** in dashboard
2. Click **Providers**
3. Enable desired providers:
   - Email/Password
   - Google
   - GitHub
   - etc.

4. In your app, add auth:
```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Get current user
const { data: { user } } = await supabase.auth.getUser()

// Sign out
await supabase.auth.signOut()
```

## 12. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` and test the application!

## Troubleshooting

### Problem: "Invalid API key"

**Solution**: Check environment variables are correct
```bash
# Print variables (be careful in production!)
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Restart dev server after changing .env
npm run dev
```

### Problem: "RLS policy violation"

**Solution**: Check RLS policies or disable for development
```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'vehicles';

-- Disable RLS temporarily
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
```

### Problem: "Table does not exist"

**Solution**: Re-run database schema
1. Go to SQL Editor
2. Run entire `database_schema.sql` again
3. Verify in Table Editor

### Problem: "CORS error"

**Solution**: Configure allowed origins
1. Go to **Settings** → **API**
2. Add your development URL to allowed origins:
   ```
   http://localhost:5173
   ```

### Problem: "Cannot find module '@supabase/supabase-js'"

**Solution**: Install package
```bash
npm install @supabase/supabase-js
```

## Database Backups

### Automatic Backups

Supabase automatically backs up your database daily (Pro plan).

### Manual Backup

1. Go to **Database** → **Backups**
2. Click "Create backup"
3. Download when complete

### Export as SQL

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or use pg_dump
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup.sql
```

## Performance Optimization

### Enable Connection Pooling

1. Go to **Settings** → **Database**
2. Note the connection pooling port (usually 6543)
3. Use pooled connection in production:
```typescript
const supabase = createClient(
  'https://xxxxx.supabase.co',
  'anon-key',
  {
    db: { schema: 'public' },
    auth: { persistSession: true }
  }
)
```

### Monitor Performance

1. Go to **Reports** in dashboard
2. Check:
   - API request count
   - Database CPU usage
   - Storage usage
   - Active connections

### Add Indexes

Already included in schema, but you can add more:
```sql
CREATE INDEX idx_custom ON table_name(column_name);
```

## Security Checklist

- [ ] Environment variables not committed to git
- [ ] RLS enabled on all tables in production
- [ ] Storage policies configured properly
- [ ] API keys rotated regularly
- [ ] Database password is strong
- [ ] HTTPS enforced
- [ ] Authentication enabled
- [ ] Input validation implemented
- [ ] File upload size limits set
- [ ] Regular backups scheduled

## Production Deployment

### Environment Variables (Vercel/Netlify)

```env
VITE_SUPABASE_URL=your-production-url
VITE_SUPABASE_ANON_KEY=your-production-key
```

### Build Command

```bash
npm run build
```

### Output Directory

```
dist/
```

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Discord Community**: https://discord.supabase.com
- **GitHub Issues**: https://github.com/supabase/supabase/issues
- **Stack Overflow**: Tag `supabase`

## Next Steps

1. ✅ Complete Supabase setup
2. ✅ Test database connection
3. ✅ Insert sample data
4. ⏭️ Run application (`npm run dev`)
5. ⏭️ Test CRUD operations
6. ⏭️ Implement remaining modules
7. ⏭️ Deploy to production

---

**Setup Complete!** 🎉

You now have a fully configured Supabase backend. Proceed to use the application and implement additional features as needed.
