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
  backgroundColor: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: '8px',
  color: '#f5f5f5',
};

export default function ScoreBarChart({ data }: ScoreBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
        <XAxis
          dataKey="bucket"
          tick={{ fill: '#888888', fontSize: 11 }}
          axisLine={{ stroke: '#2a2a2a' }}
          tickLine={false}
        />
        <YAxis tick={{ fill: '#888888', fontSize: 11 }} axisLine={{ stroke: '#2a2a2a' }} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#888888' }} />
        <Bar dataKey="count" fill="#c9a97a" radius={[4, 4, 0, 0]} name="Leads" />
      </BarChart>
    </ResponsiveContainer>
  );
}