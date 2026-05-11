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

  // Custom gradient for the funnel
  const GradientFunnelArea = () => (
    <defs>
      <linearGradient id="funnelGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.8} />
        <stop offset="50%" stopColor="#6366f1" stopOpacity={0.6} />
        <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
      </linearGradient>
      <filter id="funnelGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
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
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="neu-carved p-8 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 font-jakarta mb-2 flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-[#7c3aed]" />
              Lead Recovery Funnel
            </h2>
            <p className="text-sm text-slate-600">
              Real-time conversion intelligence across all stages
            </p>
          </div>

          {/* Conversion Badge with Pulse */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="glassmorphism rounded-xl px-6 py-4 relative"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-2 bg-[#7c3aed] rounded-xl opacity-20"
              />
              <div className="relative z-10">
                <p className="text-xs font-semibold text-slate-600 uppercase mb-1">
                  Conversion Rate
                </p>
                <p className="text-3xl font-black text-[#7c3aed] font-jakarta">
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
              className="absolute -top-3 -right-3"
            >
              <Zap className="w-6 h-6 text-[#7c3aed] fill-[#7c3aed]" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Curved Stream Funnel Chart */}
      <motion.div
        variants={itemVariants}
        className="neu-carved p-8 rounded-xl relative overflow-hidden"
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
          <h3 className="text-lg font-bold text-slate-900 mb-6 font-jakarta">
            Funnel Flow Analysis
          </h3>

          {/* Custom Curved Funnel with AreaChart */}
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={funnelData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <defs>
                <GradientFunnelArea />
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="stage"
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 30, 46, 0.95)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                }}
                cursor={{ stroke: 'rgba(124, 58, 237, 0.3)', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#7c3aed"
                strokeWidth={3}
                fill="url(#funnelGradient)"
                isAnimationActive
                animationDuration={1500}
                filter="url(#funnelGlow)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Funnel Stage Cards with Pulse Indicators */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {funnelData.map((stage, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`neu-elevated p-4 rounded-lg text-center group relative cursor-pointer ${
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
              <p className="text-xs font-semibold text-slate-600 uppercase mb-2">
                {stage.stage}
              </p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <p className="text-2xl font-black text-[#7c3aed] font-jakarta mb-1">
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
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            className={`bg-gradient-to-br ${metric.color} rounded-xl p-6 text-white shadow-lg overflow-hidden relative group`}
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute -inset-full opacity-0 group-hover:opacity-20 bg-white rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold opacity-90">{metric.label}</p>
                <span className="text-2xl">{metric.icon}</span>
              </div>
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-3xl font-black font-jakarta"
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
