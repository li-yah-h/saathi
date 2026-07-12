'use client';
import type { QuickPhrase } from '@/lib/types';
import { QUICK_PHRASES } from '@/lib/coreVocab';
interface QuickPhrasesProps {
  onSelect: (phrase: QuickPhrase) => void;
}
export default function QuickPhrases({ onSelect }: QuickPhrasesProps) {
  return (
    <div className="border-t border-slate-100 pt-4">
      <p className="mb-2.5 text-[11px] font-semibold tracking-wide text-slate-400">QUICK PHRASES</p>
      <div className="flex flex-wrap gap-2.5">
        {QUICK_PHRASES.map((phrase) => (
          <button
            key={phrase.id}
            type="button"
            onClick={() => onSelect(phrase)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 hover:brightness-95 ${phrase.color}`}
          >
            <span aria-hidden="true">{phrase.emoji}</span>
            {phrase.label}
          </button>
        ))}
      </div>
    </div>
  );
}
