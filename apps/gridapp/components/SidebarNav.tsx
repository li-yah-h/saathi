'use client';
import type { Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/coreVocab';
interface SidebarNavProps {
  active: Category;
  onSelect: (category: Category) => void;
  onOpenKeyboard?: () => void;
}
export default function SidebarNav({ active, onSelect, onOpenKeyboard }: SidebarNavProps) {
  return (
    <nav className="flex w-[76px] shrink-0 flex-col items-stretch gap-1.5" aria-label="Categories">
      {CATEGORIES.map((c) => {
        const isActive = c.id === active;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            aria-pressed={isActive}
            className={`flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-[11px] font-medium transition ${
              isActive ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <span className={`text-xl ${isActive ? '' : 'opacity-70'}`} aria-hidden="true">
              {c.icon}
            </span>
            {c.label}
          </button>
        );
      })}

      <div className="mt-4 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onOpenKeyboard}
          className="flex w-full flex-col items-center gap-1 rounded-xl px-2 py-3 text-[11px] font-medium text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
        >
          <span className="text-xl opacity-70" aria-hidden="true">
            ⌨️
          </span>
          Keyboard
        </button>
      </div>
    </nav>
  );
}
