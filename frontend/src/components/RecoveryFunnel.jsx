import React from 'react';
import { motion } from 'framer-motion';
import { CountUp } from 'react-countup';
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

const RecoveryFunnel = ({ metrics }) => {
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

  const MetricCard = ({ icon: Icon, label, value, color = 'indigo', isAnimated = false }) => {
    const colorClasses = {
      indigo: 'bg-indigo-50 text-indigo-600',
      purple: 'bg-purple-50 text-purple-600',
      emerald: 'bg-emerald-50 text-emerald-600',
      amber: 'bg-amber-50 text-amber-600',
    };
    
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.02, y: -4 }}
        className="p-6 rounded-xl bg-white border border-slate-200 transition-all"
        style={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-slate-500 text-sm font-medium">{label}</p>
            <div className="mt-3">
              {isAnimated && typeof value === 'number' ? (
                <CountUp
                  end={value}
                  duration={2.5}
                  separator=","
                  className="text-2xl font-bold text-slate-900"
                />
              ) : (
                <p className="text-2xl font-bold text-slate-900">{value}</p>
              )}
            </div>
          </div>
          <motion.div
            className={`p-3 rounded-lg ${colorClasses[color]}`}
            whileHover={{ scale: 1.1 }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          icon={Phone}
          label="Missed Calls Caught"
          value={metrics.totalMissedCalls}
          color="indigo"
          isAnimated={true}
        />
        <MetricCard
          icon={Zap}
          label="Leads Qualified"
          value={metrics.leadsQualified}
          color="purple"
          isAnimated={true}
        />
        <MetricCard
          icon={Users}
          label="Appointments Booked"
          value={metrics.appointmentsBooked}
          color="emerald"
          isAnimated={true}
        />
        <MetricCard
          icon={DollarSign}
          label="Recovery Value"
          value={metrics.totalRecoveryValue}
          color="amber"
          isAnimated={true}
        />
      </div>

      {/* Funnel Visualization */}
      <motion.div
        variants={itemVariants}
        className="p-8 rounded-xl bg-white border border-slate-200 overflow-hidden relative"
        style={{ boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08)' }}
      >
        <div className="absolute inset-0 dotted-grid-bg opacity-30 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2.5 rounded-lg bg-indigo-50"
                whileHover={{ scale: 1.1 }}
              >
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-900">Recovery Funnel</h3>
            </div>
            <motion.span
              className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-sm"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {metrics.weeklyConversionRate}% Conversion
            </motion.span>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.funnelData}>
              <defs>
                <linearGradient id="funnelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(226, 232, 240, 0.4)" vertical={false} />
              <XAxis
                dataKey="stage"
                stroke="rgb(100, 116, 139)"
                style={{ fontSize: '0.875rem' }}
              />
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
                {metrics.funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Conversion Metrics */}
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
                data={metrics.funnelData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {metrics.funnelData.map((entry, index) => (
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
              <span className="text-3xl font-bold text-indigo-700">
                {metrics.weeklyConversionRate}%
              </span>
              <span className="text-emerald-600 text-sm font-medium">↑ 12%</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-emerald-600 text-sm mb-2 font-medium">Average Lead Score</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-emerald-700">
                {metrics.averageLeadScore}
              </span>
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
