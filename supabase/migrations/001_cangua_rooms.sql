-- Cá Ngựa Cách Mạng: run once in the Supabase SQL Editor. Safe to rerun.
begin;

-- One row per room. `body` is the whole room (players, game state, answers): server-only.
-- `version` is bumped on every write; the server only writes when the version it read is unchanged.
create table if not exists public.cangua_rooms (
  code text primary key,
  body jsonb not null,
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  constraint cangua_rooms_code_format check (code ~ '^[A-HJ-NP-Z2-9]{5}$'),
  constraint cangua_rooms_body_code check (jsonb_typeof(body) = 'object' and body->>'code' = code)
);
create index if not exists cangua_rooms_created_at_idx on public.cangua_rooms (created_at desc);

-- Last time each player polled (ms since epoch); kept apart so polling does not contend on the room row.
create table if not exists public.cangua_presence (
  code text not null references public.cangua_rooms (code) on delete cascade,
  player_id text not null,
  last_seen bigint not null,
  primary key (code, player_id)
);

-- Only the Next.js server, using the secret key, may touch these tables.
alter table public.cangua_rooms enable row level security;
alter table public.cangua_presence enable row level security;
revoke all on public.cangua_rooms, public.cangua_presence from public, anon, authenticated;
grant select, insert, update, delete on public.cangua_rooms, public.cangua_presence to service_role;

commit;
