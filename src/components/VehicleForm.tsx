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
    conduction_number: initialData?.conduction_number || '',
    make: initialData?.make || '',
    model: initialData?.model || '',
    variant: initialData?.variant || '',
    year: initialData?.year || new Date().getFullYear(),
    vin: initialData?.vin || '',
    engine_number: initialData?.engine_number || '',
    fuel_capacity: initialData?.fuel_capacity || undefined,
    ownership_type: initialData?.ownership_type || 'Internal',
    status: initialData?.status || 'active',
    insurance_expiry: initialData?.insurance_expiry || '',
    registration_expiry: initialData?.registration_expiry || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        plate_number: initialData.plate_number,
        conduction_number: initialData.conduction_number || '',
        make: initialData.make,
        model: initialData.model,
        variant: initialData.variant || '',
        year: initialData.year,
        vin: initialData.vin,
        engine_number: initialData.engine_number || '',
        fuel_capacity: initialData.fuel_capacity || undefined,
        ownership_type: initialData.ownership_type,
        status: initialData.status,
        insurance_expiry: initialData.insurance_expiry,
        registration_expiry: initialData.registration_expiry,
      });
    } else {
      setFormData({
        plate_number: '',
        conduction_number: '',
        make: '',
        model: '',
        variant: '',
        year: new Date().getFullYear(),
        vin: '',
        engine_number: '',
        fuel_capacity: undefined,
        ownership_type: 'Internal',
        status: 'active',
        insurance_expiry: '',
        registration_expiry: '',
      });
    }
  }, [initialData]);

  // Auto-calculate registration expiry when plate_number or year changes
  useEffect(() => {
    if (formData.plate_number && formData.year) {
      const calculatedExpiry = calculateRegistrationExpiry(formData.plate_number, formData.year);
      if (calculatedExpiry && calculatedExpiry !== formData.registration_expiry) {
        setFormData(prev => ({
          ...prev,
          registration_expiry: calculatedExpiry,
        }));
      }
    }
  }, [formData.plate_number, formData.year]);

  // Calculate LTO registration expiry based on plate number and vehicle age
  const calculateRegistrationExpiry = (plateNumber: string, modelYear: number): string => {
    if (!plateNumber || !modelYear) return '';

    // Extract last digit (for month) - search for last digit in plate number
    const digits = plateNumber.match(/\d/g);
    if (!digits || digits.length === 0) return '';

    const lastDigit = parseInt(digits[digits.length - 1]);
    
    // Month mapping based on last digit
    const monthMap: { [key: number]: number } = {
      1: 0,  // January (0-indexed)
      2: 1,  // February
      3: 2,  // March
      4: 3,  // April
      5: 4,  // May
      6: 5,  // June
      7: 6,  // July
      8: 7,  // August
      9: 8,  // September
      0: 9,  // October
    };

    const month = monthMap[lastDigit];
    if (month === undefined) return '';

    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - modelYear;

    let expiryYear: number;
    
    // If vehicle age > 3 years, use current year
    if (vehicleAge > 3) {
      expiryYear = currentYear;
    } else {
      // If vehicle age <= 3 years, use model year + 3
      expiryYear = modelYear + 3;
    }

    // Get last day of the target month
    const lastDayOfMonth = new Date(expiryYear, month + 1, 0).getDate();
    const expiryDate = new Date(expiryYear, month, lastDayOfMonth);
    
    // Format as YYYY-MM-DD for date input
    return expiryDate.toISOString().split('T')[0];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedValue: any = value;
    
    if (name === 'year') {
      updatedValue = parseInt(value);
    } else if (name === 'fuel_capacity') {
      updatedValue = value ? parseFloat(value) : undefined;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData && onUpdate) {
      onUpdate({ 
        ...formData, 
        id: initialData.id,
        created_at: initialData.created_at,
        updated_at: initialData.updated_at,
      });
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
            Conduction Number
            <span className="text-xs text-slate-500 ml-2">(Use when plate not available)</span>
          </label>
          <input
            type="text"
            name="conduction_number"
            value={formData.conduction_number}
            onChange={handleChange}
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
            Variant
          </label>
          <input
            type="text"
            name="variant"
            value={formData.variant || ''}
            onChange={handleChange}
            placeholder="e.g., Sport, Deluxe, Base"
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
            Engine Number
          </label>
          <input
            type="text"
            name="engine_number"
            value={formData.engine_number || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Fuel Capacity (Liters)
          </label>
          <input
            type="number"
            name="fuel_capacity"
            value={formData.fuel_capacity || ''}
            onChange={handleChange}
            step="0.1"
            min="0"
            placeholder="e.g., 60"
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
            <option value="Internal">Internal</option>
            <option value="Leased">Leased</option>
            <option value="Leased to Own">Leased to Own</option>
            <option value="Shuttle">Shuttle</option>
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
            <span className="text-xs text-slate-500 ml-2">(Auto-calculated by LTO rules)</span>
          </label>
          <input
            type="date"
            name="registration_expiry"
            value={formData.registration_expiry}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            title="Automatically calculated based on plate number and vehicle age"
          />
          {formData.plate_number && formData.year && formData.registration_expiry && (
            <p className="text-xs text-emerald-600 mt-1">
              ✓ Calculated based on plate ending and vehicle age
            </p>
          )}
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

