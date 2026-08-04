'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ScoreBarChartProps {
  data: { bucket: string; count: number }[];
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

export default function ScoreBarChart({ data }: ScoreBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid stroke="#f4f4f5" strokeDasharray="3 3" />
        <XAxis
          dataKey="bucket"
          tick={{ fill: '#a1a1aa', fontSize: 11 }}
          axisLine={{ stroke: '#e4e4e7' }}
          tickLine={false}
        />
        <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={{ stroke: '#e4e4e7' }} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} cursor={{ fill: 'rgba(9,9,11,0.03)' }} />
        <Bar dataKey="count" fill="#c9a97a" radius={[4, 4, 0, 0]} name="Leads" />
      </BarChart>
    </ResponsiveContainer>
  );
}