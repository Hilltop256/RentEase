export interface Property {
  id: string;
  name: string;
  address?: string;
  plotNumber?: string;
  blockNumber?: string;
  landMark?: string;
  city: string;
  state?: string;
  district?: string;
  zipCode?: string;
  type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'room' | 'shop' | 'plot';
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  monthlyRent: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  imageUrl: string;
  description: string;
  amenities: string[];
  isFurnished?: boolean;
  isFitForHabitation?: boolean;
}

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber?: string;
  idType?: 'national_id' | 'passport' | 'drivers_license' | 'other';
  propertyId: string;
  propertyName: string;
  unitNumber?: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  securityDeposit: number;
  rentInAdvance?: number;
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
  paymentMethod?: 'bank_transfer' | 'mobile_money' | 'cash' | 'cheque' | 'credit_card' | 'check' | undefined;
  paymentReference?: string;
  lateFee?: number;
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
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'pest' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  photos?: string[];
  createdAt: string;
  completedAt?: string;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  reportedBy?: string;
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
  rentInAdvance?: number;
  petDeposit?: number;
  terms: string;
  status: 'active' | 'expired' | 'terminated' | 'pending';
  noticePeriod?: number;
  rentIncreaseCap?: number;
  isWritten?: boolean;
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
  totalExpenses?: number;
  netIncome?: number;
}

export interface Expense {
  id: string;
  propertyId?: string;
  category: 'maintenance' | 'repairs' | 'utilities' | 'taxes' | 'insurance' | 'mortgage' | 'management_fee' | 'legal' | 'marketing' | 'other';
  description: string;
  amount: number;
  date: string;
  vendorId?: string;
  receiptUrl?: string;
  isRecurring: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export interface Vendor {
  id: string;
  companyName: string;
  contactName?: string;
  email?: string;
  phone: string;
  specialty: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'general' | 'cleaning' | 'landscaping' | 'roofing' | 'painting' | 'other';
  hourlyRate?: number;
  rating?: number;
  notes?: string;
  isActive: boolean;
}

export interface Vacancy {
  id: string;
  propertyId?: string;
  unitNumber?: string;
  status: 'available' | 'pending' | 'occupied';
  availableDate?: string;
  rentAmount?: number;
  description?: string;
  amenities?: string[];
  listingDate?: string;
  viewingsCount?: number;
}

export interface Lead {
  id: string;
  vacancyId?: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  idNumber?: string;
  status: 'new' | 'contacted' | 'showing' | 'application' | 'approved' | 'rejected' | 'converted';
  notes?: string;
  source?: string;
}

export interface Document {
  id: string;
  tenantId?: string;
  propertyId?: string;
  name: string;
  type: 'lease' | 'addendum' | 'invoice' | 'receipt' | 'id_document' | 'insurance' | 'tax' | 'other';
  category: 'tenant' | 'property' | 'financial' | 'legal' | 'other';
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  description?: string;
  isEncrypted: boolean;
}

export interface Notification {
  id: string;
  tenantId?: string;
  propertyId?: string;
  type: 'rent_reminder' | 'lease_expiry' | 'maintenance_due' | 'payment_received' | 'late_fee' | 'inspection_notice' | 'custom';
  title: string;
  message: string;
  scheduledFor?: string;
  sentAt?: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export type ViewType = 'dashboard' | 'properties' | 'tenants' | 'payments' | 'maintenance' | 'leases';
