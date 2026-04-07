-- RentEase: Add NEW Tables Only
-- Run this in Supabase SQL Editor to add the missing tables

-- 8. VENDORS TABLE (for vendor management)
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  specialty TEXT CHECK (specialty IN ('plumbing', 'electrical', 'hvac', 'appliance', 'general', 'cleaning', 'landscaping', 'roofing', 'painting', 'other')),
  hourly_rate DECIMAL(10,2),
  rating DECIMAL(2,1) DEFAULT 0,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. EXPENSES TABLE (for P&L and expense tracking)
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('maintenance', 'repairs', 'utilities', 'taxes', 'insurance', 'mortgage', 'management_fee', 'legal', 'marketing', 'other')),
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  receipt_url TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. VACANCIES TABLE (for vacant units and leads)
CREATE TABLE IF NOT EXISTS public.vacancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  unit_number TEXT,
  status TEXT CHECK (status IN ('available', 'pending', 'occupied')) DEFAULT 'available',
  available_date DATE,
  rent_amount DECIMAL(10,2),
  description TEXT,
  amenities TEXT[],
  listing_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. LEADS TABLE (for vacancy prospects)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vacancy_id UUID REFERENCES vacancies(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  status TEXT CHECK (status IN ('new', 'contacted', 'showing', 'application', 'approved', 'rejected', 'converted')) DEFAULT 'new',
  notes TEXT,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. DOCUMENTS TABLE (for secure document storage)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('lease', 'addendum', 'invoice', 'receipt', 'id_document', 'insurance', 'tax', 'other')) DEFAULT 'other',
  category TEXT CHECK (category IN ('tenant', 'property', 'financial', 'legal', 'other')) DEFAULT 'other',
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  description TEXT,
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. NOTIFICATIONS TABLE (for automated reminders)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('rent_reminder', 'lease_expiry', 'maintenance_due', 'payment_received', 'late_fee', 'custom')) DEFAULT 'custom',
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')) DEFAULT 'pending',
  is_recurring BOOLEAN DEFAULT false,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('daily', 'weekly', 'monthly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add photos column to maintenance_requests if it doesn't exist
ALTER TABLE public.maintenance_requests ADD COLUMN IF NOT EXISTS photos TEXT[];
ALTER TABLE public.maintenance_requests ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL;

-- Row Level Security for NEW tables
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for EXPENSES
DROP POLICY IF EXISTS "Landlords can view expenses" ON public.expenses;
DROP POLICY IF EXISTS "Landlords can insert expenses" ON public.expenses;
DROP POLICY IF EXISTS "Landlords can update expenses" ON public.expenses;
DROP POLICY IF EXISTS "Landlords can delete expenses" ON public.expenses;

CREATE POLICY "Landlords can view expenses" ON public.expenses FOR SELECT USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can insert expenses" ON public.expenses FOR INSERT WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords can update expenses" ON public.expenses FOR UPDATE USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can delete expenses" ON public.expenses FOR DELETE USING (landlord_id = auth.uid());

-- RLS Policies for VENDORS
DROP POLICY IF EXISTS "Landlords can view vendors" ON public.vendors;
DROP POLICY IF EXISTS "Landlords can insert vendors" ON public.vendors;
DROP POLICY IF EXISTS "Landlords can update vendors" ON public.vendors;
DROP POLICY IF EXISTS "Landlords can delete vendors" ON public.vendors;

CREATE POLICY "Landlords can view vendors" ON public.vendors FOR SELECT USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can insert vendors" ON public.vendors FOR INSERT WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords can update vendors" ON public.vendors FOR UPDATE USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can delete vendors" ON public.vendors FOR DELETE USING (landlord_id = auth.uid());

-- RLS Policies for VACANCIES
DROP POLICY IF EXISTS "Landlords can view vacancies" ON public.vacancies;
DROP POLICY IF EXISTS "Landlords can insert vacancies" ON public.vacancies;
DROP POLICY IF EXISTS "Landlords can update vacancies" ON public.vacancies;
DROP POLICY IF EXISTS "Landlords can delete vacancies" ON public.vacancies;

CREATE POLICY "Landlords can view vacancies" ON public.vacancies FOR SELECT USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can insert vacancies" ON public.vacancies FOR INSERT WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords can update vacancies" ON public.vacancies FOR UPDATE USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can delete vacancies" ON public.vacancies FOR DELETE USING (landlord_id = auth.uid());

-- RLS Policies for LEADS
DROP POLICY IF EXISTS "Landlords can view leads" ON public.leads;
DROP POLICY IF EXISTS "Landlords can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Landlords can update leads" ON public.leads;
DROP POLICY IF EXISTS "Landlords can delete leads" ON public.leads;

CREATE POLICY "Landlords can view leads" ON public.leads FOR SELECT USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can insert leads" ON public.leads FOR INSERT WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords can update leads" ON public.leads FOR UPDATE USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can delete leads" ON public.leads FOR DELETE USING (landlord_id = auth.uid());

-- RLS Policies for DOCUMENTS
DROP POLICY IF EXISTS "Landlords can view documents" ON public.documents;
DROP POLICY IF EXISTS "Landlords can insert documents" ON public.documents;
DROP POLICY IF EXISTS "Landlords can update documents" ON public.documents;
DROP POLICY IF EXISTS "Landlords can delete documents" ON public.documents;

CREATE POLICY "Landlords can view documents" ON public.documents FOR SELECT USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can insert documents" ON public.documents FOR INSERT WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords can update documents" ON public.documents FOR UPDATE USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can delete documents" ON public.documents FOR DELETE USING (landlord_id = auth.uid());

-- RLS Policies for NOTIFICATIONS
DROP POLICY IF EXISTS "Landlords can view notifications" ON public.notifications;
DROP POLICY IF EXISTS "Landlords can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Landlords can update notifications" ON public.notifications;
DROP POLICY IF EXISTS "Landlords can delete notifications" ON public.notifications;

CREATE POLICY "Landlords can view notifications" ON public.notifications FOR SELECT USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can insert notifications" ON public.notifications FOR INSERT WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords can update notifications" ON public.notifications FOR UPDATE USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can delete notifications" ON public.notifications FOR DELETE USING (landlord_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_expenses_landlord ON expenses(landlord_id);
CREATE INDEX IF NOT EXISTS idx_expenses_property ON expenses(property_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_vendors_landlord ON vendors(landlord_id);
CREATE INDEX IF NOT EXISTS idx_vacancies_landlord ON vacancies(landlord_id);
CREATE INDEX IF NOT EXISTS idx_leads_landlord ON leads(landlord_id);
CREATE INDEX IF NOT EXISTS idx_leads_vacancy ON leads(vacancy_id);
CREATE INDEX IF NOT EXISTS idx_documents_landlord ON documents(landlord_id);
CREATE INDEX IF NOT EXISTS idx_notifications_landlord ON notifications(landlord_id);

SELECT 'New tables added successfully!' AS message;
