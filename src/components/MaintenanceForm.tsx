import React, { useState, useEffect } from 'react';
import { Maintenance } from '../types';

interface MaintenanceFormProps {
  onSchedule: (maintenance: Omit<Maintenance, 'id'>) => void;
  onUpdate?: (maintenance: Maintenance) => void;
  vehicles: Array<{ id: string; plate_number: string; conduction_number?: string }>;
  initialData?: Maintenance;
}

export default function MaintenanceForm({ onSchedule, onUpdate, vehicles, initialData }: MaintenanceFormProps) {
  const [formData, setFormData] = useState<Omit<Maintenance, 'id'>>({
    vehicle_id: initialData?.vehicle_id || '',
    maintenance_type: initialData?.maintenance_type || 'preventive',
    scheduled_date: initialData?.scheduled_date || '',
    status: initialData?.status || 'pending',
    cost: initialData?.cost || undefined,
    description: initialData?.description || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicle_id: initialData.vehicle_id,
        maintenance_type: initialData.maintenance_type,
        scheduled_date: initialData.scheduled_date,
        status: initialData.status,
        cost: initialData.cost,
        description: initialData.description || '',
      });
    } else {
      setFormData({
        vehicle_id: '',
        maintenance_type: 'preventive',
        scheduled_date: '',
        status: 'pending',
        cost: undefined,
        description: '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' ? (value ? parseFloat(value) : undefined) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData && onUpdate) {
      onUpdate({ ...formData, id: initialData.id });
    } else {
      onSchedule(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
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
            <option value="">Select a vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.plate_number}{(vehicle as any).conduction_number ? ` (${(vehicle as any).conduction_number})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Maintenance Type
          </label>
          <select
            name="maintenance_type"
            value={formData.maintenance_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="preventive">preventive</option>
            <option value="repair">repair</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Scheduled Date
          </label>
          <input
            type="date"
            name="scheduled_date"
            value={formData.scheduled_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Cost
          </label>
          <input
            type="number"
            name="cost"
            value={formData.cost || ''}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          placeholder="Enter maintenance details, notes, or observations..."
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-md hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Schedule Maintenance
        </button>
      </div>
    </form>
  );
}

