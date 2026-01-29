import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types';

interface VehicleFormProps {
  onSave: (vehicle: Omit<Vehicle, 'id'>) => void;
  onUpdate?: (vehicle: Vehicle) => void;
  initialData?: Vehicle;
}

export default function VehicleForm({ onSave, onUpdate, initialData }: VehicleFormProps) {
  const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>({
    plate_number: initialData?.plate_number || '',
    make: initialData?.make || '',
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear(),
    vin: initialData?.vin || '',
    ownership_type: initialData?.ownership_type || 'owned',
    status: initialData?.status || 'active',
    insurance_expiry: initialData?.insurance_expiry || '',
    registration_expiry: initialData?.registration_expiry || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        plate_number: initialData.plate_number,
        make: initialData.make,
        model: initialData.model,
        year: initialData.year,
        vin: initialData.vin,
        ownership_type: initialData.ownership_type,
        status: initialData.status,
        insurance_expiry: initialData.insurance_expiry,
        registration_expiry: initialData.registration_expiry,
      });
    } else {
      setFormData({
        plate_number: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        vin: '',
        ownership_type: 'owned',
        status: 'active',
        insurance_expiry: '',
        registration_expiry: '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData && onUpdate) {
      onUpdate({ ...formData, id: initialData.id });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Plate Number <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="plate_number"
            value={formData.plate_number}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Make <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="make"
            value={formData.make}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Model <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Year <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            VIN <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="vin"
            value={formData.vin}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Ownership Type
          </label>
          <select
            name="ownership_type"
            value={formData.ownership_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="owned">owned</option>
            <option value="leased">leased</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="active">active</option>
            <option value="maintenance">maintenance</option>
            <option value="disposed">disposed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Insurance Expiry
          </label>
          <input
            type="date"
            name="insurance_expiry"
            value={formData.insurance_expiry}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Registration Expiry
          </label>
          <input
            type="date"
            name="registration_expiry"
            value={formData.registration_expiry}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200 flex justify-end gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-md hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {initialData ? 'Update Vehicle' : 'Save Vehicle'}
        </button>
      </div>
    </form>
  );
}

