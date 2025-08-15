-- Fix security vulnerability in consultations table
-- Handle existing NULL user_id records properly

-- First, drop existing insecure policies
DROP POLICY IF EXISTS "Anyone can create consultations" ON public.consultations;
DROP POLICY IF EXISTS "Users can view their own consultations" ON public.consultations;
DROP POLICY IF EXISTS "Users can update their own consultations" ON public.consultations;

-- Create a system user UUID for existing orphaned consultations
-- This ensures data integrity while fixing the security issue
DO $$ 
DECLARE 
    system_uuid uuid := '00000000-0000-0000-0000-000000000000';
BEGIN
    -- Update existing NULL user_id records to a system UUID
    -- These will only be accessible to system/admin users
    UPDATE public.consultations 
    SET user_id = system_uuid 
    WHERE user_id IS NULL;
END $$;

-- Now make user_id NOT NULL to prevent future issues
ALTER TABLE public.consultations 
ALTER COLUMN user_id SET NOT NULL;

-- Add secure RLS policies that require authentication
-- Regular users can only access their own consultations
CREATE POLICY "Authenticated users can create their own consultations" 
ON public.consultations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view only their own consultations" 
ON public.consultations 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update only their own consultations" 
ON public.consultations 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete only their own consultations" 
ON public.consultations 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create index for better performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON public.consultations(user_id);