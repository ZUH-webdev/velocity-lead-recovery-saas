'use client';

import { useMemo, useState } from 'react';
import ConversionAreaChart from '../../../components/dashboard/Charts/ConversionAreaChart';
import LeadsLineChart from '../../../components/dashboard/Charts/LeadsLineChart';
import ScoreBarChart from '../../../components/dashboard/Charts/ScoreBarChart';
import SourcePieChart from '../../../components/dashboard/Charts/SourcePieChart';
import { analyticsData } from '../../../lib/mock-data';

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
      <div className="flex justify-end">
        <div className="inline-flex rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-1">
          {(['7d', '30d', '90d'] as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                range === r ? 'bg-[#c9a97a] text-black' : 'text-[#888888] hover:text-[#f5f5f5]'
              }`}
            >
              Last {r.replace('d', ' days')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
          <h3 className="text-xs uppercase tracking-widest text-[#888888]">Leads Over Time</h3>
          <div className="mt-4">
            <LeadsLineChart data={dailyData} />
          </div>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
          <h3 className="text-xs uppercase tracking-widest text-[#888888]">Appointment Conversion Rate</h3>
          <div className="mt-4">
            <ConversionAreaChart data={dailyData} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
          <h3 className="text-xs uppercase tracking-widest text-[#888888]">Lead Sources Breakdown</h3>
          <div className="mt-4 flex items-center justify-center">
            <SourcePieChart data={analyticsData.sources} />
          </div>
          <div className="mt-2 flex justify-center gap-4 text-xs text-[#888888]">
            {analyticsData.sources.map((s, i) => (
              <span key={s.name} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: ['#c9a97a', '#7ddcc1', '#888888'][i] }}
                />
                {s.name} ({s.value})
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
          <h3 className="text-xs uppercase tracking-widest text-[#888888]">Lead Score Distribution</h3>
          <div className="mt-4">
            <ScoreBarChart data={analyticsData.scoreDistribution} />
          </div>
        </div>
      </div>
    </div>
  );
}
