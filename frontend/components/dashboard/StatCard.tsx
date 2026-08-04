import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
}

export default function StatCard({ label, value, change, icon: Icon }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="rounded-xl border border-[#e4e4e7] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa] sm:text-[11px]">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.2px] text-[#09090b] sm:text-3xl">{value}</p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fdf6ec] sm:h-10 sm:w-10">
          <Icon className="h-4 w-4 text-[#c9a97a] sm:h-5 sm:w-5" />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1 sm:mt-4 sm:gap-1.5">
        {isPositive ? (
          <TrendingUp className="h-3.5 w-3.5 shrink-0 text-[#16a34a]" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 shrink-0 text-[#dc2626]" />
        )}
        <span className={`text-xs font-medium ${isPositive ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
          {isPositive ? '+' : ''}
          {change}%
        </span>
        <span className="text-xs text-[#a1a1aa]">vs last week</span>
      </div>
    </div>
  );
}