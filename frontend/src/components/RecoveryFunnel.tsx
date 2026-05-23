import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  PieChart,
  Pie,
} from 'recharts';
import { TrendingUp, DollarSign, Users, Zap, Phone } from 'lucide-react';
import type { FunnelDatum, RecoveryMetrics } from '../types';

interface Props {
  metrics: Partial<RecoveryMetrics>;
}

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  color?: 'indigo' | 'purple' | 'emerald' | 'amber';
  isAnimated?: boolean;
}

const RecoveryFunnel = ({ metrics }: Props) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  const MetricCard = ({ icon: Icon, label, value, color = 'indigo', isAnimated = false }: MetricCardProps) => {
    const colorClasses = {
      indigo: 'from-indigo-500 to-indigo-600',
      purple: 'from-purple-500 to-purple-600',
      emerald: 'from-emerald-500 to-emerald-600',
      amber: 'from-amber-500 to-amber-600',
    };

    const colorShadow = {
      indigo: 'rgba(99, 102, 241, 0.25)',
      purple: 'rgba(168, 85, 247, 0.25)',
      emerald: 'rgba(16, 185, 129, 0.25)',
      amber: 'rgba(217, 119, 6, 0.25)',
    };

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.05, y: -6 }}
        className="rounded-2xl border group backdrop-blur-xl overflow-hidden transition-all"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.45) 100%)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
        }}
      >
        <motion.div
          className={`absolute top-0 right-0 w-32 h-32 opacity-10 bg-gradient-to-br ${colorClasses[color]} rounded-full blur-3xl`}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${color === 'indigo' ? '#818cf8' : color === 'purple' ? '#d8b4fe' : color === 'emerald' ? '#6ee7b7' : '#fde047'} 0%, transparent 50%)`,
            padding: '1px',
            borderRadius: '1rem',
          }}
        />

        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.15, rotate: 5 }}
              className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}
              style={{ boxShadow: `0 8px 16px ${colorShadow[color]}` }}
            >
              <Icon className="w-5 h-5 text-white" />
            </motion.div>
          </div>
          <div>
            {isAnimated && typeof value === 'number' ? (
              <CountUp
                end={value}
                duration={2.5}
                separator="," 
                className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
              />
            ) : (
              <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{value}</p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const funnelData = metrics.funnelData || [];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard icon={Phone} label="Missed Calls Caught" value={metrics.totalMissedCalls || 0} color="indigo" isAnimated />
        <MetricCard icon={Zap} label="Leads Qualified" value={metrics.leadsQualified || 0} color="purple" isAnimated />
        <MetricCard icon={Users} label="Appointments Booked" value={metrics.appointmentsBooked || 0} color="emerald" isAnimated />
        <MetricCard icon={DollarSign} label="Recovery Value" value={metrics.totalRecoveryValue || 0} color="amber" isAnimated />
      </div>

      <motion.div
        variants={itemVariants}
        className="p-8 rounded-xl bg-white border border-slate-200 overflow-hidden relative"
        style={{ boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08)' }}
      >
        <div className="absolute inset-0 dotted-grid-bg opacity-30 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <motion.div className="p-2.5 rounded-lg bg-indigo-50" whileHover={{ scale: 1.1 }}>
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-900">Recovery Funnel</h3>
            </div>
            <motion.span
              className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-sm"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {metrics.weeklyConversionRate || 0}% Conversion
            </motion.span>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData}>
              <defs>
                <linearGradient id="funnelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(226, 232, 240, 0.4)" vertical={false} />
              <XAxis dataKey="stage" stroke="rgb(100, 116, 139)" style={{ fontSize: '0.875rem' }} />
              <YAxis stroke="rgb(100, 116, 139)" style={{ fontSize: '0.875rem' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  border: '1px solid rgba(226, 232, 240, 1)',
                  borderRadius: '8px',
                  color: '#0F172A',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                }}
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
              />
              <Bar dataKey="value" fill="url(#funnelGradient)" radius={[12, 12, 0, 0]}>
                {funnelData.map((entry: FunnelDatum, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-xl bg-white border border-slate-200"
          style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}
        >
          <h4 className="text-sm font-semibold text-slate-900 mb-4">Stage Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={funnelData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {funnelData.map((entry: FunnelDatum, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  borderRadius: '8px',
                  color: '#0F172A',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
            <p className="text-indigo-600 text-sm mb-2 font-medium">Weekly Conversion Rate</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-indigo-700">{metrics.weeklyConversionRate || 0}%</span>
              <span className="text-emerald-600 text-sm font-medium">↑ 12%</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-emerald-600 text-sm mb-2 font-medium">Average Lead Score</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-emerald-700">{metrics.averageLeadScore || 0}</span>
              <span className="text-slate-500 text-sm">/ 100</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-blue-700 text-sm font-medium">💡 Insight</p>
            <p className="text-blue-600 text-xs mt-2">
              Your conversion rate is 23% higher than industry average. Keep leveraging AI engagement.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RecoveryFunnel;