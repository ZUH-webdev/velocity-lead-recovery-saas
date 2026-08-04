'use client';

import { useMemo, useState } from 'react';
import ConversionAreaChart from '../../../../components/dashboard/charts/ConversionAreaChart';
import LeadsLineChart from '../../../../components/dashboard/charts/LeadsLineChart';
import ScoreBarChart from '../../../../components/dashboard/charts/ScoreBarChart';
import SourcePieChart from '../../../../components/dashboard/charts/SourcePieChart';
import { analyticsData } from '../../../../lib/mock-data';

type Range = '7d' | '30d' | '90d';

const rangeDays: Record<Range, number> = { '7d': 7, '30d': 30, '90d': 90 };

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>('30d');

  const dailyData = useMemo(() => {
    const days = rangeDays[range];
    return analyticsData.daily.slice(-days);
  }, [range]);

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#a1a1aa]">Insights</p>
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[#09090b]">Analytics</h1>
        <p className="mt-1 text-sm text-[#71717a]">Performance metrics and recovery insights</p>
      </div>

      <div className="flex justify-end">
        <div className="inline-flex gap-1.5">
          {(['7d', '30d', '90d'] as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition ${
                range === r
                  ? 'border border-[#09090b] bg-[#09090b] text-white'
                  : 'border border-[#e4e4e7] bg-white text-[#71717a] hover:text-[#09090b]'
              }`}
            >
              Last {r.replace('d', ' days')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Leads Over Time</h3>
          <div className="mt-4">
            <LeadsLineChart data={dailyData} />
          </div>
        </div>
        <div className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Appointment Conversion Rate</h3>
          <div className="mt-4">
            <ConversionAreaChart data={dailyData} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Lead Sources Breakdown</h3>
          <div className="mt-4 flex items-center justify-center">
            <SourcePieChart data={analyticsData.sources} />
          </div>
          <div className="mt-2 flex justify-center gap-4 text-xs text-[#71717a]">
            {analyticsData.sources.map((s, i) => (
              <span key={s.name} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: ['#c9a97a', '#7ddcc1', '#71717a'][i] }}
                />
                {s.name} ({s.value})
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Lead Score Distribution</h3>
          <div className="mt-4">
            <ScoreBarChart data={analyticsData.scoreDistribution} />
          </div>
        </div>
      </div>
    </div>
  );
}
