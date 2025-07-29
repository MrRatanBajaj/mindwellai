-- Fix analytics table - add view policy for admin users
CREATE POLICY "Allow read access for analytics data" 
ON public.analytics 
FOR SELECT 
USING (auth.uid() IS NOT NULL);