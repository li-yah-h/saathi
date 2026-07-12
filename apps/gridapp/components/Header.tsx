'use client';
interface HeaderProps {
  greeting: string;
  userName?: string;
  onOpenSettings?: () => void;
}
export default function Header({ greeting, onOpenSettings }: HeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-xl" aria-hidden="true">
          🧑
        </span>
        <h1 className="text-lg font-semibold text-slate-900">
          {greeting} <span aria-hidden="true">👋</span>
        </h1>
      </div>
      <button
        type="button"
        onClick={onOpenSettings}
        aria-label="Settings"
        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      >
        ⚙️
      </button>
    </header>
  );
}
