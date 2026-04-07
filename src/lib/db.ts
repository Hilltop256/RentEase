import { supabase } from './supabase';
import type { Property, Tenant, Payment, MaintenanceRequest, Lease, DashboardStats } from '@/types';

export const db = {
  // PROPERTIES
  properties: {
    async getAll(landlordId: string): Promise<Property[]> {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(mapDbPropertyToProperty) || [];
    },

    async getById(id: string): Promise<Property | null> {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data ? mapDbPropertyToProperty(data) : null;
    },

    async create(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>, landlordId: string): Promise<Property> {
      const { data, error } = await supabase
        .from('properties')
        .insert({ ...property, landlord_id: landlordId })
        .select()
        .single();
      
      if (error) throw error;
      return mapDbPropertyToProperty(data);
    },

    async update(id: string, property: Partial<Property>): Promise<Property> {
      const { data, error } = await supabase
        .from('properties')
        .update({ ...property, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return mapDbPropertyToProperty(data);
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // TENANTS
  tenants: {
    async getAll(landlordId: string): Promise<Tenant[]> {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(mapDbTenantToTenant) || [];
    },

    async getById(id: string): Promise<Tenant | null> {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data ? mapDbTenantToTenant(data) : null;
    },

    async create(tenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>, landlordId: string): Promise<Tenant> {
      const { data, error } = await supabase
        .from('tenants')
        .insert({ ...tenant, landlord_id: landlordId })
        .select()
        .single();
      
      if (error) throw error;
      return mapDbTenantToTenant(data);
    },

    async update(id: string, tenant: Partial<Tenant>): Promise<Tenant> {
      const { data, error } = await supabase
        .from('tenants')
        .update({ ...tenant, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return mapDbTenantToTenant(data);
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // LEASES
  leases: {
    async getAll(landlordId: string): Promise<Lease[]> {
      const { data, error } = await supabase
        .from('leases')
        .select('*')
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(mapDbLeaseToLease) || [];
    },

    async getByTenant(tenantId: string): Promise<Lease[]> {
      const { data, error } = await supabase
        .from('leases')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(mapDbLeaseToLease) || [];
    },

    async create(lease: Omit<Lease, 'id' | 'created_at' | 'updated_at'>, landlordId: string): Promise<Lease> {
      const { data, error } = await supabase
        .from('leases')
        .insert({ ...lease, landlord_id: landlordId })
        .select()
        .single();
      
      if (error) throw error;
      return mapDbLeaseToLease(data);
    },

    async update(id: string, lease: Partial<Lease>): Promise<Lease> {
      const { data, error } = await supabase
        .from('leases')
        .update({ ...lease, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return mapDbLeaseToLease(data);
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('leases')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // PAYMENTS
  payments: {
    async getAll(landlordId: string): Promise<Payment[]> {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('landlord_id', landlordId)
        .order('due_date', { ascending: false });
      
      if (error) throw error;
      return data?.map(mapDbPaymentToPayment) || [];
    },

    async getByTenant(tenantId: string): Promise<Payment[]> {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('due_date', { ascending: false });
      
      if (error) throw error;
      return data?.map(mapDbPaymentToPayment) || [];
    },

    async create(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>, landlordId: string): Promise<Payment> {
      const { data, error } = await supabase
        .from('payments')
        .insert({ ...payment, landlord_id: landlordId })
        .select()
        .single();
      
      if (error) throw error;
      return mapDbPaymentToPayment(data);
    },

    async update(id: string, payment: Partial<Payment>): Promise<Payment> {
      const { data, error } = await supabase
        .from('payments')
        .update({ ...payment, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return mapDbPaymentToPayment(data);
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // MAINTENANCE REQUESTS
  maintenance: {
    async getAll(landlordId: string): Promise<MaintenanceRequest[]> {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(mapDbMaintenanceToMaintenance) || [];
    },

    async getByProperty(propertyId: string): Promise<MaintenanceRequest[]> {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(mapDbMaintenanceToMaintenance) || [];
    },

    async create(request: Omit<MaintenanceRequest, 'id' | 'created_at'>, landlordId: string): Promise<MaintenanceRequest> {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert({ ...request, landlord_id: landlordId })
        .select()
        .single();
      
      if (error) throw error;
      return mapDbMaintenanceToMaintenance(data);
    },

    async update(id: string, request: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .update({ ...request })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return mapDbMaintenanceToMaintenance(data);
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // DASHBOARD STATS
  async getDashboardStats(landlordId: string): Promise<DashboardStats> {
    const [properties, tenants, payments, maintenance] = await Promise.all([
      db.properties.getAll(landlordId),
      db.tenants.getAll(landlordId),
      db.payments.getAll(landlordId),
      db.maintenance.getAll(landlordId)
    ]);

    const occupiedUnits = properties.filter(p => p.status === 'occupied').length;
    const vacantUnits = properties.filter(p => p.status === 'vacant').length;
    const activeTenants = tenants.filter(t => t.status === 'active').length;
    const monthlyRevenue = properties
      .filter(p => p.status === 'occupied')
      .reduce((sum, p) => sum + Number(p.monthlyRent), 0);
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const overduePayments = payments.filter(p => p.status === 'overdue').length;
    const openMaintenance = maintenance.filter(m => m.status === 'open' || m.status === 'in_progress').length;
    const occupancyRate = properties.length > 0 
      ? Math.round((occupiedUnits / properties.length) * 100) 
      : 0;

    return {
      totalProperties: properties.length,
      occupiedUnits,
      vacantUnits,
      totalTenants: activeTenants,
      monthlyRevenue,
      pendingPayments,
      overduePayments,
      openMaintenanceRequests: openMaintenance,
      occupancyRate
    };
  }
};

// Helper functions to map database records to frontend types
function mapDbPropertyToProperty(dbProperty: any): Property {
  return {
    id: dbProperty.id,
    name: dbProperty.name,
    address: dbProperty.address,
    city: dbProperty.city,
    state: dbProperty.state,
    zipCode: dbProperty.zip_code,
    type: dbProperty.type,
    bedrooms: dbProperty.bedrooms,
    bathrooms: dbProperty.bathrooms,
    squareFeet: dbProperty.square_feet,
    monthlyRent: Number(dbProperty.monthly_rent),
    status: dbProperty.status,
    imageUrl: dbProperty.image_url,
    description: dbProperty.description,
    amenities: dbProperty.amenities || []
  };
}

function mapDbTenantToTenant(dbTenant: any): Tenant {
  return {
    id: dbTenant.id,
    firstName: dbTenant.first_name,
    lastName: dbTenant.last_name,
    email: dbTenant.email,
    phone: dbTenant.phone,
    propertyId: dbTenant.property_id,
    propertyName: dbTenant.property_name || '',
    unitNumber: dbTenant.unit_number,
    leaseStart: dbTenant.lease_start,
    leaseEnd: dbTenant.lease_end,
    monthlyRent: Number(dbTenant.monthly_rent),
    securityDeposit: Number(dbTenant.security_deposit),
    status: dbTenant.status,
    emergencyContact: {
      name: dbTenant.emergency_contact_name || '',
      phone: dbTenant.emergency_contact_phone || '',
      relationship: dbTenant.emergency_contact_relationship || ''
    }
  };
}

function mapDbLeaseToLease(dbLease: any): Lease {
  return {
    id: dbLease.id,
    tenantId: dbLease.tenant_id,
    tenantName: dbLease.tenant_name || '',
    propertyId: dbLease.property_id,
    propertyName: dbLease.property_name || '',
    startDate: dbLease.start_date,
    endDate: dbLease.end_date,
    monthlyRent: Number(dbLease.monthly_rent),
    securityDeposit: Number(dbLease.security_deposit),
    petDeposit: dbLease.pet_deposit ? Number(dbLease.pet_deposit) : undefined,
    terms: dbLease.terms,
    status: dbLease.status
  };
}

function mapDbPaymentToPayment(dbPayment: any): Payment {
  return {
    id: dbPayment.id,
    tenantId: dbPayment.tenant_id,
    tenantName: dbPayment.tenant_name || '',
    propertyId: dbPayment.property_id,
    propertyName: dbPayment.property_name || '',
    amount: Number(dbPayment.amount),
    dueDate: dbPayment.due_date,
    paidDate: dbPayment.paid_date,
    status: dbPayment.status,
    paymentMethod: dbPayment.payment_method,
    description: dbPayment.description
  };
}

function mapDbMaintenanceToMaintenance(dbMaintenance: any): MaintenanceRequest {
  return {
    id: dbMaintenance.id,
    propertyId: dbMaintenance.property_id,
    propertyName: dbMaintenance.property_name || '',
    tenantId: dbMaintenance.tenant_id,
    tenantName: dbMaintenance.tenant_name || '',
    title: dbMaintenance.title,
    description: dbMaintenance.description,
    category: dbMaintenance.category,
    priority: dbMaintenance.priority,
    status: dbMaintenance.status,
    createdAt: dbMaintenance.created_at,
    completedAt: dbMaintenance.completed_at,
    assignedTo: dbMaintenance.assigned_to,
    estimatedCost: dbMaintenance.estimated_cost ? Number(dbMaintenance.estimated_cost) : undefined,
    actualCost: dbMaintenance.actual_cost ? Number(dbMaintenance.actual_cost) : undefined
  };
}
