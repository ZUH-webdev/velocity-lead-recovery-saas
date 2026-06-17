import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  BarChart,
} from 'recharts';
import { Zap, ArrowRight, TrendingUp } from 'lucide-react';

const PremiumFunnelChart = ({ metrics }) => {
  const [funnelData, setFunnelData] = useState([
    { stage: 'Leads', value: 1000, percentage: 100 },
    { stage: 'Contacted', value: 820, percentage: 82 },
    { stage: 'Qualified', value: 640, percentage: 64 },
    { stage: 'Proposal', value: 480, percentage: 48 },
    { stage: 'Booked', value: 350, percentage: 35 },
  ]);

  const [systemPulseIndex, setSystemPulseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemPulseIndex((prev) => (prev + 1) % funnelData.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [funnelData.length]);

  // Elite custom gradient and filter definitions
  const EliteGradientDefs = () => (
    <defs>
      {/* Multi-stop violet to emerald gradient */}
      <linearGradient id="eliteFunnelGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.9} />
        <stop offset="35%" stopColor="#6366f1" stopOpacity={0.75} />
        <stop offset="70%" stopColor="#3b82f6" stopOpacity={0.6} />
        <stop offset="100%" stopColor="#10b981" stopOpacity={0.5} />
      </linearGradient>
      
      {/* Dual-tone bar gradient */}
      <linearGradient id="eliteBarGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.95} />
        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
      </linearGradient>
      
      {/* Ambient glow filter */}
      <filter id="eliteGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      
      {/* Micro-shadow for depth */}
      <filter id="microShadow">
        <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodOpacity="0.15" />
      </filter>
    </defs>
  );

  // Custom tooltip with glassmorphism
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="backdrop-blur-md bg-white/70 border border-white/40 rounded-lg p-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
        >
          <p className="font-semibold text-slate-800 text-sm">
            {payload[0].payload.stage}
          </p>
          <p className="text-violet-600 font-bold text-base">
            {payload[0].payload.value.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {payload[0].payload.percentage}% conversion
          </p>
        </motion.div>
      );
    }
    return null;
  };

  // Fluid spring animation easing
  const fluidSpringTransition = {
    type: 'spring',
    stiffness: 180,
    damping: 26,
    mass: 1.2,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
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

  // Chart animation: bars float up from baseline
  const barContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.4,
        ease: 'easeOut',
      },
    },
  };

  // Calculate conversion rate
  const conversionRate = (
    ((funnelData[funnelData.length - 1]?.value || 0) /
      (funnelData[0]?.value || 1)) *
    100
  ).toFixed(1);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="neu-carved p-4 md:p-8 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="min-w-0">
            <h2 className="text-lg md:text-2xl font-black text-slate-900 font-jakarta mb-1 md:mb-2 flex items-center gap-2 md:gap-3">
              <TrendingUp className="w-5 md:w-7 h-5 md:h-7 text-[#7c3aed] flex-shrink-0" />
              <span className="truncate">Lead Recovery Funnel</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Real-time conversion intelligence across all stages
            </p>
          </div>

          {/* Conversion Badge with Pulse */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="glassmorphism rounded-xl px-4 md:px-6 py-3 md:py-4 relative flex-shrink-0"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-2 bg-[#7c3aed] rounded-xl opacity-20"
              />
              <div className="relative z-10">
                <p className="text-xs font-semibold text-slate-600 uppercase mb-0.5 md:mb-1">
                  Conversion Rate
                </p>
                <p className="text-2xl md:text-3xl font-black text-[#7c3aed] font-jakarta">
                  <CountUp
                    end={parseFloat(conversionRate)}
                    duration={2}
                    decimals={1}
                    suffix="%"
                  />
                </p>
              </div>
            </div>

            {/* System Pulse Icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-2 md:-top-3 -right-2 md:-right-3"
            >
              <Zap className="w-5 md:w-6 h-5 md:h-6 text-[#7c3aed] fill-[#7c3aed]" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Elite Bar Chart with Premium Styling */}
      <motion.div
        variants={itemVariants}
        className="neu-carved p-4 md:p-8 rounded-xl relative overflow-hidden"
      >
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background:
              'linear-gradient(to bottom right, rgba(124, 58, 237, 0.05) 0%, rgba(99, 102, 241, 0.03) 50%, rgba(16, 185, 129, 0.05) 100%)',
          }}
        />

        <div className="relative z-10">
          <h3 className="text-base md:text-lg font-bold text-slate-900 mb-4 md:mb-6 font-jakarta">
            Funnel Flow Analysis
          </h3>

          {/* Premium Bar Chart */}
          <motion.div variants={barContainerVariants}>
            <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 250 : 350}>
              <BarChart
                data={funnelData}
                margin={{ top: 20, right: 30, left: 0, bottom: 45 }}
              >
                <defs>
                  <EliteGradientDefs />
                </defs>
                {/* Ultra-faint grid */}
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
                {/* Elite glassmorphism tooltip */}
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.05)' }} />
                {/* Premium bars with soft corners and gradient */}
                <Bar
                  dataKey="value"
                  fill="url(#eliteBarGradient)"
                  radius={[12, 12, 0, 0]}
                  isAnimationActive
                  animationDuration={1400}
                  animationEasing="easeOut"
                  filter="url(#microShadow)"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </motion.div>

      {/* Premium Area Chart Variant */}
      <motion.div
        variants={itemVariants}
        className="neu-carved p-4 md:p-8 rounded-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, transparent 50%, rgba(16, 185, 129, 0.08) 100%)',
          }}
        />

        <div className="relative z-10">
          <h3 className="text-base md:text-lg font-bold text-slate-900 mb-4 md:mb-6 font-jakarta">
            Conversion Trend
          </h3>

          <motion.div variants={barContainerVariants}>
            <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 200 : 280}>
              <AreaChart
                data={funnelData}
                margin={{ top: 10, right: 30, left: 0, bottom: 45 }}
              >
                <defs>
                  <EliteGradientDefs />
                </defs>
                <CartesianGrid
                  strokeDasharray="0"
                  stroke="rgba(163, 177, 198, 0.15)"
                  vertical={false}
                />
                <XAxis
                  dataKey="stage"
                  tick={{
                    fill: '#94a3b8',
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: 'Inter, Plus Jakarta Sans',
                  }}
                  axisLine={{ stroke: 'rgba(163, 177, 198, 0.2)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fill: '#94a3b8',
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: 'Inter, Plus Jakarta Sans',
                  }}
                  axisLine={{ stroke: 'rgba(163, 177, 198, 0.2)' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.05)' }} />
                {/* Dual-tone area with smooth monotone stroke */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  fill="url(#eliteFunnelGradient)"
                  fillOpacity={0.15}
                  isAnimationActive
                  animationDuration={1400}
                  animationEasing="easeOut"
                  filter="url(#microShadow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </motion.div>

      {/* Funnel Stage Cards with Pulse Indicators */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
        {funnelData.map((stage, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`neu-elevated p-3 md:p-4 rounded-lg text-center group relative cursor-pointer ${
              systemPulseIndex === index ? 'ring-2 ring-[#7c3aed]' : ''
            }`}
          >
            {/* Active Pulse Animation */}
            {systemPulseIndex === index && (
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-lg border-2 border-[#7c3aed]"
              />
            )}

            <div className="relative z-10">
              <p className="text-xs font-semibold text-slate-600 uppercase mb-1 md:mb-2">
                {stage.stage}
              </p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <p className="text-lg md:text-2xl font-black text-[#7c3aed] font-jakarta mb-0.5 md:mb-1">
                  <CountUp end={stage.value} duration={2} separator="," />
                </p>
              </motion.div>
              <p className="text-xs font-medium text-slate-500 flex items-center justify-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-[#7c3aed] rounded-full" />
                {stage.percentage}%
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Key Metrics Summary */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {[
          {
            label: 'Total Leads',
            value: funnelData[0]?.value || 0,
            icon: '📊',
            color: 'from-violet-500 to-indigo-600',
          },
          {
            label: 'Conversion Peak',
            value: '48%',
            icon: '🎯',
            color: 'from-indigo-500 to-blue-600',
          },
          {
            label: 'Appointments Booked',
            value: funnelData[funnelData.length - 1]?.value || 0,
            icon: '✅',
            color: 'from-emerald-500 to-teal-600',
          },
        ].map((metric, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            className={`bg-gradient-to-br ${metric.color} rounded-lg md:rounded-xl p-4 md:p-6 text-white shadow-lg overflow-hidden relative group`}
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute -inset-full opacity-0 group-hover:opacity-20 bg-white rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <p className="text-xs md:text-sm font-semibold opacity-90">{metric.label}</p>
                <span className="text-lg md:text-2xl">{metric.icon}</span>
              </div>
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-2xl md:text-3xl font-black font-jakarta"
              >
                <CountUp end={typeof metric.value === 'string' ? 0 : metric.value} />
                {typeof metric.value === 'string' && metric.value}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default PremiumFunnelChart;
