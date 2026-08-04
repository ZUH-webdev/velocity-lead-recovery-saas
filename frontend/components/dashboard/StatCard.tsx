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
    <div className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.2px] text-[#09090b]">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fdf6ec]">
          <Icon className="h-5 w-5 text-[#c9a97a]" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp className="h-3.5 w-3.5 text-[#16a34a]" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-[#dc2626]" />
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