'use client';
import type { HeatLevel, HeatmapTile } from '@/lib/types';
const HEAT_CLASS: Record<HeatLevel, string> = {
  0: 'bg-heat-0 text-slate-500',
  1: 'bg-heat-1 text-slate-800',
  2: 'bg-heat-2 text-slate-900',
  3: 'bg-heat-3 text-white',
  4: 'bg-heat-4 text-white',
  5: 'bg-heat-5 text-white',
};
interface HeatmapProps {
  tiles: HeatmapTile[];
  onToggleLock: (tileId: string, nextLocked: boolean) => void;
  pendingTileId?: string | null;
}
export default function Heatmap({ tiles, onToggleLock, pendingTileId }: HeatmapProps) {
  if (tiles.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        No tiles yet. Capture a few from the main screen to see the heatmap here.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {tiles.map((tile) => {
        const isLocked = tile.locked || tile.is_locked_by_frequency;
        return (
          <div
            key={tile.tile_id}
            className={`relative flex aspect-square flex-col items-center justify-center rounded-xl p-2 text-center text-xs font-medium shadow-sm ${HEAT_CLASS[tile.heat_level]}`}
          >
            {isLocked && (
              <span
                className="absolute left-1.5 top-1.5 rounded-full bg-black/25 px-1.5 py-0.5 text-[10px] leading-none"
                title={
                  tile.locked
                    ? 'Manually locked'
                    : 'Auto-locked: high-frequency tile, position protected'
                }
              >
                🔒
              </span>
            )}
            {tile.is_cold && (
              <span
                className="absolute right-1.5 top-1.5 rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] leading-none text-slate-700"
                title="Low use — safe candidate for vocabulary swap"
              >
                cold
              </span>
            )}
            <span className="line-clamp-2 px-1">{tile.label}</span>
            <span className="mt-1 text-[10px] opacity-80">{tile.click_count} taps</span>
            <button
              type="button"
              disabled={pendingTileId === tile.tile_id}
              onClick={() => onToggleLock(tile.tile_id, !tile.locked)}
              className="mt-2 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-slate-800 hover:bg-white disabled:opacity-50"
            >
              {pendingTileId === tile.tile_id ? '…' : tile.locked ? 'Unlock' : 'Lock'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
