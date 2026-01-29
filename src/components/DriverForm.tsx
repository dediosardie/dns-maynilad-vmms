import React, { useState, useEffect } from 'react';
import { Driver } from '../types';

interface DriverFormProps {
  onSave: (driver: Omit<Driver, 'id'>) => void;
  onUpdate?: (driver: Driver) => void;
  initialData?: Driver;
}

export default function DriverForm({ onSave, onUpdate, initialData }: DriverFormProps) {
  const [formData, setFormData] = useState<Omit<Driver, 'id'>>({
    full_name: initialData?.full_name || '',
    license_number: initialData?.license_number || '',
    license_expiry: initialData?.license_expiry || '',
    status: initialData?.status || 'active',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        full_name: initialData.full_name,
        license_number: initialData.license_number,
        license_expiry: initialData.license_expiry,
        status: initialData.status,
      });
    } else {
      setFormData({
        full_name: '',
        license_number: '',
        license_expiry: '',
        status: 'active',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
            Full Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            License Number <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="license_number"
            value={formData.license_number}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            License Expiry <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            name="license_expiry"
            value={formData.license_expiry}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
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
            <option value="suspended">suspended</option>
          </select>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-md hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Save Driver
        </button>
      </div>
    </form>
  );
}

