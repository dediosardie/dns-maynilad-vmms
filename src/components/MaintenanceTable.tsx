import { Maintenance } from '../types';

interface MaintenanceTableProps {
  maintenances: Maintenance[];
  vehicles: Array<{ id: string; plate_number: string }>;
  onMarkCompleted: (id: string) => void;
  onEdit: (maintenance: Maintenance) => void;
}

export default function MaintenanceTable({ maintenances, vehicles, onMarkCompleted, onEdit }: MaintenanceTableProps) {
  const getVehiclePlate = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle?.plate_number || 'N/A';
  };

  if (maintenances.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">No maintenance records</h3>
        <p className="text-slate-600">Schedule your first maintenance task</p>
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
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Maintenance Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Scheduled Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {maintenances.map((maintenance) => (
              <tr key={maintenance.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {getVehiclePlate(maintenance.vehicle_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 capitalize">
                  {maintenance.maintenance_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {maintenance.scheduled_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    maintenance.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {maintenance.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-mono">
                  {maintenance.cost ? `$${maintenance.cost.toFixed(2)}` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-3">
                  <button
                    onClick={() => onEdit(maintenance)}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  {maintenance.status === 'pending' && (
                    <button
                      onClick={() => onMarkCompleted(maintenance.id)}
                      className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
