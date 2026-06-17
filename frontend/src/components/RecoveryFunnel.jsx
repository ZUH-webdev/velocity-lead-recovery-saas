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
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, DollarSign, Users, Zap, Phone } from 'lucide-react';

const RecoveryFunnel = ({ metrics }) => {
  // Elite animation easing
  const fluidSpringTransition = {
    type: 'spring',
    stiffness: 180,
    damping: 26,
    mass: 1.1,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: fluidSpringTransition,
    },
  };

  // Elite gradient and filter definitions
  const EliteGradientDefs = () => (
    <defs>
      <linearGradient id="eliteFunnelGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95} />
        <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.75} />
        <stop offset="100%" stopColor="#10b981" stopOpacity={0.55} />
      </linearGradient>
      <linearGradient id="eliteBarGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.95} />
        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
      </linearGradient>
      <filter id="microShadow">
        <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodOpacity="0.15" />
      </filter>
    </defs>
  );

  // Custom glassmorphic tooltip
  const EliteTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="backdrop-blur-md bg-white/70 border border-white/40 rounded-lg p-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
        >
          <p className="font-semibold text-slate-800 text-sm">
            {payload[0].payload.stage || 'Value'}
          </p>
          <p className="text-indigo-600 font-bold text-base">
            {typeof payload[0].value === 'number'
              ? payload[0].value.toLocaleString()
              : payload[0].value}
          </p>
        </motion.div>
      );
    }
    return null;
  };

  const MetricCard = ({ icon: Icon, label, value, color = 'indigo', isAnimated = false }) => {
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
        {/* Animated Gradient Background */}
        <motion.div
          className={`absolute top-0 right-0 w-32 h-32 opacity-10 bg-gradient-to-br ${colorClasses[color]} rounded-full blur-3xl`}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Premium Border Glow */}
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

      {/* Elite Bar Chart Visualization */}
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

          {/* Premium Bar Chart with Elite Styling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          >
            <ResponsiveContainer width="100%" height={340}>
              <BarChart
                data={metrics.funnelData}
                margin={{ top: 20, right: 30, left: 0, bottom: 45 }}
              >
                <defs>
                  <EliteGradientDefs />
                </defs>
                {/* Ultra-faint grid lines */}
                <CartesianGrid
                  strokeDasharray="0"
                  stroke="rgba(163, 177, 198, 0.2)"
                  vertical={false}
                  horizontalPoints={[0, 1]}
                />
                {/* Elite axis styling */}
                <XAxis
                  dataKey="stage"
                  tick={{
                    fill: '#94a3b8',
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: 'Inter, Plus Jakarta Sans',
                  }}
                  axisLine={{ stroke: 'rgba(163, 177, 198, 0.2)' }}
                  tickLine={{ stroke: 'rgba(163, 177, 198, 0.2)' }}
                />
                <YAxis
                  tick={{
                    fill: '#94a3b8',
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: 'Inter, Plus Jakarta Sans',
                  }}
                  axisLine={{ stroke: 'rgba(163, 177, 198, 0.2)' }}
                  tickLine={{ stroke: 'rgba(163, 177, 198, 0.2)' }}
                />
                {/* Glassmorphic tooltip */}
                <Tooltip content={<EliteTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                {/* Premium bars with soft corners */}
                <Bar
                  dataKey="value"
                  fill="url(#eliteBarGradient)"
                  radius={[12, 12, 0, 0]}
                  isAnimationActive
                  animationDuration={1400}
                  animationEasing="easeOut"
                  filter="url(#microShadow)"
                >
                  {metrics.funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || 'url(#eliteBarGradient)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </motion.div>

      {/* Conversion Metrics with Area Chart */}
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
              <Tooltip content={<EliteTooltip />} />
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
