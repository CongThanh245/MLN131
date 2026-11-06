-- Cá Ngựa Cách Mạng: presence uses the database clock, so web servers with skewed clocks
-- (a laptop running `next dev` next to Vercel) no longer mark players as disconnected.
-- Run once in the Supabase SQL Editor after 001. Safe to rerun.
begin;

-- Marks a player as seen now (database time, ms since epoch).
create or replace function public.cangua_touch(p_code text, p_player text)
returns void
language sql
as $$
  insert into public.cangua_presence (code, player_id, last_seen)
  values (p_code, p_player, (extract(epoch from clock_timestamp()) * 1000)::bigint)
  on conflict (code, player_id) do update set last_seen = excluded.last_seen;
$$;

-- How long ago (ms, database time) each player of a room was last seen.
create or replace function public.cangua_presence_ages(p_code text)
returns table (player_id text, age_ms bigint)
language sql
stable
as $$
  select p.player_id, greatest(0, (extract(epoch from clock_timestamp()) * 1000)::bigint - p.last_seen)
  from public.cangua_presence p
  where p.code = p_code;
$$;

revoke execute on function public.cangua_touch(text, text) from public, anon, authenticated;
revoke execute on function public.cangua_presence_ages(text) from public, anon, authenticated;
grant execute on function public.cangua_touch(text, text) to service_role;
grant execute on function public.cangua_presence_ages(text) to service_role;

commit;

-- Make the API see the new functions right away.
notify pgrst, 'reload schema';
