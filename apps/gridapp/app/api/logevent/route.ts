import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
interface LogEventBody {
  tile_id: string;
  latency_ms: number;
  source: 'grid' | 'dynamic_column' | 'quick_phrase';
}
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Missing session — sign in to log events.' }, { status: 401 });
  }
  let body: LogEventBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  if (!body.tile_id || typeof body.latency_ms !== 'number' || !body.source) {
    return NextResponse.json({ error: 'tile_id, latency_ms and source are required.' }, { status: 400 });
  }
  const supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 });
  }
  const { error } = await supabase.from('events').insert({
    tile_id: body.tile_id,
    user_id: user.id,
    latency_ms: Math.max(0, Math.round(body.latency_ms)),
    source: body.source,
  });
  if (error) {
    console.error('log event insert failed:', error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 200 });
  }
  return NextResponse.json({ ok: true });
}
