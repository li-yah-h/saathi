'use client';

import { useEffect, useState, type FormEvent } from 'react';
import type { AppContext, SuggestedTile } from '@/lib/types';
import { FALLBACK_SUGGESTIONS } from '@/lib/coreVocab';
interface DynamicColumnProps {
  context: AppContext;
  onSelect: (tile: SuggestedTile) => void;
}
export default function DynamicColumn({ context, onSelect }: DynamicColumnProps) {
  const [suggestions, setSuggestions] = useState<SuggestedTile[]>(FALLBACK_SUGGESTIONS);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/suggestions?context=${encodeURIComponent(context.name)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { suggestions: SuggestedTile[] }) => {
        if (!cancelled && data.suggestions?.length) setSuggestions(data.suggestions);
        else if (!cancelled) setSuggestions(FALLBACK_SUGGESTIONS);
      })
      .catch(() => {
        if (!cancelled) setSuggestions(FALLBACK_SUGGESTIONS);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [context.name]);
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/suggestions?context=${encodeURIComponent(context.name)}&q=${encodeURIComponent(query.trim())}`
      );
      const data: { suggestions: SuggestedTile[] } = await res.json();
      setSuggestions(data.suggestions?.length ? data.suggestions : FALLBACK_SUGGESTIONS);
    } catch {
      setSuggestions(FALLBACK_SUGGESTIONS);
    } finally {
      setLoading(false);
    }
  };
  return (
    <aside className="flex w-[260px] shrink-0 flex-col gap-3 border-l border-slate-200 pl-5">
      <div className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-brand-600">
        <span aria-hidden="true">✨</span>
        <span>AI SUGGESTIONS</span>
      </div>
      <form onSubmit={handleSearch}>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 focus-within:border-brand-500">
          <span aria-hidden="true">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or generate..."
            className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
      </form>
      <div className={`flex flex-col gap-2.5 transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
        {suggestions.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s)}
            className={`flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-left text-sm font-medium text-slate-700 shadow-tile transition active:scale-[0.98] hover:brightness-[0.98] ${s.color}`}
          >
            <span className="text-lg" aria-hidden="true">
              {s.emoji}
            </span>
            {s.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
