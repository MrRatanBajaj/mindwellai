-- Fix security vulnerability in consultations table
-- Remove overly permissive RLS policies and add secure ones

-- Drop existing insecure policies
DROP POLICY IF EXISTS "Anyone can create consultations" ON public.consultations;
DROP POLICY IF EXISTS "Users can view their own consultations" ON public.consultations;
DROP POLICY IF EXISTS "Users can update their own consultations" ON public.consultations;

-- Make user_id NOT NULL to prevent data without ownership
ALTER TABLE public.consultations 
ALTER COLUMN user_id SET NOT NULL;

-- Add secure RLS policies that require authentication
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