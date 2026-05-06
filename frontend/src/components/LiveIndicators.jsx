import React from 'react';
import { motion } from 'framer-motion';

export const LivePulse = () => (
  <div className="flex items-center gap-2">
    <div className="relative">
      {/* Outer pulsing ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-emerald-500"
        animate={{ scale: [1, 1.3], opacity: [1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Inner solid dot */}
      <div className="relative w-3 h-3 bg-emerald-600 rounded-full" />
    </div>
    <span className="text-xs font-semibold text-emerald-700">Live</span>
  </div>
);

export const SpinningSync = ({ isActive = false }) => (
  <motion.div
    animate={isActive ? { rotate: 360 } : {}}
    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
  >
    {/* children via props or render as SVG */}
  </motion.div>
);
