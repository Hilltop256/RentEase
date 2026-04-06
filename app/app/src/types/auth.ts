export type UserRole = 'landlord' | 'tenant' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isOnboarded: boolean;
}

export interface LandlordProfile extends User {
  role: 'landlord';
  companyName?: string;
  businessAddress?: string;
  taxId?: string;
  totalProperties: number;
  subscriptionPlan: 'free' | 'basic' | 'pro';
}

export interface TenantProfile extends User {
  role: 'tenant';
  currentPropertyId?: string;
  currentPropertyName?: string;
  unitNumber?: string;
  leaseStart?: string;
  leaseEnd?: string;
  monthlyRent?: number;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  landlordId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

export interface OnboardingData {
  companyName?: string;
  businessAddress?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}
