// Fuel Transaction Table - Defined per fuel-tracking-module.md
import { FuelTransaction, Vehicle, Driver } from '../types';
// Format number with thousand separators
const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Format currency with Php prefix
const formatCurrency = (amount: number): string => {
  return `Php ${formatNumber(amount, 2)}`;
};
interface FuelTransactionTableProps {
  transactions: FuelTransaction[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onEdit: (transaction: FuelTransaction) => void;
  onDelete: (id: string) => void;
  onViewEfficiency: () => void;
}

export default function FuelTransactionTable({ 
  transactions, 
  vehicles, 
  drivers, 
  onEdit, 
  onDelete
}: FuelTransactionTableProps) {
  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.plate_number}${vehicle.conduction_number ? ` (${vehicle.conduction_number})` : ''}` : 'N/A';
  };

  const getDriverInfo = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.full_name : 'N/A';
  };

  // Action: Delete Transaction (danger, confirmation required)
  const handleDelete = (transaction: FuelTransaction) => {
    if (window.confirm(`Delete fuel transaction for ${getVehicleInfo(transaction.vehicle_id)}?`)) {
      onDelete(transaction.id);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">No fuel transactions</h3>
        <p className="text-slate-600">Start tracking fuel usage by adding transactions</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {/* Columns per Fuel Transaction Table definition */}
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Odometer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Liters
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Cost/L
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Fuel Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Station
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {getVehicleInfo(transaction.vehicle_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {getDriverInfo(transaction.driver_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {formatNumber(transaction.odometer_reading, 0)} km
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {formatNumber(transaction.liters, 2)} L
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {formatCurrency(transaction.cost)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {formatCurrency(transaction.cost_per_liter)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.fuel_type === 'diesel' ? 'bg-amber-100 text-amber-800' :
                    transaction.fuel_type === 'petrol' ? 'bg-blue-100 text-blue-800' :
                    transaction.fuel_type === 'electric' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {transaction.fuel_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {transaction.station_name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {/* Action: Update Transaction (primary) */}
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Edit
                  </button>
                  {/* Action: Delete Transaction (danger, confirmation required) */}
                  <button
                    onClick={() => handleDelete(transaction)}
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Delete
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
