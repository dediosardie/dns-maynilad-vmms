# RBAC SETUP CHECKLIST

## ✅ Complete Setup Checklist for Role-Based Access Control

Follow these steps in order to fully implement RBAC in your system.

---

## 📋 Pre-Setup Requirements

- [ ] Supabase project is created and configured
- [ ] Application is connected to Supabase
- [ ] At least one user account exists in auth.users
- [ ] You have access to Supabase SQL Editor
- [ ] You have admin/owner access to the Supabase project

---

## 🗄️ Database Setup

### Step 1: Run Migration Script

- [ ] Open Supabase Dashboard
- [ ] Navigate to SQL Editor
- [ ] Open the file: `migrations/create_role_based_access_control.sql`
- [ ] Copy entire contents
- [ ] Paste into SQL Editor
- [ ] Click "Run" to execute
- [ ] Verify success (should show "Success. No rows returned")

### Step 2: Verify Database Objects Created

Run these verification queries:

```sql
-- Check if user_roles table exists
SELECT * FROM public.user_roles;
```
- [ ] Table exists and is empty (or has test data)

```sql
-- Check if helper functions exist
SELECT proname FROM pg_proc WHERE proname IN (
  'get_user_role',
  'has_role',
  'has_any_role',
  'get_user_client_id'
);
```
- [ ] All 4 functions are listed

```sql
-- Check RLS policies
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
```
- [ ] Multiple tables have RLS policies (vehicles, maintenance, drivers, trips, etc.)

### Step 3: Assign Initial Admin Role

- [ ] Get your user ID:
```sql
SELECT id, email FROM auth.users;
```

- [ ] Insert admin role (replace YOUR_USER_ID with actual UUID):
```sql
INSERT INTO public.user_roles (user_id, role, created_by)
VALUES ('YOUR_USER_ID'::UUID, 'administration', 'YOUR_USER_ID'::UUID);
```

- [ ] Verify role assigned:
```sql
SELECT ur.*, u.email
FROM public.user_roles ur
JOIN auth.users u ON ur.user_id = u.id;
```

---

## 💻 Frontend Setup

### Step 4: Verify Files Exist

Check that these files were created:

- [ ] `src/config/rolePermissions.ts` - Role definitions and permissions
- [ ] `src/hooks/useRoleAccess.ts` - Role access hook
- [ ] `src/components/ProtectedRoute.tsx` - Route protection components
- [ ] `src/services/authService.ts` - Updated with role methods
- [ ] `src/App.tsx` - Updated with route protection

### Step 5: Build and Test

- [ ] Run build command:
```bash
npm run build
```

- [ ] Build completes without errors
- [ ] No TypeScript compilation errors

- [ ] Start development server:
```bash
npm run dev
```

- [ ] Application starts successfully
- [ ] No console errors on load

---

## 🧪 Testing

### Step 6: Test Authentication

- [ ] Navigate to application
- [ ] Login page displays
- [ ] Login with admin user
- [ ] Successfully logged in
- [ ] Role badge displays "Administration"
- [ ] All modules visible in navigation

### Step 7: Test Role-Based Access

Create test users for each role:

#### Test User 1: Fleet Manager
- [ ] Create new user account
- [ ] Assign role:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE'::UUID, 'fleet_manager');
```
- [ ] Login with this user
- [ ] Verify accessible modules: Vehicles, Maintenance, Drivers, Trips, Fuel, Incidents, Compliance, Disposal, Reporting
- [ ] Verify role badge shows "Fleet Manager"
- [ ] Test creating a vehicle (should work)
- [ ] Test creating maintenance record (should work)

#### Test User 2: Driver
- [ ] Create new user account
- [ ] Assign role:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE'::UUID, 'driver');
```
- [ ] Login with this user
- [ ] Verify accessible modules: Vehicles, Trips, Fuel, Incidents (only these 4)
- [ ] Verify role badge shows "Driver"
- [ ] Navigate to Vehicles (should show access denied or only assigned vehicles)
- [ ] Navigate to Maintenance (should not be visible in menu)
- [ ] Navigate to Analytics (should not be visible in menu)

#### Test User 3: Maintenance Team
- [ ] Create new user account
- [ ] Assign role:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE'::UUID, 'maintenance_team');
```
- [ ] Login with this user
- [ ] Verify accessible modules: Vehicles, Maintenance, Incidents (only these 3)
- [ ] Verify role badge shows "Maintenance Team"
- [ ] Test creating maintenance record (should work)
- [ ] Test accessing Analytics (should not be visible)

### Step 8: Test Access Denied Screens

- [ ] Login as Driver
- [ ] Try to manually navigate to `/` and switch to Maintenance module
- [ ] Should see "Access Denied" screen with role information
- [ ] "Go Back" button works

### Step 9: Test RLS Policies

Test data isolation at database level:

- [ ] Login as Driver 1, create a trip
- [ ] Login as Driver 2, verify cannot see Driver 1's trip
- [ ] Login as Fleet Manager, verify can see all trips
- [ ] Login as Administration, verify can see all trips

### Step 10: Test Role Badge Display

- [ ] Login with each role
- [ ] Verify role badge displays correct role name
- [ ] Verify role badge has correct color:
  - Fleet Manager: Purple
  - Maintenance Team: Orange
  - Driver: Blue
  - Administration: Red
  - Client Liaison: Green

---

## 🔧 Configuration

### Step 11: Create Additional Test Users (Optional)

For comprehensive testing, create at least one user for each role:

```sql
-- Assuming you have 5 user accounts in auth.users
SELECT id, email FROM auth.users;

-- Assign roles (replace UUIDs with actual user IDs)
INSERT INTO public.user_roles (user_id, role) VALUES
  ('USER_1_ID'::UUID, 'administration'),
  ('USER_2_ID'::UUID, 'fleet_manager'),
  ('USER_3_ID'::UUID, 'maintenance_team'),
  ('USER_4_ID'::UUID, 'driver'),
  ('USER_5_ID'::UUID, 'client_company_liaison');
```

- [ ] All test users created
- [ ] All roles assigned
- [ ] Verified in database

---

## 📝 Documentation Review

### Step 12: Review Documentation

- [ ] Read `RBAC_IMPLEMENTATION_GUIDE.md` - Full implementation guide
- [ ] Read `RBAC_QUICK_REFERENCE.md` - Quick reference for developers
- [ ] Understand role definitions and permissions
- [ ] Understand how to use `useRoleAccess` hook
- [ ] Understand how to use `ProtectedRoute` component
- [ ] Know how to assign roles to users

---

## 🚀 Production Deployment

### Step 13: Pre-Production Checklist

- [ ] All tests pass
- [ ] All roles tested
- [ ] RLS policies verified
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Security audit completed

### Step 14: Production Migration

- [ ] Backup production database
- [ ] Run migration on production:
```sql
-- Run migrations/create_role_based_access_control.sql
```
- [ ] Assign roles to all existing users
- [ ] Test with production users
- [ ] Monitor for errors

### Step 15: Post-Deployment

- [ ] Verify all users can login
- [ ] Verify roles are correctly assigned
- [ ] Monitor Supabase logs for RLS policy errors
- [ ] Monitor application logs for permission errors
- [ ] Gather user feedback

---

## 🔍 Common Issues and Solutions

### Issue: "No Role Assigned" after login

**Solution:**
```sql
-- Check if user has role
SELECT * FROM public.user_roles WHERE user_id = 'USER_ID'::UUID;

-- Assign role if missing
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID'::UUID, 'administration');
```

### Issue: Navigation menu is empty

**Solution:**
- Check if user has a valid role assigned
- Verify `ROLE_MODULE_ACCESS` in `rolePermissions.ts`
- Check browser console for errors

### Issue: Can't access any modules

**Solution:**
- Verify RLS policies are enabled
- Check if helper functions exist
- Test role check: `SELECT public.get_user_role();`

### Issue: TypeScript compilation errors

**Solution:**
- Run `npm install` to ensure dependencies are installed
- Check if all RBAC files are present
- Verify imports are correct

---

## ✅ Final Verification

Run this comprehensive check:

```sql
-- 1. Check all tables have RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false;
-- Should return no rows (all tables should have RLS enabled)

-- 2. Count RLS policies
SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public';
-- Should be > 20 policies

-- 3. Check user roles
SELECT COUNT(*) FROM public.user_roles;
-- Should have at least 1 user

-- 4. Test helper functions
SELECT 
  public.get_user_role() as my_role,
  public.has_role('administration') as is_admin;
-- Should return your role

-- 5. Check all modules
SELECT role, array_agg(DISTINCT tablename) as accessible_tables
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY role;
-- Should show policies for different roles
```

---

## 🎉 Setup Complete!

If all checkboxes are marked, your RBAC system is fully implemented and tested.

### Next Steps:

1. **Train Users**: Educate users about their roles and permissions
2. **Monitor Usage**: Watch logs for unauthorized access attempts
3. **Regular Audits**: Periodically review role assignments
4. **Update Docs**: Keep documentation updated as roles evolve
5. **Gather Feedback**: Collect user feedback on access restrictions

---

## 📞 Support

- **Documentation**: `RBAC_IMPLEMENTATION_GUIDE.md`
- **Quick Reference**: `RBAC_QUICK_REFERENCE.md`
- **Database Migration**: `migrations/create_role_based_access_control.sql`
- **Supabase Docs**: https://supabase.com/docs

---

**Date Completed**: _________________

**Completed By**: _________________

**Notes**: 
_________________________________________________________________________________
_________________________________________________________________________________
_________________________________________________________________________________
