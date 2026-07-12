export type Role = 'user' | 'admin';
export interface Profile {
  id: string;
  role: Role;
  name: string;
}
export interface TileRecord {
  id: string;
  label: string;
  image_url: string | null;
  audio_url: string | null;
  is_dynamic_slot: boolean;
  locked: boolean;
}
export interface GridTile {
  id: string;
  label: string;
  emoji: string;
  imageUrl?: string | null;
  audioUrl?: string | null;
  category: Category;
  color: string;
  expandable?: boolean;
  isDynamicSlot?: boolean;
}
export type Category = 'feelings' | 'actions' | 'food' | 'people' | 'time' | 'favorites';
export interface QuickPhrase {
  id: string;
  label: string;
  emoji: string;
  color: string;
}
export interface SuggestedTile {
  id: string;
  label: string;
  emoji: string;
  color: string;
  similarity?: number;
}
export interface NewEvent {
  tile_id: string;
  latency_ms: number;
  source: 'grid' | 'dynamic_column' | 'quick_phrase';
}
export interface AppContext {
  id: string;
  name: string;
  label: string;
  icon: string;
}
