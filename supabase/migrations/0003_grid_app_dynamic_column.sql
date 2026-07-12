create or replace function public.match_tiles_by_context(
  p_context_tag_id   uuid,
  p_match_count       int,
  p_exclude_tile_ids  uuid[]
)
returns table (
  id          uuid,
  label       text,
  similarity  float
)
language sql
stable
as $$
  with context_centroid as (
    select avg(t2.embedding) as embedding
    from public.tiles t2
    join public.tile_context_tags tct on tct.tile_id = t2.id
    where tct.context_tag_id = p_context_tag_id
      and t2.embedding is not null
  )
  select
    t.id,
    t.label,
    1 - (t.embedding <=> context_centroid.embedding) as similarity
  from public.tiles t
  cross join context_centroid
  where t.embedding is not null
    and context_centroid.embedding is not null
    and t.is_dynamic_slot = true
    and (p_exclude_tile_ids is null or t.id != all(p_exclude_tile_ids))
  order by t.embedding <=> context_centroid.embedding
  limit p_match_count;
$$;

grant execute on function public.match_tiles_by_context(uuid, int, uuid[])
  to anon, authenticated, service_role;