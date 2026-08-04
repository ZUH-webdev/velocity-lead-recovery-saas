'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DailyAnalytics } from '../../../lib/mock-data';

interface ConversionAreaChartProps {
  data: DailyAnalytics[];
}

const tooltipStyle = {
  background: '#ffffff',
  border: '1px solid #e4e4e7',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  fontSize: '12px',
  color: '#09090b',
};

const labelStyle = { color: '#71717a', fontWeight: 600 };

export default function ConversionAreaChart({ data }: ConversionAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7ddcc1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7ddcc1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f4f4f5" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#a1a1aa', fontSize: 11 }}
          tickFormatter={(v) => v.slice(5)}
          axisLine={{ stroke: '#e4e4e7' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#a1a1aa', fontSize: 11 }}
          axisLine={{ stroke: '#e4e4e7' }}
          tickLine={false}
          unit="%"
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={labelStyle}
          cursor={{ fill: 'rgba(9,9,11,0.03)' }}
          formatter={(value: number) => [`${value}%`, 'Conversion']}
        />
        <Area
          type="monotone"
          dataKey="conversionRate"
          stroke="#7ddcc1"
          fill="url(#conversionGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}