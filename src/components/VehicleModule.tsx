import { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import VehicleTable from './VehicleTable';
import VehicleForm from './VehicleForm';
import Modal from './Modal';
import { vehicleStorage } from '../storage';

export default function VehicleModule() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load vehicles from storage on mount
    const loadVehicles = async () => {
      try {
        setIsLoading(true);
        const storedVehicles = await vehicleStorage.getAll();
        console.log('Loaded vehicles:', storedVehicles);
        setVehicles(storedVehicles);
      } catch (error) {
        console.error('Error loading vehicles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadVehicles();
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('vehiclesUpdated', { detail: vehicles }));
  }, [vehicles]);

  const handleSaveVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: crypto.randomUUID(),
    };
    try {
      setIsModalOpen(false);
      await vehicleStorage.save(newVehicle);
      setVehicles([...vehicles, newVehicle]);
    } catch (error) {
      console.error('Failed to save vehicle:', error);
      alert('Failed to save vehicle. Please try again.');
    }
  };

  const handleUpdateVehicle = async (vehicle: Vehicle) => {
    try {
      await vehicleStorage.update(vehicle);
      setVehicles(vehicles.map(v => v.id === vehicle.id ? vehicle : v));
      setIsModalOpen(false);
      setEditingVehicle(undefined);
    } catch (error) {
      console.error('Failed to update vehicle:', error);
      alert('Failed to update vehicle. Please try again.');
    }
  };

  const handleDisposeVehicle = async (id: string) => {
    try {
      await vehicleStorage.delete(id);
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (error) {
      console.error('Failed to dispose vehicle:', error);
      alert('Failed to dispose vehicle. Please try again.');
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleAddVehicle = () => {
    setEditingVehicle(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{vehicles.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{vehicles.filter(v => v.status === 'active').length}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Maintenance</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{vehicles.filter(v => v.status === 'maintenance').length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Disposed</p>
              <p className="text-2xl font-bold text-slate-600 mt-1">{vehicles.filter(v => v.status === 'disposed').length}</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Vehicle Fleet</h2>
            <p className="text-sm text-slate-600 mt-1">Manage and monitor your vehicle inventory</p>
          </div>
          <button
            onClick={handleAddVehicle}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg font-medium text-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Vehicle
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="text-slate-600 mt-4">Loading vehicles...</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <VehicleTable
              vehicles={vehicles}
              onDispose={handleDisposeVehicle}
              onEdit={handleEditVehicle}
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
      >
        <VehicleForm
          onSave={handleSaveVehicle}
          onUpdate={handleUpdateVehicle}
          initialData={editingVehicle}
        />
      </Modal>
    </div>
  );
}
