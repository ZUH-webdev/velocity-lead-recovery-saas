import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Search, ChevronDown, Menu } from 'lucide-react';
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

export const Header = ({ onSearch, onMenuClick }) => {
  const {
    businessSettings,
    systemPulse,
    connectionStatus,
    unreadMessageCount,
  } = useAppStore();

  const neuShellStyle = {
    background: 'var(--neu-bg)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '18px 18px 36px var(--neu-dark), -18px -18px 36px var(--neu-light)',
  };

  const neuInsetStyle = {
    background: 'var(--neu-bg)',
    boxShadow: 'inset 8px 8px 16px var(--neu-dark), inset -8px -8px 16px var(--neu-light)',
  };

  return (
    <div
      className="fixed top-4 left-4 right-4 md:left-[17rem] h-16 md:h-20 flex items-center justify-between px-4 md:px-8 z-40 rounded-2xl md:rounded-[24px]"
      style={neuShellStyle}
    >
      <style>{pulseStyle}</style>

      {/* Left: Menu Button + Clinic Name & Pulse */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg flex-shrink-0"
          style={neuInsetStyle}
        >
          <Menu className="w-5 h-5" style={{ color: 'var(--neu-text-dark)' }} />
        </motion.button>

        <div className="hidden sm:block">
          <p className="text-xs uppercase tracking-widest font-semibold truncate" style={{ color: 'var(--neu-text-light)' }}>
            Current Clinic
          </p>
          <p className="text-xs md:text-sm font-semibold truncate" style={{ color: 'var(--neu-text-dark)' }}>
            {businessSettings.businessName}
          </p>
        </div>

        {/* Live System Pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden md:flex items-center gap-2 ml-4"
        >
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/40"
            style={neuInsetStyle}
          >
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
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        {/* Search Bar - Enhanced */}
        <motion.div
          className="hidden lg:flex items-center gap-3 rounded-2xl px-4 py-2.5 border w-48 xl:w-80 transition-all duration-300"
          style={{
            background: 'var(--neu-bg)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            boxShadow: 'inset 6px 6px 12px var(--neu-dark), inset -6px -6px 12px var(--neu-light)',
          }}
          whileHover={{
            boxShadow: 'inset 4px 4px 8px var(--neu-dark), inset -4px -4px 8px var(--neu-light)',
          }}
          whileTap={{
            boxShadow: 'inset 8px 8px 16px var(--neu-dark), inset -8px -8px 16px var(--neu-light)',
          }}
        >
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--neu-text-light)' }} />
          <input
            type="text"
            placeholder="Search leads..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="bg-transparent text-sm w-full transition-colors duration-200"
            style={{
              color: 'var(--neu-text-dark)',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.color = 'var(--neu-text-dark)';
            }}
            onBlur={(e) => {
              e.target.style.color = 'var(--neu-text-dark)';
            }}
          />
          <style>{`
            input::placeholder {
              color: var(--neu-text-light);
              opacity: 0.6;
              font-style: italic;
            }
            input:focus::placeholder {
              opacity: 0.4;
            }
          `}</style>
        </motion.div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-9 md:w-11 h-9 md:h-11 flex items-center justify-center rounded-xl md:rounded-2xl border border-white/40 transition-all flex-shrink-0"
          style={neuInsetStyle}
        >
          <Bell className="w-4 md:w-5 h-4 md:h-5" style={{ color: 'var(--neu-text-dark)' }} />
          {unreadMessageCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0.5 right-0.5 w-4 h-4 text-white text-xs font-bold rounded-full flex items-center justify-center"
              style={{ background: 'var(--neu-error)', boxShadow: '0 6px 12px rgba(255, 59, 92, 0.25)' }}
            >
              {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
            </motion.span>
          )}
        </motion.button>

        {/* Profile */}
        <button
          className="hidden sm:flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 rounded-xl md:rounded-2xl border border-white/40 transition-all group flex-shrink-0"
          style={neuInsetStyle}
        >
          <div
            className="w-7 md:w-8 h-7 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(145deg, #d4d9e2, #eef3f8)',
              boxShadow: '6px 6px 12px var(--neu-dark), -6px -6px 12px var(--neu-light)',
            }}
          >
            <span className="text-xs font-bold" style={{ color: 'var(--neu-text-dark)' }}>Z</span>
          </div>
          <ChevronDown className="w-4 h-4 hidden md:block transition-colors" style={{ color: 'var(--neu-text-light)' }} />
        </button>

        {/* Mobile Logo (far right end) */}
        <Link to="/dashboard" className="md:hidden flex-shrink-0 ml-1">
          <img src="/velocity-logo.webp" alt="Velocity" className="h-8 w-8 object-contain" />
        </Link>
      </div>
    </div>
  );
};
