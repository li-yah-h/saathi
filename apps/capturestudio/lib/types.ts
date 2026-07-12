// Extends the shared `Tile` contract with fields introduced in
// supabase/migrations/0002_capture_studio.sql. If/when these land in
// @echovoice/shared-types, this file can just re-export from there.

export type LockReason = 'auto_high_frequency' | 'manual' | null;

export interface Tile {
  id: string;
  label: string;
  image_url: string | null;
  audio_url: string | null;
  is_dynamic_slot: boolean;
  locked: boolean;
  lock_reason: LockReason;
  embedding: number[] | null;
  created_at?: string;
}

export interface TileFrequencyStat {
  tile_id: string;
  label: string;
  locked: boolean;
  click_count: number;
  avg_latency_ms: number | null;
  last_used_at: string | null;
}

export type HeatLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface HeatmapTile extends TileFrequencyStat {
  heat_level: HeatLevel;
  is_cold: boolean; // safe candidate for vocabulary swap
  is_locked_by_frequency: boolean; // hit the auto-lock threshold
}
