# Quick Start Guide - Implementing Remaining Modules

## Overview

This guide shows you how to quickly implement the remaining modules using the established patterns.

## Pattern: Module Implementation

Every module follows this structure:

```typescript
import { useState, useEffect } from 'react';
import { YourType } from '../types';
import Modal from './Modal';
import { yourService } from '../services/supabaseService';

export default function YourModule() {
  // 1. STATE MANAGEMENT
  const [items, setItems] = useState<YourType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<YourType | undefined>();

  // 2. DATA LOADING
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await yourService.getAll();
      setItems(data);
    } catch (error: any) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. CRUD OPERATIONS
  const handleCreate = async (data: Omit<YourType, 'id'>) => {
    try {
      const newItem = await yourService.create(data);
      setItems([newItem, ...items]);
      setIsModalOpen(false);
    } catch (error: any) {
      alert(error.message || 'Failed to create');
    }
  };

  const handleUpdate = async (item: YourType) => {
    try {
      const updated = await yourService.update(item.id, item);
      setItems(items.map(i => i.id === updated.id ? updated : i));
      setIsModalOpen(false);
      setEditingItem(undefined);
    } catch (error: any) {
      alert(error.message || 'Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await yourService.delete(id);
      setItems(items.filter(i => i.id !== id));
    } catch (error: any) {
      alert(error.message || 'Failed to delete');
    }
  };

  // 4. UI RENDER
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {/* Table/List */}
      {/* Modal Form */}
    </div>
  );
}
```

## Trip Module Implementation

**File**: `src/components/TripModule.tsx`

### Key Changes Needed:

1. **Replace localStorage with Supabase**:
```typescript
// BEFORE
import { tripStorage } from '../storage';
const trips = await tripStorage.getAll();

// AFTER
import { tripService, vehicleService, driverService } from '../services/supabaseService';
const trips = await tripService.getAll();
```

2. **Add Status Workflow**:
```typescript
const handleStartTrip = async (id: string) => {
  try {
    const updated = await tripService.startTrip(id);
    setTrips(trips.map(t => t.id === id ? updated : t));
  } catch (error: any) {
    alert(error.message);
  }
};

const handleCompleteTrip = async (id: string) => {
  try {
    const updated = await tripService.completeTrip(id);
    setTrips(trips.map(t => t.id === id ? updated : t));
  } catch (error: any) {
    alert(error.message);
  }
};
```

3. **Add Validation**:
```typescript
// Check vehicle availability
const isVehicleAvailable = async (vehicleId: string, departureTime: string) => {
  const activeTrips = await tripService.getAll();
  return !activeTrips.some(t => 
    t.vehicle_id === vehicleId && 
    t.status === 'in_progress'
  );
};
```

## Fuel Tracking Module Implementation

**File**: `src/components/FuelTrackingModule.tsx`

### Key Changes:

1. **Load Transactions**:
```typescript
const loadData = async () => {
  const [transactions, metrics] = await Promise.all([
    fuelService.getAllTransactions(),
    fuelService.getEfficiencyMetrics()
  ]);
  setTransactions(transactions);
  setMetrics(metrics);
};
```

2. **Add Efficiency Calculation**:
```typescript
const calculateEfficiency = (transaction: FuelTransaction, previous: FuelTransaction) => {
  const distance = transaction.odometer_reading - previous.odometer_reading;
  const consumption = (transaction.liters / distance) * 100;
  return consumption;
};
```

3. **Add Anomaly Detection**:
```typescript
const detectAnomaly = (consumption: number, baseline: number) => {
  const variance = ((consumption - baseline) / baseline) * 100;
  if (variance > 20) {
    alert('Warning: Fuel consumption 20% above baseline');
  }
};
```

## Incident & Insurance Module Implementation

**File**: `src/components/IncidentInsuranceModule.tsx`

### Key Changes:

1. **Load Incidents and Claims**:
```typescript
const loadData = async () => {
  const [incidents, claims] = await Promise.all([
    incidentService.getAll(),
    insuranceService.getAllClaims()
  ]);
  setIncidents(incidents);
  setClaims(claims);
};
```

2. **Add Photo Upload**:
```typescript
const handlePhotoUpload = async (incidentId: string, file: File) => {
  try {
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('incident-photos')
      .upload(`${incidentId}/${file.name}`, file);
    
    if (error) throw error;
    
    // Save photo reference
    await incidentService.uploadPhoto({
      incident_id: incidentId,
      photo_url: data.path,
      uploaded_by: 'current_user_id'
    });
  } catch (error: any) {
    alert('Failed to upload photo');
  }
};
```

3. **File Insurance Claim**:
```typescript
const handleFileClaim = async (incidentId: string, claimData: any) => {
  try {
    const claim = await insuranceService.createClaim({
      incident_id: incidentId,
      ...claimData,
      status: 'filed'
    });
    setClaims([claim, ...claims]);
  } catch (error: any) {
    alert('Failed to file claim');
  }
};
```

## Vehicle Disposal Module Implementation

**File**: `src/components/VehicleDisposalModule.tsx`

### Key Changes:

1. **Load Disposal Requests**:
```typescript
const loadData = async () => {
  const requests = await disposalService.getAllRequests();
  setRequests(requests);
};
```

2. **Create Auction**:
```typescript
const handleCreateAuction = async (disposalId: string, auctionData: any) => {
  try {
    const auction = await disposalService.createAuction({
      disposal_id: disposalId,
      ...auctionData,
      auction_status: 'scheduled'
    });
    // Reload auctions
  } catch (error: any) {
    alert('Failed to create auction');
  }
};
```

3. **Place Bid**:
```typescript
const handlePlaceBid = async (auctionId: string, bidAmount: number) => {
  try {
    await disposalService.placeBid({
      auction_id: auctionId,
      bidder_name: 'Bidder Name',
      bidder_contact: 'Contact',
      bid_amount: bidAmount,
      is_valid: true
    });
    // Reload bids
  } catch (error: any) {
    alert('Failed to place bid');
  }
};
```

## Reporting & Analytics Dashboard Implementation

**File**: `src/components/ReportingAnalyticsDashboard.tsx`

### Key Changes:

1. **Aggregate Data from All Services**:
```typescript
const loadMetrics = async () => {
  const [vehicles, maintenance, trips, fuel, incidents, documents] = await Promise.all([
    vehicleService.getAll(),
    maintenanceService.getAll(),
    tripService.getAll(),
    fuelService.getAllTransactions(),
    incidentService.getAll(),
    documentService.getAll()
  ]);

  // Calculate KPIs
  const metrics = {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter(v => v.status === 'active').length,
    maintenanceCount: maintenance.filter(m => m.status === 'pending').length,
    totalTrips: trips.length,
    totalFuelCost: fuel.reduce((sum, f) => sum + f.cost, 0),
    incidentCount: incidents.length,
    complianceRate: (documents.filter(d => d.status === 'active').length / documents.length) * 100
  };

  setMetrics(metrics);
};
```

2. **Create Chart Data**:
```typescript
const createChartData = (data: any[]) => {
  return {
    labels: data.map(d => d.label),
    datasets: [{
      label: 'Series 1',
      data: data.map(d => d.value),
      backgroundColor: 'rgba(239, 68, 68, 0.5)',
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 1
    }]
  };
};
```

## Common Patterns

### Loading State
```typescript
{isLoading ? (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
  </div>
) : (
  /* Content */
)}
```

### Error Display
```typescript
{error && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <p className="text-sm text-red-800">{error}</p>
  </div>
)}
```

### Empty State
```typescript
{items.length === 0 ? (
  <div className="text-center py-12">
    <p className="text-slate-500">No items found</p>
    <button onClick={handleAdd} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">
      Add First Item
    </button>
  </div>
) : (
  /* Table/List */
)}
```

### Confirmation Dialog
```typescript
if (!confirm('Are you sure you want to delete this item?')) {
  return;
}
```

### Date Formatting
```typescript
new Date(dateString).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
})
```

### Status Badge
```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-emerald-100 text-emerald-800';
    case 'pending': return 'bg-amber-100 text-amber-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
  {status}
</span>
```

## Testing Checklist

For each module:

- [ ] Load data from Supabase
- [ ] Create new record
- [ ] Edit existing record
- [ ] Delete record
- [ ] Filter/search functionality
- [ ] Sort functionality
- [ ] Validation messages
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states
- [ ] Confirmation dialogs
- [ ] Success messages

## Common Issues & Solutions

### Issue: "Cannot read property of undefined"
**Solution**: Add optional chaining
```typescript
// BEFORE
const name = vehicle.make + ' ' + vehicle.model;

// AFTER
const name = `${vehicle?.make || ''} ${vehicle?.model || ''}`.trim();
```

### Issue: "Network request failed"
**Solution**: Check Supabase connection
```typescript
// Test connection
const { data, error } = await supabase.from('vehicles').select('count');
if (error) console.error('Connection error:', error);
```

### Issue: "Row Level Security policy violation"
**Solution**: Update RLS policies in Supabase
```sql
-- Allow all operations for testing
CREATE POLICY "Allow all for authenticated users" 
ON table_name FOR ALL 
TO authenticated 
USING (true);
```

### Issue: "Type mismatch"
**Solution**: Ensure types.ts matches database schema exactly
```typescript
// Check column names match
interface Vehicle {
  plate_number: string; // NOT plateNumber
  ...
}
```

## Performance Tips

1. **Batch Requests**:
```typescript
const [vehicles, drivers] = await Promise.all([
  vehicleService.getAll(),
  driverService.getAll()
]);
```

2. **Memoize Calculations**:
```typescript
const metrics = useMemo(() => calculateMetrics(data), [data]);
```

3. **Debounce Search**:
```typescript
const debouncedSearch = debounce((term: string) => {
  search(term);
}, 300);
```

## Next Steps

1. Copy pattern from VehicleModule.tsx
2. Replace storage calls with service calls
3. Add module-specific business logic
4. Test CRUD operations
5. Add filters and sorting
6. Implement special features (workflows, calculations, etc.)

---

**Need Help?**
- Review `VehicleModule.tsx` for complete example
- Check `supabaseService.ts` for available methods
- Refer to markdown rules in `src/rules/` folder
