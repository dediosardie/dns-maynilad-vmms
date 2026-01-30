# ROLE-BASED ACCESS CONTROL (RBAC) IMPLEMENTATION GUIDE

## Overview

This document provides a complete guide for the Role-Based Access Control (RBAC) system implemented in the Vehicle Maintenance Management System.

## Table of Contents

1. [User Roles](#user-roles)
2. [Implementation Files](#implementation-files)
3. [Setup Instructions](#setup-instructions)
4. [Usage Guide](#usage-guide)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## User Roles

### 1. Fleet Manager

**Responsibilities:**
- Oversee entire fleet operations
- Ensure vehicle maintenance and regulatory compliance
- Monitor driver performance and safety adherence
- Manage vehicle acquisition and leasing

**Allowed Access:**
- Vehicles: read, create, update
- Maintenance records: read, create, update
- Drivers: read, performance view
- Reports: read
- Leasing records: read, create, update
- Disposal: read
- Compliance: read
- Analytics: read

**Forbidden:**
- Deleting system records
- Modifying system configuration
- Managing user roles

---

### 2. Maintenance Team

**Responsibilities:**
- Perform scheduled and corrective maintenance
- Handle repair requests
- Track vehicle downtime
- Track parts replacement
- Coordinate with external service providers

**Allowed Access:**
- Vehicles: read
- Maintenance records: read, create, update
- Incidents: read (to view reported vehicle issues)

**Forbidden:**
- Access to financial reports
- Driver performance analytics
- Vehicle acquisition or disposal

---

### 3. Driver

**Responsibilities:**
- Operate vehicles safely and efficiently
- Maintain accurate trip logs
- Record fuel usage
- Report incidents and vehicle issues immediately

**Allowed Access:**
- Assigned vehicles: read only
- Trip logs: read, create (own trips only)
- Fuel logs: read, create (own fuel logs only)
- Incident reports: read, create (own incidents only)

**Forbidden:**
- Viewing other drivers' data
- Editing vehicle or maintenance records
- Accessing reports or analytics

---

### 4. Administration

**Responsibilities:**
- Manage backend system operations
- Configure reports
- Maintain data accuracy and completeness

**Allowed Access:**
- All system tables: read, update
- Reports: read, create, configure
- Users: read
- Can update most operational data

**Forbidden:**
- Operational actions (driving, maintenance execution)
- Client contract modification

---

### 5. Client-Company Liaison

**Responsibilities:**
- Coordinate between DNS and client-companies
- Communicate vehicle needs and lease terms
- Address client concerns
- Oversee service agreements

**Allowed Access:**
- Vehicles (client-scoped): read
- Leasing records (client-scoped): read
- Reports (client-scoped): read
- Compliance (client-scoped): read

**Forbidden:**
- System configuration
- Driver or maintenance execution
- Editing operational data
- Access to data outside assigned client scope

---

## Implementation Files

### Configuration Files

1. **src/config/rolePermissions.ts**
   - Defines all user roles
   - Permission matrix for each role
   - Module access configuration
   - Helper functions for permission checks

### Hooks

2. **src/hooks/useRoleAccess.ts**
   - React hook for accessing role information
   - Permission checking utilities
   - Real-time role updates

### Components

3. **src/components/ProtectedRoute.tsx**
   - Route protection component
   - Conditional rendering based on roles
   - Access denied screen
   - Role badge display component

### Services

4. **src/services/authService.ts**
   - Enhanced authentication service
   - Role fetching functionality
   - Role validation

### Database Migration

5. **migrations/create_role_based_access_control.sql**
   - Creates `user_roles` table
   - Implements RLS policies for all tables
   - Helper functions for role checking
   - Comprehensive security rules

---

## Setup Instructions

### Step 1: Run Database Migration

Execute the SQL migration in your Supabase SQL Editor:

```bash
# Navigate to Supabase Dashboard > SQL Editor
# Copy and paste the contents of:
migrations/create_role_based_access_control.sql
# Click "Run" to execute
```

### Step 2: Assign Initial Admin Role

After running the migration, assign a role to your initial user:

1. Get your user ID from Supabase:
   ```sql
   SELECT id, email FROM auth.users;
   ```

2. Insert role for the admin user:
   ```sql
   INSERT INTO public.user_roles (user_id, role, created_by)
   VALUES ('YOUR_USER_ID_HERE'::UUID, 'administration', 'YOUR_USER_ID_HERE'::UUID);
   ```

### Step 3: Verify Installation

Check if everything is set up correctly:

```sql
-- Check user_roles table
SELECT * FROM public.user_roles;

-- Check RLS policies
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Test helper functions
SELECT public.get_user_role();
```

### Step 4: Build and Run Application

```bash
npm run build
npm run dev
```

---

## Usage Guide

### Frontend Usage

#### Protecting Routes/Modules

```tsx
import { ProtectedRoute } from './components/ProtectedRoute';

// Protect by module access
<ProtectedRoute requiredModule="vehicles">
  <VehicleModule />
</ProtectedRoute>

// Protect by specific permission
<ProtectedRoute requiredPermission="vehicles:create">
  <AddVehicleButton />
</ProtectedRoute>

// Protect by role
<ProtectedRoute requiredRole="fleet_manager">
  <FleetManagerDashboard />
</ProtectedRoute>

// Protect by multiple roles
<ProtectedRoute requiredRoles={['fleet_manager', 'administration']}>
  <AdminPanel />
</ProtectedRoute>
```

#### Conditional Rendering

```tsx
import { ConditionalRender } from './components/ProtectedRoute';

// Hide/show elements based on permissions
<ConditionalRender requiredPermission="vehicles:delete">
  <DeleteButton />
</ConditionalRender>

// Hide/show based on role
<ConditionalRender requiredRole="administration">
  <SettingsPanel />
</ConditionalRender>
```

#### Using the Role Access Hook

```tsx
import { useRoleAccess } from './hooks/useRoleAccess';

function MyComponent() {
  const {
    userRole,
    hasPermission,
    hasModuleAccess,
    hasRole,
    hasAnyRole,
  } = useRoleAccess();

  if (hasPermission('vehicles:create')) {
    // Show create vehicle button
  }

  if (hasModuleAccess('maintenance')) {
    // Show maintenance module
  }

  if (hasRole('fleet_manager')) {
    // Show fleet manager specific content
  }

  if (hasAnyRole(['administration', 'fleet_manager'])) {
    // Show content for admins and fleet managers
  }
}
```

#### Display Role Badge

```tsx
import { RoleBadge } from './components/ProtectedRoute';

// Display user's current role
<RoleBadge />
```

### Backend (Supabase) Usage

The RLS policies automatically enforce permissions at the database level. No additional backend code is needed, but you can use the helper functions in SQL:

```sql
-- Check user's role
SELECT public.get_user_role();

-- Check if user has specific role
SELECT public.has_role('fleet_manager');

-- Check if user has any of multiple roles
SELECT public.has_any_role(ARRAY['fleet_manager', 'administration']);

-- Get user's client_id (for client-scoped roles)
SELECT public.get_user_client_id();
```

---

## Testing

### Test Role Assignment

1. **Create test users:**
   ```sql
   -- Get user IDs
   SELECT id, email FROM auth.users;
   ```

2. **Assign different roles:**
   ```sql
   -- Assign Fleet Manager role
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('user_id_1'::UUID, 'fleet_manager');

   -- Assign Driver role
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('user_id_2'::UUID, 'driver');

   -- Assign Maintenance Team role
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('user_id_3'::UUID, 'maintenance_team');
   ```

### Test Access Control

1. **Login with different roles**
2. **Verify navigation menu** shows only accessible modules
3. **Try accessing restricted modules** - should show "Access Denied"
4. **Test CRUD operations** - should respect permissions
5. **Verify RLS policies** work at database level

### Test Cases

#### Fleet Manager
- ✓ Can view all vehicles
- ✓ Can create new vehicles
- ✓ Can view maintenance records
- ✓ Can view driver performance
- ✗ Cannot delete vehicles
- ✗ Cannot manage user roles

#### Driver
- ✓ Can view assigned vehicles
- ✓ Can create trip logs
- ✓ Can create fuel logs
- ✓ Can report incidents
- ✗ Cannot view other drivers' data
- ✗ Cannot access analytics

#### Maintenance Team
- ✓ Can view vehicles
- ✓ Can create maintenance records
- ✓ Can view incidents
- ✗ Cannot access financial reports
- ✗ Cannot dispose vehicles

---

## Troubleshooting

### User Has No Role Assigned

**Symptoms:**
- "No Role Assigned" message after login

**Solution:**
```sql
-- Check if user has a role
SELECT * FROM public.user_roles WHERE user_id = auth.uid();

-- Assign a role
INSERT INTO public.user_roles (user_id, role)
VALUES (auth.uid(), 'administration');
```

### Cannot Access Module

**Symptoms:**
- "Access Denied" screen when trying to access a module

**Solution:**
1. Check user's role:
   ```sql
   SELECT role FROM public.user_roles WHERE user_id = auth.uid();
   ```

2. Verify role has access to the module in [rolePermissions.ts](src/config/rolePermissions.ts)

3. Check if RLS policies are enabled:
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public'
   AND rowsecurity = true;
   ```

### RLS Policy Not Working

**Symptoms:**
- Users can see data they shouldn't have access to

**Solution:**
1. Verify RLS is enabled:
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public';
   ```

2. Check existing policies:
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

3. Test helper functions:
   ```sql
   SELECT public.get_user_role();
   SELECT public.has_role('your_role');
   ```

### Role Not Loading in Frontend

**Symptoms:**
- Role badge not showing
- All modules hidden

**Solution:**
1. Check browser console for errors
2. Verify Supabase connection
3. Check if user is authenticated:
   ```tsx
   const { data: { user } } = await supabase.auth.getUser();
   console.log('Current user:', user);
   ```

4. Verify user_roles table query:
   ```tsx
   const { data, error } = await supabase
     .from('user_roles')
     .select('role, client_id')
     .eq('user_id', user.id)
     .single();
   console.log('Role data:', data, error);
   ```

---

## Adding New Roles or Permissions

### Add a New Role

1. **Update rolePermissions.ts:**
   ```typescript
   export type UserRole = 
     | 'fleet_manager' 
     | 'maintenance_team' 
     | 'driver' 
     | 'administration' 
     | 'client_company_liaison'
     | 'your_new_role'; // Add here
   ```

2. **Add role permissions:**
   ```typescript
   export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
     // ... existing roles
     your_new_role: [
       'vehicles:read',
       'trips:read',
       // ... add permissions
     ],
   };
   ```

3. **Update database CHECK constraint:**
   ```sql
   ALTER TABLE public.user_roles
   DROP CONSTRAINT IF EXISTS user_roles_role_check;

   ALTER TABLE public.user_roles
   ADD CONSTRAINT user_roles_role_check
   CHECK (role IN ('fleet_manager', 'maintenance_team', 'driver', 'administration', 'client_company_liaison', 'your_new_role'));
   ```

### Add a New Permission

1. **Update rolePermissions.ts:**
   ```typescript
   export type Permission = 
     | 'vehicles:read'
     // ... existing permissions
     | 'your_new_permission:action';
   ```

2. **Assign to appropriate roles:**
   ```typescript
   export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
     fleet_manager: [
       // ... existing permissions
       'your_new_permission:action',
     ],
   };
   ```

---

## Security Best Practices

1. **Never bypass RLS policies** - Always use Supabase client with user context
2. **Always check permissions on frontend AND backend** - Defense in depth
3. **Audit role changes** - Log all role assignments and modifications
4. **Principle of least privilege** - Give users minimum required permissions
5. **Regular security reviews** - Periodically review and update role permissions
6. **Test thoroughly** - Test with each role to ensure proper access control
7. **Client scoping** - Use client_id for multi-tenant scenarios

---

## API Reference

### useRoleAccess Hook

```typescript
const {
  userRole,           // Current user's role data
  loading,            // Loading state
  hasPermission,      // Check if user has permission
  hasModuleAccess,    // Check if user can access module
  getPermissions,     // Get all user permissions
  getModules,         // Get all accessible modules
  getRoleDescription, // Get role details
  isAuthenticated,    // Check if user is authenticated
  hasRole,            // Check if user has specific role
  hasAnyRole,         // Check if user has any of specified roles
  refresh,            // Refresh role data
} = useRoleAccess();
```

### Helper Functions (SQL)

```sql
-- Get current user's role
SELECT public.get_user_role();

-- Check if user has specific role
SELECT public.has_role('fleet_manager');

-- Check if user has any of multiple roles
SELECT public.has_any_role(ARRAY['fleet_manager', 'administration']);

-- Get user's client_id
SELECT public.get_user_client_id();
```

---

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Supabase logs in Dashboard > Logs
3. Check browser console for frontend errors
4. Verify database policies and functions are correctly installed

---

## License

This RBAC implementation is part of the Vehicle Maintenance Management System.
