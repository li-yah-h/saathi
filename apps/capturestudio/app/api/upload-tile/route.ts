import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@saathi/client/server' (and it's async, so await createServerComponentClient())
import { embedText } from '@saathi/ai'
export const runtime = 'nodejs';
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
      return NextResponse.json({ error: 'Only admins can capture tiles.' }, { status: 403 });
    }
    const formData = await req.formData();
    const image = formData.get('image');
    const audio = formData.get('audio');
    const label = formData.get('label');
    const isDynamicSlot = formData.get('is_dynamic_slot') === 'true';
    if (!(image instanceof File) || typeof label !== 'string' || !label.trim()) {
      return NextResponse.json({ error: 'An image and a label are required.' }, { status: 400 });
    }
    const tileId = crypto.randomUUID();
    const imagePath = `${tileId}/tile.jpg`;
    const { error: imageUploadError } = await supabase.storage
      .from('tile-images')
      .upload(imagePath, image, { contentType: image.type || 'image/jpeg', upsert: true });
    if (imageUploadError) {
      return NextResponse.json(
        { error: `Image upload failed: ${imageUploadError.message}` },
        { status: 500 }
      );
    }
    const {
      data: { publicUrl: imageUrl },
    } = supabase.storage.from('tile-images').getPublicUrl(imagePath);
    let audioUrl: string | null = null;
    if (audio instanceof File && audio.size > 0) {
      const audioPath = `${tileId}/anchor.webm`;
      const { error: audioUploadError } = await supabase.storage
        .from('tile-audio')
        .upload(audioPath, audio, { contentType: audio.type || 'audio/webm', upsert: true });
      if (audioUploadError) {
        return NextResponse.json(
          { error: `Audio upload failed: ${audioUploadError.message}` },
          { status: 500 }
        );
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from('tile-audio').getPublicUrl(audioPath);
      audioUrl = publicUrl;
    }
    let embedding: number[];
    try {
      embedding = (await embedText(label.trim())).embedding;
    } catch (err) {
      return NextResponse.json(
        {
          error: `Embedding generation failed: ${
            err instanceof Error ? err.message : 'unknown error'
          }`,
        },
        { status: 502 }
      );
    }
    const { data: tile, error: insertError } = await supabase
      .from('tiles')
      .insert({
        id: tileId,
        label: label.trim(),
        image_url: imageUrl,
        audio_url: audioUrl,
        is_dynamic_slot: isDynamicSlot,
        embedding,
        locked: false,
        lock_reason: null,
      })
      .select()
      .single();
    if (insertError) {
      return NextResponse.json(
        { error: `Failed to save tile: ${insertError.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json({ tile }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unexpected server error.' },
      { status: 500 }
    );
  }
}
