# Vehicle Maintenance Management System

A professional vehicle fleet management system built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Vehicle Management
- Add, edit, and dispose vehicles
- Track vehicle details (plate, make, model, year, VIN)
- Monitor ownership type and status
- Track insurance and registration expiry dates

### Driver Management
- Maintain driver records
- Track license information and expiry
- Suspend drivers when needed

### Maintenance Scheduling
- Schedule preventive and repair maintenance
- Track maintenance status and costs
- Link maintenance to specific vehicles

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS (enterprise-grade design)
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `SUPABASE_SETUP.md` in your Supabase SQL Editor
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── VehicleModule.tsx
│   ├── VehicleForm.tsx
│   ├── VehicleTable.tsx
│   ├── DriverModule.tsx
│   ├── DriverForm.tsx
│   ├── DriverTable.tsx
│   ├── MaintenanceModule.tsx
│   ├── MaintenanceForm.tsx
│   └── MaintenanceTable.tsx
├── types.ts            # TypeScript type definitions
├── storage.ts          # Database operations
├── supabaseClient.ts   # Supabase configuration
├── database.types.ts   # Database type definitions
├── theme.css           # Global theme variables
└── App.tsx             # Main application component
```

## Database Schema

The application uses three main tables:
- `vehicles` - Vehicle fleet records
- `drivers` - Driver information
- `maintenance` - Maintenance scheduling and tracking

See `SUPABASE_SETUP.md` for the complete schema and setup instructions.

## Design System

- **Color Palette**: Professional blue with neutral backgrounds
- **Typography**: System font stack for optimal readability
- **Components**: Enterprise-grade UI with consistent spacing and styling
- **Layout**: Sidebar navigation with tabbed content areas

## Rules-Driven Implementation

This system is implemented strictly according to specifications defined in:
- `src/rules/vehicle-module.md`
- `src/rules/driver-module.md`
- `src/rules/maintenance-module.md`
- `src/rules/DASHBOARD LAYOUT RULE.md`
- `src/rules/tailwind-governance.md`

All tables, forms, actions, and layouts match these specifications exactly.
