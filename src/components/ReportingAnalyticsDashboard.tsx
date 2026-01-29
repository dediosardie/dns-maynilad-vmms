// Reporting & Analytics Dashboard - Defined per reporting-analytics-module.md
import { useState, useEffect } from 'react';
import { Vehicle, Driver, Maintenance, Trip, FuelTransaction, Incident } from '../types';

export default function ReportingAnalyticsDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
  const [trips] = useState<Trip[]>([]);
  const [fuelTransactions] = useState<FuelTransaction[]>([]);
  const [incidents] = useState<Incident[]>([]);
  const [selectedReport, setSelectedReport] = useState<string>('dashboard');

  useEffect(() => {
    const handleVehiclesUpdate = ((event: CustomEvent) => setVehicles(event.detail)) as EventListener;
    const handleDriversUpdate = ((event: CustomEvent) => setDrivers(event.detail)) as EventListener;
    const handleMaintenanceUpdate = ((event: CustomEvent) => setMaintenanceRecords(event.detail)) as EventListener;
    
    window.addEventListener('vehiclesUpdated', handleVehiclesUpdate);
    window.addEventListener('driversUpdated', handleDriversUpdate);
    window.addEventListener('maintenanceUpdated', handleMaintenanceUpdate);
    
    return () => {
      window.removeEventListener('vehiclesUpdated', handleVehiclesUpdate);
      window.removeEventListener('driversUpdated', handleDriversUpdate);
      window.removeEventListener('maintenanceUpdated', handleMaintenanceUpdate);
    };
  }, []);

  // Calculate Fleet Performance KPIs per markdown Section 1.1
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const utilizationRate = totalVehicles > 0 ? ((activeVehicles / totalVehicles) * 100).toFixed(1) : '0';
  const averageAge = vehicles.length > 0
    ? (vehicles.reduce((sum, v) => sum + (new Date().getFullYear() - v.year), 0) / vehicles.length).toFixed(1)
    : '0';
  const totalMileage = 0; // Mileage tracking would need to be added to Vehicle type

  // Calculate Maintenance KPIs per markdown Section 1.2
  const scheduledMaintenance = maintenanceRecords.filter(m => m.status === 'pending').length;
  const inProgressMaintenance = 0; // Would need in_progress status in Maintenance type
  const completedMaintenance = maintenanceRecords.filter(m => m.status === 'completed').length;
  const totalMaintenanceCost = maintenanceRecords.reduce((sum, m) => sum + (m.cost || 0), 0);
  const averageMaintenanceCost = maintenanceRecords.length > 0
    ? (totalMaintenanceCost / maintenanceRecords.length).toFixed(2)
    : '0';
  const costPerVehicle = totalVehicles > 0 ? (totalMaintenanceCost / totalVehicles).toFixed(2) : '0';

  // Calculate Driver Performance KPIs per markdown Section 1.3
  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const availableDrivers = activeDrivers; // Simplified: using active drivers

  // Calculate Fuel Efficiency KPIs per markdown Section 1.4
  const totalFuelCost = fuelTransactions.reduce((sum, f) => sum + (f.cost || 0), 0);
  const totalLiters = fuelTransactions.reduce((sum, f) => sum + (f.liters || 0), 0);
  const averageCostPerLiter = totalLiters > 0 ? (totalFuelCost / totalLiters).toFixed(2) : '0';

  // Calculate Trip Analytics KPIs per markdown Section 1.8
  const totalTrips = trips.length;
  const completedTrips = trips.filter(t => t.status === 'completed').length;
  const totalDistance = trips.reduce((sum, t) => sum + (t.distance_km || 0), 0);
  const averageTripDistance = totalTrips > 0 ? (totalDistance / totalTrips).toFixed(1) : '0';

  // Calculate Incident KPIs per markdown Section 1.5
  const totalIncidents = incidents.length;
  const criticalIncidents = incidents.filter(i => i.severity === 'critical').length;
  const severeIncidents = incidents.filter(i => i.severity === 'severe').length;
  const incidentRate = totalTrips > 0 ? ((totalIncidents / totalTrips) * 100).toFixed(2) : '0';

  // Calculate Financial KPIs per markdown Section 1.7
  const totalOperatingCost = totalMaintenanceCost + totalFuelCost;
  const costPerKm = totalDistance > 0 ? (totalOperatingCost / totalDistance).toFixed(2) : '0';
  const costPerVehiclePerMonth = totalVehicles > 0 ? (totalOperatingCost / totalVehicles / 12).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      {/* Report Type Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Report types per markdown Section 2 */}
          {[
            { id: 'dashboard', label: 'Dashboard Overview' },
            { id: 'fleet', label: 'Fleet Performance' },
            { id: 'maintenance', label: 'Maintenance Report' },
            { id: 'driver', label: 'Driver Performance' },
            { id: 'fuel', label: 'Fuel Efficiency' },
            { id: 'incident', label: 'Incident Report' },
            { id: 'financial', label: 'Financial Report' },
            { id: 'trip', label: 'Trip Analysis' },
          ].map(report => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                selectedReport === report.id
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {report.label}
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Widgets per markdown Section 3.1 */}
      {selectedReport === 'dashboard' && (
        <>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Real-Time Fleet Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Widget 1: Active Vehicles */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Vehicles</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{activeVehicles}/{totalVehicles}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Widget 2: Scheduled Maintenance */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Scheduled Maintenance</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{scheduledMaintenance}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Widget 3: Available Drivers */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Available Drivers</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{availableDrivers}/{totalDrivers}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Widget 4: Today's Fuel Cost */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Fuel Cost</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">${totalFuelCost.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics Widgets per markdown Section 3.2 */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Widget 5: Fleet Utilization Rate */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Fleet Utilization Rate</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{utilizationRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Widget 6: Average Maintenance Cost */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Maintenance Cost</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">${averageMaintenanceCost}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Widget 7: Fuel Efficiency */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Cost Per Liter</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">${averageCostPerLiter}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparative Metrics Widgets per markdown Section 3.3 */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Operational Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Widget 8: Total Mileage */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Mileage</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{totalMileage.toLocaleString()} km</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Widget 9: Total Incidents */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Incidents</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{totalIncidents}</p>
                    <p className="text-xs text-red-600 mt-1">{criticalIncidents + severeIncidents} critical/severe</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Widget 10: Completed Trips */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Completed Trips</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{completedTrips}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Widget 11: Cost Per Km */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Cost Per Km</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">${costPerKm}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Fleet Performance Report per markdown Section 2.1 */}
      {selectedReport === 'fleet' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Fleet Performance Report</h2>
            {/* Export options per markdown Section 5 */}
            <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{totalVehicles}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Active Vehicles</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{activeVehicles}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Utilization Rate</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{utilizationRate}%</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Average Age</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{averageAge} yrs</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Vehicle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Mileage</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Age</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {vehicles.map(vehicle => (
                  <tr key={vehicle.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {vehicle.plate_number} - {vehicle.make} {vehicle.model}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        vehicle.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                        vehicle.status === 'maintenance' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">N/A</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{new Date().getFullYear() - vehicle.year} yrs</td>
                    <td className="px-4 py-3 text-sm text-slate-700 capitalize">{vehicle.ownership_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Maintenance Report per markdown Section 2.2 */}
      {selectedReport === 'maintenance' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Maintenance Report</h2>
            <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Excel
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Total Cost</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">${totalMaintenanceCost.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{scheduledMaintenance}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">In Progress</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{inProgressMaintenance}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{completedMaintenance}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-slate-600">Average Cost Per Maintenance</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">${averageMaintenanceCost}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-slate-600">Cost Per Vehicle</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">${costPerVehicle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Financial Report per markdown Section 2.7 */}
      {selectedReport === 'financial' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Financial Report</h2>
            <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6">
              <p className="text-sm opacity-90">Total Operating Cost</p>
              <p className="text-3xl font-bold mt-2">${totalOperatingCost.toLocaleString()}</p>
              <p className="text-xs opacity-75 mt-1">Maintenance + Fuel</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
              <p className="text-sm opacity-90">Cost Per Kilometer</p>
              <p className="text-3xl font-bold mt-2">${costPerKm}</p>
              <p className="text-xs opacity-75 mt-1">Average across {totalDistance.toLocaleString()} km</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
              <p className="text-sm opacity-90">Cost Per Vehicle/Month</p>
              <p className="text-3xl font-bold mt-2">${costPerVehiclePerMonth}</p>
              <p className="text-xs opacity-75 mt-1">Estimated monthly average</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Maintenance</span>
                  <span className="text-lg font-bold text-slate-900">${totalMaintenanceCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Fuel</span>
                  <span className="text-lg font-bold text-slate-900">${totalFuelCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                  <span className="text-sm font-semibold text-slate-700">Total</span>
                  <span className="text-xl font-bold text-red-600">${totalOperatingCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost Distribution</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Maintenance</span>
                    <span className="font-medium">{totalOperatingCost > 0 ? ((totalMaintenanceCost / totalOperatingCost) * 100).toFixed(1) : 0}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${totalOperatingCost > 0 ? (totalMaintenanceCost / totalOperatingCost) * 100 : 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Fuel</span>
                    <span className="font-medium">{totalOperatingCost > 0 ? ((totalFuelCost / totalOperatingCost) * 100).toFixed(1) : 0}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${totalOperatingCost > 0 ? (totalFuelCost / totalOperatingCost) * 100 : 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fuel Efficiency Report per markdown Section 2.4 */}
      {selectedReport === 'fuel' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Fuel Efficiency Report</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
              <p className="text-sm text-slate-600">Total Fuel Cost</p>
              <p className="text-3xl font-bold text-amber-900 mt-2">${totalFuelCost.toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-sm text-slate-600">Total Liters</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{totalLiters.toLocaleString()} L</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
              <p className="text-sm text-slate-600">Avg Cost Per Liter</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">${averageCostPerLiter}</p>
            </div>
          </div>
        </div>
      )}

      {/* Trip Analysis Report per markdown Section 2.8 */}
      {selectedReport === 'trip' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Trip Analysis Report</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Total Trips</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{totalTrips}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{completedTrips}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Total Distance</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{totalDistance.toLocaleString()} km</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Avg Distance</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">{averageTripDistance} km</p>
            </div>
          </div>
        </div>
      )}

      {/* Incident Report per markdown Section 2.5 */}
      {selectedReport === 'incident' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Incident Report</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-sm text-slate-600">Total Incidents</p>
              <p className="text-3xl font-bold text-red-900 mt-2">{totalIncidents}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
              <p className="text-sm text-slate-600">Critical</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">{criticalIncidents}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
              <p className="text-sm text-slate-600">Severe</p>
              <p className="text-3xl font-bold text-amber-900 mt-2">{severeIncidents}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
              <p className="text-sm text-slate-600">Incident Rate</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{incidentRate}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Driver Performance Report per markdown Section 2.3 */}
      {selectedReport === 'driver' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Driver Performance Report</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Total Drivers</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{totalDrivers}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Active</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{activeDrivers}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Available</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{availableDrivers}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Driver</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">License Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Expiry Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {drivers.map(driver => (
                  <tr key={driver.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{driver.full_name}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{driver.license_number}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        driver.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {driver.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{new Date(driver.license_expiry).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
