import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { TrendingUp, Activity, Brain } from 'lucide-react';

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
}) => {
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
        whileHover={{ scale: 1.02 }}
        className="stat-card-premium flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* Gradient Background Accent */}
        <div
          className={`absolute inset-0 opacity-5 bg-gradient-to-br ${accentClass}`}
        />

        {/* Content */}
        <div className="relative z-10 text-center w-full">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="w-24 h-24 mx-auto bg-slate-200 rounded-full" />
              <div className="h-4 bg-slate-200 rounded w-20 mx-auto" />
            </div>
          ) : (
            <>
              {/* Circular Progress Ring */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-slate-200"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                    animate={{
                      strokeDashoffset:
                        2 * Math.PI * 45 * (1 - (value || 0) / 100),
                    }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className={`text-${accentColor}-600`}
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
                    <p className={`text-3xl font-bold bg-gradient-to-r ${accentClass} bg-clip-text text-transparent`}>
                      {isLoading ? '...' : value}
                      {isPercentage && '%'}
                    </p>
                  </motion.div>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-600">{title}</p>
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
      whileHover={{ scale: 1.02, y: -4 }}
      className="stat-card-premium relative overflow-hidden group"
    >
      {/* Gradient Background Accent */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 opacity-5 bg-gradient-to-br ${accentClass} rounded-full blur-2xl`}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
              {title}
            </p>
          </div>
          <div
            className={`p-2.5 rounded-lg bg-gradient-to-br ${accentClass} bg-opacity-10`}
          >
            <Icon className={`w-5 h-5 ${accentClass}`} />
          </div>
        </div>

        {/* Value */}
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 bg-slate-200 rounded w-2/3 animate-pulse" />
            <div className="h-3 bg-slate-100 rounded w-1/3 animate-pulse" />
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-3xl font-bold bg-gradient-to-r ${accentClass} bg-clip-text text-transparent`}
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
                <span className={`text-lg font-semibold ${accentClass}`}>
                  %
                </span>
              )}
              {unit && (
                <span className="text-sm font-medium text-slate-600">
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
                className="mt-3 flex items-center gap-1"
              >
                <TrendingUp
                  className={`w-3 h-3 ${
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
                  className={`text-xs font-semibold ${
                    trendDirection === 'up'
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  {trendDirection === 'up' ? '+' : '-'}
                  {trend}% from last week
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
