-- 0002_capture_studio.sql
-- Extends the Phase 1 schema contract to support Module 2 (Capture Studio & Heatmap).
-- Safe to run once on top of 0001_init.sql.

-- 1. Voice anchor + manual lock state on tiles.
alter table public.tiles
  add column if not exists audio_url text,
  add column if not exists locked boolean not null default false,
  add column if not exists lock_reason text; -- 'auto_high_frequency' | 'manual' | null

-- 2. Context tags: lets Jaliba assign a captured tile to one or more
--    situational contexts (e.g. "breakfast", "playground") so Diya's
--    dynamic column can pull the right candidates via pgvector.
create table if not exists public.context_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.tile_context_tags (
  tile_id uuid not null references public.tiles(id) on delete cascade,
  context_tag_id uuid not null references public.context_tags(id) on delete cascade,
  primary key (tile_id, context_tag_id)
);

-- 3. View: per-tile click counts + average latency, used to drive the
--    Spatial Intensity Matrix (heatmap) in Edit Mode. Excludes tiles with
--    zero events by using a left join from tiles.
create or replace view public.tile_frequency_stats as
select
  t.id            as tile_id,
  t.label,
  t.locked,
  count(e.id)              as click_count,
  avg(e.latency_ms)::numeric(10,2) as avg_latency_ms,
  max(e.created_at)        as last_used_at
from public.tiles t
left join public.events e on e.tile_id = t.id
group by t.id, t.label, t.locked;

-- 4. RLS: context tables follow the same rule as tiles — readable by
--    authenticated users, writable only by admins (Jaliba's dashboard/app
--    is expected to run under an admin or editor role in this module).
alter table public.context_tags enable row level security;
alter table public.tile_context_tags enable row level security;

create policy "context_tags_select_authenticated"
  on public.context_tags for select
  to authenticated
  using (true);

create policy "context_tags_write_admin"
  on public.context_tags for all
  to authenticated
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ))
  with check (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "tile_context_tags_select_authenticated"
  on public.tile_context_tags for select
  to authenticated
  using (true);

create policy "tile_context_tags_write_admin"
  on public.tile_context_tags for all
  to authenticated
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ))
  with check (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- 5. Storage buckets for captured media (idempotent).
insert into storage.buckets (id, name, public)
values ('tile-images', 'tile-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('tile-audio', 'tile-audio', true)
on conflict (id) do nothing;
