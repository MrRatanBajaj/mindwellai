-- Remove the public SELECT policy that exposes customer data
DROP POLICY IF EXISTS "Anyone can view feedback" ON public.feedback;

-- Add secure policy that only allows authenticated users to view feedback
CREATE POLICY "Authenticated users can view feedback" 
ON public.feedback 
FOR SELECT 
TO authenticated
USING (true);

-- Keep the existing INSERT policy as-is so anonymous users can still submit feedback
-- Policy "Anyone can submit feedback" remains unchanged