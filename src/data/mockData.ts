import type { Property, Tenant, Payment, MaintenanceRequest, Lease, DashboardStats } from '@/types';

export const properties: Property[] = [
  {
    id: '1',
    name: 'Sunset Gardens Apartments',
    address: '123 Sunset Boulevard',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90028',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 950,
    monthlyRent: 2800,
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    description: 'Modern apartment complex with pool and gym access',
    amenities: ['Pool', 'Gym', 'Parking', 'Laundry']
  },
  {
    id: '2',
    name: 'Downtown Loft',
    address: '456 Main Street',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90014',
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 750,
    monthlyRent: 2200,
    status: 'vacant',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    description: 'Stylish downtown loft with city views',
    amenities: ['Rooftop', 'Parking', 'Pet Friendly']
  },
  {
    id: '3',
    name: 'Family Home on Maple',
    address: '789 Maple Avenue',
    city: 'Pasadena',
    state: 'CA',
    zipCode: '91101',
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2100,
    monthlyRent: 4500,
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    description: 'Spacious family home with large backyard',
    amenities: ['Backyard', 'Garage', 'Fireplace', 'Garden']
  },
  {
    id: '4',
    name: 'Beachside Condo',
    address: '321 Ocean Drive',
    city: 'Santa Monica',
    state: 'CA',
    zipCode: '90401',
    type: 'condo',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1100,
    monthlyRent: 3800,
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1512918760513-95f192633805?w=800',
    description: 'Luxury condo steps from the beach',
    amenities: ['Ocean View', 'Pool', 'Concierge', 'Parking']
  },
  {
    id: '5',
    name: 'Modern Townhouse',
    address: '654 Park Lane',
    city: 'Burbank',
    state: 'CA',
    zipCode: '91505',
    type: 'townhouse',
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 1600,
    monthlyRent: 3200,
    status: 'maintenance',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    description: 'Contemporary townhouse with modern finishes',
    amenities: ['Garage', 'Patio', 'Smart Home', 'Storage']
  },
  {
    id: '6',
    name: 'Cozy Studio',
    address: '987 Hill Street',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90026',
    type: 'apartment',
    bedrooms: 0,
    bathrooms: 1,
    squareFeet: 450,
    monthlyRent: 1500,
    status: 'vacant',
    imageUrl: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
    description: 'Affordable studio in trendy neighborhood',
    amenities: ['Laundry', 'Bike Storage']
  }
];

export const tenants: Tenant[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    propertyId: '1',
    propertyName: 'Sunset Gardens Apartments',
    unitNumber: '4B',
    leaseStart: '2024-01-01',
    leaseEnd: '2024-12-31',
    monthlyRent: 2800,
    securityDeposit: 5600,
    status: 'active',
    emergencyContact: {
      name: 'Michael Johnson',
      phone: '(555) 987-6543',
      relationship: 'Brother'
    }
  },
  {
    id: '2',
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@email.com',
    phone: '(555) 234-5678',
    propertyId: '3',
    propertyName: 'Family Home on Maple',
    leaseStart: '2024-02-15',
    leaseEnd: '2025-02-14',
    monthlyRent: 4500,
    securityDeposit: 9000,
    status: 'active',
    emergencyContact: {
      name: 'Lisa Chen',
      phone: '(555) 876-5432',
      relationship: 'Spouse'
    }
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '(555) 345-6789',
    propertyId: '4',
    propertyName: 'Beachside Condo',
    unitNumber: '12A',
    leaseStart: '2024-03-01',
    leaseEnd: '2025-02-28',
    monthlyRent: 3800,
    securityDeposit: 7600,
    status: 'active',
    emergencyContact: {
      name: 'Carlos Rodriguez',
      phone: '(555) 765-4321',
      relationship: 'Father'
    }
  },
  {
    id: '4',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@email.com',
    phone: '(555) 456-7890',
    propertyId: '5',
    propertyName: 'Modern Townhouse',
    leaseStart: '2024-01-15',
    leaseEnd: '2025-01-14',
    monthlyRent: 3200,
    securityDeposit: 6400,
    status: 'active',
    emergencyContact: {
      name: 'Mary Wilson',
      phone: '(555) 654-3210',
      relationship: 'Mother'
    }
  },
  {
    id: '5',
    firstName: 'Amanda',
    lastName: 'Thompson',
    email: 'amanda.thompson@email.com',
    phone: '(555) 567-8901',
    propertyId: '2',
    propertyName: 'Downtown Loft',
    leaseStart: '2023-06-01',
    leaseEnd: '2024-05-31',
    monthlyRent: 2200,
    securityDeposit: 4400,
    status: 'inactive',
    emergencyContact: {
      name: 'Robert Thompson',
      phone: '(555) 543-2109',
      relationship: 'Father'
    }
  }
];

export const payments: Payment[] = [
  {
    id: '1',
    tenantId: '1',
    tenantName: 'Sarah Johnson',
    propertyId: '1',
    propertyName: 'Sunset Gardens Apartments',
    amount: 2800,
    dueDate: '2024-02-01',
    paidDate: '2024-02-01',
    status: 'paid',
    paymentMethod: 'bank_transfer',
    description: 'February 2024 Rent'
  },
  {
    id: '2',
    tenantId: '1',
    tenantName: 'Sarah Johnson',
    propertyId: '1',
    propertyName: 'Sunset Gardens Apartments',
    amount: 2800,
    dueDate: '2024-03-01',
    paidDate: '2024-03-02',
    status: 'paid',
    paymentMethod: 'bank_transfer',
    description: 'March 2024 Rent'
  },
  {
    id: '3',
    tenantId: '2',
    tenantName: 'David Chen',
    propertyId: '3',
    propertyName: 'Family Home on Maple',
    amount: 4500,
    dueDate: '2024-02-15',
    paidDate: '2024-02-14',
    status: 'paid',
    paymentMethod: 'credit_card',
    description: 'February 2024 Rent'
  },
  {
    id: '4',
    tenantId: '2',
    tenantName: 'David Chen',
    propertyId: '3',
    propertyName: 'Family Home on Maple',
    amount: 4500,
    dueDate: '2024-03-15',
    status: 'pending',
    description: 'March 2024 Rent'
  },
  {
    id: '5',
    tenantId: '3',
    tenantName: 'Emily Rodriguez',
    propertyId: '4',
    propertyName: 'Beachside Condo',
    amount: 3800,
    dueDate: '2024-02-01',
    paidDate: '2024-02-01',
    status: 'paid',
    paymentMethod: 'bank_transfer',
    description: 'February 2024 Rent'
  },
  {
    id: '6',
    tenantId: '3',
    tenantName: 'Emily Rodriguez',
    propertyId: '4',
    propertyName: 'Beachside Condo',
    amount: 3800,
    dueDate: '2024-03-01',
    paidDate: '2024-03-05',
    status: 'paid',
    paymentMethod: 'check',
    description: 'March 2024 Rent'
  },
  {
    id: '7',
    tenantId: '4',
    tenantName: 'James Wilson',
    propertyId: '5',
    propertyName: 'Modern Townhouse',
    amount: 3200,
    dueDate: '2024-02-15',
    status: 'overdue',
    description: 'February 2024 Rent'
  },
  {
    id: '8',
    tenantId: '4',
    tenantName: 'James Wilson',
    propertyId: '5',
    propertyName: 'Modern Townhouse',
    amount: 3200,
    dueDate: '2024-03-15',
    status: 'pending',
    description: 'March 2024 Rent'
  },
  {
    id: '9',
    tenantId: '1',
    tenantName: 'Sarah Johnson',
    propertyId: '1',
    propertyName: 'Sunset Gardens Apartments',
    amount: 2800,
    dueDate: '2024-04-01',
    status: 'pending',
    description: 'April 2024 Rent'
  },
  {
    id: '10',
    tenantId: '5',
    tenantName: 'Amanda Thompson',
    propertyId: '2',
    propertyName: 'Downtown Loft',
    amount: 2200,
    dueDate: '2024-05-01',
    status: 'pending',
    description: 'May 2024 Rent'
  }
];

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: '1',
    propertyId: '1',
    propertyName: 'Sunset Gardens Apartments',
    tenantId: '1',
    tenantName: 'Sarah Johnson',
    title: 'Leaky Faucet',
    description: 'Kitchen faucet is dripping constantly',
    category: 'plumbing',
    priority: 'low',
    status: 'completed',
    createdAt: '2024-02-10',
    completedAt: '2024-02-12',
    assignedTo: 'Mike\'s Plumbing',
    estimatedCost: 150,
    actualCost: 125
  },
  {
    id: '2',
    propertyId: '3',
    propertyName: 'Family Home on Maple',
    tenantId: '2',
    tenantName: 'David Chen',
    title: 'HVAC Not Working',
    description: 'Air conditioning stopped working, house is very hot',
    category: 'hvac',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2024-03-05',
    assignedTo: 'Cool Air Services',
    estimatedCost: 450
  },
  {
    id: '3',
    propertyId: '4',
    propertyName: 'Beachside Condo',
    tenantId: '3',
    tenantName: 'Emily Rodriguez',
    title: 'Broken Dishwasher',
    description: 'Dishwasher won\'t drain properly',
    category: 'appliance',
    priority: 'medium',
    status: 'open',
    createdAt: '2024-03-08'
  },
  {
    id: '4',
    propertyId: '5',
    propertyName: 'Modern Townhouse',
    tenantId: '4',
    tenantName: 'James Wilson',
    title: 'Electrical Outage',
    description: 'Multiple outlets not working in living room',
    category: 'electrical',
    priority: 'high',
    status: 'open',
    createdAt: '2024-03-10'
  },
  {
    id: '5',
    propertyId: '1',
    propertyName: 'Sunset Gardens Apartments',
    tenantId: '1',
    tenantName: 'Sarah Johnson',
    title: 'Clogged Drain',
    description: 'Bathroom sink is draining very slowly',
    category: 'plumbing',
    priority: 'medium',
    status: 'open',
    createdAt: '2024-03-12'
  },
  {
    id: '6',
    propertyId: '5',
    propertyName: 'Modern Townhouse',
    tenantId: '4',
    tenantName: 'James Wilson',
    title: 'Roof Leak',
    description: 'Water stain on ceiling in master bedroom',
    category: 'structural',
    priority: 'urgent',
    status: 'in_progress',
    createdAt: '2024-03-01',
    assignedTo: 'Premier Roofing',
    estimatedCost: 1200
  }
];

export const leases: Lease[] = [
  {
    id: '1',
    tenantId: '1',
    tenantName: 'Sarah Johnson',
    propertyId: '1',
    propertyName: 'Sunset Gardens Apartments',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    monthlyRent: 2800,
    securityDeposit: 5600,
    terms: '12-month lease, no pets allowed',
    status: 'active'
  },
  {
    id: '2',
    tenantId: '2',
    tenantName: 'David Chen',
    propertyId: '3',
    propertyName: 'Family Home on Maple',
    startDate: '2024-02-15',
    endDate: '2025-02-14',
    monthlyRent: 4500,
    securityDeposit: 9000,
    petDeposit: 500,
    terms: '12-month lease, pets allowed with deposit',
    status: 'active'
  },
  {
    id: '3',
    tenantId: '3',
    tenantName: 'Emily Rodriguez',
    propertyId: '4',
    propertyName: 'Beachside Condo',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    monthlyRent: 3800,
    securityDeposit: 7600,
    terms: '12-month lease, no smoking',
    status: 'active'
  },
  {
    id: '4',
    tenantId: '4',
    tenantName: 'James Wilson',
    propertyId: '5',
    propertyName: 'Modern Townhouse',
    startDate: '2024-01-15',
    endDate: '2025-01-14',
    monthlyRent: 3200,
    securityDeposit: 6400,
    terms: '12-month lease',
    status: 'active'
  },
  {
    id: '5',
    tenantId: '5',
    tenantName: 'Amanda Thompson',
    propertyId: '2',
    propertyName: 'Downtown Loft',
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    monthlyRent: 2200,
    securityDeposit: 4400,
    terms: '12-month lease',
    status: 'expired'
  }
];

export const getDashboardStats = (): DashboardStats => {
  const occupiedUnits = properties.filter(p => p.status === 'occupied').length;
  const vacantUnits = properties.filter(p => p.status === 'vacant').length;
  const totalProperties = properties.length;
  
  const monthlyRevenue = payments
    .filter(p => p.status === 'paid' && p.paidDate && new Date(p.paidDate).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + p.amount, 0);
  
  const pendingPayments = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const overduePayments = payments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);
  
  return {
    totalProperties,
    occupiedUnits,
    vacantUnits,
    totalTenants: tenants.filter(t => t.status === 'active').length,
    monthlyRevenue,
    pendingPayments,
    overduePayments,
    openMaintenanceRequests: maintenanceRequests.filter(m => m.status === 'open' || m.status === 'in_progress').length,
    occupancyRate: Math.round((occupiedUnits / totalProperties) * 100)
  };
};

export const getMonthlyRevenueData = () => {
  return [
    { month: 'Jan', revenue: 14500 },
    { month: 'Feb', revenue: 15200 },
    { month: 'Mar', revenue: 14800 },
    { month: 'Apr', revenue: 16300 },
    { month: 'May', revenue: 15800 },
    { month: 'Jun', revenue: 17200 },
  ];
};

export const getOccupancyData = () => {
  return [
    { name: 'Occupied', value: 4, color: '#10b981' },
    { name: 'Vacant', value: 2, color: '#f59e0b' },
    { name: 'Maintenance', value: 1, color: '#ef4444' },
  ];
};
