import { Vehicle } from '../types';

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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">No vehicles found</h3>
        <p className="text-slate-600">Get started by adding your first vehicle to the fleet</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Plate Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Make
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                VIN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Ownership Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Insurance Expiry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Registration Expiry
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {vehicle.plate_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {vehicle.make}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {vehicle.model}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {vehicle.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-mono">
                  {vehicle.vin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 capitalize">
                  {vehicle.ownership_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    vehicle.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                    vehicle.status === 'maintenance' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {vehicle.insurance_expiry}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {vehicle.registration_expiry}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-3">
                  <button
                    onClick={() => onEdit(vehicle)}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDispose(vehicle)}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Dispose
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
