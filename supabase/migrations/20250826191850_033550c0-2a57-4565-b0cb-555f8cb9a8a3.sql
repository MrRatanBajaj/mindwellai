-- Remove the overly permissive SELECT policy that allows all authenticated users to view feedback
DROP POLICY IF EXISTS "Authenticated users can view feedback" ON public.feedback;

-- Keep the INSERT policy to allow feedback submission
-- (The "Anyone can submit feedback" policy remains unchanged)

-- Note: This restricts feedback viewing to service role only, which is appropriate
-- for customer feedback that should only be accessible to administrators