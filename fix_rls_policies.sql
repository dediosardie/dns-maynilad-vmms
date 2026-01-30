-- Fix RLS Policies to work with Supabase Auth
-- Run this in your Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins and managers can modify vehicles" ON vehicles;

-- Create a simple policy that allows all authenticated users to modify vehicles
CREATE POLICY "Authenticated users can modify vehicles" ON vehicles
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Apply same fix to other tables
DROP POLICY IF EXISTS "Admins and managers can modify drivers" ON drivers;
CREATE POLICY "Authenticated users can modify drivers" ON drivers
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins and managers can modify maintenance" ON maintenance;
CREATE POLICY "Authenticated users can modify maintenance" ON maintenance
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins and managers can modify trips" ON trips;
CREATE POLICY "Authenticated users can modify trips" ON trips
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins and managers can modify fuel_transactions" ON fuel_transactions;
CREATE POLICY "Authenticated users can modify fuel_transactions" ON fuel_transactions
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins and managers can modify incidents" ON incidents;
CREATE POLICY "Authenticated users can modify incidents" ON incidents
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins and managers can modify documents" ON documents;
CREATE POLICY "Authenticated users can modify documents" ON documents
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins and managers can modify disposal_requests" ON disposal_requests;
CREATE POLICY "Authenticated users can modify disposal_requests" ON disposal_requests
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
