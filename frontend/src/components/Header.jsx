import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Search, ChevronDown, Menu, MessageSquare, CalendarCheck2, Sparkles, X } from 'lucide-react';
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

export const Header = ({ onSearch, onMenuClick, searchValue }) => {
  const {
    businessSettings,
    systemPulse,
    connectionStatus,
    unreadMessageCount,
    clearUnreadMessages,
  } = useAppStore();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState('');
  const isSearchControlled = searchValue !== undefined;
  const currentSearchValue = isSearchControlled ? searchValue : localSearchValue;

  const notifications = [
    {
      id: 'notif-1',
      icon: MessageSquare,
      title: 'New SMS conversation',
      description: 'Lead #65 replied to the AI follow-up sequence.',
      time: '2m ago',
      tone: 'violet',
    },
    {
      id: 'notif-2',
      icon: CalendarCheck2,
      title: 'Calendar sync updated',
      description: '3 appointments were confirmed and synced.',
      time: '14m ago',
      tone: 'emerald',
    },
    {
      id: 'notif-3',
      icon: Sparkles,
      title: 'High intent lead detected',
      description: 'Lead #82 is ready for a callback today.',
      time: '28m ago',
      tone: 'indigo',
    },
  ];

  const neuShellStyle = {
    background: 'var(--neu-bg)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '18px 18px 36px var(--neu-dark), -18px -18px 36px var(--neu-light)',
  };

  const neuInsetStyle = {
    background: 'var(--neu-bg)',
    boxShadow: 'inset 8px 8px 16px var(--neu-dark), inset -8px -8px 16px var(--neu-light)',
  };

  const handleSearchChange = (value) => {
    if (onSearch) {
      onSearch(value);
    }

    if (!isSearchControlled) {
      setLocalSearchValue(value);
    }
  };

  const openNotifications = () => {
    setIsNotificationOpen(true);
    clearUnreadMessages();
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
          className="hidden lg:flex header-search-shell items-center rounded-[22px] px-5 py-3 border w-48 xl:w-80 transition-all duration-300"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(247, 249, 252, 0.95) 100%)',
            borderColor: 'rgba(255, 255, 255, 0.6)',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px) saturate(135%)',
            WebkitBackdropFilter: 'blur(20px) saturate(135%)',
          }}
          whileHover={{
            boxShadow: '0 14px 34px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          }}
          whileTap={{
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.72)',
          }}
        >
          <Search className="w-5 h-5 flex-shrink-0 mr-3" style={{ color: 'var(--neu-text-light)' }} />
          <input
            type="text"
            placeholder="Search leads..."
            value={currentSearchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label="Search leads"
            className="header-search-input bg-transparent text-[15px] w-full transition-colors duration-200"
            style={{
              color: 'var(--neu-text-dark)',
              outline: 'none',
            }}
          />
        </motion.div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-9 md:w-11 h-9 md:h-11 flex items-center justify-center rounded-xl md:rounded-2xl border border-white/40 transition-all flex-shrink-0"
          style={neuInsetStyle}
          onClick={openNotifications}
          aria-label="Open notifications"
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

      <AnimatePresence>
        {isNotificationOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/20 px-4 pt-24 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsNotificationOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(249,250,252,0.98)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200/60 px-5 py-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Notifications
                  </p>
                  <h3 className="text-lg font-black tracking-tight text-slate-900">
                    System Activity
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
                  aria-label="Close notifications"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[70vh] space-y-3 overflow-y-auto px-5 py-4">
                {notifications.map((notification) => {
                  const Icon = notification.icon;
                  const toneClasses = {
                    violet: 'bg-violet-500/10 text-violet-600',
                    emerald: 'bg-emerald-500/10 text-emerald-600',
                    indigo: 'bg-indigo-500/10 text-indigo-600',
                  };

                  return (
                    <motion.div
                      key={notification.id}
                      whileHover={{ y: -2 }}
                      className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/75 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${toneClasses[notification.tone]}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {notification.title}
                          </p>
                          <span className="flex-shrink-0 text-xs font-medium text-slate-400">
                            {notification.time}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          {notification.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
