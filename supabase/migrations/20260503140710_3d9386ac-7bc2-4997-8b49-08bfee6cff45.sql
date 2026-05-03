-- Allow anyone to view feedback for the public Feedback Wall
CREATE POLICY "Anyone can view feedback for public wall"
ON public.feedback
FOR SELECT
USING (true);