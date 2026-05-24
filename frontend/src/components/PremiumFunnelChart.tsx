import React, { useEffect, useId, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ArrowUpRight, TrendingUp, Zap } from 'lucide-react';
import type { FunnelDatum, RecoveryMetrics } from '../types';

const defaultFunnelData: FunnelDatum[] = [
  { stage: 'Missed Calls', value: 1247, percentage: 100 },
  { stage: 'AI Engaged', value: 1089, percentage: 87.3 },
  { stage: 'Qualified', value: 893, percentage: 71.6 },
  { stage: 'Booked', value: 456, percentage: 36.6 },
];

const chartWrapperVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 18 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 28 },
  },
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: FunnelDatum }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  const datum = (payload[0]?.payload ?? {}) as FunnelDatum;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className="rounded-2xl border border-white/40 bg-white/70 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{datum.stage}</p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-xl font-black text-violet-600 font-jakarta">
          <CountUp end={datum.value || 0} duration={0.8} separator="," />
        </span>
        <span className="pb-0.5 text-xs font-semibold text-emerald-600">
          {datum.percentage ? `${datum.percentage}% of baseline` : ''}
        </span>
      </div>
    </motion.div>
  );
};

interface Props {
  metrics: Partial<RecoveryMetrics>;
}

const PremiumFunnelChart = ({ metrics }: Props) => {
  const chartId = useId().replace(/:/g, '');
  const [pulseIndex, setPulseIndex] = useState(0);

  const funnelData = useMemo(() => {
    if (metrics?.funnelData?.length) {
      return metrics.funnelData.map((entry, index) => ({
        ...entry,
        percentage:
          typeof entry.percentage === 'number'
            ? entry.percentage
            : index === 0
              ? 100
              : Number(((entry.value / (metrics.funnelData?.[0]?.value || 1)) * 100).toFixed(1)),
      }));
    }

    return defaultFunnelData;
  }, [metrics]);

  useEffect(() => {
    if (!funnelData.length) {
      return undefined;
    }

    const interval = setInterval(() => {
      setPulseIndex((current) => (current + 1) % funnelData.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [funnelData.length]);

  const conversionRate = useMemo(() => {
    const startValue = funnelData[0]?.value || 1;
    const endValue = funnelData[funnelData.length - 1]?.value || 0;
    return ((endValue / startValue) * 100).toFixed(1);
  }, [funnelData]);

  const summaryCards = [
    {
      label: 'Total Leads',
      value: funnelData[0]?.value || 0,
      accent: 'violet',
      icon: '📊',
    },
    {
      label: 'Conversion Peak',
      value: `${conversionRate}%`,
      accent: 'indigo',
      icon: '🎯',
    },
    {
      label: 'Appointments Booked',
      value: funnelData[funnelData.length - 1]?.value || 0,
      accent: 'emerald',
      icon: '✅',
    },
  ];

  return (
    <motion.div
      variants={chartWrapperVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(248,250,252,0.94)_100%)] p-4 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_32%)]" />

        <div className="relative z-10 mb-5 flex flex-col gap-4 md:mb-7 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 md:gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <TrendingUp className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-black tracking-tight text-slate-900 md:text-2xl font-jakarta">
                  Lead Recovery Funnel
                </h2>
                <p className="text-xs font-medium text-slate-500 md:text-sm">
                  Real-time conversion intelligence across every stage
                </p>
              </div>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/70 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(124,58,237,0.08)_0%,rgba(99,102,241,0.05)_50%,rgba(16,185,129,0.08)_100%)]" />
            <div className="relative z-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Conversion Rate
              </p>
              <div className="mt-1 flex items-end gap-2">
                <p className="text-3xl font-black text-violet-600 font-jakarta md:text-4xl">
                  <CountUp end={parseFloat(conversionRate)} duration={1.2} decimals={1} suffix="%" />
                </p>
                <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Live
                </span>
              </div>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              className="absolute -right-2 -top-2 text-violet-500/70"
            >
              <Zap className="h-5 w-5 fill-current" />
            </motion.div>
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between gap-3 md:mb-6">
            <h3 className="text-sm font-bold tracking-tight text-slate-900 md:text-base font-jakarta">
              Funnel Flow Analysis
            </h3>
            <div className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/60 px-3 py-1.5 text-[11px] font-semibold text-slate-500 md:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
              Soft obsidian + violet treatment
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={funnelData}
              margin={{ top: 12, right: 20, left: 8, bottom: 26 }}
              barCategoryGap="28%"
            >
              <defs>
                <linearGradient id={`${chartId}-barGradient`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.95" />
                  <stop offset="45%" stopColor="#6366f1" stopOpacity="0.82" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.78" />
                </linearGradient>
                <linearGradient id={`${chartId}-barGlow`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.08" />
                </linearGradient>
                <filter id={`${chartId}-barShadow`} x="-20%" y="-20%" width="140%" height="180%">
                  <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0f172a" floodOpacity="0.12" />
                </filter>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="rgba(163, 177, 198, 0.2)"
                strokeDasharray="4 10"
              />
              <XAxis
                dataKey="stage"
                tickLine={false}
                axisLine={false}
                tickMargin={14}
                interval={0}
                tick={{
                  fill: '#94a3b8',
                  fontSize: 11,
                  fontWeight: 500,
                  fontFamily: 'Inter, "Plus Jakarta Sans", sans-serif',
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={42}
                tickMargin={10}
                tick={{
                  fill: '#94a3b8',
                  fontSize: 11,
                  fontWeight: 500,
                  fontFamily: 'Inter, "Plus Jakarta Sans", sans-serif',
                }}
              />
              <Tooltip cursor={{ fill: 'rgba(124, 58, 237, 0.05)' }} content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                radius={[10, 10, 0, 0]}
                fill={`url(#${chartId}-barGradient)`}
                stroke={`url(#${chartId}-barGlow)`}
                strokeWidth={1}
                filter={`url(#${chartId}-barShadow)`}
                animationBegin={0}
                animationDuration={1400}
                animationEasing="ease-out"
                isAnimationActive
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {funnelData.map((stage, index) => {
          const isActive = pulseIndex === index;

          return (
            <motion.div
              key={stage.stage}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className={`relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-md ${
                isActive ? 'ring-1 ring-violet-400/70' : ''
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.1),transparent_38%)]" />
              {isActive && (
                <motion.div
                  animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.04, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl bg-violet-500/5"
                />
              )}

              <div className="relative z-10 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Stage {index + 1}
                  </p>
                  <h4 className="mt-1 text-sm font-semibold text-slate-800 md:text-base">
                    {stage.stage}
                  </h4>
                </div>

                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/12 to-emerald-500/12 text-violet-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-current" />
                </span>
              </div>

              <div className="relative z-10 mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-2xl font-black tracking-tight text-violet-600 font-jakarta md:text-3xl">
                    <CountUp end={stage.value || 0} duration={1.2} separator="," />
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Conversion share {stage.percentage ?? 0}%
                  </p>
                </div>

                <div className="flex h-9 items-center gap-2 rounded-full bg-slate-950/5 px-3 text-xs font-semibold text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Active
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        {summaryCards.map((card) => (
          <motion.div
            key={card.label}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/75 p-4 shadow-[0_12px_24px_rgba(15,23,42,0.06)] backdrop-blur-md md:p-5"
          >
            <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_36%)]" />
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  {card.label}
                </p>
                <p className="mt-2 text-2xl font-black tracking-tight text-slate-900 font-jakarta md:text-3xl">
                  {typeof card.value === 'number' ? (
                    <CountUp end={card.value} duration={1.2} separator="," />
                  ) : (
                    card.value
                  )}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] ${
                  card.accent === 'emerald'
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : card.accent === 'indigo'
                      ? 'bg-indigo-500/10 text-indigo-600'
                      : 'bg-violet-500/10 text-violet-600'
                }`}
              >
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default PremiumFunnelChart;