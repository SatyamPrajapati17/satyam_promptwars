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

-- ==============================================

-- supabase/migrations/0002_ai_and_work.sql

-- ───────────── analysis runs (versioned) ─────────────
create table public.analysis_runs (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  version int not null check (version >= 1),
  status text not null default 'running' check (status in ('running','succeeded','failed')),
  model_name text,                       -- server-side only; never returned to the client
  prompt_version text not null default 'v1',
  input_snapshot jsonb not null,         -- exactly what was sent to the AI (decision_data)
  raw_output jsonb,                      -- validated Core + Insights JSON
  validation_report jsonb,               -- { attempts, errors[], dropped[] }
  error_code text,
  error_message text,
  latency_ms int,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  unique (decision_id, version),
  unique (id, user_id),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);
create index analysis_runs_decision_idx on public.analysis_runs (decision_id, version desc);

-- ───────────── blind-spot cards ─────────────
create table public.blind_spot_cards (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  run_id uuid not null references public.analysis_runs (id) on delete cascade,
  run_version int not null,
  position int not null default 0,
  title text not null check (char_length(title) between 1 and 160),
  type text not null check (type in (
    'assumption','evidence_gap','stakeholder_gap','time_horizon_gap',
    'alternative_gap','reversibility_risk','failure_mode')),
  evidence_from_user_text text not null,
  why_it_matters text not null,
  reflection_question text not null,
  verification_action text not null,
  confidence text not null check (confidence in ('low','medium','high')),
  node_keys text[] not null default '{}',
  user_status text not null default 'unreviewed' check (user_status in ('unreviewed','relevant','already_considered','dismissed')),
  user_note text not null default '' check (char_length(user_note) <= 2000),
  carried_over boolean not null default false,   -- status copied from a previous run
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);
create index blind_spot_cards_run_idx on public.blind_spot_cards (decision_id, run_version, position);

-- ───────────── reasoning map ─────────────
create table public.map_nodes (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  run_id uuid not null references public.analysis_runs (id) on delete cascade,
  run_version int not null,
  node_key text not null,
  node_type text not null check (node_type in ('decision','reason','assumption','evidence_gap','risk','question','action')),
  label text not null,
  explanation text not null default '',
  evidence_from_user_text text not null default '',
  why_it_matters text not null default '',
  confidence text not null default 'medium' check (confidence in ('low','medium','high')),
  related_question text,
  suggested_action text,
  reason_id uuid references public.reasons (id) on delete set null,
  user_status text not null default 'unreviewed' check (user_status in ('unreviewed','relevant','already_considered','dismissed')),
  user_note text not null default '' check (char_length(user_note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  unique (run_id, node_key),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);
create index map_nodes_run_idx on public.map_nodes (decision_id, run_version);

create table public.map_edges (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  run_id uuid not null references public.analysis_runs (id) on delete cascade,
  from_key text not null,
  to_key text not null,
  relation text not null default 'depends_on' check (relation in ('depends_on','supports','raises','tested_by')),
  created_at timestamptz not null default now(),
  unique (run_id, from_key, to_key),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);

-- ───────────── red-team ─────────────
create table public.redteam_sessions (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  run_version int not null,
  status text not null default 'in_progress' check (status in ('in_progress','completed')),
  confidence_after int check (confidence_after between 0 and 100),
  summary jsonb,                          -- validated RedTeamSummary (no recommendation)
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  unique (decision_id, run_version),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);

create table public.redteam_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.redteam_sessions (id) on delete cascade,
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  position int not null check (position between 1 and 5),
  template_key text not null check (template_key in (
    'disagree','load_bearing_reason','weakening_evidence','assumed_outcome','inconvenient',
    'real_alternative','irreversible','friend_advice','without_best_benefit')),
  question text not null,
  answer text not null default '' check (char_length(answer) <= 3000),
  skipped boolean not null default false,
  answered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, position),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);

-- ───────────── pre-mortem ─────────────
create table public.premortem_items (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  user_text text not null check (char_length(user_text) between 1 and 500),
  risk_theme text,
  affected_areas text[] not null default '{}',
  mitigation text not null default '' check (char_length(mitigation) <= 1000),
  likelihood int check (likelihood between 1 and 5),
  impact int check (impact between 1 and 5),
  accepted boolean,                       -- "Is this risk acceptable?" (null = not answered)
  timeline_phase text not null default 'unplaced' check (timeline_phase in ('unplaced','today','month_1','midpoint','month_6')),
  cluster_key text,
  ai_generated boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);
create index premortem_items_decision_idx on public.premortem_items (decision_id, position);

-- ───────────── what would change my mind ─────────────
create table public.change_mind_items (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  prompt text not null check (char_length(prompt) between 1 and 400),
  answer text not null default '' check (char_length(answer) <= 2000),
  mark text not null default 'unmarked' check (mark in ('unmarked','important','not_important','needs_evidence','answered')),
  ai_generated boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);

-- ───────────── evidence actions (Kanban) ─────────────
create table public.evidence_actions (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  title text not null check (char_length(title) between 1 and 140),
  open_question text not null default '' check (char_length(open_question) <= 400),
  description text not null default '' check (char_length(description) <= 1000),
  priority text not null default 'medium' check (priority in ('high','medium','low')),
  source_to_contact text not null default '' check (char_length(source_to_contact) <= 160),
  due_date date,
  status text not null default 'open' check (status in ('open','in_progress','completed','not_applicable')),
  notes text not null default '' check (char_length(notes) <= 3000),
  estimate_minutes int not null default 30 check (estimate_minutes between 5 and 480),
  position double precision not null default 0,
  origin text not null default 'user' check (origin in ('user','ai','card','premortem','redteam','change_mind','map_node')),
  card_id uuid references public.blind_spot_cards (id) on delete set null,
  premortem_id uuid references public.premortem_items (id) on delete set null,
  reason_id uuid references public.reasons (id) on delete set null,
  change_mind_id uuid references public.change_mind_items (id) on delete set null,
  map_node_id uuid references public.map_nodes (id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);
create index evidence_actions_board_idx on public.evidence_actions (decision_id, status, position);
create index evidence_actions_due_idx on public.evidence_actions (decision_id, due_date) where status in ('open','in_progress');

-- ───────────── option comparison ─────────────
create table public.comparison_factors (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  name text not null check (char_length(name) between 1 and 80),
  importance int not null default 3 check (importance between 1 and 5),
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);

create table public.comparison_cells (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  factor_id uuid not null references public.comparison_factors (id) on delete cascade,
  option_id uuid not null references public.decision_options (id) on delete cascade,
  rating int check (rating between 1 and 5),
  evidence_status text check (evidence_status in ('known','assumed','unknown','needs_verification')),
  note text not null default '' check (char_length(note) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (factor_id, option_id),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);
-- NOTE: there is intentionally NO column, view, or function that totals ratings per option.

-- ───────────── confidence, scores, reflection, revisit ─────────────
create table public.confidence_checkpoints (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  stage text not null check (stage in ('initial','after_redteam','after_premortem','after_actions','final','revisit')),
  value int not null check (value between 0 and 100),
  created_at timestamptz not null default now(),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);
create index confidence_checkpoints_idx on public.confidence_checkpoints (decision_id, created_at);

create table public.score_snapshots (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  run_version int not null default 0,
  formula_version int not null default 1,
  readiness int not null check (readiness between 0 and 100),
  evidence_coverage numeric(5,2) not null,
  assumption_exposure numeric(5,2),               -- null when not applicable
  risk_readiness numeric(5,2) not null,
  challenge_depth numeric(5,2) not null,
  action_momentum numeric(5,2) not null,
  projected_readiness int not null check (projected_readiness between 0 and 100),
  confidence int check (confidence between 0 and 100),
  calibration_gap numeric(6,2),
  feasibility_ratio numeric(8,2),
  inputs jsonb not null default '{}'::jsonb,       -- counts used (for the "how is this calculated" drawer)
  created_at timestamptz not null default now(),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);
create index score_snapshots_idx on public.score_snapshots (decision_id, created_at desc);

create table public.reflection_sessions (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  minutes int not null check (minutes in (2,5,10)),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);

create table public.revisits (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  what_changed text not null default '' check (char_length(what_changed) <= 3000),
  assumptions_confirmed text not null default '' check (char_length(assumptions_confirmed) <= 3000),
  assumptions_wrong text not null default '' check (char_length(assumptions_wrong) <= 3000),
  priorities_changed text not null default '' check (char_length(priorities_changed) <= 3000),
  same_decision_today text check (same_decision_today in ('yes','no','unsure')),
  confidence_now int check (confidence_now between 0 and 100),
  score_snapshot_id uuid references public.score_snapshots (id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);

-- ==============================================

-- supabase/migrations/0003_sharing_comms.sql

-- ───────────── reminders ─────────────
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  kind text not null check (kind in ('deadline','one_day_before','one_week_before','evidence_action','revisit','custom')),
  action_id uuid references public.evidence_actions (id) on delete cascade,
  scheduled_for timestamptz not null,
  timezone text not null default 'UTC',
  frequency text not null default 'once' check (frequency in ('once','daily','weekly')),
  status text not null default 'scheduled' check (status in ('scheduled','sending','sent','failed','cancelled')),
  attempts int not null default 0,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);
create index reminders_due_idx on public.reminders (scheduled_for) where status = 'scheduled';
create unique index reminders_dedupe on public.reminders
  (decision_id, kind, scheduled_for, coalesce(action_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- ───────────── share links ─────────────
create table public.share_links (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  token text not null unique,                       -- 32 random bytes, base64url
  visibility text not null default 'link' check (visibility in ('link','password')),
  password_hash text,                               -- scrypt$N$salt$hash
  allow_comments boolean not null default false,
  expires_at timestamptz,
  revoked_at timestamptz,
  view_count int not null default 0,
  last_viewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (id, user_id),
  check ((visibility = 'password') = (password_hash is not null)),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);
create index share_links_decision_idx on public.share_links (decision_id);

create table public.share_comments (
  id uuid primary key default gen_random_uuid(),
  share_id uuid not null references public.share_links (id) on delete cascade,
  decision_id uuid not null,
  user_id uuid not null,                            -- owner of the decision (set by server)
  author_name text not null check (char_length(author_name) between 1 and 60),
  body text not null check (char_length(body) between 1 and 1000),
  status text not null default 'visible' check (status in ('visible','hidden')),
  created_at timestamptz not null default now(),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);
create index share_comments_share_idx on public.share_comments (share_id, created_at);

-- ───────────── audit / analytics events ─────────────
create table public.decision_events (
  id bigint generated always as identity primary key,
  decision_id uuid not null,
  user_id uuid not null default auth.uid(),
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,      -- e.g. { "minutes": 30 } for action_completed
  created_at timestamptz not null default now(),
  foreign key (decision_id, user_id) references public.decisions (id, user_id) on delete cascade
);
create index decision_events_idx on public.decision_events (decision_id, created_at desc);
create index decision_events_type_idx on public.decision_events (decision_id, event_type, created_at desc);

-- ───────────── email log (no recipient stored) ─────────────
create table public.email_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  decision_id uuid references public.decisions (id) on delete set null,
  kind text not null,
  subject text not null,
  status text not null check (status in ('sent','failed','skipped')),
  provider_message_id text,
  error text,
  created_at timestamptz not null default now()
);
create index email_log_user_idx on public.email_log (user_id, created_at desc);

-- ───────────── server-only: Sheets outbox & rate limits ─────────────
create table public.sheets_outbox (
  id bigint generated always as identity primary key,
  sheet_tab text not null check (sheet_tab in ('events','decision_metrics','email_log')),
  row_values jsonb not null,                        -- array of scalars ONLY (anonymized)
  status text not null default 'pending' check (status in ('pending','sent','failed')),
  attempts int not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);
create index sheets_outbox_pending_idx on public.sheets_outbox (created_at)
  where status in ('pending','failed');

create table public.rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  count int not null default 0
);

-- ==============================================

-- supabase/migrations/0004_security_functions.sql

-- ───────────── updated_at triggers ─────────────
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','decisions','decision_options','reasons','blind_spot_cards','map_nodes',
    'redteam_sessions','redteam_answers','premortem_items','change_mind_items',
    'evidence_actions','comparison_factors','comparison_cells','reminders'
  ] loop
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      t || '_set_updated_at', t);
  end loop;
end $$;

-- ───────────── RLS: owner policies ─────────────
do $$
declare t text;
begin
  foreach t in array array[
    'decisions','decision_options','reasons','analysis_runs','blind_spot_cards','map_nodes','map_edges',
    'redteam_sessions','redteam_answers','premortem_items','change_mind_items','evidence_actions',
    'comparison_factors','comparison_cells','confidence_checkpoints','score_snapshots',
    'reflection_sessions','revisits','reminders','share_links','decision_events'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy %I on public.%I for all to authenticated
         using (user_id = (select auth.uid()))
         with check (user_id = (select auth.uid()))',
      t || '_owner_all', t);
  end loop;
end $$;

-- profiles: id = auth user
alter table public.profiles enable row level security;
create policy profiles_select_own on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- share_comments: owner can read / moderate; inserts only by the server (service role)
alter table public.share_comments enable row level security;
create policy share_comments_owner_select on public.share_comments for select to authenticated
  using (user_id = (select auth.uid()));
create policy share_comments_owner_update on public.share_comments for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy share_comments_owner_delete on public.share_comments for delete to authenticated
  using (user_id = (select auth.uid()));

-- email_log: owner read-only
alter table public.email_log enable row level security;
create policy email_log_owner_select on public.email_log for select to authenticated
  using (user_id = (select auth.uid()));

-- server-only tables: RLS on, no policies
alter table public.sheets_outbox enable row level security;
alter table public.rate_limits enable row level security;

-- ───────────── grants ─────────────
grant usage on schema public to anon, authenticated, service_role;
revoke all on all tables in schema public from anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;
revoke all on public.sheets_outbox, public.rate_limits from authenticated;
-- tighten: client may only read these
revoke insert, update, delete on public.email_log from authenticated;
revoke insert on public.share_comments from authenticated;

-- ───────────── functions ─────────────
-- Fixed-window rate limiter. Returns true if the call is allowed.
create or replace function public.rate_limit_hit(p_key text, p_limit int, p_window_seconds int)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare v_count int;
begin
  insert into public.rate_limits as r (key, window_start, count)
  values (p_key, now(), 1)
  on conflict (key) do update set
    window_start = case
      when r.window_start < now() - make_interval(secs => p_window_seconds) then now()
      else r.window_start end,
    count = case
      when r.window_start < now() - make_interval(secs => p_window_seconds) then 1
      else r.count + 1 end
  returning r.count into v_count;
  return v_count <= p_limit;
end $$;

-- Reminder worker: atomically claims due reminders (safe for concurrent workers).
create or replace function public.claim_due_reminders(p_limit int default 25)
returns setof public.reminders
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- recover rows stuck in 'sending' (worker crashed)
  update public.reminders
     set status = 'scheduled', updated_at = now()
   where status = 'sending' and updated_at < now() - interval '10 minutes';

  return query
  with due as (
    select id from public.reminders
     where status = 'scheduled' and scheduled_for <= now()
     order by scheduled_for
     limit p_limit
     for update skip locked
  ),
  upd as (
    update public.reminders r
       set status = 'sending', attempts = r.attempts + 1, updated_at = now()
      from due
     where r.id = due.id
    returning r.*
  )
  select * from upd;
end $$;

-- Global, k-anonymous aggregates for the analytics page. No ids, no text.
create or replace function public.public_analytics()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with d as (
    select * from public.decisions where not is_sample and analyzed_at is not null
  ),
  cat as (
    select category, count(*)::int as n from d group by category having count(*) >= 3
  ),
  cards as (
    select c.type, c.decision_id
      from public.blind_spot_cards c
      join d on d.id = c.decision_id and c.run_version = d.latest_analysis_version
  ),
  card_types as (
    select type, count(*)::int as n from cards group by type having count(*) >= 3
  ),
  per_decision_cards as (
    select decision_id, count(*)::int as n from cards group by decision_id
  )
  select jsonb_build_object(
    'total_decisions', (select count(*)::int from d),
    'categories', coalesce((select jsonb_agg(jsonb_build_object('category', category, 'count', n) order by n desc) from cat), '[]'::jsonb),
    'blind_spot_types', coalesce((select jsonb_agg(jsonb_build_object('type', type, 'count', n) order by n desc) from card_types), '[]'::jsonb),
    'avg_blind_spots', (select round(avg(n)::numeric, 2) from per_decision_cards),
    'avg_actions', (
      select round(count(a.id)::numeric / nullif((select count(*) from d), 0), 2)
        from public.evidence_actions a join d on d.id = a.decision_id),
    'premortem_completion_rate', (
      select round(100.0 * count(*) filter (where premortem_at is not null) / nullif(count(*), 0), 1) from d),
    'avg_confidence_before', (
      select round(avg(confidence_before)::numeric, 1) from d where confidence_before is not null),
    'avg_confidence_after', (
      select round(avg(confidence_after)::numeric, 1) from d where confidence_after is not null),
    'refined_share', (
      select round(100.0 * count(*) filter (where confidence_after is not null and confidence_after <> confidence_before)
             / nullif(count(*) filter (where confidence_after is not null), 0), 1) from d),
    'k_anonymity_min', 3
  );
$$;

revoke all on function public.rate_limit_hit(text, int, int) from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, int, int) to service_role;
revoke all on function public.claim_due_reminders(int) from public, anon, authenticated;
grant execute on function public.claim_due_reminders(int) to service_role;
revoke all on function public.public_analytics() from public, anon;
grant execute on function public.public_analytics() to authenticated, service_role;
revoke all on function public.handle_new_user() from public, anon, authenticated;