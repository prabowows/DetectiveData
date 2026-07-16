-- Detective Data — Supabase schema
-- Run this once against a fresh Supabase project (SQL Editor) to enable
-- shared, multi-admin case storage and analytics. Optional: the app works
-- fully in local mode without this file (see lib/store.ts).

create extension if not exists "uuid-ossp";

-- Admin allow-list. Anyone signed in via Supabase Auth whose email appears
-- here can access /admin. Everyone else only sees the Game User experience.
create table if not exists admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists cases (
  case_id text primary key,
  title text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  category text not null,
  time_limit integer not null,
  max_score integer not null,
  story text not null,
  question text not null,
  culprit text not null,
  solution text not null,
  reference_events text[] not null default '{}',
  hint text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  raw_csv text not null,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists case_events (
  id uuid primary key default uuid_generate_v4(),
  case_id text not null references cases (case_id) on delete cascade,
  event_id text not null,
  time text not null,
  source text not null,
  actor text not null,
  action text not null,
  object text,
  target text,
  location text not null,
  description text not null,
  importance smallint not null check (importance between 1 and 5),
  unique (case_id, event_id)
);

create table if not exists submissions (
  id uuid primary key default uuid_generate_v4(),
  case_id text not null references cases (case_id) on delete cascade,
  user_id uuid references auth.users (id),
  selected_culprit text not null,
  reasoning text not null default '',
  correct boolean not null,
  time_spent_seconds integer not null default 0,
  submitted_at timestamptz not null default now()
);

create index if not exists idx_case_events_case_id on case_events (case_id);
create index if not exists idx_submissions_case_id on submissions (case_id);

alter table cases enable row level security;
alter table case_events enable row level security;
alter table submissions enable row level security;
alter table admins enable row level security;

-- Everyone can read published cases and their events.
create policy "Published cases are readable by everyone"
  on cases for select
  using (status = 'published' or auth.uid() in (select user_id from admins));

create policy "Events of published cases are readable by everyone"
  on case_events for select
  using (
    case_id in (select case_id from cases where status = 'published')
    or auth.uid() in (select user_id from admins)
  );

-- Only admins can write cases.
create policy "Admins manage cases"
  on cases for all
  using (auth.uid() in (select user_id from admins))
  with check (auth.uid() in (select user_id from admins));

create policy "Admins manage case events"
  on case_events for all
  using (auth.uid() in (select user_id from admins))
  with check (auth.uid() in (select user_id from admins));

-- Anyone signed in can submit an answer and read their own submissions;
-- admins can read all submissions (for Analytics).
create policy "Users insert their own submissions"
  on submissions for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users read their own submissions, admins read all"
  on submissions for select
  using (auth.uid() = user_id or auth.uid() in (select user_id from admins));
