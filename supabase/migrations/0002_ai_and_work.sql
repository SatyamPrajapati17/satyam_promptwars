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