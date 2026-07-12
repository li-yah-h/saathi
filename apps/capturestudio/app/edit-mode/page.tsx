'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@saathi/client/client'
import { getHeatmap, setTileLock } from '@/lib/heatmapQuery';
import type { HeatmapTile } from '@/lib/types';
import Heatmap from '@/components/Heatmap';
type LoadState = 'loading' | 'ready' | 'error' | 'unauthorized';
export default function EditModePage() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [tiles, setTiles] = useState<HeatmapTile[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingTileId, setPendingTileId] = useState<string | null>(null);

  const loadHeatmap = useCallback(async () => {
    setLoadState('loading');
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoadState('unauthorized');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        setLoadState('unauthorized');
        return;
      }

      const heatmap = await getHeatmap(supabase);
      setTiles(heatmap);
      setLoadState('ready');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to load the heatmap.');
      setLoadState('error');
    }
  }, [supabase]);

  useEffect(() => {
    loadHeatmap();
  }, [loadHeatmap]);

  const handleToggleLock = useCallback(
    async (tileId: string, nextLocked: boolean) => {
      setPendingTileId(tileId);
      // Optimistic update so the tap feels instant.
      setTiles((prev) =>
        prev.map((t) => (t.tile_id === tileId ? { ...t, locked: nextLocked } : t))
      );
      try {
        await setTileLock(supabase, tileId, nextLocked);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to update lock state.');
        // Revert on failure.
        setTiles((prev) =>
          prev.map((t) => (t.tile_id === tileId ? { ...t, locked: !nextLocked } : t))
        );
      } finally {
        setPendingTileId(null);
      }
    },
    [supabase]
  );

  const coldTiles = tiles.filter((t) => t.is_cold);

  return (
    <main>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Spatial Intensity Matrix</h1>
          <p className="text-sm text-slate-500">
            Hot tiles are protected from rearrangement. Cold tiles are safe to swap.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900"
        >
          Capture a tile
        </Link>
      </header>

      {loadState === 'loading' && <p className="text-sm text-slate-500">Loading heatmap…</p>}

      {loadState === 'unauthorized' && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Edit Mode is only available to admin accounts.
        </p>
      )}

      {loadState === 'error' && (
        <div className="space-y-2">
          <p role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={loadHeatmap}
            className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium hover:bg-slate-100"
          >
            Retry
          </button>
        </div>
      )}

      {loadState === 'ready' && (
        <>
          <Heatmap tiles={tiles} onToggleLock={handleToggleLock} pendingTileId={pendingTileId} />

          <section className="mt-8">
            <h2 className="mb-2 text-sm font-semibold text-slate-700">
              Safe to swap ({coldTiles.length})
            </h2>
            {coldTiles.length === 0 ? (
              <p className="text-sm text-slate-500">No cold tiles right now.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {coldTiles.map((tile) => (
                  <li
                    key={tile.tile_id}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
                  >
                    {tile.label} · {tile.click_count} taps
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
