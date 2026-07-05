-- ╔══════════════════════════════════════════════════════════════╗
-- ║ RUN THIS IN SUPABASE SQL EDITOR                              ║
-- ║ https://supabase.com/dashboard/project/tcqwhsdhbxlzxuoekjom/sql/new
-- ╚══════════════════════════════════════════════════════════════╝

-- =========================================================
-- 1) audio_usage + subscriptions.period_type (weekly plans)
-- =========================================================
create table if not exists public.audio_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  plan_id text not null default 'free',
  counselor text,
  engine text,
  seconds int not null default 0,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);
grant select, insert, update on public.audio_usage to authenticated;
grant all on public.audio_usage to service_role;
alter table public.audio_usage enable row level security;
drop policy if exists "user reads own audio usage" on public.audio_usage;
create policy "user reads own audio usage" on public.audio_usage for select to authenticated using (user_id = auth.uid());
drop policy if exists "service writes audio usage" on public.audio_usage;
create policy "service writes audio usage" on public.audio_usage for all to service_role using (true) with check (true);
create index if not exists idx_audio_usage_user_started on public.audio_usage (user_id, started_at desc);

alter table public.subscriptions add column if not exists period_type text not null default 'monthly';

-- =========================================================
-- 2) b2b_invites security lockdown
-- =========================================================
drop policy if exists "Authenticated users can view all invites" on public.b2b_invites;
drop policy if exists "authenticated_users_view_all_invites" on public.b2b_invites;
drop policy if exists "Anyone authenticated can view invites" on public.b2b_invites;
drop policy if exists "authenticated can view invites" on public.b2b_invites;
drop policy if exists "b2b_invites_select_authenticated" on public.b2b_invites;
alter table public.b2b_invites enable row level security;
create policy "invitee_or_company_admin_can_view_invite" on public.b2b_invites for select to authenticated
using (
  lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  or exists (select 1 from public.b2b_companies c where c.id = b2b_invites.company_id and c.admin_user_id = auth.uid())
);

-- =========================================================
-- 3) app_role + user_roles + has_role()  (admin panel gate)
-- =========================================================
do $$ begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'moderator', 'user');
  end if;
end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

drop policy if exists "users read own roles" on public.user_roles;
create policy "users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Seed founder as admin (auto-links when the user exists)
insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role from auth.users where lower(email) = 'ratankumar4937@gmail.com'
on conflict do nothing;

-- Admin can view/manage user_roles
drop policy if exists "admins manage roles" on public.user_roles;
create policy "admins manage roles" on public.user_roles for all to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 4) research_papers (admin-managed content)
-- =========================================================
create table if not exists public.research_papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  authors text,
  abstract text,
  pdf_url text,
  cover_url text,
  tags text[],
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
grant select on public.research_papers to anon, authenticated;
grant all on public.research_papers to service_role;
grant insert, update, delete on public.research_papers to authenticated;
alter table public.research_papers enable row level security;

drop policy if exists "public reads published papers" on public.research_papers;
create policy "public reads published papers" on public.research_papers for select using (published = true);
drop policy if exists "admins manage papers" on public.research_papers;
create policy "admins manage papers" on public.research_papers for all to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 5) demo_access_grants (1-day full-feature demo)
-- =========================================================
create table if not exists public.demo_access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text not null,
  granted_by uuid,
  expires_at timestamptz not null default (now() + interval '1 day'),
  is_active boolean not null default true,
  created_at timestamptz default now()
);
grant select on public.demo_access_grants to authenticated;
grant all on public.demo_access_grants to service_role;
alter table public.demo_access_grants enable row level security;

drop policy if exists "users read own demo" on public.demo_access_grants;
create policy "users read own demo" on public.demo_access_grants for select to authenticated
using (user_id = auth.uid() or lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
drop policy if exists "admins manage demo grants" on public.demo_access_grants;
create policy "admins manage demo grants" on public.demo_access_grants for all to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 6) invoices (WellMindAI-branded billing record)
-- =========================================================
create sequence if not exists public.invoice_no_seq start 1001;
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  invoice_no text unique not null default ('WMA-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.invoice_no_seq')::text, 5, '0')),
  plan_id text,
  amount numeric not null,
  currency text default 'INR',
  razorpay_payment_id text,
  razorpay_order_id text,
  status text not null default 'paid',
  issued_at timestamptz default now(),
  meta jsonb default '{}'::jsonb
);
grant select on public.invoices to authenticated;
grant all on public.invoices to service_role;
alter table public.invoices enable row level security;

drop policy if exists "users read own invoices" on public.invoices;
create policy "users read own invoices" on public.invoices for select to authenticated using (user_id = auth.uid());
drop policy if exists "admins read all invoices" on public.invoices;
create policy "admins read all invoices" on public.invoices for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 7) b2b_accounts + b2b_gateways (used by b2b-activate edge fn)
-- =========================================================
create table if not exists public.b2b_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  organization_type text not null,
  admin_email text not null,
  admin_user_id uuid,
  is_active boolean not null default true,
  max_seats int not null default 10,
  contract_start timestamptz,
  contract_end timestamptz,
  razorpay_payment_id text,
  created_at timestamptz default now()
);
grant select on public.b2b_accounts to authenticated;
grant all on public.b2b_accounts to service_role;
alter table public.b2b_accounts enable row level security;

drop policy if exists "admin_of_account_reads" on public.b2b_accounts;
create policy "admin_of_account_reads" on public.b2b_accounts for select to authenticated using (admin_user_id = auth.uid());

create table if not exists public.b2b_gateways (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.b2b_accounts(id) on delete cascade,
  auth_strategy text not null,
  target_domain text,
  secure_passcode text,
  created_at timestamptz default now()
);
grant select on public.b2b_gateways to authenticated;
grant all on public.b2b_gateways to service_role;
alter table public.b2b_gateways enable row level security;
drop policy if exists "admin_reads_own_gateway" on public.b2b_gateways;
create policy "admin_reads_own_gateway" on public.b2b_gateways for select to authenticated
using (exists (select 1 from public.b2b_accounts a where a.id = b2b_gateways.account_id and a.admin_user_id = auth.uid()));

-- profiles.b2b_account_id (used to link buyer)
alter table public.profiles add column if not exists b2b_account_id uuid;
