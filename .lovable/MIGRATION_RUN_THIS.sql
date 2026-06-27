-- ╔══════════════════════════════════════════════════════════════╗
-- ║ RUN THIS IN SUPABASE SQL EDITOR                              ║
-- ║ Adds audio_usage table + period_type column for ₹99 Weekly   ║
-- ║ https://supabase.com/dashboard/project/tcqwhsdhbxlzxuoekjom/sql/new
-- ╚══════════════════════════════════════════════════════════════╝

-- 1) Audio usage table (mirrors video_usage)
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
create policy "user reads own audio usage"
  on public.audio_usage for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "service writes audio usage" on public.audio_usage;
create policy "service writes audio usage"
  on public.audio_usage for all to service_role
  using (true) with check (true);

create index if not exists idx_audio_usage_user_started
  on public.audio_usage (user_id, started_at desc);

-- 2) period_type on subscriptions (weekly | monthly)
alter table public.subscriptions
  add column if not exists period_type text not null default 'monthly';
