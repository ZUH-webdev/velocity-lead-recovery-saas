import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { TrendingUp, Activity, Brain } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: number;
  unit?: string;
  icon?: LucideIcon;
  trend?: number | null;
  trendDirection?: 'up' | 'down';
  isLoading?: boolean;
  isPercentage?: boolean;
  isCircular?: boolean;
  accentColor?: 'indigo' | 'emerald' | 'violet';
}

export const KPICard = ({
  title,
  value,
  unit = '',
  icon: Icon = TrendingUp,
  trend = null,
  trendDirection = 'up',
  isLoading = false,
  isPercentage = false,
  isCircular = false,
  accentColor = 'indigo',
}: Props) => {
  const accentMap = {
    indigo: 'from-indigo-500 to-indigo-600 text-indigo-600',
    emerald: 'from-emerald-500 to-emerald-600 text-emerald-600',
    violet: 'from-violet-500 to-violet-600 text-violet-600',
  };

  const accentClass = accentMap[accentColor] || accentMap.indigo;

  if (isCircular) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        whileHover={{ scale: 1.06, y: -6 }}
        className="stat-card-premium flex flex-col items-center justify-center relative overflow-hidden rounded-2xl border group backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.45) 100%)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
        }}
      >
        {/* Animated Gradient Background */}
        <motion.div
          className={`absolute top-0 right-0 w-48 h-48 opacity-10 bg-gradient-to-br ${accentClass} rounded-full blur-3xl`}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Premium Border Glow */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${accentColor === 'indigo' ? '#818cf8' : accentColor === 'emerald' ? '#10b981' : '#a78bfa'} 0%, transparent 50%)`,
            pointerEvents: 'none',
            padding: '1px',
            borderRadius: '1rem',
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center w-full p-8">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="w-28 h-28 mx-auto bg-gradient-to-r from-slate-200 to-slate-100 rounded-full" />
              <div className="h-4 bg-slate-200 rounded w-24 mx-auto" />
            </div>
          ) : (
            <>
              {/* Circular Progress Ring */}
              <div className="relative w-28 h-28 mx-auto mb-6">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-slate-200"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="2.5"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                    animate={{
                      strokeDashoffset:
                        2 * Math.PI * 45 * (1 - (value || 0) / 100),
                    }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className={`text-${accentColor}-600`}
                    style={{
                      filter: `drop-shadow(0 4px 12px ${accentColor === 'indigo' ? 'rgba(99, 102, 241, 0.3)' : accentColor === 'emerald' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(167, 139, 250, 0.3)'})`,
                    }}
                  />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <p className={`text-4xl font-bold bg-gradient-to-r ${accentClass} bg-clip-text text-transparent`}>
                      {isLoading ? '...' : value}
                      {isPercentage && '%'}
                    </p>
                  </motion.div>
                </div>
              </div>

              <p className="text-sm font-semibold text-slate-600">{title}</p>
            </>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={{ scale: 1.04, y: -6 }}
      className="stat-card-premium relative overflow-hidden group rounded-2xl border backdrop-blur-xl"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.45) 100%)',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
      }}
    >
      {/* Animated Gradient Background */}
      <motion.div
        className={`absolute top-0 right-0 w-40 h-40 opacity-10 bg-gradient-to-br ${accentClass} rounded-full blur-3xl`}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Premium Border Glow */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${accentColor === 'indigo' ? '#818cf8' : accentColor === 'emerald' ? '#10b981' : '#a78bfa'} 0%, transparent 50%)`,
          pointerEvents: 'none',
          padding: '1px',
          borderRadius: '1rem',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              {title}
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            className={`p-3 rounded-xl bg-gradient-to-br ${accentClass} shadow-lg`}
            style={{
              boxShadow: `0 8px 16px ${accentColor === 'indigo' ? 'rgba(99, 102, 241, 0.25)' : accentColor === 'emerald' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(167, 139, 250, 0.25)'}`,
            }}
          >
            <Icon className={`w-5 h-5 text-white`} />
          </motion.div>
        </div>

        {/* Value */}
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg w-2/3 animate-pulse" />
            <div className="h-3 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg w-1/3 animate-pulse" />
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-2 mb-4">
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-4xl font-bold bg-gradient-to-r ${accentClass} bg-clip-text text-transparent`}
              >
                <CountUp
                  start={0}
                  end={value || 0}
                  duration={1.5}
                  separator=","
                  decimals={isPercentage ? 1 : 0}
                />
              </motion.p>
              {isPercentage && (
                <span className={`text-xl font-bold bg-gradient-to-r ${accentClass} bg-clip-text text-transparent`}>
                  %
                </span>
              )}
              {unit && (
                <span className="text-xs font-medium text-slate-500 ml-1">
                  {unit}
                </span>
              )}
            </div>

            {/* Trend */}
            {trend !== null && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{
                  background: trendDirection === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                }}
              >
                <TrendingUp
                  className={`w-3.5 h-3.5 ${
                    trendDirection === 'up'
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }`}
                  style={{
                    transform:
                      trendDirection === 'down' ? 'scaleY(-1)' : 'none',
                  }}
                />
                <span
                  className={`text-xs font-bold ${
                    trendDirection === 'up'
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  {trendDirection === 'up' ? '+' : '-'}
                  {trend}%
                </span>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export const KPIGrid = ({ metrics, isLoading = false }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <KPICard
        title="Revenue Recovered"
        value={metrics?.revenueRecovered || 0}
        unit="$"
        icon={TrendingUp}
        trend={metrics?.revenueTrend || 12}
        trendDirection="up"
        isLoading={isLoading}
        accentColor="indigo"
      />

      <KPICard
        title="Recovery Rate"
        value={metrics?.recoveryRate || 0}
        isPercentage
        icon={Activity}
        trend={metrics?.rateTrend || 5}
        trendDirection="up"
        isLoading={isLoading}
        isCircular
        accentColor="emerald"
      />

      <KPICard
        title="AI Handled"
        value={metrics?.aiHandled || 0}
        unit="messages"
        icon={Brain}
        trend={metrics?.aiTrend || 8}
        trendDirection="up"
        isLoading={isLoading}
        accentColor="violet"
      />
    </motion.div>
  );
};
