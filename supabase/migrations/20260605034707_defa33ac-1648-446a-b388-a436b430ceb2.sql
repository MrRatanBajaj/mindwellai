-- Security fix 1: analytics — users may only read their own rows
DROP POLICY IF EXISTS "Allow read access for analytics data" ON public.analytics;
CREATE POLICY "Users read own analytics"
ON public.analytics FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Security fix 2: feedback — public must not see emails
DROP POLICY IF EXISTS "Public can view approved feedback" ON public.feedback;
CREATE OR REPLACE VIEW public.approved_feedback_public AS
SELECT id, name, category, rating, feedback, suggestions, created_at, status
FROM public.feedback
WHERE status = 'approved';
GRANT SELECT ON public.approved_feedback_public TO anon, authenticated;

-- Security fix 3: inbound_chat_sessions — restrict update to admin only
-- (visitor flows go through edge functions using service_role)
DROP POLICY IF EXISTS "Anyone can update own session by token" ON public.inbound_chat_sessions;
CREATE POLICY "Admins update sessions"
ON public.inbound_chat_sessions FOR UPDATE
TO authenticated
USING (is_blog_admin((auth.jwt() ->> 'email'::text)))
WITH CHECK (is_blog_admin((auth.jwt() ->> 'email'::text)));