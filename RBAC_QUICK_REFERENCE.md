# ROLE-BASED ACCESS CONTROL (RBAC) - QUICK REFERENCE

## 📋 User Roles Summary

| Role | Key Access | Restrictions |
|------|-----------|--------------|
| **Fleet Manager** | All fleet ops, maintenance, driver performance, reports | No delete, no config, no user management |
| **Maintenance Team** | Vehicles (read), maintenance (full), incidents | No financials, no analytics, no disposal |
| **Driver** | Own trips, fuel logs, incidents, assigned vehicles | No other drivers' data, no analytics |
| **Administration** | All data (read/update), reports, system config | No operational execution |
| **Client Liaison** | Client-scoped vehicles, reports, compliance | No system config, no operational data edit |

---

## 🎯 Quick Usage Examples

### Protect a Module/Route
```tsx
import { ProtectedRoute } from './components/ProtectedRoute';

<ProtectedRoute requiredModule="vehicles">
  <VehicleModule />
</ProtectedRoute>
```

### Hide/Show UI Elements
```tsx
import { ConditionalRender } from './components/ProtectedRoute';

<ConditionalRender requiredPermission="vehicles:create">
  <button>Add Vehicle</button>
</ConditionalRender>
```

### Check Permissions in Code
```tsx
import { useRoleAccess } from './hooks/useRoleAccess';

const { hasPermission, hasModuleAccess, hasRole } = useRoleAccess();

if (hasPermission('vehicles:delete')) {
  // Show delete button
}

if (hasModuleAccess('maintenance')) {
  // Enable maintenance features
}

if (hasRole('fleet_manager')) {
  // Fleet manager specific logic
}
```

### Display User Role Badge
```tsx
import { RoleBadge } from './components/ProtectedRoute';

<RoleBadge />
```

---

## 🗄️ Database Operations

### Assign Role to User
```sql
-- Get user ID first
SELECT id, email FROM auth.users;

-- Assign role
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE'::UUID, 'fleet_manager');
```

### Check User's Role
```sql
SELECT public.get_user_role();
```

### Check Role Permissions
```sql
SELECT public.has_role('administration');
SELECT public.has_any_role(ARRAY['fleet_manager', 'administration']);
```

### View All User Roles
```sql
SELECT ur.*, u.email
FROM public.user_roles ur
JOIN auth.users u ON ur.user_id = u.id;
```

---

## 🔒 Permission Matrix

### Vehicles Module
| Role | Read | Create | Update | Delete |
|------|------|--------|--------|--------|
| Fleet Manager | ✓ | ✓ | ✓ | ✗ |
| Maintenance Team | ✓ | ✗ | ✗ | ✗ |
| Driver | ✓ (assigned) | ✗ | ✗ | ✗ |
| Administration | ✓ | ✗ | ✓ | ✗ |
| Client Liaison | ✓ (scoped) | ✗ | ✗ | ✗ |

### Maintenance Module
| Role | Read | Create | Update | Delete |
|------|------|--------|--------|--------|
| Fleet Manager | ✓ | ✓ | ✓ | ✗ |
| Maintenance Team | ✓ | ✓ | ✓ | ✗ |
| Driver | ✗ | ✗ | ✗ | ✗ |
| Administration | ✓ | ✗ | ✓ | ✗ |
| Client Liaison | ✗ | ✗ | ✗ | ✗ |

### Trips Module
| Role | Read | Create | Update | Delete |
|------|------|--------|--------|--------|
| Fleet Manager | ✓ | ✗ | ✗ | ✗ |
| Maintenance Team | ✗ | ✗ | ✗ | ✗ |
| Driver | ✓ (own) | ✓ | ✓ | ✗ |
| Administration | ✓ | ✗ | ✓ | ✗ |
| Client Liaison | ✗ | ✗ | ✗ | ✗ |

### Fuel Tracking Module
| Role | Read | Create | Update | Delete |
|------|------|--------|--------|--------|
| Fleet Manager | ✓ | ✗ | ✗ | ✗ |
| Maintenance Team | ✗ | ✗ | ✗ | ✗ |
| Driver | ✓ (own) | ✓ | ✗ | ✗ |
| Administration | ✓ | ✗ | ✓ | ✗ |
| Client Liaison | ✗ | ✗ | ✗ | ✗ |

### Incidents Module
| Role | Read | Create | Update | Delete |
|------|------|--------|--------|--------|
| Fleet Manager | ✓ | ✗ | ✗ | ✗ |
| Maintenance Team | ✓ | ✗ | ✗ | ✗ |
| Driver | ✓ (own) | ✓ | ✗ | ✗ |
| Administration | ✓ | ✗ | ✓ | ✗ |
| Client Liaison | ✗ | ✗ | ✗ | ✗ |

### Drivers Module
| Role | Read | Create | Update | Delete |
|------|------|--------|--------|--------|
| Fleet Manager | ✓ | ✗ | ✗ | ✗ |
| Maintenance Team | ✗ | ✗ | ✗ | ✗ |
| Driver | ✓ (self) | ✗ | ✗ | ✗ |
| Administration | ✓ | ✓ | ✓ | ✗ |
| Client Liaison | ✗ | ✗ | ✗ | ✗ |

---

## 🛠️ Common Tasks

### Add New Role
1. Update `UserRole` type in `rolePermissions.ts`
2. Add permissions in `ROLE_PERMISSIONS`
3. Add module access in `ROLE_MODULE_ACCESS`
4. Update database constraint:
   ```sql
   ALTER TABLE public.user_roles DROP CONSTRAINT user_roles_role_check;
   ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_role_check
   CHECK (role IN ('fleet_manager', 'maintenance_team', 'driver', 'administration', 'client_company_liaison', 'new_role'));
   ```

### Add New Permission
1. Update `Permission` type in `rolePermissions.ts`
2. Assign to appropriate roles in `ROLE_PERMISSIONS`
3. Use in components:
   ```tsx
   <ConditionalRender requiredPermission="new:permission">
     <YourComponent />
   </ConditionalRender>
   ```

### Change User Role
```sql
UPDATE public.user_roles
SET role = 'new_role', updated_at = now()
WHERE user_id = 'USER_ID_HERE'::UUID;
```

### Debug Access Issues
```sql
-- Check user's current role
SELECT ur.role, u.email
FROM public.user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE ur.user_id = auth.uid();

-- Check RLS policies
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;

-- Test role check
SELECT public.has_role('fleet_manager');
```

---

## 🚨 Important Rules

1. **Each user MUST have exactly ONE role**
2. **UI checks + Backend RLS = Defense in Depth**
3. **NEVER bypass RLS policies**
4. **Forbidden actions must be HIDDEN, not just disabled**
5. **All tables MUST have RLS enabled**
6. **Client-scoped roles require client_id**

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/config/rolePermissions.ts` | Role & permission definitions |
| `src/hooks/useRoleAccess.ts` | React hook for role checks |
| `src/components/ProtectedRoute.tsx` | Route protection components |
| `src/services/authService.ts` | Auth with role fetching |
| `migrations/create_role_based_access_control.sql` | Database setup |
| `RBAC_IMPLEMENTATION_GUIDE.md` | Detailed documentation |

---

## 🧪 Testing Checklist

- [ ] Assign test users to different roles
- [ ] Login with each role
- [ ] Verify correct modules visible in navigation
- [ ] Test access to each module
- [ ] Verify "Access Denied" for restricted modules
- [ ] Test CRUD operations respect permissions
- [ ] Verify data isolation (driver can't see other drivers' data)
- [ ] Test RLS policies work at database level
- [ ] Check role badge displays correctly
- [ ] Verify logout clears role information

---

## 📞 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "No Role Assigned" | Assign role: `INSERT INTO user_roles (user_id, role) VALUES (...)` |
| "Access Denied" everywhere | Check if user has valid role in database |
| Can see unauthorized data | Verify RLS policies enabled on table |
| Role not loading | Check Supabase connection and console for errors |
| Navigation menu empty | Check `hasModuleAccess` function and role assignments |

---

## 📚 References

- Full Documentation: [RBAC_IMPLEMENTATION_GUIDE.md](RBAC_IMPLEMENTATION_GUIDE.md)
- Supabase RLS Docs: https://supabase.com/docs/guides/auth/row-level-security
- React Hooks: https://react.dev/reference/react/hooks
