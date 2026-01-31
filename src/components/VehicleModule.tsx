import { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import VehicleTable from './VehicleTable';
import VehicleForm from './VehicleForm';
import Modal from './Modal';
import { vehicleService } from '../services/supabaseService';
import { notificationService } from '../services/notificationService';
import { auditLogService } from '../services/auditLogService';
import { Button, Card, Input } from './ui';

export default function VehicleModule() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('vehiclesUpdated', { detail: vehicles }));
  }, [vehicles]);

  const loadVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setError('Failed to load vehicles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newVehicle = await vehicleService.create(vehicleData);
      setVehicles([newVehicle, ...vehicles]);
      setIsModalOpen(false);
      
      // Create notification
      notificationService.success(
        'Vehicle Added',
        `${newVehicle.plate_number} has been successfully added to the fleet`
      );
      
      // Create audit log
      await auditLogService.createLog(
        'Vehicle Created',
        `Added vehicle ${newVehicle.plate_number} (${newVehicle.make} ${newVehicle.model})`
      );
    } catch (error: any) {
      console.error('Failed to save vehicle:', error);
      notificationService.error(
        'Failed to Add Vehicle',
        error.message || 'Unable to add vehicle. Please try again.'
      );
      alert(error.message || 'Failed to save vehicle. Please try again.');
    }
  };

  const handleUpdateVehicle = async (vehicle: Vehicle) => {
    try {
      // Validate vehicle object
      if (!vehicle || !vehicle.id) {
        console.error('Invalid vehicle object:', vehicle);
        alert('Invalid vehicle data. Missing ID.');
        return;
      }

      // Check if vehicle exists in current state
      const existingVehicle = vehicles.find(v => v.id === vehicle.id);
      if (!existingVehicle) {
        console.error('Vehicle not found in current state:', vehicle.id);
        alert('Vehicle not found in current list. Please refresh and try again.');
        return;
      }

      console.log('Updating vehicle:', {
        id: vehicle.id,
        plate_number: vehicle.plate_number,
        make: vehicle.make,
        model: vehicle.model
      });

      // Verify vehicle exists in database before updating
      const dbVehicle = await vehicleService.getById(vehicle.id);
      if (!dbVehicle) {
        console.error('Vehicle not found in database:', vehicle.id);
        alert('Vehicle not found in database. It may have been deleted. Refreshing list...');
        await loadVehicles();
        setIsModalOpen(false);
        setEditingVehicle(undefined);
        return;
      }

      // Extract only updatable fields (exclude id, created_at, updated_at)
      const { id, created_at, updated_at, ...updateData } = vehicle;
      console.log('Update data being sent:', updateData);
      
      const updated = await vehicleService.update(vehicle.id, updateData);
      console.log('Update successful, received:', updated);
      
      setVehicles(vehicles.map(v => v.id === updated.id ? updated : v));
      setIsModalOpen(false);
      setEditingVehicle(undefined);
      
      // Create notification
      notificationService.success(
        'Vehicle Updated',
        `${updated.plate_number} has been successfully updated`
      );
      
      // Create audit log
      await auditLogService.createLog(
        'Vehicle Updated',
        `Updated vehicle ${updated.plate_number} (${updated.make} ${updated.model})`,
        { before: vehicle, after: updated }
      );
    } catch (error: any) {
      console.error('Failed to update vehicle:', error);
      console.error('Vehicle object was:', vehicle);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      notificationService.error(
        'Failed to Update Vehicle',
        error.message || 'Unable to update vehicle. Please try again.'
      );
      alert(error.message || 'Failed to update vehicle. Please try again.');
    }
  };

  const handleDisposeVehicle = async (id: string) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (!confirm('Are you sure you want to dispose this vehicle? This action cannot be undone.')) {
      return;
    }
    
    try {
      await vehicleService.delete(id);
      setVehicles(vehicles.filter(v => v.id !== id));
      
      // Create notification
      notificationService.info(
        'Vehicle Disposed',
        `${vehicle?.plate_number || 'Vehicle'} has been removed from the fleet`
      );
      
      // Create audit log
      await auditLogService.createLog(
        'Vehicle Disposed',
        `Disposed vehicle ${vehicle?.plate_number} (${vehicle?.make} ${vehicle?.model})`
      );
    } catch (error: any) {
      console.error('Failed to dispose vehicle:', error);
      notificationService.error(
        'Failed to Dispose Vehicle',
        error.message || 'Unable to dispose vehicle. Please try again.'
      );
      alert(error.message || 'Failed to dispose vehicle. Please try again.');
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

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter(vehicle => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      vehicle.plate_number.toLowerCase().includes(query) ||
      vehicle.make.toLowerCase().includes(query) ||
      vehicle.model.toLowerCase().includes(query) ||
      vehicle.vin.toLowerCase().includes(query) ||
      (vehicle.conduction_number && vehicle.conduction_number.toLowerCase().includes(query)) ||
      (vehicle.variant && vehicle.variant.toLowerCase().includes(query)) ||
      vehicle.status.toLowerCase().includes(query) ||
      vehicle.ownership_type.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Total Vehicles</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{filteredVehicles.length}</p>
            </div>
            <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Active</p>
              <p className="text-2xl font-bold text-emerald-500 mt-1">{filteredVehicles.filter(v => v.status === 'active').length}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Maintenance</p>
              <p className="text-2xl font-bold text-amber-500 mt-1">{filteredVehicles.filter(v => v.status === 'maintenance').length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Disposed</p>
              <p className="text-2xl font-bold text-text-secondary mt-1">{filteredVehicles.filter(v => v.status === 'disposed').length}</p>
            </div>
            <div className="w-12 h-12 bg-bg-elevated rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-border-muted">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-text-primary">Vehicle Fleet</h2>
            <p className="text-sm text-text-secondary mt-1">Manage and monitor your vehicle inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Button onClick={handleAddVehicle} variant="primary"
              size="md"
              className="inline-flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Vehicle
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              <p className="text-text-secondary mt-4">Loading vehicles...</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="overflow-x-auto overflow-y-auto max-h-96 md:max-h-[32rem] lg:max-h-[40rem] xl:max-h-[38rem]">
              <VehicleTable
                vehicles={filteredVehicles}
                onDispose={handleDisposeVehicle}
                onEdit={handleEditVehicle}
              />
            </div>
          </div>
        )}
      </Card>

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
