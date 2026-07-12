import type { AppContext } from './types';
export const CONTEXTS: AppContext[] = [
  { id: 'general', name: 'general', label: 'General', icon: '🏡' },
  { id: 'breakfast', name: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { id: 'school', name: 'school', label: 'School', icon: '🏫' },
  { id: 'playground', name: 'playground', label: 'Playground', icon: '🛝' },
  { id: 'bedtime', name: 'bedtime', label: 'Bedtime', icon: '🌙' },
];
export const DEFAULT_CONTEXT = CONTEXTS[0];
const STORAGE_KEY = 'echovoice.activeContext';
export function getActiveContext(): AppContext {
  if (typeof window === 'undefined') return DEFAULT_CONTEXT;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return CONTEXTS.find((c) => c.name === saved) ?? DEFAULT_CONTEXT;
}
export function setActiveContext(context: AppContext): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, context.name);
}
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning!';
  if (hour < 17) return 'Good afternoon!';
  if (hour < 21) return 'Good evening!';
  return 'Good night!';
}
