// Trip Table Component - Defined per trip-scheduling-module.md
import { Trip, Vehicle, Driver } from '../types';

interface TripTableProps {
  trips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onEdit: (trip: Trip) => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  onViewRoute: (trip: Trip) => void;
}

export default function TripTable({ 
  trips, 
  vehicles, 
  drivers, 
  onEdit, 
  onStart, 
  onComplete, 
  onCancel,
  onViewRoute 
}: TripTableProps) {
  // Helper functions to display related data
  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.plate_number}` : 'N/A';
  };

  const getDriverInfo = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.full_name : 'N/A';
  };

  // Action: Start Trip (success, updates status to in_progress, records actual_departure)
  const handleStart = (trip: Trip) => {
    if (window.confirm(`Start trip to ${trip.destination}?`)) {
      onStart(trip.id);
    }
  };

  // Action: Complete Trip (success, updates status to completed, records actual_arrival)
  const handleComplete = (trip: Trip) => {
    if (window.confirm(`Mark trip to ${trip.destination} as completed?`)) {
      onComplete(trip.id);
    }
  };

  // Action: Cancel Trip (danger, confirmation required)
  const handleCancel = (trip: Trip) => {
    if (window.confirm(`Are you sure you want to cancel this trip to ${trip.destination}?`)) {
      onCancel(trip.id);
    }
  };

  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">No trips scheduled</h3>
        <p className="text-slate-600">Get started by creating your first trip</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {/* Columns match Trip Table definition in markdown */}
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Origin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Destination
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Planned Departure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Planned Arrival
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Distance (km)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {trips.map((trip) => (
              <tr key={trip.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {getVehicleInfo(trip.vehicle_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {getDriverInfo(trip.driver_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {trip.origin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {trip.destination}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {new Date(trip.planned_departure).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {new Date(trip.planned_arrival).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {/* Status enum(planned, in_progress, completed, cancelled) */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    trip.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                    trip.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                    trip.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {trip.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {trip.distance_km.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {/* Actions based on status per markdown */}
                  {trip.status === 'planned' && (
                    <>
                      {/* Update Trip (primary, submit) */}
                      <button
                        onClick={() => onEdit(trip)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Edit"
                      >
                        Edit
                      </button>
                      {/* Start Trip (success) */}
                      <button
                        onClick={() => handleStart(trip)}
                        className="text-emerald-600 hover:text-emerald-900 transition-colors"
                        title="Start Trip"
                      >
                        Start
                      </button>
                      {/* Cancel Trip (danger) */}
                      <button
                        onClick={() => handleCancel(trip)}
                        className="text-slate-600 hover:text-slate-900 transition-colors"
                        title="Cancel"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {trip.status === 'in_progress' && (
                    <>
                      {/* Complete Trip (success) */}
                      <button
                        onClick={() => handleComplete(trip)}
                        className="text-emerald-600 hover:text-emerald-900 transition-colors"
                        title="Complete Trip"
                      >
                        Complete
                      </button>
                      {/* View Route Map (secondary) */}
                      <button
                        onClick={() => onViewRoute(trip)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View Route"
                      >
                        Route
                      </button>
                    </>
                  )}
                  {(trip.status === 'completed' || trip.status === 'cancelled') && (
                    <button
                      onClick={() => onViewRoute(trip)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View Details"
                    >
                      View
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
