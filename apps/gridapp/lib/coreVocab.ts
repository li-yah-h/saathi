import type { Category, GridTile, QuickPhrase } from './types';
export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'feelings', label: 'Feelings', icon: '🙂' },
  { id: 'actions', label: 'Actions', icon: '⚡' },
  { id: 'food', label: 'Food', icon: '🍴' },
  { id: 'people', label: 'People', icon: '👥' },
  { id: 'time', label: 'Time', icon: '🕐' },
  { id: 'favorites', label: 'Favorites', icon: '⭐' },
];
export const DEFAULT_CATEGORY: Category = 'actions';
const ACTIONS_TILES: GridTile[] = [
  { id: 'core-hello', label: 'Hello', emoji: '👋', category: 'actions', color: 'bg-amber-100' },
  { id: 'core-dont-know', label: "I don't know", emoji: '🤷', category: 'actions', color: 'bg-sky-100' },
  { id: 'core-thank-you', label: 'Thank you', emoji: '🙏', category: 'actions', color: 'bg-emerald-100' },
  { id: 'core-love-you', label: 'I love you', emoji: '🤟', category: 'actions', color: 'bg-rose-100' },
  { id: 'core-want', label: 'want', emoji: '🙋', category: 'actions', color: 'bg-amber-100' },
  { id: 'core-help', label: 'help', emoji: '🤝', category: 'actions', color: 'bg-emerald-100' },
  { id: 'core-no', label: 'no', emoji: '❌', category: 'actions', color: 'bg-rose-100' },
  { id: 'core-water', label: 'water', emoji: '💧', category: 'actions', color: 'bg-sky-100' },
  {
    id: 'core-food',
    label: 'food',
    emoji: '🍎',
    category: 'actions',
    color: 'bg-emerald-100',
    expandable: true,
  },
  { id: 'core-bathroom', label: 'bathroom', emoji: '🚻', category: 'actions', color: 'bg-violet-100' },
  { id: 'core-sleep', label: 'sleep', emoji: '😴', category: 'actions', color: 'bg-violet-100' },
  { id: 'core-home', label: 'home', emoji: '🏠', category: 'actions', color: 'bg-amber-100' },
  { id: 'core-school', label: 'school', emoji: '🏫', category: 'actions', color: 'bg-emerald-100' },
  { id: 'core-play', label: 'play', emoji: '🎮', category: 'actions', color: 'bg-sky-100' },
];
const FEELINGS_TILES: GridTile[] = [
  { id: 'feel-happy', label: 'happy', emoji: '😄', category: 'feelings', color: 'bg-amber-100' },
  { id: 'feel-sad', label: 'sad', emoji: '😢', category: 'feelings', color: 'bg-sky-100' },
  { id: 'feel-angry', label: 'angry', emoji: '😠', category: 'feelings', color: 'bg-rose-100' },
  { id: 'feel-scared', label: 'scared', emoji: '😨', category: 'feelings', color: 'bg-violet-100' },
  { id: 'feel-tired', label: 'tired', emoji: '😪', category: 'feelings', color: 'bg-violet-100' },
  { id: 'feel-sick', label: 'sick', emoji: '🤒', category: 'feelings', color: 'bg-emerald-100' },
];
const FOOD_TILES: GridTile[] = [
  { id: 'food-apple', label: 'apple', emoji: '🍎', category: 'food', color: 'bg-emerald-100' },
  { id: 'food-milk', label: 'milk', emoji: '🥛', category: 'food', color: 'bg-sky-100' },
  { id: 'food-bread', label: 'bread', emoji: '🍞', category: 'food', color: 'bg-amber-100' },
  { id: 'food-banana', label: 'banana', emoji: '🍌', category: 'food', color: 'bg-amber-100' },
  { id: 'food-snack', label: 'snack', emoji: '🍪', category: 'food', color: 'bg-amber-100' },
  { id: 'food-more', label: 'more', emoji: '➕', category: 'food', color: 'bg-slate-100' },
];
const PEOPLE_TILES: GridTile[] = [
  { id: 'people-mom', label: 'mom', emoji: '👩', category: 'people', color: 'bg-rose-100' },
  { id: 'people-dad', label: 'dad', emoji: '👨', category: 'people', color: 'bg-sky-100' },
  { id: 'people-teacher', label: 'teacher', emoji: '🧑‍🏫', category: 'people', color: 'bg-emerald-100' },
  { id: 'people-friend', label: 'friend', emoji: '🧑‍🤝‍🧑', category: 'people', color: 'bg-amber-100' },
  { id: 'people-doctor', label: 'doctor', emoji: '🩺', category: 'people', color: 'bg-violet-100' },
];
const TIME_TILES: GridTile[] = [
  { id: 'time-now', label: 'now', emoji: '⏱️', category: 'time', color: 'bg-amber-100' },
  { id: 'time-later', label: 'later', emoji: '⏳', category: 'time', color: 'bg-sky-100' },
  { id: 'time-today', label: 'today', emoji: '📅', category: 'time', color: 'bg-emerald-100' },
  { id: 'time-tomorrow', label: 'tomorrow', emoji: '🌅', category: 'time', color: 'bg-violet-100' },
];
const FAVORITES_TILES: GridTile[] = [
  { id: 'fav-music', label: 'music', emoji: '🎵', category: 'favorites', color: 'bg-sky-100' },
  { id: 'fav-book', label: 'book', emoji: '📖', category: 'favorites', color: 'bg-amber-100' },
  { id: 'fav-outside', label: 'outside', emoji: '🌳', category: 'favorites', color: 'bg-emerald-100' },
];
export const TILES_BY_CATEGORY: Record<Category, GridTile[]> = {
  actions: ACTIONS_TILES,
  feelings: FEELINGS_TILES,
  food: FOOD_TILES,
  people: PEOPLE_TILES,
  time: TIME_TILES,
  favorites: FAVORITES_TILES,
};
export const QUICK_PHRASES: QuickPhrase[] = [
  { id: 'qp-need-help', label: 'I need help', emoji: '💚', color: 'bg-emerald-50 text-emerald-900' },
  { id: 'qp-hungry', label: "I'm hungry", emoji: '🍽️', color: 'bg-sky-50 text-sky-900' },
  { id: 'qp-tired', label: "I'm tired", emoji: '😪', color: 'bg-violet-50 text-violet-900' },
  { id: 'qp-break', label: 'I need a break', emoji: '🖐️', color: 'bg-orange-50 text-orange-900' },
];
export const FALLBACK_SUGGESTIONS = [
  { id: 'sug-feel-good', label: 'I feel good', emoji: '😊', color: 'bg-emerald-100' },
  { id: 'sug-rest', label: 'I need rest', emoji: '🛌', color: 'bg-violet-100' },
  { id: 'sug-excited', label: "I'm excited", emoji: '🎉', color: 'bg-amber-100' },
  { id: 'sug-outside', label: "Let's go outside", emoji: '🌳', color: 'bg-emerald-100' },
  { id: 'sug-music', label: 'I want music', emoji: '🎵', color: 'bg-sky-100' },
  { id: 'sug-book', label: 'Read a book', emoji: '📖', color: 'bg-amber-100' },
];
