-- Tenant Features: Messages Table
-- Run this in Supabase SQL Editor

-- MESSAGES TABLE (for tenant-landlord communication)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for MESSAGES
DROP POLICY IF EXISTS "Users can view messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages" ON public.messages;

CREATE POLICY "Users can view messages" ON public.messages FOR SELECT 
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can insert messages" ON public.messages FOR INSERT 
  WITH CHECK (sender_id = auth.uid());

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);

-- Add message column to maintenance_requests for tenant notes (if needed)
ALTER TABLE public.maintenance_requests ADD COLUMN IF NOT EXISTS tenant_notes TEXT;

SELECT 'Tenant features tables added successfully!' AS message;
