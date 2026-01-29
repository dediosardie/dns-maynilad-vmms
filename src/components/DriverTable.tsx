import { Driver } from '../types';

interface DriverTableProps {
  drivers: Driver[];
  onSuspend: (id: string) => void;
  onEdit: (driver: Driver) => void;
}

export default function DriverTable({ drivers, onSuspend, onEdit }: DriverTableProps) {
  const handleSuspend = (driver: Driver) => {
    if (window.confirm(`Are you sure you want to suspend driver ${driver.full_name}?`)) {
      onSuspend(driver.id);
    }
  };

  if (drivers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">No drivers found</h3>
        <p className="text-slate-600">Add your first driver to get started</p>
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
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                License Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                License Expiry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {drivers.map((driver) => (
              <tr key={driver.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {driver.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-mono">
                  {driver.license_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {driver.license_expiry}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    driver.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {driver.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-3">
                  <button
                    onClick={() => onEdit(driver)}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleSuspend(driver)}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Suspend
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
