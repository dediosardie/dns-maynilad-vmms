import React, { useState, useEffect, useRef } from 'react';
import { Maintenance } from '../types';
import { Input, Select, Textarea, Button } from './ui';
import { supabase } from '../supabaseClient';

interface MaintenanceFormProps {
  onSchedule: (maintenance: Omit<Maintenance, 'id'>) => void;
  onUpdate?: (maintenance: Maintenance) => void;
  vehicles: Array<{ id: string; plate_number: string; conduction_number?: string; model: string; make: string }>;
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
    company: initialData?.company ?? undefined,
    current_mileage: initialData?.current_mileage || undefined,
    completed_date: initialData?.completed_date || '',    image_url: initialData?.image_url || undefined,  });

  const [vehicleInputValue, setVehicleInputValue] = useState('');
  const [showVehicleSuggestions, setShowVehicleSuggestions] = useState(false);
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);

  // Camera capture states
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicle_id: initialData.vehicle_id,
        maintenance_type: initialData.maintenance_type,
        scheduled_date: initialData.scheduled_date,
        status: initialData.status,
        cost: initialData.cost,
        description: initialData.description || '',
        company: initialData.company ?? undefined,
        current_mileage: initialData.current_mileage || undefined,
        completed_date: initialData.completed_date || '',
      });
      
      // Set the display value for the vehicle input
      const vehicle = vehicles.find(v => v.id === initialData.vehicle_id);
      if (vehicle) {
        const identifier = vehicle.plate_number || vehicle.conduction_number || 'Unknown';
        setVehicleInputValue(`${identifier} - ${vehicle.make} ${vehicle.model}`);
      }
      
      // Set captured image if image URL exists
      if (initialData.image_url) {
        setCapturedImage(initialData.image_url);
      }
    } else {
      setFormData({
        vehicle_id: '',
        maintenance_type: 'preventive',
        scheduled_date: '',
        status: 'pending',
        cost: undefined,
        description: '',
        company: undefined,
        current_mileage: undefined,
        completed_date: '',
        image_url: undefined,
      });
      setVehicleInputValue('');
      setCapturedImage(null);
    }
  }, [initialData, vehicles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'cost' || name === 'current_mileage'
          ? (value ? parseFloat(value) : undefined)
          : name === 'company'
            ? (value ? value : undefined)
            : value,
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

  const handleVehicleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setVehicleInputValue(inputValue);
    
    // Filter vehicles based on input
    const filtered = vehicles.filter(v => {
      const identifier = v.plate_number || v.conduction_number || 'Unknown';
      const displayText = `${identifier} - ${v.make} ${v.model}`.toLowerCase();
      return displayText.includes(inputValue.toLowerCase());
    });
    
    setFilteredVehicles(filtered);
    setShowVehicleSuggestions(inputValue.length > 0 && filtered.length > 0);
    
    // Clear vehicle_id when typing (will be set when selecting)
    setFormData(prev => ({
      ...prev,
      vehicle_id: ''
    }));
  };

  const handleVehicleSelect = (vehicle: typeof vehicles[0]) => {
    const identifier = vehicle.plate_number || vehicle.conduction_number || 'Unknown';
    const displayText = `${identifier} - ${vehicle.make} ${vehicle.model}`;
    
    setVehicleInputValue(displayText);
    setFormData(prev => ({
      ...prev,
      vehicle_id: vehicle.id
    }));
    setShowVehicleSuggestions(false);
  };

  // Camera functions
  const startCamera = async () => {
    try {
      setShowCamera(true);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera API is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Edge.');
        setShowCamera(false);
        return;
      }

      // Request camera access with rear camera (environment)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error: any) {
      console.error('Camera access error:', error);
      
      // Provide specific error messages based on error type
      let errorMessage = 'Unable to access camera. ';
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage += 'Camera permission denied. Please allow camera access in your browser settings.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage += 'No camera device found. Please connect a camera and try again.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage += 'Camera is already in use by another application.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage += 'Camera settings are not supported on this device.';
      } else if (error.name === 'SecurityError') {
        errorMessage += 'Camera access blocked due to security settings. Please use HTTPS or localhost.';
      } else {
        errorMessage += error.message || 'Unknown error occurred.';
      }
      
      alert(errorMessage);
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const captureImage = async () => {
    if (!videoRef.current || !streamRef.current) {
      alert('Camera is not active');
      return;
    }

    try {
      // Create canvas to capture the frame
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) {
        alert('Failed to create canvas context');
        return;
      }

      // Draw the current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to base64 image
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageDataUrl);

      // Stop camera
      stopCamera();

      // Upload the image to storage
      await uploadImageToStorage(imageDataUrl);
      
    } catch (error) {
      console.error('Failed to capture image:', error);
      alert('Failed to capture image. Please try again.');
    }
  };

  const uploadImageToStorage = async (imageDataUrl: string) => {
    try {
      setIsUploading(true);
      
      // Convert base64 to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      // Create structured path: maintenance-images/{year}/{month}/{day}/{vehicleId}_{timestamp}.jpg
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const timestamp = now.getTime();
      const vehicleId = formData.vehicle_id || 'unknown';
      const fileName = `${vehicleId}_${timestamp}.jpg`;
      const filePath = `maintenance-images/${year}/${month}/${day}/${fileName}`;

      console.log('📤 Uploading maintenance image:', filePath);

      // Upload to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('maintenance-images')
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
        .from('maintenance-images')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;
      console.log('🔗 Image URL:', imageUrl);

      // Update form data with the URL
      setFormData(prev => ({
        ...prev,
        image_url: imageUrl
      }));

      setIsUploading(false);
    } catch (error) {
      console.error('❌ Image upload failed:', error);
      alert('Failed to upload maintenance image. Please try again.');
      setIsUploading(false);
      setCapturedImage(null);
    }
  };

  const removeImage = () => {
    setCapturedImage(null);
    setFormData(prev => ({
      ...prev,
      image_url: undefined
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="relative">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Vehicle <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="vehicle_display"
            value={vehicleInputValue}
            onChange={handleVehicleInputChange}
            onFocus={() => {
              if (vehicleInputValue) {
                setShowVehicleSuggestions(filteredVehicles.length > 0);
              }
            }}
            onBlur={() => {
              // Delay to allow click on suggestion
              setTimeout(() => setShowVehicleSuggestions(false), 200);
            }}
            required
            placeholder="Type to search vehicle..."
            className="w-full px-4 py-2.5 bg-bg-elevated border border-border-muted rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            autoComplete="off"
          />
          {showVehicleSuggestions && (
            <div className="absolute z-50 w-full mt-1 bg-bg-elevated border border-border-muted rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredVehicles.map((vehicle) => {
                const identifier = vehicle.plate_number || vehicle.conduction_number || 'Unknown';
                return (
                  <div
                    key={vehicle.id}
                    onClick={() => handleVehicleSelect(vehicle)}
                    className="px-4 py-2.5 cursor-pointer hover:bg-bg-primary transition-colors border-b border-border-muted last:border-b-0"
                  >
                    <div className="text-sm text-text-primary font-medium">{identifier}</div>
                    <div className="text-xs text-text-secondary">{vehicle.make} {vehicle.model}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <Select
            label="Maintenance Type"
            name="maintenance_type"
            value={formData.maintenance_type}
            onChange={handleChange}
          >
            <option value="preventive">preventive</option>
            <option value="repair">repair</option>
          </Select>
        </div>

        <div>
          <Input
            label="Scheduled Date"
            type="date"
            name="scheduled_date"
            value={formData.scheduled_date}
            onChange={handleChange}
          />
        </div>

        <div>
          <Input
            label="Cost"
            type="number"
            name="cost"
            value={formData.cost || ''}
            onChange={handleChange}
            step="0.01"
          />
        </div>

        <div>
          <Input
            label="Company"
            type="text"
            name="company"
            value={formData.company ?? ''}
            onChange={handleChange}
            placeholder="Service provider or company"
          />
        </div>

        <div>
          <Input
            label="Current Mileage"
            type="number"
            name="current_mileage"
            value={formData.current_mileage || ''}
            onChange={handleChange}
            placeholder="Enter current mileage"
          />
        </div>

        <div>
          <Input
            label="Completed Date"
            type="date"
            name="completed_date"
            value={formData.completed_date || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Maintenance Image Upload with Camera */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-secondary">
          Maintenance Image
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
            Capture Image
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
            <span>Uploading image...</span>
          </div>
        )}

        {capturedImage && !isUploading && (
          <div className="relative">
            <img
              src={capturedImage}
              alt="Maintenance"
              className="w-full max-w-md rounded-lg border border-border-muted"
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

      <div>
        <Textarea
          label="Description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={4}
          placeholder="Enter maintenance details, notes, or observations..."
        />
      </div>

      <div className="mt-6 pt-6 border-t border-border-muted flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="md"
        >
          Schedule Maintenance
        </Button>
      </div>
    </form>
  );
}

