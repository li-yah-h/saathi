'use client';
import Tile from './Tile';
import type { Category, GridTile } from '@/lib/types';
import { TILES_BY_CATEGORY } from '@/lib/coreVocab';
interface GridProps {
  category: Category;
  onTap: (tile: GridTile) => void;
}
export default function Grid({ category, onTap }: GridProps) {
  const tiles = TILES_BY_CATEGORY[category];
  return (
    <div className="flex flex-wrap content-start gap-3" role="group" aria-label={`${category} tiles`}>
      {tiles.map((tile) => (
        <Tile key={tile.id} tile={tile} onTap={onTap} />
      ))}
    </div>
  );
}
