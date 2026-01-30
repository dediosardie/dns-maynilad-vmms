// Fuel Transaction Form Component - Defined per fuel-tracking-module.md
import React, { useState, useEffect } from 'react';
import { FuelTransaction, Vehicle, Driver } from '../types';

interface FuelTransactionFormProps {
  onSave: (transaction: Omit<FuelTransaction, 'id' | 'created_at'>) => void;
  onUpdate?: (transaction: FuelTransaction) => void;
  initialData?: FuelTransaction;
  vehicles: Vehicle[];
  drivers: Driver[];
}

export default function FuelTransactionForm({ onSave, onUpdate, initialData, vehicles, drivers }: FuelTransactionFormProps) {
  const [formData, setFormData] = useState<Omit<FuelTransaction, 'id' | 'created_at'>>({
    vehicle_id: initialData?.vehicle_id || '',
    driver_id: initialData?.driver_id || '',
    transaction_date: initialData?.transaction_date || new Date().toISOString().slice(0, 16),
    odometer_reading: initialData?.odometer_reading || 0,
    liters: initialData?.liters || 0,
    cost: initialData?.cost || 0,
    cost_per_liter: initialData?.cost_per_liter || 0,
    fuel_type: initialData?.fuel_type || 'diesel',
    station_name: initialData?.station_name,
    station_location: initialData?.station_location,
    receipt_image_url: initialData?.receipt_image_url,
    is_full_tank: initialData?.is_full_tank ?? true,
  });

  // Filter active vehicles per business rules
  const activeVehicles = vehicles.filter(v => v.status === 'active');
  const activeDrivers = drivers.filter(d => d.status === 'active');

  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicle_id: initialData.vehicle_id,
        driver_id: initialData.driver_id,
        transaction_date: initialData.transaction_date,
        odometer_reading: initialData.odometer_reading,
        liters: initialData.liters,
        cost: initialData.cost,
        cost_per_liter: initialData.cost_per_liter,
        fuel_type: initialData.fuel_type,
        station_name: initialData.station_name,
        station_location: initialData.station_location,
        receipt_image_url: initialData.receipt_image_url,
        is_full_tank: initialData.is_full_tank,
      });
    }
  }, [initialData]);

  // Auto-calculate cost_per_liter when cost or liters change
  useEffect(() => {
    if (formData.liters > 0) {
      setFormData(prev => ({
        ...prev,
        cost_per_liter: parseFloat((prev.cost / prev.liters).toFixed(2))
      }));
    }
  }, [formData.cost, formData.liters]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
              type === 'number' ? parseFloat(value) :
              value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (initialData && onUpdate) {
      onUpdate({ 
        ...formData, 
        id: initialData.id,
        created_at: initialData.created_at
      });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Vehicle (select, required, from active vehicles) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Vehicle <span className="text-red-600">*</span>
          </label>
          <select
            name="vehicle_id"
            value={formData.vehicle_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Select Vehicle</option>
            {activeVehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.plate_number}{vehicle.conduction_number ? ` (${vehicle.conduction_number})` : ''} - {vehicle.make} {vehicle.model}
              </option>
            ))}
          </select>
        </div>

        {/* Driver (select, required, from active drivers) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Driver <span className="text-red-600">*</span>
          </label>
          <select
            name="driver_id"
            value={formData.driver_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Select Driver</option>
            {activeDrivers.map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Transaction Date (datetime, required, default: now) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Transaction Date <span className="text-red-600">*</span>
          </label>
          <input
            type="datetime-local"
            name="transaction_date"
            value={formData.transaction_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Odometer Reading (number, required, km) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Odometer Reading (km) <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            name="odometer_reading"
            value={formData.odometer_reading}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Liters (number, required, decimal) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Liters <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            name="liters"
            value={formData.liters}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Cost (number, required, decimal) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Cost <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Cost Per Liter (number, required, auto-calculated) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Cost Per Liter <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            name="cost_per_liter"
            value={formData.cost_per_liter}
            readOnly
            required
            step="0.01"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-slate-50 focus:outline-none"
          />
        </div>

        {/* Fuel Type (select, required: diesel, petrol, electric, hybrid) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Fuel Type <span className="text-red-600">*</span>
          </label>
          <select
            name="fuel_type"
            value={formData.fuel_type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="diesel">Diesel</option>
            <option value="petrol">Petrol</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Station Name (text, optional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Station Name
          </label>
          <input
            type="text"
            name="station_name"
            value={formData.station_name || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Station Location (text, optional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Station Location
          </label>
          <input
            type="text"
            name="station_location"
            value={formData.station_location || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      {/* Full Tank (checkbox, default: true) */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="is_full_tank"
          checked={formData.is_full_tank}
          onChange={handleChange}
          className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 rounded"
        />
        <label className="ml-2 block text-sm text-slate-700">
          Full Tank
        </label>
      </div>

      {/* Actions: Record/Update Fuel Transaction (primary, submit) */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          {initialData ? 'Update Transaction' : 'Record Fuel Transaction'}
        </button>
      </div>
    </form>
  );
}
