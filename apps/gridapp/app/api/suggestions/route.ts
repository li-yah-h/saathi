import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { FALLBACK_SUGGESTIONS } from '@/lib/coreVocab';
import type { SuggestedTile } from '@/lib/types';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
function supaserver() {
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
const PALETTE = ['bg-amber-100', 'bg-sky-100', 'bg-emerald-100', 'bg-rose-100', 'bg-violet-100'];
const colorFor = (i: number) => PALETTE[i % PALETTE.length];
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contextName = searchParams.get('context') ?? 'general';
  const q = searchParams.get('q');
  if (!url || !serviceKey) {
    return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
  }
  const supabase = supaserver();
  try {
    if (q) {
      const { data, error } = await supabase
        .from('tiles')
        .select('id, label, image_url')
        .ilike('label', `%${q}%`)
        .limit(6);
      if (error) throw error;
      const suggestions: SuggestedTile[] = (data ?? []).map((t, i) => ({
        id: t.id,
        label: t.label,
        emoji: '🗣️',
        color: colorFor(i),
      }));
      return NextResponse.json({ suggestions: suggestions.length ? suggestions : FALLBACK_SUGGESTIONS });
    }
    const { data: contextTag, error: contextError } = await supabase
      .from('context_tags')
      .select('id')
      .eq('name', contextName)
      .maybeSingle();
    if (contextError || !contextTag) {
      return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
    }
    const { data, error } = await supabase.rpc('match_tiles_by_context', {
      p_context_tag_id: contextTag.id,
      p_match_count: 6,
      p_exclude_tile_ids: [],
    });
    if (error) throw error;
    const suggestions: SuggestedTile[] = (data ?? []).map(
      (row: { id: string; label: string; similarity: number }, i: number) => ({
        id: row.id,
        label: row.label,
        emoji: '🗣️',
        color: colorFor(i),
        similarity: row.similarity,
      })
    );
    return NextResponse.json({ suggestions: suggestions.length ? suggestions : FALLBACK_SUGGESTIONS });
  } catch (err) {
    console.error('suggestions query failed:', err);
    return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
  }
}
