export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'apartment' | 'house' | 'condo' | 'townhouse';
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  monthlyRent: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  imageUrl: string;
  description: string;
  amenities: string[];
}

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: string;
  propertyName: string;
  unitNumber?: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  securityDeposit: number;
  status: 'active' | 'inactive' | 'pending';
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Payment {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyId: string;
  propertyName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paymentMethod?: 'bank_transfer' | 'credit_card' | 'check' | 'cash';
  description: string;
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  tenantId: string;
  tenantName: string;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
}

export interface Lease {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyId: string;
  propertyName: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  petDeposit?: number;
  terms: string;
  status: 'active' | 'expired' | 'terminated' | 'pending';
}

export interface DashboardStats {
  totalProperties: number;
  occupiedUnits: number;
  vacantUnits: number;
  totalTenants: number;
  monthlyRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  openMaintenanceRequests: number;
  occupancyRate: number;
}

export type ViewType = 'dashboard' | 'properties' | 'tenants' | 'payments' | 'maintenance' | 'leases';
