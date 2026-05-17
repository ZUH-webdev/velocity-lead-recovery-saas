import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  Globe,
  Clock,
} from 'lucide-react';

const CalendarSyncStatus = ({ status, onSync, onSettings }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');

  // Update "time ago" display in real-time
  useEffect(() => {
    const updateTimeAgo = () => {
      if (!status?.lastSync) return;
      
      const lastSyncDate = new Date(status.lastSync);
      const now = new Date();
      const diffMinutes = Math.floor((now - lastSyncDate) / 60000);
      
      if (diffMinutes < 1) {
        setTimeAgo('Just now');
      } else if (diffMinutes < 60) {
        setTimeAgo(`${diffMinutes}m ago`);
      } else {
        const diffHours = Math.floor(diffMinutes / 60);
        setTimeAgo(`${diffHours}h ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [status?.lastSync]);

  const handleSync = async () => {
    if (!onSync) return;

    setIsRefreshing(true);
    try {
      await onSync();
    } finally {
      setIsRefreshing(false);
    }
  };

  const isHealthy = status?.syncStatus === 'healthy';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(249,250,252,0.95)_100%)] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6 lg:p-7"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_28%)]" />

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <div className="mb-6 flex w-full items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 md:gap-4">
            <motion.div
              className="flex-shrink-0 rounded-2xl border border-white/60 bg-white/70 p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-md md:p-3.5"
              whileHover={{ scale: 1.1 }}
            >
              <Calendar className="h-5 w-5 text-violet-600 md:h-6 md:w-6" />
            </motion.div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 md:text-xs">
                Calendar Sync
              </p>
              <h3 className="truncate text-lg font-black tracking-tight text-slate-900 md:text-xl">
                Google Calendar Integration
              </h3>
            </div>
          </div>

          <div className="flex-shrink-0">
            {isHealthy ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-emerald-500/10 px-3 py-2 text-xs shadow-[0_8px_20px_rgba(16,185,129,0.12)] backdrop-blur-md md:px-4"
              >
                <motion.div
                  className="h-2.5 w-2.5 rounded-full bg-emerald-600"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs font-bold text-emerald-700">Connected</span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-rose-500/10 px-3 py-2 text-xs shadow-[0_8px_20px_rgba(244,63,94,0.1)] backdrop-blur-md md:px-4"
              >
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span className="text-xs font-bold text-rose-700">Disconnected</span>
              </motion.div>
            )}
          </div>
        </div>

        <div className="my-6 grid w-full grid-cols-3 gap-4">
          <div className="flex min-w-0 flex-col items-center justify-center rounded-[22px] border border-white/60 bg-white/60 p-3 text-center shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-md">
            <div className="mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-500" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Timezone
              </p>
            </div>
            <p className="w-full truncate text-sm font-bold leading-tight text-slate-900 md:text-base">
              {status?.timezone}
            </p>
          </div>

          <div className="flex min-w-0 flex-col items-center justify-center rounded-[22px] border border-white/60 bg-white/60 p-3 text-center shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-md">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Last Sync
              </p>
            </div>
            <motion.p
              key={timeAgo}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full break-words text-sm font-bold leading-tight text-slate-900 md:text-base"
            >
              {timeAgo}
            </motion.p>
          </div>

          <div className="flex min-w-0 flex-col items-center justify-center rounded-[22px] border border-white/60 bg-gradient-to-br from-violet-500/12 via-white/55 to-indigo-500/12 p-3 text-center shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-md">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-600">
              Upcoming
            </div>
            <motion.p
              whileHover={{ scale: 1.1 }}
              className="w-full truncate text-3xl font-black tracking-tight text-violet-700"
            >
              {status?.upcomingAppointments}
            </motion.p>
          </div>
        </div>

        <div className="mb-6 rounded-[24px] border border-white/60 bg-white/60 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-md">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Business
          </p>
          <p className="truncate text-base font-bold tracking-tight text-slate-900 md:text-lg">
            {status?.businessName}
          </p>
        </div>

        <div className="mt-auto flex w-full items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSync}
            disabled={isRefreshing}
            className="flex-1 flex items-center justify-center gap-2 rounded-[20px] border border-white/40 bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(124,58,237,0.22)] transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-[0_18px_38px_rgba(124,58,237,0.28)] disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 backdrop-blur-md"
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw className="h-4 w-4" />
            </motion.div>
            {isRefreshing ? 'Syncing...' : 'Sync Now'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSettings}
            className="flex-1 flex items-center justify-center gap-2 rounded-[20px] border border-white/60 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-md transition-all hover:bg-white/85"
          >
            <Settings className="h-4 w-4" />
            Settings
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarSyncStatus;
