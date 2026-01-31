# UI Components - Standard Formatting Guide

This document outlines the standard UI components for the Vehicle Management System, following the SGS Dark Theme design system.

## Component Library

All standard UI components are located in `src/components/ui/` and follow the dark theme color palette.

### Button Component

**Import:**
```tsx
import { Button } from '@/components/ui';
```

**Variants:**
- `primary` - Orange accent background (default)
- `secondary` - Dark background with border
- `ghost` - Transparent background
- `danger` - Orange accent (for destructive actions)

**Sizes:**
- `sm` - Small (px-3 py-1.5)
- `md` - Medium (px-4 py-2) [default]
- `lg` - Large (px-6 py-3)

**Usage:**
```tsx
<Button variant="primary" size="md">
  Save Changes
</Button>

<Button variant="secondary">
  Cancel
</Button>

<Button variant="ghost" size="sm">
  Learn More
</Button>
```

---

### Input Component

**Import:**
```tsx
import { Input } from '@/components/ui';
```

**Features:**
- Dark theme styling
- Optional label
- Error state with message
- Focus ring in accent color

**Usage:**
```tsx
<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  error="Please enter a valid email"
/>
```

---

### Select Component

**Import:**
```tsx
import { Select } from '@/components/ui';
```

**Features:**
- Dark theme styling
- Optional label
- Error state
- Array-based options or children

**Usage:**
```tsx
<Select
  label="Status"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]}
/>
```

---

### Card Components

**Import:**
```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui';
```

**Features:**
- Dark background
- Elevated variant for modals/overlays
- Subcomponents for header, content, footer

**Usage:**
```tsx
<Card elevated>
  <CardHeader>
    <h2 className="text-xl font-semibold text-text-primary">Title</h2>
  </CardHeader>
  <CardContent>
    <p className="text-text-secondary">Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

### Badge Component

**Import:**
```tsx
import { Badge } from '@/components/ui';
```

**Variants:**
- `default` - Gray
- `accent` - Orange
- `success` - Green
- `warning` - Yellow
- `danger` - Red/Orange

**Usage:**
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="accent">New</Badge>
```

---

### Table Components

**Import:**
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';
```

**Features:**
- Dark theme styling
- Hover effects on rows
- Consistent spacing

**Usage:**
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell><Badge variant="success">Active</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Color System Reference

### Backgrounds
- `bg-bg-primary` - #0B0B0B (main background)
- `bg-bg-secondary` - #121212 (cards, panels)
- `bg-bg-elevated` - #1A1A1A (modals, dropdowns)

### Text
- `text-text-primary` - #E5E5E5 (headings)
- `text-text-secondary` - #B3B3B3 (body text)
- `text-text-muted` - #8A8A8A (labels, hints)
- `text-text-disabled` - #5A5A5A (disabled)

### Accents
- `bg-accent` - #F97316 (primary actions)
- `bg-accent-hover` - #FB923C (hover state)
- `bg-accent-soft` - rgba(249,115,22,0.12) (subtle backgrounds)

### Borders
- `border-border-muted` - #2A2A2A (all borders)

---

## Design Principles

1. **Dark-First**: All components use dark backgrounds by default
2. **Restrained Accent**: Orange color only for primary actions and active states
3. **Subtle Transitions**: All interactions use 200ms transitions
4. **High Contrast**: Text colors ensure readability
5. **Consistent Spacing**: Use Tailwind spacing scale (4, 8, 16, 24px)
6. **Professional**: Enterprise-grade, operational focus

---

## Migration Guide

To update existing components:

1. Replace inline button styles with `<Button>` component
2. Replace form inputs with `<Input>` and `<Select>` components
3. Wrap content sections with `<Card>` components
4. Use `<Badge>` for status indicators
5. Replace table markup with `<Table>` components

**Before:**
```tsx
<button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
  Save
</button>
```

**After:**
```tsx
<Button variant="primary">Save</Button>
```
