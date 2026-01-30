// Trip Form Component - Defined per trip-scheduling-module.md
import React, { useState, useEffect } from 'react';
import { Trip, Vehicle, Driver } from '../types';

interface TripFormProps {
  onSave: (trip: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdate?: (trip: Trip) => void;
  initialData?: Trip;
  vehicles: Vehicle[];
  drivers: Driver[];
}

// TODO: Replace with your Google Maps API key
// Get your API key from: https://console.cloud.google.com/google/maps-apis
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

export default function TripForm({ onSave, onUpdate, initialData, vehicles, drivers }: TripFormProps) {
  const [formData, setFormData] = useState<Omit<Trip, 'id' | 'created_at' | 'updated_at'>>({
    vehicle_id: initialData?.vehicle_id || '',
    driver_id: initialData?.driver_id || '',
    origin: initialData?.origin || '',
    destination: initialData?.destination || '',
    planned_departure: initialData?.planned_departure || '',
    planned_arrival: initialData?.planned_arrival || '',
    actual_departure: initialData?.actual_departure,
    actual_arrival: initialData?.actual_arrival,
    status: initialData?.status || 'planned',
    distance_km: initialData?.distance_km || 0,
    estimated_fuel_consumption: initialData?.estimated_fuel_consumption || 0,
    route_waypoints: initialData?.route_waypoints,
    notes: initialData?.notes,
  });

  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [distanceError, setDistanceError] = useState<string | null>(null);

  // Filter: only active vehicles per business rules
  const activeVehicles = vehicles.filter(v => v.status === 'active');

  // Auto-calculate distance when origin and destination are provided
  useEffect(() => {
    const calculateDistance = async () => {
      if (!formData.origin || !formData.destination) {
        setDistanceError(null);
        return;
      }

      // Skip if API key is not configured
      if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        setDistanceError('Google Maps API key not configured');
        return;
      }

      setIsCalculatingDistance(true);
      setDistanceError(null);

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
            formData.origin
          )}&destinations=${encodeURIComponent(
            formData.destination
          )}&units=metric&key=${GOOGLE_MAPS_API_KEY}`,
          {
            mode: 'cors',
          }
        );

        const data = await response.json();

        if (data.status === 'OK' && data.rows[0]?.elements[0]?.status === 'OK') {
          const distanceInMeters = data.rows[0].elements[0].distance.value;
          const distanceInKm = distanceInMeters / 1000;

          setFormData(prev => ({
            ...prev,
            distance_km: parseFloat(distanceInKm.toFixed(2)),
          }));
          setDistanceError(null);
        } else {
          setDistanceError('Could not calculate distance. Please check addresses.');
        }
      } catch (error) {
        console.error('Error calculating distance:', error);
        setDistanceError('Failed to calculate distance. Please enter manually.');
      } finally {
        setIsCalculatingDistance(false);
      }
    };

    // Debounce: wait 1 second after user stops typing
    const timeoutId = setTimeout(() => {
      calculateDistance();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData.origin, formData.destination]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicle_id: initialData.vehicle_id,
        driver_id: initialData.driver_id,
        origin: initialData.origin,
        destination: initialData.destination,
        planned_departure: initialData.planned_departure,
        planned_arrival: initialData.planned_arrival,
        actual_departure: initialData.actual_departure,
        actual_arrival: initialData.actual_arrival,
        status: initialData.status,
        distance_km: initialData.distance_km,
        estimated_fuel_consumption: initialData.estimated_fuel_consumption,
        route_waypoints: initialData.route_waypoints,
        notes: initialData.notes,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'distance_km' || name === 'estimated_fuel_consumption' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: planned arrival must be after planned departure per business rules
    if (new Date(formData.planned_arrival) <= new Date(formData.planned_departure)) {
      alert('Planned arrival must be after planned departure');
      return;
    }

    if (initialData && onUpdate) {
      onUpdate({ 
        ...formData, 
        id: initialData.id,
        created_at: initialData.created_at,
        updated_at: new Date().toISOString()
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
                {vehicle.plate_number || vehicle.conduction_number} - {vehicle.make} {vehicle.model}
              </option>
            ))}
          </select>
        </div>

        {/* Driver (select, required, from available drivers) */}
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
            {drivers.filter(d => d.status === 'active').map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Origin (text/autocomplete, required) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Origin <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Destination (text/autocomplete, required) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Destination <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Planned Departure (datetime, required) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Planned Departure <span className="text-red-600">*</span>
          </label>
          <input
            type="datetime-local"
            name="planned_departure"
            value={formData.planned_departure}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Planned Arrival (datetime, required) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Planned Arrival <span className="text-red-600">*</span>
          </label>
          <input
            type="datetime-local"
            name="planned_arrival"
            value={formData.planned_arrival}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Distance (number, required, km) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Distance (km) <span className="text-red-600">*</span>
            {isCalculatingDistance && (
              <span className="ml-2 text-xs text-blue-600">Calculating...</span>
            )}
            {distanceError && (
              <span className="ml-2 text-xs text-amber-600">{distanceError}</span>
            )}
          </label>
          <input
            type="number"
            name="distance_km"
            value={formData.distance_km}
            onChange={handleChange}
            required
            min="0"
            step="0.1"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            disabled={isCalculatingDistance}
          />
          <p className="mt-1 text-xs text-slate-500">
            Distance auto-calculates from Google Maps
          </p>
        </div>

        {/* Estimated Fuel Consumption (number, required, liters) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Estimated Fuel Consumption (liters) <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            name="estimated_fuel_consumption"
            value={formData.estimated_fuel_consumption}
            onChange={handleChange}
            required
            min="0"
            step="0.1"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      {/* Notes (textarea, optional) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      {/* Actions: Save/Update (primary, submit) */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          {initialData ? 'Update Trip' : 'Create Trip'}
        </button>
      </div>
    </form>
  );
}
