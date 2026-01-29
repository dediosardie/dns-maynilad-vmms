# Supabase Database Setup

## SQL Schema

Run the following SQL commands in your Supabase SQL Editor to create the required tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create vehicles table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plate_number TEXT NOT NULL UNIQUE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  vin TEXT NOT NULL UNIQUE,
  ownership_type TEXT NOT NULL CHECK (ownership_type IN ('owned', 'leased')),
  status TEXT NOT NULL CHECK (status IN ('active', 'maintenance', 'disposed')),
  insurance_expiry DATE NOT NULL,
  registration_expiry DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create drivers table
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  license_number TEXT NOT NULL UNIQUE,
  license_expiry DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create maintenance table
CREATE TABLE maintenance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL CHECK (maintenance_type IN ('preventive', 'repair')),
  scheduled_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed')),
  cost DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_vehicles_plate ON vehicles(plate_number);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_drivers_license ON drivers(license_number);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_maintenance_vehicle ON maintenance(vehicle_id);
CREATE INDEX idx_maintenance_status ON maintenance(status);

-- Enable Row Level Security (RLS)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security requirements)
CREATE POLICY "Enable read access for all users" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON vehicles FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON vehicles FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON drivers FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON drivers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON drivers FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON drivers FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON maintenance FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON maintenance FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON maintenance FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON maintenance FOR DELETE USING (true);
```

## Environment Setup

1. Create a `.env` file in the project root (copy from `.env.example`):
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the Project URL and anon/public key
   - Paste them into your `.env` file

3. Restart the development server after creating the `.env` file

## Notes

- The database uses UUID for primary keys
- Row Level Security (RLS) is enabled with public access policies
- Adjust the RLS policies based on your authentication requirements
- All tables have `created_at` timestamps for audit purposes
- Foreign key constraints ensure referential integrity
