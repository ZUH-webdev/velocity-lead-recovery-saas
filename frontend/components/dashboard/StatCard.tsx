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
    <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#888888]">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-[#f5f5f5]">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c9a97a]/15">
          <Icon className="h-5 w-5 text-[#c9a97a]" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp className="h-3.5 w-3.5 text-[#4ade80]" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-[#f87171]" />
        )}
        <span className={`text-xs font-medium ${isPositive ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
          {isPositive ? '+' : ''}
          {change}%
        </span>
        <span className="text-xs text-[#888888]">vs last week</span>
      </div>
    </div>
  );
}
