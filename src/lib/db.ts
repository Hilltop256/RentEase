import { supabase } from './supabase';
import type { Property, Tenant, Payment, MaintenanceRequest, Lease, DashboardStats, Expense, Vendor, Vacancy, Lead, Document, Notification, Message } from '@/types';

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

    async create(request: Partial<MaintenanceRequest>, landlordId: string): Promise<MaintenanceRequest> {
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

  // EXPENSES
  expenses: {
    async getAll(landlordId: string): Promise<Expense[]> {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('landlord_id', landlordId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data?.map(mapDbExpenseToExpense) || [];
    },

    async getByProperty(propertyId: string): Promise<Expense[]> {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('property_id', propertyId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data?.map(mapDbExpenseToExpense) || [];
    },

    async create(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>, landlordId: string): Promise<Expense> {
      const { data, error } = await supabase
        .from('expenses')
        .insert({ ...expense, landlord_id: landlordId })
        .select()
        .single();
      
      if (error) throw error;
      return mapDbExpenseToExpense(data);
    },

    async update(id: string, expense: Partial<Expense>): Promise<Expense> {
      const { data, error } = await supabase
        .from('expenses')
        .update({ ...expense, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return mapDbExpenseToExpense(data);
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // VENDORS
  vendors: {
    async getAll(landlordId: string): Promise<Vendor[]> {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('landlord_id', landlordId)
        .order('company_name', { ascending: true });
      
      if (error) throw error;
      return data?.map(mapDbVendorToVendor) || [];
    },

    async getById(id: string): Promise<Vendor | null> {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data ? mapDbVendorToVendor(data) : null;
    },

    async create(vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>, landlordId: string): Promise<Vendor> {
      const { data, error } = await supabase
        .from('vendors')
        .insert({ ...vendor, landlord_id: landlordId })
        .select()
        .single();
      
      if (error) throw error;
      return mapDbVendorToVendor(data);
    },

    async update(id: string, vendor: Partial<Vendor>): Promise<Vendor> {
      const { data, error } = await supabase
        .from('vendors')
        .update({ ...vendor, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return mapDbVendorToVendor(data);
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // VACANCIES
  vacancies: {
    async getAll(landlordId: string): Promise<Vacancy[]> {
      const { data, error } = await supabase
        .from('vacancies')
        .select('*')
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(mapDbVacancyToVacancy) || [];
    },

    async create(vacancy: Omit<Vacancy, 'id' | 'created_at' | 'updated_at'>, landlordId: string): Promise<Vacancy> {
      const { data, error } = await supabase
        .from('vacancies')
        .insert({ ...vacancy, landlord_id: landlordId })
        .select()
        .single();
      
      if (error) throw error;
      return mapDbVacancyToVacancy(data);
    },

    async update(id: string, vacancy: Partial<Vacancy>): Promise<Vacancy> {
      const { data, error } = await supabase
        .from('vacancies')
        .update({ ...vacancy, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return mapDbVacancyToVacancy(data);
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('vacancies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // LEADS
  leads: {
    async getAll(landlordId: string): Promise<Lead[]> {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(mapDbLeadToLead) || [];
    },

    async create(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>, landlordId: string): Promise<Lead> {
      const { data, error } = await supabase
        .from('leads')
        .insert({ ...lead, landlord_id: landlordId })
        .select()
        .single();
      
      if (error) throw error;
      return mapDbLeadToLead(data);
    },

    async update(id: string, lead: Partial<Lead>): Promise<Lead> {
      const { data, error } = await supabase
        .from('leads')
        .update({ ...lead, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return mapDbLeadToLead(data);
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // DOCUMENTS
  documents: {
    async getAll(landlordId: string): Promise<Document[]> {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(mapDbDocumentToDocument) || [];
    },

    async create(doc: Omit<Document, 'id' | 'created_at'>, landlordId: string): Promise<Document> {
      const { data, error } = await supabase
        .from('documents')
        .insert({ ...doc, landlord_id: landlordId })
        .select()
        .single();
      
      if (error) throw error;
      return mapDbDocumentToDocument(data);
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // NOTIFICATIONS
  notifications: {
    async getAll(landlordId: string): Promise<Notification[]> {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(mapDbNotificationToNotification) || [];
    },

    async create(notification: Omit<Notification, 'id' | 'created_at'>, landlordId: string): Promise<Notification> {
      const { data, error } = await supabase
        .from('notifications')
        .insert({ ...notification, landlord_id: landlordId })
        .select()
        .single();
      
      if (error) throw error;
      return mapDbNotificationToNotification(data);
    },

    async update(id: string, notification: Partial<Notification>): Promise<Notification> {
      const { data, error } = await supabase
        .from('notifications')
        .update(notification)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return mapDbNotificationToNotification(data);
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // MESSAGES (for tenant-landlord communication)
  messages: {
    async getConversation(userId1: string, userId2: string): Promise<Message[]> {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data?.map(mapDbMessageToMessage) || [];
    },

    async getAll(userId: string): Promise<Message[]> {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(mapDbMessageToMessage) || [];
    },

    async send(message: Partial<Message>): Promise<Message> {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: message.senderId,
          receiver_id: message.receiverId,
          content: message.content
        })
        .select()
        .single();
      
      if (error) throw error;
      return mapDbMessageToMessage(data);
    },

    async markAsRead(messageId: string): Promise<void> {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', messageId);
      
      if (error) throw error;
    }
  },

  // DASHBOARD STATS
  async getDashboardStats(landlordId: string): Promise<DashboardStats> {
    const [properties, tenants, payments, maintenance, expenses] = await Promise.all([
      db.properties.getAll(landlordId),
      db.tenants.getAll(landlordId),
      db.payments.getAll(landlordId),
      db.maintenance.getAll(landlordId),
      db.expenses.getAll(landlordId)
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
    
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const netIncome = monthlyRevenue - totalExpenses;

    return {
      totalProperties: properties.length,
      occupiedUnits,
      vacantUnits,
      totalTenants: activeTenants,
      monthlyRevenue,
      pendingPayments,
      overduePayments,
      openMaintenanceRequests: openMaintenance,
      occupancyRate,
      totalExpenses,
      netIncome
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
    photos: dbMaintenance.photos || [],
    createdAt: dbMaintenance.created_at,
    completedAt: dbMaintenance.completed_at,
    assignedTo: dbMaintenance.assigned_to,
    estimatedCost: dbMaintenance.estimated_cost ? Number(dbMaintenance.estimated_cost) : undefined,
    actualCost: dbMaintenance.actual_cost ? Number(dbMaintenance.actual_cost) : undefined
  };
}

function mapDbExpenseToExpense(dbExpense: any): Expense {
  return {
    id: dbExpense.id,
    propertyId: dbExpense.property_id,
    category: dbExpense.category,
    description: dbExpense.description,
    amount: Number(dbExpense.amount),
    date: dbExpense.date,
    vendorId: dbExpense.vendor_id,
    receiptUrl: dbExpense.receipt_url,
    isRecurring: dbExpense.is_recurring,
    recurringFrequency: dbExpense.recurring_frequency
  };
}

function mapDbVendorToVendor(dbVendor: any): Vendor {
  return {
    id: dbVendor.id,
    companyName: dbVendor.company_name,
    contactName: dbVendor.contact_name,
    email: dbVendor.email,
    phone: dbVendor.phone,
    specialty: dbVendor.specialty,
    hourlyRate: dbVendor.hourly_rate ? Number(dbVendor.hourly_rate) : undefined,
    rating: Number(dbVendor.rating) || 0,
    notes: dbVendor.notes,
    isActive: dbVendor.is_active
  };
}

function mapDbVacancyToVacancy(dbVacancy: any): Vacancy {
  return {
    id: dbVacancy.id,
    propertyId: dbVacancy.property_id,
    unitNumber: dbVacancy.unit_number,
    status: dbVacancy.status,
    availableDate: dbVacancy.available_date,
    rentAmount: dbVacancy.rent_amount ? Number(dbVacancy.rent_amount) : undefined,
    description: dbVacancy.description,
    amenities: dbVacancy.amenities || [],
    listingDate: dbVacancy.listing_date
  };
}

function mapDbLeadToLead(dbLead: any): Lead {
  return {
    id: dbLead.id,
    vacancyId: dbLead.vacancy_id,
    firstName: dbLead.first_name,
    lastName: dbLead.last_name,
    email: dbLead.email,
    phone: dbLead.phone,
    status: dbLead.status,
    notes: dbLead.notes,
    source: dbLead.source
  };
}

function mapDbDocumentToDocument(dbDoc: any): Document {
  return {
    id: dbDoc.id,
    tenantId: dbDoc.tenant_id,
    propertyId: dbDoc.property_id,
    name: dbDoc.name,
    type: dbDoc.type,
    category: dbDoc.category,
    fileUrl: dbDoc.file_url,
    fileSize: dbDoc.file_size,
    mimeType: dbDoc.mime_type,
    description: dbDoc.description,
    isEncrypted: dbDoc.is_encrypted
  };
}

function mapDbNotificationToNotification(dbNotification: any): Notification {
  return {
    id: dbNotification.id,
    tenantId: dbNotification.tenant_id,
    propertyId: dbNotification.property_id,
    type: dbNotification.type,
    title: dbNotification.title,
    message: dbNotification.message,
    scheduledFor: dbNotification.scheduled_for,
    sentAt: dbNotification.sent_at,
    status: dbNotification.status,
    isRecurring: dbNotification.is_recurring,
    recurringFrequency: dbNotification.recurring_frequency
  };
}

function mapDbMessageToMessage(dbMessage: any): Message {
  return {
    id: dbMessage.id,
    senderId: dbMessage.sender_id,
    receiverId: dbMessage.receiver_id,
    content: dbMessage.content,
    isRead: dbMessage.is_read,
    readAt: dbMessage.read_at,
    createdAt: dbMessage.created_at
  };
}
