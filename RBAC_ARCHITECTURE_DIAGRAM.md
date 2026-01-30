# RBAC SYSTEM ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     VEHICLE MAINTENANCE MANAGEMENT SYSTEM                    │
│                        ROLE-BASED ACCESS CONTROL (RBAC)                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER AUTHENTICATION                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │   Supabase Auth Login   │
                        │   (authService.ts)      │
                        └─────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ROLE ASSIGNMENT                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
        ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
        │  Database Query │ │  user_roles     │ │  RLS Policies   │
        │  (useRoleAccess)│ │  Table          │ │  Enabled        │
        └─────────────────┘ └─────────────────┘ └─────────────────┘
                    │                 │                 │
                    └─────────────────┼─────────────────┘
                                      ▼
                        ┌─────────────────────────┐
                        │   User Role Retrieved   │
                        │   - Fleet Manager       │
                        │   - Maintenance Team    │
                        │   - Driver              │
                        │   - Administration      │
                        │   - Client Liaison      │
                        └─────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PERMISSION RESOLUTION                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
        ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
        │  Role Config    │ │  Permission     │ │  Module Access  │
        │  (permissions.ts)│ │  Matrix         │ │  Matrix         │
        └─────────────────┘ └─────────────────┘ └─────────────────┘
                    │                 │                 │
                    └─────────────────┼─────────────────┘
                                      ▼
                        ┌─────────────────────────┐
                        │  Permissions Resolved   │
                        │  - vehicles:read        │
                        │  - maintenance:create   │
                        │  - trips:update         │
                        │  - etc...               │
                        └─────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           UI LAYER PROTECTION                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  Navigation Filter   │  │  ProtectedRoute      │  │  ConditionalRender   │
│  (App.tsx)           │  │  Component           │  │  Component           │
│                      │  │                      │  │                      │
│  ✓ Show: Vehicles    │  │  ✓ Allow Access     │  │  ✓ Show: Add Button  │
│  ✓ Show: Trips       │  │  ✗ Deny Access      │  │  ✗ Hide: Delete Btn  │
│  ✗ Hide: Admin       │  │  → Access Denied    │  │                      │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
            │                         │                         │
            └─────────────────────────┼─────────────────────────┘
                                      ▼
                        ┌─────────────────────────┐
                        │   User Interface        │
                        │   Rendered with         │
                        │   Appropriate Access    │
                        └─────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPONENT LAYER PROTECTION                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  Module Check        │  │  Permission Check    │  │  Role Check          │
│  hasModuleAccess()   │  │  hasPermission()     │  │  hasRole()           │
│                      │  │                      │  │                      │
│  'vehicles' → ✓      │  │  'vehicles:create'   │  │  'fleet_manager'     │
│  'analytics' → ✗     │  │  → ✓ or ✗            │  │  → ✓ or ✗            │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
            │                         │                         │
            └─────────────────────────┼─────────────────────────┘
                                      ▼
                        ┌─────────────────────────┐
                        │   Component Rendered    │
                        │   or Access Denied      │
                        └─────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER PROTECTION (RLS)                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  RLS Policy Check    │  │  Helper Functions    │  │  Row Filtering       │
│  (Supabase)          │  │  (SQL)               │  │  (Data Isolation)    │
│                      │  │                      │  │                      │
│  • vehicles_read     │  │  • get_user_role()   │  │  • Driver sees only  │
│  • vehicles_insert   │  │  • has_role()        │  │    assigned vehicles │
│  • vehicles_update   │  │  • has_any_role()    │  │  • Fleet Manager     │
│  • vehicles_delete   │  │  • get_client_id()   │  │    sees all vehicles │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
            │                         │                         │
            └─────────────────────────┼─────────────────────────┘
                                      ▼
                        ┌─────────────────────────┐
                        │   Query Executed with   │
                        │   Role-Based Filtering  │
                        └─────────────────────────┘
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │   ✓ Allowed: Return Data│
                        │   ✗ Denied: Empty Result│
                        └─────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              ROLE HIERARCHY                                  │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌────────────────────────┐
                        │    ADMINISTRATION      │
                        │   (Highest Access)     │
                        │                        │
                        │  • All Modules         │
                        │  • Read + Update Data  │
                        │  • Configure Reports   │
                        └────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
        ┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
        │ FLEET MANAGER   │ │ MAINTENANCE │ │ CLIENT LIAISON  │
        │                 │ │    TEAM     │ │                 │
        │ • 10 Modules    │ │ • 3 Modules │ │ • 3 Modules     │
        │ • Create/Update │ │ • Maintenance│ │ • Read Only     │
        │ • Performance   │ │ • Repairs    │ │ • Client Scope  │
        └─────────────────┘ └─────────────┘ └─────────────────┘
                    │
                    ▼
        ┌─────────────────────┐
        │      DRIVER         │
        │   (Least Access)    │
        │                     │
        │  • 4 Modules        │
        │  • Own Data Only    │
        │  • Create Logs      │
        └─────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW DIAGRAM                                  │
└─────────────────────────────────────────────────────────────────────────────┘

User Login
    │
    ▼
[authService] ──────► [Supabase Auth]
    │                       │
    │                       ▼
    │                [auth.users]
    │                       │
    ▼                       ▼
[useRoleAccess] ◄──── [user_roles table]
    │                       │
    │                       ▼
    │                [RLS Policies]
    │
    ├──► [hasPermission()] ───► [ROLE_PERMISSIONS matrix]
    │
    ├──► [hasModuleAccess()] ─► [ROLE_MODULE_ACCESS matrix]
    │
    └──► [hasRole()] ──────────► [Role comparison]
    │
    ▼
[ProtectedRoute / ConditionalRender]
    │
    ▼
[Render Component or Access Denied]
    │
    ▼
[User Action (CRUD)]
    │
    ▼
[Supabase Client Query]
    │
    ▼
[RLS Policy Validation]
    │
    ├──► ✓ [Allowed] ──► [Execute Query] ──► [Return Data]
    │
    └──► ✗ [Denied] ───► [Block Query] ───► [Empty/Error]

┌─────────────────────────────────────────────────────────────────────────────┐
│                        MODULE ACCESS MATRIX                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Role              │ Veh │ Mnt │ Drv │ Trp │ Ful │ Inc │ Cmp │ Dsp │ Rpt │ Ana │
──────────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────│
Fleet Manager     │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │
Maintenance Team  │  ✓  │  ✓  │  ✗  │  ✗  │  ✗  │  ✓  │  ✗  │  ✗  │  ✗  │  ✗  │
Driver            │  ✓* │  ✗  │  ✗  │  ✓* │  ✓* │  ✓* │  ✗  │  ✗  │  ✗  │  ✗  │
Administration    │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │
Client Liaison    │  ✓^ │  ✗  │  ✗  │  ✗  │  ✗  │  ✗  │  ✓^ │  ✗  │  ✓^ │  ✗  │
──────────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────│

Legend:
  ✓  = Full Access
  ✓* = Own Data Only
  ✓^ = Client-Scoped Only
  ✗  = No Access

Modules:
  Veh = Vehicles          Mnt = Maintenance     Drv = Drivers
  Trp = Trips             Ful = Fuel Tracking   Inc = Incidents
  Cmp = Compliance        Dsp = Disposal        Rpt = Reports
  Ana = Analytics

┌─────────────────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Layer 1: UI/Navigation                                               │
│ ───────────────────────────────────────────────────────────────────│
│ • Navigation menu filtered by role                                  │
│ • Only accessible modules shown                                     │
│ • Buttons/actions hidden if no permission                           │
│ • Role badge displayed                                              │
│                                                                      │
│ Files: App.tsx, ProtectedRoute.tsx                                  │
└─────────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Layer 2: Component/Route                                             │
│ ───────────────────────────────────────────────────────────────────│
│ • ProtectedRoute wrapper validates access                           │
│ • Shows "Access Denied" if unauthorized                             │
│ • ConditionalRender hides elements                                  │
│ • useRoleAccess hook provides permission checks                     │
│                                                                      │
│ Files: ProtectedRoute.tsx, useRoleAccess.ts                         │
└─────────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Layer 3: Database/RLS                                                │
│ ───────────────────────────────────────────────────────────────────│
│ • Row Level Security policies on all tables                         │
│ • Helper functions validate role                                    │
│ • Data filtered by role and user_id                                 │
│ • Cannot bypass with client manipulation                            │
│                                                                      │
│ Files: create_role_based_access_control.sql                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            FILE STRUCTURE                                    │
└─────────────────────────────────────────────────────────────────────────────┘

src/
├── config/
│   └── rolePermissions.ts ········· Role definitions, permissions matrix
├── hooks/
│   └── useRoleAccess.ts ·········· React hook for role access
├── components/
│   └── ProtectedRoute.tsx ········ Route protection components
├── services/
│   └── authService.ts ············ Enhanced auth with role fetching
└── App.tsx ··················· Main app with route protection

migrations/
└── create_role_based_access_control.sql ··· Database setup

docs/
├── RBAC_IMPLEMENTATION_GUIDE.md ····· Complete guide
├── RBAC_QUICK_REFERENCE.md ········· Quick reference
├── RBAC_SETUP_CHECKLIST.md ········· Setup checklist
└── RBAC_IMPLEMENTATION_SUMMARY.md ··· This summary

┌─────────────────────────────────────────────────────────────────────────────┐
│                          IMPLEMENTATION STATUS                               │
└─────────────────────────────────────────────────────────────────────────────┘

✅ Configuration System ············ Complete
✅ Role Access Hook ··············· Complete
✅ Protected Route Components ······ Complete
✅ Enhanced Auth Service ·········· Complete
✅ App Integration ················ Complete
✅ Database Migration ············· Complete
✅ RLS Policies ··················· Complete
✅ Helper Functions ··············· Complete
✅ Documentation ·················· Complete
✅ Build Verification ············· Complete

Status: ✅ READY FOR DEPLOYMENT
