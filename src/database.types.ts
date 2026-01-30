export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string
          plate_number: string
          conduction_number?: string
          make: string
          model: string
          year: number
          vin: string
          ownership_type: 'owned' | 'leased'
          status: 'active' | 'maintenance' | 'disposed'
          insurance_expiry: string
          registration_expiry: string
          created_at: string
        }
        Insert: {
          id?: string
          plate_number: string
          conduction_number?: string
          make: string
          model: string
          year: number
          vin: string
          ownership_type: 'owned' | 'leased'
          status: 'active' | 'maintenance' | 'disposed'
          insurance_expiry: string
          registration_expiry: string
          created_at?: string
        }
        Update: {
          id?: string
          plate_number?: string
          conduction_number?: string
          make?: string
          model?: string
          year?: number
          vin?: string
          ownership_type?: 'owned' | 'leased'
          status?: 'active' | 'maintenance' | 'disposed'
          insurance_expiry?: string
          registration_expiry?: string
          created_at?: string
        }
      }
      drivers: {
        Row: {
          id: string
          full_name: string
          license_number: string
          license_expiry: string
          status: 'active' | 'suspended'
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          license_number: string
          license_expiry: string
          status: 'active' | 'suspended'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          license_number?: string
          license_expiry?: string
          status?: 'active' | 'suspended'
          created_at?: string
        }
      }
      maintenance: {
        Row: {
          id: string
          vehicle_id: string
          maintenance_type: 'preventive' | 'repair'
          scheduled_date: string
          status: 'pending' | 'completed'
          cost: number | null
          created_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          maintenance_type: 'preventive' | 'repair'
          scheduled_date: string
          status: 'pending' | 'completed'
          cost?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          maintenance_type?: 'preventive' | 'repair'
          scheduled_date?: string
          status?: 'pending' | 'completed'
          cost?: number | null
          created_at?: string
        }
      }
    }
  }
}
