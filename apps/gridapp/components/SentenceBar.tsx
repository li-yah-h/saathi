'use client';
export interface SentenceToken {
  id: string;
  label: string;
  audioUrl?: string | null;
}
interface SentenceBarProps {
  tokens: SentenceToken[];
  onSpeak: () => void;
  onClear: () => void;
  speaking: boolean;
}
export default function SentenceBar({ tokens, onSpeak, onClear, speaking }: SentenceBarProps) {
  const text = tokens.map((t) => t.label).join(' ');
  return (
    <div className="flex items-center gap-3">
      <div className="flex min-h-[52px] flex-1 items-center rounded-2xl border border-slate-200 bg-white px-4 text-slate-700">
        {text || <span className="text-slate-400">Tap tiles to build a sentence...</span>}
      </div>
      <button
        type="button"
        onClick={onSpeak}
        disabled={tokens.length === 0}
        className="flex items-center gap-2 whitespace-nowrap rounded-2xl bg-brand-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span aria-hidden="true">{speaking ? '🔊' : '🔊'}</span> Speak
      </button>
      <button
        type="button"
        onClick={onClear}
        disabled={tokens.length === 0}
        className="flex items-center gap-2 whitespace-nowrap rounded-2xl bg-rose-50 px-5 py-3.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span aria-hidden="true">✕</span> Clear
      </button>
    </div>
  );
}
