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
  backgroundColor: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: '8px',
  color: '#f5f5f5',
};

export default function LeadsLineChart({ data }: LeadsLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#888888', fontSize: 11 }}
          tickFormatter={(v) => v.slice(5)}
          axisLine={{ stroke: '#2a2a2a' }}
          tickLine={false}
        />
        <YAxis tick={{ fill: '#888888', fontSize: 11 }} axisLine={{ stroke: '#2a2a2a' }} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#888888' }} />
        <Line type="monotone" dataKey="leads" stroke="#c9a97a" strokeWidth={2} dot={false} name="Leads" />
      </LineChart>
    </ResponsiveContainer>
  );
}
