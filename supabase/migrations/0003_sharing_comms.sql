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