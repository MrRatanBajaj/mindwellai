ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';
UPDATE public.feedback SET status = 'approved' WHERE status = 'pending';

DROP POLICY IF EXISTS "Anyone can view feedback for public wall" ON public.feedback;
DROP POLICY IF EXISTS "Public can view approved feedback" ON public.feedback;
CREATE POLICY "Public can view approved feedback"
  ON public.feedback FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback;
CREATE POLICY "Admins can view all feedback"
  ON public.feedback FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND (p.email LIKE '%@mindwellai.com' OR p.email LIKE '%@wellmindai.in' OR p.email = 'ratankumar4937@gmail.com')));

DROP POLICY IF EXISTS "Admins can update feedback" ON public.feedback;
CREATE POLICY "Admins can update feedback"
  ON public.feedback FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND (p.email LIKE '%@mindwellai.com' OR p.email LIKE '%@wellmindai.in' OR p.email = 'ratankumar4937@gmail.com')));

DROP POLICY IF EXISTS "Admins can delete feedback" ON public.feedback;
CREATE POLICY "Admins can delete feedback"
  ON public.feedback FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND (p.email LIKE '%@mindwellai.com' OR p.email LIKE '%@wellmindai.in' OR p.email = 'ratankumar4937@gmail.com')));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.feedback TO authenticated;
GRANT SELECT, INSERT ON public.feedback TO anon;