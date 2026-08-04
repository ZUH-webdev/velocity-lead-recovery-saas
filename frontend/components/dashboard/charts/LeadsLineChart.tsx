'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DailyAnalytics } from '../../../lib/mock-data';

interface LeadsLineChartProps {
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

export default function LeadsLineChart({ data }: LeadsLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid stroke="#f4f4f5" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#a1a1aa', fontSize: 11 }}
          tickFormatter={(v) => v.slice(5)}
          axisLine={{ stroke: '#e4e4e7' }}
          tickLine={false}
        />
        <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={{ stroke: '#e4e4e7' }} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} cursor={{ fill: 'rgba(9,9,11,0.03)' }} />
        <Line type="monotone" dataKey="leads" stroke="#c9a97a" strokeWidth={2} dot={false} name="Leads" />
      </LineChart>
    </ResponsiveContainer>
  );
}