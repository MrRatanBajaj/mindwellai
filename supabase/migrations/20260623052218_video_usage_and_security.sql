-- Video usage table for server-enforced minute/session limits
create table if not exists public.video_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  plan_id text not null default 'free',
  counselor text,
  conversation_id text,
  seconds int not null default 0,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

grant select, insert, update on public.video_usage to authenticated;
grant all on public.video_usage to service_role;

alter table public.video_usage enable row level security;

create policy "user reads own video usage"
  on public.video_usage for select
  to authenticated
  using (user_id = auth.uid());

create policy "service writes video usage"
  on public.video_usage for all
  to service_role
  using (true) with check (true);

create index if not exists idx_video_usage_user_started
  on public.video_usage (user_id, started_at desc);

-- ─── SECURITY FIX #1: tighten b2b_invites SELECT ───
drop policy if exists "Authenticated users can view all invites" on public.b2b_invites;
drop policy if exists "authenticated_users_view_all_invites" on public.b2b_invites;
drop policy if exists "Anyone authenticated can view invites" on public.b2b_invites;

create policy "Invitee can read own invite"
  on public.b2b_invites for select
  to authenticated
  using (
    lower(email) = (select lower(email) from public.profiles where user_id = auth.uid())
    or exists (
      select 1 from public.b2b_members m
      where m.company_id = b2b_invites.company_id
        and m.user_id = auth.uid()
        and m.role in ('admin', 'owner')
    )
  );

-- ─── SECURITY FIX #2: scope realtime broadcasts to channel owner ───
drop policy if exists "Authenticated can read all realtime messages" on realtime.messages;
drop policy if exists "Authenticated can write all realtime messages" on realtime.messages;
drop policy if exists "authenticated_select_all" on realtime.messages;
drop policy if exists "authenticated_insert_all" on realtime.messages;

create policy "user reads own-topic realtime"
  on realtime.messages for select
  to authenticated
  using (
    topic like ('user:' || auth.uid()::text || ':%')
    or topic = ('user:' || auth.uid()::text)
  );

create policy "user writes own-topic realtime"
  on realtime.messages for insert
  to authenticated
  with check (
    topic like ('user:' || auth.uid()::text || ':%')
    or topic = ('user:' || auth.uid()::text)
  );
