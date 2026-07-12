import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@echovoice/supabase-client/server';
export const runtime = 'nodejs';
interface UploadContextBody {
  tile_id: string;
  context_names: string[]; 
}
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can tag context.' }, { status: 403 });
    }
    const body = (await req.json()) as Partial<UploadContextBody>;
    const tileId = body.tile_id;
    const contextNames = (body.context_names ?? [])
      .map((name) => name.trim().toLowerCase())
      .filter(Boolean);
    if (!tileId || contextNames.length === 0) {
      return NextResponse.json(
        { error: 'tile_id and at least one context name are required.' },
        { status: 400 }
      );
    }
    const { data: tags, error: tagUpsertError } = await supabase
      .from('context_tags')
      .upsert(
        contextNames.map((name) => ({ name })),
        { onConflict: 'name', ignoreDuplicates: false }
      )
      .select('id, name');
    if (tagUpsertError) {
      return NextResponse.json(
        { error: `Failed to upsert context tags: ${tagUpsertError.message}` },
        { status: 500 }
      );
    }
    const links = (tags ?? []).map((tag) => ({ tile_id: tileId, context_tag_id: tag.id }));
    const { error: linkError } = await supabase
      .from('tile_context_tags')
      .upsert(links, { onConflict: 'tile_id,context_tag_id', ignoreDuplicates: true });
    if (linkError) {
      return NextResponse.json(
        { error: `Failed to link tile to context tags: ${linkError.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json({ tile_id: tileId, context_tags: tags }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unexpected server error.' },
      { status: 500 }
    );
  }
}
