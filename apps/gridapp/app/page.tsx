'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import SentenceBar, { type SentenceToken } from '@/components/SentenceBar';
import SidebarNav from '@/components/SidebarNav';
import Grid from '@/components/Grid';
import DynamicColumn from '@/components/DynamicColumn';
import QuickPhrases from '@/components/QuickPhrases';
import { useVoicePlayer } from '@/components/VoicePlayer';
import { supabaseBrowser } from '@/lib/supabase';
import { CONTEXTS, getActiveContext, getGreeting, setActiveContext } from '@/lib/context';
import { DEFAULT_CATEGORY } from '@/lib/coreVocab';
import type { AppContext, Category, GridTile, QuickPhrase, SuggestedTile } from '@/lib/types';
export default function GridPage() {
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY);
  const [context, setContext] = useState<AppContext>(getActiveContext());
  const [sentence, setSentence] = useState<SentenceToken[]>([]);
  const [greeting, setGreeting] = useState(getGreeting());
  const { speak, speaking } = useVoicePlayer();
  const lastTapAt = useRef<number>(Date.now());
  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const logEvent = useCallback(
    async (tileId: string, source: 'grid' | 'dynamic_column' | 'quick_phrase') => {
      const now = Date.now();
      const latencyMs = now - lastTapAt.current;
      lastTapAt.current = now;

      try {
        const {
          data: { session },
        } = await supabaseBrowser.auth.getSession();

        await fetch('/api/log-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
          },
          body: JSON.stringify({ tile_id: tileId, latency_ms: latencyMs, source }),
        });
      } catch {
        
      }
    },
    []
  );
  const handleGridTap = useCallback(
    (tile: GridTile) => {
      setSentence((prev) => [...prev, tile]);
      void logEvent(tile.id, 'grid');
    },
    [logEvent]
  );
  const handleSuggestionTap = useCallback(
    (tile: SuggestedTile) => {
      setSentence((prev) => [...prev, tile]);
      void logEvent(tile.id, 'dynamic_column');
    },
    [logEvent]
  );
  const handleQuickPhraseTap = useCallback(
    (phrase: QuickPhrase) => {
      setSentence((prev) => [...prev, { id: phrase.id, label: phrase.label }]);
      void logEvent(phrase.id, 'quick_phrase');
    },
    [logEvent]
  );
  const handleSpeak = useCallback(() => {
    void speak(sentence.map((t) => ({ label: t.label, audioUrl: t.audioUrl })));
  }, [sentence, speak]);

  const handleClear = useCallback(() => setSentence([]), []);

  const handleContextChange = useCallback((next: AppContext) => {
    setContext(next);
    setActiveContext(next);
  }, []);
  return (
    <main className="flex flex-col gap-5">
      <Header greeting={greeting} />
      <SentenceBar tokens={sentence} onSpeak={handleSpeak} onClear={handleClear} speaking={speaking} />
      <div className="flex flex-1 gap-6">
        <SidebarNav active={category} onSelect={setCategory} />
        <section className="flex flex-1 flex-col gap-5">
          <Grid category={category} onTap={handleGridTap} />
          <QuickPhrases onSelect={handleQuickPhraseTap} />
        </section>
        <DynamicColumn context={context} onSelect={handleSuggestionTap} />
      </div>

      {}
      <div className="flex items-center gap-2 self-end text-xs text-slate-400">
        <span>Context:</span>
        <select
          value={context.name}
          onChange={(e) => {
            const found = CONTEXTS.find((c) => c.name === e.target.value) ?? context;
            handleContextChange(found);
          }}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-600"
        >
          {CONTEXTS.map((c) => (
            <option key={c.id} value={c.name}>
              {c.icon} {c.label}
            </option>
          ))}
        </select>
      </div>
    </main>
  );
}
