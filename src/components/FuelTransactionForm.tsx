// Fuel Transaction Form Component - Defined per fuel-tracking-module.md
import React, { useState, useEffect, useRef } from 'react';
import { FuelTransaction, Vehicle, Driver } from '../types';
import { Input, Select } from './ui';
import { supabase } from '../supabaseClient';

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

  const [vehicleInputValue, setVehicleInputValue] = useState('');
  const [showVehicleSuggestions, setShowVehicleSuggestions] = useState(false);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const vehicleRef = useRef<HTMLDivElement>(null);

  // Camera capture states
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Filter active vehicles per business rules
  const activeVehicles = vehicles.filter(v => v.status === 'active');
  const activeDrivers = drivers.filter(d => d.status === 'active');

  // Get vehicle display text
  const getVehicleDisplay = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return '';
    const identifier = vehicle.plate_number || vehicle.conduction_number || 'Unknown';
    return `${identifier} - ${vehicle.make} ${vehicle.model}`;
  };

  // Handle vehicle input change with filtering
  const handleVehicleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setVehicleInputValue(inputValue);
    
    if (inputValue.length === 0) {
      setFilteredVehicles(activeVehicles);
      setShowVehicleSuggestions(false);
      setFormData(prev => ({ ...prev, vehicle_id: '' }));
      return;
    }
    
    const filtered = activeVehicles.filter(vehicle => {
      const identifier = vehicle.plate_number || vehicle.conduction_number || '';
      const displayText = `${identifier} ${vehicle.make} ${vehicle.model}`.toLowerCase();
      return displayText.includes(inputValue.toLowerCase());
    });
    
    setFilteredVehicles(filtered);
    setShowVehicleSuggestions(inputValue.length > 0 && filtered.length > 0);
  };

  // Handle vehicle selection from suggestions
  const handleVehicleSelect = (vehicle: Vehicle) => {
    const identifier = vehicle.plate_number || vehicle.conduction_number || 'Unknown';
    const displayText = `${identifier} - ${vehicle.make} ${vehicle.model}`;
    setVehicleInputValue(displayText);
    setFormData(prev => ({ ...prev, vehicle_id: vehicle.id }));
    setShowVehicleSuggestions(false);
  };

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
      
      // Set vehicle input value for editing
      if (initialData.vehicle_id) {
        setVehicleInputValue(getVehicleDisplay(initialData.vehicle_id));
      }
      
      // Set captured image if receipt URL exists
      if (initialData.receipt_image_url) {
        setCapturedImage(initialData.receipt_image_url);
      }
    } else {
      setVehicleInputValue('');
      setShowVehicleSuggestions(false);
      setFilteredVehicles(activeVehicles);
      setCapturedImage(null);
    }
  }, [initialData, vehicles]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (vehicleRef.current && !vehicleRef.current.contains(event.target as Node)) {
        setShowVehicleSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-calculate cost_per_liter when cost or liters change
  useEffect(() => {
    if (formData.liters > 0) {
      setFormData(prev => ({
        ...prev,
        cost_per_liter: parseFloat((prev.cost / prev.liters).toFixed(2))
      }));
    }
  }, [formData.cost, formData.liters]);

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use rear camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        stopCamera();
        uploadImageToStorage(imageDataUrl);
      }
    }
  };

  const uploadImageToStorage = async (imageDataUrl: string) => {
    try {
      setIsUploading(true);
      
      // Convert base64 to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      // Create structured path: fuel-receipts/{year}/{month}/{day}/{vehicleId}_{timestamp}.jpg
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const timestamp = now.getTime();
      const vehicleId = formData.vehicle_id || 'unknown';
      const fileName = `${vehicleId}_${timestamp}.jpg`;
      const filePath = `fuel-receipts/${year}/${month}/${day}/${fileName}`;

      console.log('📤 Uploading receipt image:', filePath);

      // Upload to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('fuel-receipts')
        .upload(filePath, blob, {
          cacheControl: '31536000',
          upsert: false,
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        console.error('❌ Image upload error:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      console.log('✅ Image uploaded successfully:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('fuel-receipts')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;
      console.log('🔗 Image URL:', imageUrl);

      // Update form data with the URL
      setFormData(prev => ({
        ...prev,
        receipt_image_url: imageUrl
      }));

      setIsUploading(false);
    } catch (error) {
      console.error('❌ Image upload failed:', error);
      alert('Failed to upload receipt image. Please try again.');
      setIsUploading(false);
      setCapturedImage(null);
    }
  };

  const removeImage = () => {
    setCapturedImage(null);
    setFormData(prev => ({
      ...prev,
      receipt_image_url: undefined
    }));
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
        {/* Vehicle (autocomplete, required, from active vehicles) */}
        <div style={{ position: 'relative' }} ref={vehicleRef}>
          <Input
            label={<>Vehicle <span className="text-red-600">*</span></>}
            type="text"
            name="vehicle_input"
            value={vehicleInputValue}
            onChange={handleVehicleInputChange}
            onFocus={() => {
              if (vehicleInputValue.length > 0 && filteredVehicles.length > 0) {
                setShowVehicleSuggestions(true);
              }
            }}
            onBlur={() => {
              setTimeout(() => setShowVehicleSuggestions(false), 200);
            }}
            required
            placeholder="Type to search vehicle..."
          />
          {showVehicleSuggestions && filteredVehicles.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#2d3748',
              border: '1px solid #4a5568',
              borderRadius: '4px',
              maxHeight: '240px',
              overflowY: 'auto',
              zIndex: 50,
              marginTop: '4px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
            }}>
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => handleVehicleSelect(vehicle)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #4a5568',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a5568'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#e2e8f0' }}>
                    {vehicle.plate_number || vehicle.conduction_number || 'Unknown'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#a0aec0', marginTop: '2px' }}>
                    {vehicle.make} {vehicle.model}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Driver (select, required, from active drivers) */}
        <div>
          <Select
            label={<>Driver <span className="text-red-600">*</span></>}
            name="driver_id"
            value={formData.driver_id}
            onChange={handleChange}
            required
          >
            <option value="">Select driver</option>
            {activeDrivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.full_name}
              </option>
            ))}
          </Select>
        </div>

        {/* Transaction Date (datetime, required, default: now) */}
        <div>
          <Input
            label={<>Transaction Date <span className="text-red-600">*</span></>}
            type="datetime-local"
            name="transaction_date"
            value={formData.transaction_date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Odometer Reading (number, required, km) */}
        <div>
          <Input
            label={<>Odometer Reading (km) <span className="text-red-600">*</span></>}
            type="number"
            name="odometer_reading"
            value={formData.odometer_reading}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        {/* Liters (number, required, decimal) */}
        <div>
          <Input
            label={<>Liters <span className="text-red-600">*</span></>}
            type="number"
            name="liters"
            value={formData.liters}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Cost (number, required, decimal) */}
        <div>
          <Input
            label={<>Cost <span className="text-red-600">*</span></>}
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
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
          <Input
            label="Station Name"
            type="text"
            name="station_name"
            value={formData.station_name || ''}
            onChange={handleChange}
          />
        </div>

        {/* Station Location (text, optional) */}
        <div>
          <Input
            label="Station Location"
            type="text"
            name="station_location"
            value={formData.station_location || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Receipt Image Upload with Camera */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          Receipt Image
        </label>
        
        {!capturedImage && !showCamera && (
          <button
            type="button"
            onClick={startCamera}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Capture Receipt
          </button>
        )}

        {showCamera && (
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto"
              style={{ maxHeight: '400px' }}
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button
                type="button"
                onClick={captureImage}
                className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                </svg>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="flex items-center gap-2 text-blue-600">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Uploading receipt...</span>
          </div>
        )}

        {capturedImage && !isUploading && (
          <div className="relative">
            <img
              src={capturedImage}
              alt="Receipt"
              className="w-full max-w-md rounded-lg border border-slate-300"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors shadow-lg"
              title="Remove image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
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
