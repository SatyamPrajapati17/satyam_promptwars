-- supabase/migrations/0001_core.sql
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ───────────── profiles ─────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  timezone text not null default 'UTC',
  email_opt_in boolean not null default true,
  daily_focus_minutes int not null default 30 check (daily_focus_minutes between 5 and 480),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name',
             new.raw_user_meta_data ->> 'name',
             split_part(coalesce(new.email, ''), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────── decisions ─────────────
create table public.decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 3 and 140),
  question text not null default '' check (char_length(question) <= 600),
  category text not null default 'other' check (category in (
    'education','career','relationships','business','personal_growth',
    'finance','relocation','health_lifestyle','other')),
  status text not null default 'draft' check (status in ('draft','active','completed','archived')),
  current_stage text not null default 'draft' check (current_stage in (
    'draft','analysis','challenge','premortem','actions','report','revisit','done')),
  wizard_step int not null default 1 check (wizard_step between 1 and 5),
  desired_outcome text not null default '' check (char_length(desired_outcome) <= 2000),
  non_negotiables text not null default '' check (char_length(non_negotiables) <= 2000),
  affected_people text not null default '' check (char_length(affected_people) <= 2000),
  short_term_impact text not null default '' check (char_length(short_term_impact) <= 2000),
  long_term_impact text not null default '' check (char_length(long_term_impact) <= 2000),
  time_horizon text not null default '' check (char_length(time_horizon) <= 200),
  what_might_change_mind text not null default '' check (char_length(what_might_change_mind) <= 2000),
  my_current_view text not null default '' check (char_length(my_current_view) <= 3000),
  confidence_before int check (confidence_before between 0 and 100),
  confidence_after int check (confidence_after between 0 and 100),
  deadline timestamptz,
  revisit_at timestamptz,
  timezone text not null default 'UTC',
  email_reminders boolean not null default false,
  is_sample boolean not null default false,
  latest_analysis_version int not null default 0,
  analyzed_at timestamptz,
  redteam_at timestamptz,
  premortem_at timestamptz,
  report_at timestamptz,
  revisited_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);
create index decisions_user_idx on public.decisions (user_id, status, updated_at desc);

-- ───────────── options ─────────────
create table public.decision_options (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  name text not null check (char_length(name) between 1 and 140),
  description text not null default '' check (char_length(description) <= 1000),
  is_preferred boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);
create index decision_options_decision_idx on public.decision_options (decision_id, position);
create unique index decision_options_one_preferred on public.decision_options (decision_id) where is_preferred;

-- ───────────── reasons ─────────────
create table public.reasons (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  option_id uuid references public.decision_options (id) on delete set null,  -- null = applies to the decision in general
  text text not null check (char_length(text) between 1 and 500),
  weight int not null default 3 check (weight between 1 and 5),
  ai_evidence_status text check (ai_evidence_status in ('known','assumed','unknown','needs_verification')),
  evidence_status text not null default 'unknown' check (evidence_status in ('known','assumed','unknown','needs_verification')),
  status_source text not null default 'default' check (status_source in ('default','ai','user')),
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);
create index reasons_decision_idx on public.reasons (decision_id, position);