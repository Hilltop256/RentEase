// Database Types - These match the Supabase database schema
// Run the SQL from SUPABASE_SCHEMA.md in your Supabase SQL Editor to create the tables

export interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: 'landlord' | 'tenant' | 'admin';
  company_name: string | null;
  avatar_url: string | null;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  landlord_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  type: 'apartment' | 'house' | 'condo' | 'townhouse';
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  monthly_rent: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  image_url: string | null;
  description: string | null;
  amenities: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  landlord_id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  property_id: string | null;
  unit_number: string | null;
  lease_start: string | null;
  lease_end: string | null;
  monthly_rent: number;
  security_deposit: number;
  status: 'active' | 'inactive' | 'pending';
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relationship: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lease {
  id: string;
  tenant_id: string;
  property_id: string;
  landlord_id: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit: number;
  pet_deposit: number | null;
  terms: string | null;
  status: 'active' | 'expired' | 'terminated' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  tenant_id: string;
  property_id: string;
  landlord_id: string;
  amount: number;
  due_date: string;
  paid_date: string | null;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  payment_method: 'bank_transfer' | 'credit_card' | 'check' | 'cash' | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRequest {
  id: string;
  property_id: string;
  tenant_id: string | null;
  landlord_id: string;
  title: string;
  description: string | null;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  completed_at: string | null;
  assigned_to: string | null;
  estimated_cost: number | null;
  actual_cost: number | null;
}
