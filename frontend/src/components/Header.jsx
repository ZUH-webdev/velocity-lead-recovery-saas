import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, ChevronDown, Zap } from 'lucide-react';
import { useAppStore } from '../store/appStore';

// CSS for ripple animation (will be imported from index.css)
const pulseStyle = `
  @keyframes pulse-ripple {
    0% {
      box-shadow: 0 0 0 0 rgb(34, 197, 94, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgb(34, 197, 94, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgb(34, 197, 94, 0);
    }
  }
`;

export const Header = ({ onSearch }) => {
  const {
    businessSettings,
    systemPulse,
    connectionStatus,
    unreadMessageCount,
  } = useAppStore();

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200/30 flex items-center justify-between px-8 z-40">
      <style>{pulseStyle}</style>

      {/* Left: Clinic Name & Pulse */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
            Current Clinic
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {businessSettings.businessName}
          </p>
        </div>

        {/* Live System Pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ml-4 flex items-center gap-2"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/50 rounded-full border border-emerald-200/50">
            <div
              className="w-2 h-2 bg-emerald-500 rounded-full"
              style={{
                animation:
                  systemPulse && connectionStatus === 'connected'
                    ? 'pulse-ripple 2s infinite'
                    : 'none',
              }}
            />
            <span className="text-xs font-medium text-emerald-700">
              {connectionStatus === 'connected' ? 'System Live' : 'Connecting...'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100/50 rounded-lg px-3 py-2 border border-slate-200/50 w-64">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search leads..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="bg-transparent text-sm text-slate-900 placeholder-slate-500 outline-none w-full"
          />
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 hover:bg-slate-100/50 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5 text-slate-700" />
          {unreadMessageCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
            </motion.span>
          )}
        </motion.button>

        {/* Profile */}
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100/50 rounded-lg transition-colors group">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-white">Z</span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
        </button>
      </div>
    </div>
  );
};
