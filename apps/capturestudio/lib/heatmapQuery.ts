import type { SupabaseClient } from '@supabase/supabase-js';
import type { HeatLevel, HeatmapTile, TileFrequencyStat } from './types';
export const HEATMAP_THRESHOLDS = {
  HOT_LOCK_PERCENTILE: 0.85,
  COLD_MAX_CLICKS: 2,
} as const;
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
export async function getHeatmap(supabase: SupabaseClient): Promise<HeatmapTile[]> {
  const stats = await fetchTileFrequencyStats(supabase);
  return classifyHeatmap(stats);
}
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
