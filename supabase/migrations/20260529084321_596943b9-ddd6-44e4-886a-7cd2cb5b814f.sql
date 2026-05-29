
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  cover_image_url text,
  body_markdown text not null default '',
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  author_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_idx on public.blog_posts (published, published_at desc);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);

grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;

alter table public.blog_posts enable row level security;

create or replace function public.is_blog_admin(_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select _email is not null and (
    lower(_email) in ('ratankumar4937@gmail.com')
    or lower(_email) like '%@wellmindai.in'
    or lower(_email) like '%@mindwellai.com'
  );
$$;

create policy "Anyone can read published posts"
  on public.blog_posts for select
  using (published = true);

create policy "Admins can read all posts"
  on public.blog_posts for select
  to authenticated
  using (public.is_blog_admin((select email from auth.users where id = auth.uid())));

create policy "Admins can insert posts"
  on public.blog_posts for insert
  to authenticated
  with check (public.is_blog_admin((select email from auth.users where id = auth.uid())));

create policy "Admins can update posts"
  on public.blog_posts for update
  to authenticated
  using (public.is_blog_admin((select email from auth.users where id = auth.uid())))
  with check (public.is_blog_admin((select email from auth.users where id = auth.uid())));

create policy "Admins can delete posts"
  on public.blog_posts for delete
  to authenticated
  using (public.is_blog_admin((select email from auth.users where id = auth.uid())));

create or replace function public.touch_blog_posts_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  if new.published = true and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.touch_blog_posts_updated_at();

drop trigger if exists trg_blog_posts_insert on public.blog_posts;
create trigger trg_blog_posts_insert
before insert on public.blog_posts
for each row execute function public.touch_blog_posts_updated_at();
