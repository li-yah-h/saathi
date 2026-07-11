import type { SupabaseClient } from '@supabase/supabase-js';
import type { HeatLevel, HeatmapTile, TileFrequencyStat } from './types';

/**
 * Classification thresholds for the Spatial Intensity Matrix.
 *
 * - HOT_LOCK_PERCENTILE: tiles at/above this percentile of click_count
 *   within the current grid are auto-flagged "locked" to protect motor
 *   planning. Jaliba can still override a lock manually in Edit Mode.
 * - COLD_MAX_CLICKS: tiles at/below this raw click count (and not manually
 *   locked) are flagged "cold" — safe candidates for vocabulary swapping.
 */
export const HEATMAP_THRESHOLDS = {
  HOT_LOCK_PERCENTILE: 0.85,
  COLD_MAX_CLICKS: 2,
} as const;

/**
 * Pulls per-tile click counts + latency from the `tile_frequency_stats`
 * view (see supabase/migrations/0002_capture_studio.sql), which aggregates
 * the `events` table server-side so we never pull raw event rows into the
 * client.
 */
export async function fetchTileFrequencyStats(
  supabase: SupabaseClient
): Promise<TileFrequencyStat[]> {
  const { data, error } = await supabase
    .from('tile_frequency_stats')
    .select('tile_id, label, locked, click_count, avg_latency_ms, last_used_at')
    .order('click_count', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch tile frequency stats: ${error.message}`);
  }

  return (data ?? []) as TileFrequencyStat[];
}

/**
 * Turns raw click counts into a 0–5 heat level, and applies the
 * hot-lock / cold-swap classification described in the architecture spec.
 * Pure function — safe to unit test without a live Supabase connection.
 */
export function classifyHeatmap(stats: TileFrequencyStat[]): HeatmapTile[] {
  if (stats.length === 0) return [];

  const counts = stats.map((s) => s.click_count).sort((a, b) => a - b);
  const percentileIndex = Math.floor(
    HEATMAP_THRESHOLDS.HOT_LOCK_PERCENTILE * (counts.length - 1)
  );
  const hotThreshold = counts[percentileIndex] ?? Number.POSITIVE_INFINITY;
  const maxClicks = counts[counts.length - 1] || 1;

  return stats.map((stat): HeatmapTile => {
    const isLockedByFrequency = stat.click_count >= hotThreshold && stat.click_count > 0;
    const isCold = !stat.locked && !isLockedByFrequency && stat.click_count <= HEATMAP_THRESHOLDS.COLD_MAX_CLICKS;

    return {
      ...stat,
      heat_level: toHeatLevel(stat.click_count, maxClicks, stat.locked),
      is_locked_by_frequency: isLockedByFrequency,
      is_cold: isCold,
    };
  });
}

function toHeatLevel(clickCount: number, maxClicks: number, manuallyLocked: boolean): HeatLevel {
  if (manuallyLocked) return 5;
  if (clickCount === 0) return 0;

  const ratio = clickCount / maxClicks;
  if (ratio >= 0.85) return 5;
  if (ratio >= 0.65) return 4;
  if (ratio >= 0.4) return 3;
  if (ratio >= 0.15) return 2;
  return 1;
}

/**
 * Convenience combinator for the Edit Mode page: fetch + classify in one call.
 */
export async function getHeatmap(supabase: SupabaseClient): Promise<HeatmapTile[]> {
  const stats = await fetchTileFrequencyStats(supabase);
  return classifyHeatmap(stats);
}

/**
 * Persists a manual lock/unlock action. RLS ensures only an `admin` role
 * can succeed here (see 0002_capture_studio.sql policies).
 */
export async function setTileLock(
  supabase: SupabaseClient,
  tileId: string,
  locked: boolean
): Promise<void> {
  const { error } = await supabase
    .from('tiles')
    .update({
      locked,
      lock_reason: locked ? 'manual' : null,
    })
    .eq('id', tileId);

  if (error) {
    throw new Error(`Failed to update lock state for tile ${tileId}: ${error.message}`);
  }
}
