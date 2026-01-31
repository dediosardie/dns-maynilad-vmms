import { Vehicle } from '../types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button } from './ui';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onDispose: (id: string) => void;
  onEdit: (vehicle: Vehicle) => void;
}

export default function VehicleTable({ vehicles, onDispose, onEdit }: VehicleTableProps) {
  const handleDispose = (vehicle: Vehicle) => {
    if (window.confirm(`Are you sure you want to dispose vehicle ${vehicle.plate_number}?`)) {
      onDispose(vehicle.id);
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg-elevated mb-4">
          <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-text-primary mb-1">No vehicles found</h3>
        <p className="text-text-secondary">Get started by adding your first vehicle to the fleet</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Plate Number</TableHead>
          <TableHead>Conduction #</TableHead>
          <TableHead>Make</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>Variant</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>VIN</TableHead>
          <TableHead>Fuel Capacity</TableHead>
          <TableHead>Ownership Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Insurance Expiry</TableHead>
          <TableHead>Registration Expiry</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.map((vehicle) => (
          <TableRow
            key={vehicle.id}
            className="cursor-pointer"
            onDoubleClick={() => onEdit(vehicle)}
            title="Double-click to edit"
          >
            <TableCell className="font-medium">
              {vehicle.plate_number}
            </TableCell>
            <TableCell className="font-mono">
              {vehicle.conduction_number || '-'}
            </TableCell>
            <TableCell>
              {vehicle.make}
            </TableCell>
            <TableCell>
              {vehicle.model}
            </TableCell>
            <TableCell>
              {vehicle.variant || '-'}
            </TableCell>
            <TableCell>
              {vehicle.year}
            </TableCell>
            <TableCell className="font-mono">
              {vehicle.vin}
            </TableCell>
            <TableCell>
              {vehicle.fuel_capacity ? `${vehicle.fuel_capacity} L` : '-'}
            </TableCell>
            <TableCell className="capitalize">
              {vehicle.ownership_type}
            </TableCell>
            <TableCell>
              <Badge variant={
                vehicle.status === 'active' ? 'success' :
                vehicle.status === 'maintenance' ? 'warning' :
                'default'
              }>
                {vehicle.status}
              </Badge>
            </TableCell>
            <TableCell>
              {vehicle.insurance_expiry}
            </TableCell>
            <TableCell>
              {vehicle.registration_expiry}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                onClick={() => onEdit(vehicle)}
                variant="ghost"
                size="sm"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDispose(vehicle)}
                variant="ghost"
                size="sm"
              >
                Dispose
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
