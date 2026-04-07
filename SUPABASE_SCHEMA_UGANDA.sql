-- RentEase Uganda: Updated Database Schema
-- Based on Uganda Landlord and Tenant Act 2022
-- Run this in Supabase SQL Editor to add/update tables

-- =====================================================
-- PROPERTIES TABLE - Add Uganda-specific fields
-- =====================================================
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS plot_number TEXT,
ADD COLUMN IF NOT EXISTS block_number TEXT,
ADD COLUMN IF NOT EXISTS landmark TEXT,
ADD COLUMN IF NOT EXISTS district TEXT,
ADD COLUMN IF NOT EXISTS is_furnished BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_fit_for_habitation BOOLEAN DEFAULT true;

-- Update property types to include Uganda types
-- Note: This is a comment, actual CHECK constraint modification may require table recreation

-- =====================================================
-- TENANTS TABLE - Add Uganda-specific fields
-- =====================================================
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS id_number TEXT,
ADD COLUMN IF NOT EXISTS id_type TEXT CHECK (id_type IN ('national_id', 'passport', 'drivers_license', 'other')),
ADD COLUMN IF NOT EXISTS rent_in_advance INTEGER DEFAULT 1;

-- =====================================================
-- PAYMENTS TABLE - Update payment methods for Uganda
-- =====================================================
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS late_fee DECIMAL(10,2);

-- Note: payment_method already supports bank_transfer, credit_card, check, cash
-- Add mobile_money support:
-- ALTER TYPE payment_method_enum ADD VALUE IF NOT EXISTS 'mobile_money';

-- =====================================================
-- MAINTENANCE REQUESTS TABLE - Add reportedBy field
-- =====================================================
ALTER TABLE public.maintenance_requests 
ADD COLUMN IF NOT EXISTS reported_by TEXT;

-- =====================================================
-- LEASES TABLE - Add Uganda-specific fields
-- =====================================================
ALTER TABLE public.leases 
ADD COLUMN IF NOT EXISTS rent_in_advance INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS notice_period INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS rent_increase_cap DECIMAL(5,2) DEFAULT 10.00,
ADD COLUMN IF NOT EXISTS is_written BOOLEAN DEFAULT false;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_properties_district ON properties(district);
CREATE INDEX IF NOT EXISTS idx_properties_plot_number ON properties(plot_number);
CREATE INDEX IF NOT EXISTS idx_tenants_id_number ON tenants(id_number);
CREATE INDEX IF NOT EXISTS idx_tenants_id_type ON tenants(id_type);

-- =====================================================
-- SAMPLE DATA - Properties with Uganda addresses
-- =====================================================
-- Example properties (uncomment to add sample data):
-- INSERT INTO properties (landlord_id, name, plot_number, block_number, landmark, city, district, type, monthly_rent, status)
-- VALUES 
--   ('USER_ID_HERE', 'Kampala Apartments Unit 1', 'Plot 123', 'Block A', 'Near Kampala Road, opposite factory', 'Kampala', 'Kampala', 'apartment', 500000, 'occupied'),
--   ('USER_ID_HERE', 'Ntinda Rooms', 'Plot 45', 'Block B', 'Ntinda-Kiwatule Road', 'Kampala', 'Wakiso', 'room', 250000, 'vacant'),
--   ('USER_ID_HERE', 'Kisasi Shop', 'Plot 789', 'Block C', 'Kisasi-Kulambiro Road', 'Kampala', 'Wakiso', 'shop', 800000, 'occupied');

-- =====================================================
-- RLS POLICIES (Update existing if needed)
-- =====================================================
-- Properties - Landlords can only see their own
DROP POLICY IF EXISTS "Landlords can manage properties" ON properties;
CREATE POLICY "Landlords can manage properties" ON properties
  FOR ALL USING (landlord_id = auth.uid());

-- Tenants - Landlords can only see their tenants
DROP POLICY IF EXISTS "Landlords can manage tenants" ON tenants;
CREATE POLICY "Landlords can manage tenants" ON tenants
  FOR ALL USING (landlord_id = auth.uid());

-- Payments - Landlords can only see their payments
DROP POLICY IF EXISTS "Landlords can manage payments" ON payments;
CREATE POLICY "Landlords can manage payments" ON payments
  FOR ALL USING (landlord_id = auth.uid());

-- Maintenance - Landlords can manage
DROP POLICY IF EXISTS "Landlords can manage maintenance" ON maintenance_requests;
CREATE POLICY "Landlords can manage maintenance" ON maintenance_requests
  FOR ALL USING (landlord_id = auth.uid());

-- Leases - Landlords can manage
DROP POLICY IF EXISTS "Landlords can manage leases" ON leases;
CREATE POLICY "Landlords can manage leases" ON leases
  FOR ALL USING (landlord_id = auth.uid());

-- =====================================================
-- NOTES ON UGANDA LANDLORD AND TENANT ACT 2022 COMPLIANCE
-- =====================================================
-- 1. Tenancy Agreements: For rent >= UGX 500,000, agreements should be in writing/email
-- 2. Rent Payment: Must be in UGX unless otherwise agreed
-- 3. Rent in Advance: Cannot exceed 3 months for tenancies > 1 month
-- 4. Rent Increase: Cannot exceed 10% annually with 6 working days notice
-- 5. Security Deposit: Maximum 1 month's rent
-- 6. Termination Notice: 
--    - Weekly tenancy: 7 days notice
--    - Monthly tenancy: 30 days notice  
--    - Yearly tenancy: 60 days notice
-- 7. Property must be fit for human habitation
-- 8. Tenant must provide ID copy to landlord

-- Run this SQL in Supabase Dashboard → SQL Editor
