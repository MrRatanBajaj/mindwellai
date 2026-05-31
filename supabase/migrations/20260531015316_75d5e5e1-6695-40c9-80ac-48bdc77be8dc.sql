-- Fix "permission denied for table users" on blog_posts
-- Root cause: policies select from auth.users which is not granted to authenticated.
-- Use auth.jwt() ->> 'email' instead (no auth.users access needed).

DROP POLICY IF EXISTS "Admins can delete posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can insert posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can read all posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can update posts" ON public.blog_posts;

CREATE POLICY "Admins can read all posts"
ON public.blog_posts FOR SELECT TO authenticated
USING (public.is_blog_admin((auth.jwt() ->> 'email')));

CREATE POLICY "Admins can insert posts"
ON public.blog_posts FOR INSERT TO authenticated
WITH CHECK (public.is_blog_admin((auth.jwt() ->> 'email')));

CREATE POLICY "Admins can update posts"
ON public.blog_posts FOR UPDATE TO authenticated
USING (public.is_blog_admin((auth.jwt() ->> 'email')))
WITH CHECK (public.is_blog_admin((auth.jwt() ->> 'email')));

CREATE POLICY "Admins can delete posts"
ON public.blog_posts FOR DELETE TO authenticated
USING (public.is_blog_admin((auth.jwt() ->> 'email')));
