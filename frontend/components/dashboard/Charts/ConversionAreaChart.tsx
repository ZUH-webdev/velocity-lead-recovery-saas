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
  backgroundColor: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: '8px',
  color: '#f5f5f5',
};

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
        <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#888888', fontSize: 11 }}
          tickFormatter={(v) => v.slice(5)}
          axisLine={{ stroke: '#2a2a2a' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#888888', fontSize: 11 }}
          axisLine={{ stroke: '#2a2a2a' }}
          tickLine={false}
          unit="%"
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: '#888888' }}
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
