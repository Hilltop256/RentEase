-- RentEase Supabase Database Schema
-- Copy and run this in Supabase SQL Editor (Dashboard → SQL Editor)

-- 1. PROFILES TABLE (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('landlord', 'tenant', 'admin')) DEFAULT 'tenant',
  company_name TEXT,
  avatar_url TEXT,
  is_onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROPERTIES TABLE
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  type TEXT CHECK (type IN ('apartment', 'house', 'condo', 'townhouse')) DEFAULT 'apartment',
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  square_feet INTEGER DEFAULT 0,
  monthly_rent DECIMAL(10,2) DEFAULT 0,
  status TEXT CHECK (status IN ('occupied', 'vacant', 'maintenance')) DEFAULT 'vacant',
  image_url TEXT,
  description TEXT,
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TENANTS TABLE
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  unit_number TEXT,
  lease_start DATE,
  lease_end DATE,
  monthly_rent DECIMAL(10,2) DEFAULT 0,
  security_deposit DECIMAL(10,2) DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'pending',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. LEASES TABLE
CREATE TABLE public.leases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_rent DECIMAL(10,2) NOT NULL,
  security_deposit DECIMAL(10,2) DEFAULT 0,
  pet_deposit DECIMAL(10,2) DEFAULT 0,
  terms TEXT,
  status TEXT CHECK (status IN ('active', 'expired', 'terminated', 'pending')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PAYMENTS TABLE
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT CHECK (status IN ('paid', 'pending', 'overdue', 'partial')) DEFAULT 'pending',
  payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'credit_card', 'check', 'cash')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. MAINTENANCE REQUESTS TABLE
CREATE TABLE public.maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other')) DEFAULT 'other',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  assigned_to TEXT,
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2)
);

-- Row Level Security (RLS) - ENABLE FIRST
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for PROPERTIES
CREATE POLICY "Landlords can view properties" ON public.properties FOR SELECT USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can insert properties" ON public.properties FOR INSERT WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords can update properties" ON public.properties FOR UPDATE USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can delete properties" ON public.properties FOR DELETE USING (landlord_id = auth.uid());

-- RLS Policies for TENANTS
CREATE POLICY "Landlords can view tenants" ON public.tenants FOR SELECT USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can insert tenants" ON public.tenants FOR INSERT WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords can update tenants" ON public.tenants FOR UPDATE USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can delete tenants" ON public.tenants FOR DELETE USING (landlord_id = auth.uid());

-- RLS Policies for LEASES
CREATE POLICY "Landlords can view leases" ON public.leases FOR SELECT USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can insert leases" ON public.leases FOR INSERT WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords can update leases" ON public.leases FOR UPDATE USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can delete leases" ON public.leases FOR DELETE USING (landlord_id = auth.uid());

-- RLS Policies for PAYMENTS
CREATE POLICY "Landlords can view payments" ON public.payments FOR SELECT USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can insert payments" ON public.payments FOR INSERT WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords can update payments" ON public.payments FOR UPDATE USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can delete payments" ON public.payments FOR DELETE USING (landlord_id = auth.uid());

-- RLS Policies for MAINTENANCE
CREATE POLICY "Users can view maintenance" ON public.maintenance_requests FOR SELECT USING (landlord_id = auth.uid() OR tenant_id = auth.uid());
CREATE POLICY "Landlords can insert maintenance" ON public.maintenance_requests FOR INSERT WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords can update maintenance" ON public.maintenance_requests FOR UPDATE USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can delete maintenance" ON public.maintenance_requests FOR DELETE USING (landlord_id = auth.uid());

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'tenant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_properties_landlord ON properties(landlord_id);
CREATE INDEX idx_tenants_landlord ON tenants(landlord_id);
CREATE INDEX idx_tenants_property ON tenants(property_id);
CREATE INDEX idx_leases_property ON leases(property_id);
CREATE INDEX idx_leases_tenant ON leases(tenant_id);
CREATE INDEX idx_payments_property ON payments(property_id);
CREATE INDEX idx_payments_tenant ON payments(tenant_id);
CREATE INDEX idx_maintenance_property ON maintenance_requests(property_id);

SELECT 'Database schema created successfully!' AS message;
