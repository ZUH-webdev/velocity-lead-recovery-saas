import React from 'react';
import { motion } from 'framer-motion';
import { CountUp } from 'react-countup';

const StatCard = ({
  icon: Icon,
  label,
  value,
  suffix = '',
  prefix = '',
  color = 'indigo',
  isLoading = false,
  animateValue = false,
  endValue = null,
}) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-5 rounded-xl bg-white border border-slate-200"
        style={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
      >
        <div className="space-y-3">
          <div className="h-4 w-1/2 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse" />
          <div className="h-8 w-3/4 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="p-5 rounded-xl bg-white border border-slate-200 transition-all cursor-pointer group"
      style={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-500 text-sm font-medium">{label}</p>
          <div className="mt-3 flex items-baseline gap-1">
            {prefix && <span className="text-slate-600 text-sm">{prefix}</span>}
            {animateValue && endValue !== null ? (
              <CountUp
                end={endValue}
                duration={2}
                separator=","
                className="text-3xl font-bold text-slate-900"
              />
            ) : (
              <span className="text-3xl font-bold text-slate-900">{value}</span>
            )}
            {suffix && <span className="text-slate-600 text-sm">{suffix}</span>}
          </div>
        </div>

        <motion.div
          className={`p-3 rounded-lg ${colorClasses[color]} transition-all`}
          whileHover={{ scale: 1.1 }}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatCard;
