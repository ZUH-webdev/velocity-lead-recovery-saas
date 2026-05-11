import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

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
  index = 0,
}) => {
  // Vivid Violet as primary accent with supporting colors
  const colorGradients = {
    indigo: 'from-violet-500 to-indigo-600',
    purple: 'from-purple-500 to-violet-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    blue: 'from-blue-500 to-cyan-600',
  };

  const containerVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 20,
        delay: index * 0.08,
      },
    },
  };

  if (isLoading) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="neu-carved p-4 md:p-6 group overflow-hidden relative"
      >
        <div className="relative z-10 space-y-3 md:space-y-4">
          <div className="h-3 w-20 md:w-24 bg-gradient-to-r from-slate-300 to-slate-200 rounded-full animate-pulse" />
          <div className="h-8 md:h-10 w-28 md:w-32 bg-gradient-to-r from-slate-300 to-slate-200 rounded-lg animate-pulse" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        scale: 1.02,
        transition: { type: 'spring', stiffness: 300, damping: 25 },
      }}
      className="neu-carved p-4 md:p-6 group overflow-hidden relative cursor-pointer transition-all duration-300"
    >
      {/* Animated Background Glow */}
      <motion.div
        className={`absolute top-2 right-4 w-24 h-24 opacity-0 group-hover:opacity-20 bg-gradient-to-br ${colorGradients[color]} rounded-full blur-3xl transition-all duration-300`}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4 md:mb-6">
          <div className="flex-1 min-w-0">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.08 + 0.1 }}
              className="text-xs font-semibold text-slate-600 uppercase tracking-wider"
            >
              {label}
            </motion.p>
          </div>

          {/* Icon in Soft Pressed Tray */}
          <motion.div
            whileHover={{ scale: 1.12, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="neu-pressed p-2.5 md:p-3.5 flex items-center justify-center transition-all duration-200 flex-shrink-0 ml-2"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            >
              <Icon className="w-4 md:w-5 h-4 md:h-5 text-[#7c3aed]" />
            </motion.div>
          </motion.div>
        </div>

        {/* Metric Value Section with Glassmorphism Overlay */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 + 0.2 }}
            className="glassmorphism rounded-lg p-3 md:p-4 mb-2 relative"
          >
            <div className="flex items-baseline gap-2 flex-wrap">
              {prefix && (
                <span className="text-xs md:text-sm font-medium text-slate-600">{prefix}</span>
              )}
              {animateValue && endValue !== null ? (
                <CountUp
                  end={endValue}
                  duration={2.5}
                  separator=","
                  decimals={0}
                  className="text-xl md:text-3xl font-black text-[#7c3aed] font-jakarta tracking-tight"
                />
              ) : (
                <span className="text-xl md:text-3xl font-black text-[#7c3aed] font-jakarta tracking-tight">
                  {value}
                </span>
              )}
              {suffix && (
                <span className="text-xs md:text-sm font-medium text-slate-600">{suffix}</span>
              )}
            </div>
          </motion.div>

          {/* Subtle accent bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: index * 0.08 + 0.4, duration: 0.6 }}
            className={`h-1 bg-gradient-to-r ${colorGradients[color]} rounded-full origin-left`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
