
-- 1. Fix SECURITY DEFINER view
DROP VIEW IF EXISTS public.approved_feedback_public;
CREATE VIEW public.approved_feedback_public
WITH (security_invoker = true) AS
SELECT id, name, category, rating, feedback, suggestions, created_at, status
FROM public.feedback
WHERE status = 'approved';
GRANT SELECT ON public.approved_feedback_public TO anon, authenticated;

-- 2. Blog posts: remove public access to author_email
DROP POLICY IF EXISTS "Anyone can read published posts" ON public.blog_posts;

CREATE OR REPLACE VIEW public.published_blog_posts
WITH (security_invoker = true) AS
SELECT id, slug, title, excerpt, body_markdown, cover_image_url,
       tags, published, published_at, created_at, updated_at
FROM public.blog_posts
WHERE published = true;
GRANT SELECT ON public.published_blog_posts TO anon, authenticated;

CREATE POLICY "Authenticated can read published posts"
ON public.blog_posts FOR SELECT
TO authenticated
USING (published = true);

-- 3. Push subscriptions: tighten anonymous read
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON public.push_subscriptions;

CREATE POLICY "Users view their own subscriptions"
ON public.push_subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users delete their own subscriptions"
ON public.push_subscriptions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
