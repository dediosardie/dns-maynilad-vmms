import React, { useState, useEffect } from 'react';
import { Driver } from '../types';
import { Input, Select, Button } from './ui';

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
        <Input
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />

        <Input
          label="License Number"
          name="license_number"
          value={formData.license_number}
          onChange={handleChange}
          required
        />

        <Input
          label="License Expiry"
          type="date"
          name="license_expiry"
          value={formData.license_expiry}
          onChange={handleChange}
          required
        />

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="active">active</option>
          <option value="suspended">suspended</option>
        </Select>
      </div>

      <div className="mt-6 pt-6 border-t border-border-muted flex justify-end">
        <Button type="submit" variant="primary">
          Save Driver
        </Button>
      </div>
    </form>
  );
}

