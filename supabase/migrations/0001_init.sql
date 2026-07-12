create extension if not exists vector;
create extension if not exists pgcrypto; 
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        text not null default 'user' check (role in ('user', 'admin')),
  name        text not null default '',
  created_at  timestamptz not null default now()
);
alter table public.profiles enable row level security;
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, name)
  values (
    new.id,
    'user',
    coalesce(new.raw_user_meta_data ->> 'name', '')
  );
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());
create table if not exists public.tiles (
  id              uuid primary key default gen_random_uuid(),
  label           text not null,
  image_url       text,
  audio_url       text,
  is_dynamic_slot boolean not null default false,
  is_locked       boolean not null default false,
  position        int,
  embedding       vector(384),
  created_by      uuid references public.profiles (id),
  created_at      timestamptz not null default now()
);
alter table public.tiles enable row level security;
create index if not exists tiles_embedding_idx
  on public.tiles
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
create policy "tiles_select_authenticated"
  on public.tiles for select
  to authenticated
  using (true);
create policy "tiles_insert_admin_only"
  on public.tiles for insert
  to authenticated
  with check (public.is_admin());

create policy "tiles_update_admin_only"
  on public.tiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "tiles_delete_admin_only"
  on public.tiles for delete
  to authenticated
  using (public.is_admin());
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  tile_id     uuid not null references public.tiles (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  latency_ms  int not null,
  source      text not null check (source in ('grid', 'dynamic_column', 'quick_phrase')),
  created_at  timestamptz not null default now()
);

alter table public.events enable row level security;

create index if not exists events_user_id_created_at_idx
  on public.events (user_id, created_at desc);

create index if not exists events_tile_id_idx
  on public.events (tile_id);
create policy "events_insert_own_only"
  on public.events for insert
  to authenticated
  with check (user_id = auth.uid());
create policy "events_select_admin_only"
  on public.events for select
  to authenticated
  using (public.is_admin());
alter publication supabase_realtime add table public.events;
create table if not exists public.reports (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  generated_by  uuid not null references public.profiles (id),
  summary       text not null,
  period_start  date not null,
  period_end    date not null,
  created_at    timestamptz not null default now()
);
alter table public.reports enable row level security;
create policy "reports_select_admin_only"
  on public.reports for select
  to authenticated
  using (public.is_admin());
create policy "reports_insert_admin_only"
  on public.reports for insert
  to authenticated
  with check (public.is_admin());
insert into storage.buckets (id, name, public)
values ('tile-media', 'tile-media', true)
on conflict (id) do nothing;
create policy "tile_media_read_public"
  on storage.objects for select
  using (bucket_id = 'tile-media');
create policy "tile_media_write_admin_only"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'tile-media' and public.is_admin());