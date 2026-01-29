// Trip Module - Defined per trip-scheduling-module.md
import { useState, useEffect } from 'react';
import { Trip, Vehicle, Driver } from '../types';
import TripTable from './TripTable';
import TripForm from './TripForm';
import Modal from './Modal';

export default function TripModule() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load data (simulated - would integrate with storage)
    setIsLoading(false);
    
    // Listen for updates from other modules
    const handleVehiclesUpdate = ((event: CustomEvent) => {
      setVehicles(event.detail);
    }) as EventListener;
    
    const handleDriversUpdate = ((event: CustomEvent) => {
      setDrivers(event.detail);
    }) as EventListener;

    window.addEventListener('vehiclesUpdated', handleVehiclesUpdate);
    window.addEventListener('driversUpdated', handleDriversUpdate);

    return () => {
      window.removeEventListener('vehiclesUpdated', handleVehiclesUpdate);
      window.removeEventListener('driversUpdated', handleDriversUpdate);
    };
  }, []);

  // Action: Create Trip (primary, submit)
  const handleSaveTrip = (tripData: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTrips([...trips, newTrip]);
    setIsModalOpen(false);
  };

  // Action: Update Trip (primary, submit)
  const handleUpdateTrip = (trip: Trip) => {
    setTrips(trips.map(t => t.id === trip.id ? trip : t));
    setIsModalOpen(false);
    setEditingTrip(undefined);
  };

  // Action: Start Trip (success, updates status to in_progress, records actual_departure)
  const handleStartTrip = (id: string) => {
    setTrips(trips.map(t => 
      t.id === id 
        ? { 
            ...t, 
            status: 'in_progress', 
            actual_departure: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } 
        : t
    ));
  };

  // Action: Complete Trip (success, updates status to completed, records actual_arrival)
  const handleCompleteTrip = (id: string) => {
    setTrips(trips.map(t => 
      t.id === id 
        ? { 
            ...t, 
            status: 'completed', 
            actual_arrival: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } 
        : t
    ));
  };

  // Action: Cancel Trip (danger, confirmation required)
  const handleCancelTrip = (id: string) => {
    setTrips(trips.map(t => 
      t.id === id 
        ? { ...t, status: 'cancelled', updated_at: new Date().toISOString() } 
        : t
    ));
  };

  // Action: View Route Map (secondary, displays visual route)
  const handleViewRoute = (trip: Trip) => {
    alert(`View route for trip from ${trip.origin} to ${trip.destination}\n(Route visualization would be implemented here)`);
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setIsModalOpen(true);
  };

  const handleAddTrip = () => {
    setEditingTrip(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrip(undefined);
  };

  // Calculate stats
  const plannedTrips = trips.filter(t => t.status === 'planned').length;
  const inProgressTrips = trips.filter(t => t.status === 'in_progress').length;
  const completedTrips = trips.filter(t => t.status === 'completed').length;
  const totalDistance = trips.reduce((sum, t) => sum + t.distance_km, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Planned Trips</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{plannedTrips}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">In Progress</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{inProgressTrips}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{completedTrips}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Distance</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{totalDistance.toFixed(0)} km</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Trip Schedule</h2>
              <p className="text-sm text-slate-600 mt-1">Manage routes and monitor trip status</p>
            </div>
            <button
              onClick={handleAddTrip}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Schedule Trip
            </button>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-2 text-slate-600">Loading trips...</p>
            </div>
          ) : (
            <TripTable
              trips={trips}
              vehicles={vehicles}
              drivers={drivers}
              onEdit={handleEditTrip}
              onStart={handleStartTrip}
              onComplete={handleCompleteTrip}
              onCancel={handleCancelTrip}
              onViewRoute={handleViewRoute}
            />
          )}
        </div>
      </div>

      {/* Modal for Create/Edit Trip */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTrip ? 'Edit Trip' : 'Schedule New Trip'}
      >
        <TripForm
          onSave={handleSaveTrip}
          onUpdate={handleUpdateTrip}
          initialData={editingTrip}
          vehicles={vehicles}
          drivers={drivers}
        />
      </Modal>
    </div>
  );
}
