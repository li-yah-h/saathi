'use client';
import Image from 'next/image';
import type { GridTile } from '@/lib/types';
interface TileProps {
  tile: GridTile;
  onTap: (tile: GridTile) => void;
}
export default function Tile({ tile, onTap }: TileProps) {
  return (
    <button
      type="button"
      onClick={() => onTap(tile)}
      aria-label={tile.label}
      className={`relative flex h-[104px] w-[104px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-black/5 shadow-tile transition active:scale-95 hover:brightness-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${tile.color}`}
    >
      {tile.expandable && (
        <span className="absolute right-2 top-2 text-slate-400" aria-hidden="true">
          ▶
        </span>
      )}
      <span className="flex h-9 w-9 items-center justify-center text-[26px] leading-none">
        {tile.imageUrl ? (
          <Image
            src={tile.imageUrl}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          tile.emoji
        )}
      </span>
      <span className="px-1 text-center text-[13px] font-medium leading-tight text-slate-700">
        {tile.label}
      </span>
    </button>
  );
}
