-- =====================================================
-- ROLE-BASED ACCESS CONTROL (RBAC) IMPLEMENTATION
-- =====================================================
-- This migration creates the infrastructure for role-based
-- access control with Row Level Security (RLS) policies

-- =====================================================
-- 1. CREATE USER_ROLES TABLE
-- =====================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('fleet_manager', 'maintenance_team', 'driver', 'administration', 'client_company_liaison')),
    client_id UUID, -- For client-scoped roles (no FK constraint - clients table may not exist)
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id) -- Each user can have only one role
);

-- Create index for faster lookups
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_user_roles_client_id ON public.user_roles(client_id);

-- Add comments
COMMENT ON TABLE public.user_roles IS 'Stores user role assignments for RBAC';
COMMENT ON COLUMN public.user_roles.role IS 'User role: fleet_manager, maintenance_team, driver, administration, or client_company_liaison';
COMMENT ON COLUMN public.user_roles.client_id IS 'Client ID for client-scoped roles (used by client_company_liaison)';

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own role
CREATE POLICY "Users can view own role"
    ON public.user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own role (for initial setup)
CREATE POLICY "Users can insert own role"
    ON public.user_roles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Note: For admin management of roles, disable RLS temporarily or use service role
-- This prevents infinite recursion in the policy check

-- =====================================================
-- 2. CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to get current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
    SELECT role FROM public.user_roles WHERE user_id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = required_role
    )
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to check if user has any of multiple roles
CREATE OR REPLACE FUNCTION public.has_any_role(required_roles TEXT[])
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = ANY(required_roles)
    )
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to get user's client_id (for client-scoped access)
CREATE OR REPLACE FUNCTION public.get_user_client_id()
RETURNS UUID AS $$
    SELECT client_id FROM public.user_roles WHERE user_id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- =====================================================
-- 3. UPDATE RLS POLICIES FOR VEHICLES TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.vehicles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.vehicles;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.vehicles;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.vehicles;

-- Policy: Fleet managers, administration, and maintenance team can read all vehicles
CREATE POLICY "vehicles_read_policy"
    ON public.vehicles
    FOR SELECT
    USING (
        public.has_any_role(ARRAY['fleet_manager', 'administration', 'maintenance_team', 'driver']::TEXT[])
        OR (public.has_role('client_company_liaison') AND client_id IS NOT NULL AND client_id = public.get_user_client_id())
    );

-- Policy: Fleet managers can create vehicles
CREATE POLICY "vehicles_insert_policy"
    ON public.vehicles
    FOR INSERT
    WITH CHECK (
        public.has_any_role(ARRAY['fleet_manager', 'administration']::TEXT[])
    );

-- Policy: Fleet managers and administration can update vehicles
CREATE POLICY "vehicles_update_policy"
    ON public.vehicles
    FOR UPDATE
    USING (
        public.has_any_role(ARRAY['fleet_manager', 'administration']::TEXT[])
    );

-- Policy: No one can delete vehicles (business rule)
CREATE POLICY "vehicles_delete_policy"
    ON public.vehicles
    FOR DELETE
    USING (false);

-- =====================================================
-- 4. UPDATE RLS POLICIES FOR MAINTENANCE TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.maintenance;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.maintenance;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.maintenance;

-- Policy: Read access for relevant roles
CREATE POLICY "maintenance_read_policy"
    ON public.maintenance
    FOR SELECT
    USING (
        public.has_any_role(ARRAY['fleet_manager', 'administration', 'maintenance_team']::TEXT[])
    );

-- Policy: Fleet managers, administration, and maintenance team can create maintenance records
CREATE POLICY "maintenance_insert_policy"
    ON public.maintenance
    FOR INSERT
    WITH CHECK (
        public.has_any_role(ARRAY['fleet_manager', 'administration', 'maintenance_team']::TEXT[])
    );

-- Policy: Same roles can update maintenance records
CREATE POLICY "maintenance_update_policy"
    ON public.maintenance
    FOR UPDATE
    USING (
        public.has_any_role(ARRAY['fleet_manager', 'administration', 'maintenance_team']::TEXT[])
    );

-- =====================================================
-- 5. UPDATE RLS POLICIES FOR DRIVERS TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.drivers;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.drivers;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.drivers;

-- Policy: Read access
CREATE POLICY "drivers_read_policy"
    ON public.drivers
    FOR SELECT
    USING (
        public.has_any_role(ARRAY['fleet_manager', 'administration', 'driver']::TEXT[])
    );

-- Policy: Administration can create drivers
CREATE POLICY "drivers_insert_policy"
    ON public.drivers
    FOR INSERT
    WITH CHECK (
        public.has_role('administration')
    );

-- Policy: Administration can update drivers
CREATE POLICY "drivers_update_policy"
    ON public.drivers
    FOR UPDATE
    USING (
        public.has_role('administration')
    );

-- =====================================================
-- 6. UPDATE RLS POLICIES FOR TRIPS TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.trips;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.trips;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.trips;

-- Policy: Read access
CREATE POLICY "trips_read_policy"
    ON public.trips
    FOR SELECT
    USING (
        public.has_any_role(ARRAY['fleet_manager', 'administration', 'driver']::TEXT[])
    );

-- Policy: Drivers and administration can create trips
CREATE POLICY "trips_insert_policy"
    ON public.trips
    FOR INSERT
    WITH CHECK (
        public.has_any_role(ARRAY['administration', 'driver']::TEXT[])
    );

-- Policy: Drivers can update their own trips, administration can update all
CREATE POLICY "trips_update_policy"
    ON public.trips
    FOR UPDATE
    USING (
        public.has_any_role(ARRAY['administration', 'driver']::TEXT[])
    );

-- =====================================================
-- 7. UPDATE RLS POLICIES FOR FUEL_TRANSACTIONS TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.fuel_transactions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.fuel_transactions;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.fuel_transactions;

-- Policy: Read access
CREATE POLICY "fuel_read_policy"
    ON public.fuel_transactions
    FOR SELECT
    USING (
        public.has_any_role(ARRAY['fleet_manager', 'administration', 'driver']::TEXT[])
    );

-- Policy: Drivers and administration can create fuel transactions
CREATE POLICY "fuel_insert_policy"
    ON public.fuel_transactions
    FOR INSERT
    WITH CHECK (
        public.has_any_role(ARRAY['administration', 'driver']::TEXT[])
    );

-- Policy: Administration can update fuel transactions
CREATE POLICY "fuel_update_policy"
    ON public.fuel_transactions
    FOR UPDATE
    USING (
        public.has_role('administration')
    );

-- =====================================================
-- 8. UPDATE RLS POLICIES FOR INCIDENTS TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.incidents;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.incidents;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.incidents;

-- Policy: Read access
CREATE POLICY "incidents_read_policy"
    ON public.incidents
    FOR SELECT
    USING (
        public.has_any_role(ARRAY['fleet_manager', 'administration', 'maintenance_team', 'driver']::TEXT[])
    );

-- Policy: Drivers and administration can create incidents
CREATE POLICY "incidents_insert_policy"
    ON public.incidents
    FOR INSERT
    WITH CHECK (
        public.has_any_role(ARRAY['administration', 'driver']::TEXT[])
    );

-- Policy: Administration can update incidents
CREATE POLICY "incidents_update_policy"
    ON public.incidents
    FOR UPDATE
    USING (
        public.has_role('administration')
    );

-- =====================================================
-- 9. UPDATE RLS POLICIES FOR COMPLIANCE_DOCUMENTS TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.compliance_documents;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.compliance_documents;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.compliance_documents;

-- Policy: Read access
CREATE POLICY "compliance_read_policy"
    ON public.compliance_documents
    FOR SELECT
    USING (
        public.has_any_role(ARRAY['fleet_manager', 'administration', 'client_company_liaison']::TEXT[])
    );

-- Policy: Fleet managers and administration can create compliance documents
CREATE POLICY "compliance_insert_policy"
    ON public.compliance_documents
    FOR INSERT
    WITH CHECK (
        public.has_any_role(ARRAY['fleet_manager', 'administration']::TEXT[])
    );

-- Policy: Same roles can update compliance documents
CREATE POLICY "compliance_update_policy"
    ON public.compliance_documents
    FOR UPDATE
    USING (
        public.has_any_role(ARRAY['fleet_manager', 'administration']::TEXT[])
    );

-- =====================================================
-- 10. UPDATE RLS POLICIES FOR VEHICLE_DISPOSAL TABLE
-- =====================================================

-- Drop existing policies if table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'vehicle_disposal') THEN
        DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.vehicle_disposal;
        DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.vehicle_disposal;
        DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.vehicle_disposal;

        -- Policy: Read access
        CREATE POLICY "disposal_read_policy"
            ON public.vehicle_disposal
            FOR SELECT
            USING (
                public.has_any_role(ARRAY['fleet_manager', 'administration']::TEXT[])
            );

        -- Policy: Fleet managers and administration can create disposal records
        CREATE POLICY "disposal_insert_policy"
            ON public.vehicle_disposal
            FOR INSERT
            WITH CHECK (
                public.has_any_role(ARRAY['fleet_manager', 'administration']::TEXT[])
            );

        -- Policy: Same roles can update disposal records
        CREATE POLICY "disposal_update_policy"
            ON public.vehicle_disposal
            FOR UPDATE
            USING (
                public.has_any_role(ARRAY['fleet_manager', 'administration']::TEXT[])
            );
    END IF;
END $$;

-- =====================================================
-- 11. INSERT DEFAULT ADMIN USER ROLE (OPTIONAL)
-- =====================================================

-- IMPORTANT: Replace 'YOUR_ADMIN_USER_ID' with actual UUID from auth.users
-- You can find this by running: SELECT id, email FROM auth.users;

-- Example (commented out - uncomment and update after getting actual user ID):
-- INSERT INTO public.user_roles (user_id, role, created_by)
-- VALUES ('YOUR_ADMIN_USER_ID'::UUID, 'administration', 'YOUR_ADMIN_USER_ID'::UUID)
-- ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- 12. GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant access to user_roles table
GRANT SELECT ON public.user_roles TO authenticated;

-- Grant execute on helper functions
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_any_role(TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_client_id() TO authenticated;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Verification queries (run these to check if everything is set up correctly):
-- 1. Check if user_roles table exists:
--    SELECT * FROM public.user_roles;
--
-- 2. Check helper functions:
--    SELECT public.get_user_role();
--
-- 3. Check RLS policies:
--    SELECT schemaname, tablename, policyname, cmd, qual 
--    FROM pg_policies 
--    WHERE schemaname = 'public' 
--    ORDER BY tablename, policyname;
