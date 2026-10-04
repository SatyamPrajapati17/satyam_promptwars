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