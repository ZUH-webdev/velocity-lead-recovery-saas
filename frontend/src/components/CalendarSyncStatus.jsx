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
      className="p-8 rounded-xl bg-white border border-slate-200 shadow-elite-md space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            className="p-3.5 rounded-lg bg-blue-50"
            whileHover={{ scale: 1.1 }}
          >
            <Calendar className="w-6 h-6 text-blue-600" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Calendar Sync</h3>
            <p className="text-sm text-slate-500 mt-0.5">Google Calendar Integration</p>
          </div>
        </div>

        {isHealthy && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200"
          >
            <motion.div
              className="w-2.5 h-2.5 bg-emerald-600 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-bold text-emerald-700">Connected</span>
          </motion.div>
        )}

        {!isHealthy && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-200"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-rose-700">Disconnected</span>
          </motion.div>
        )}
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-slate-600" />
            <p className="text-xs font-semibold text-slate-600">Timezone</p>
          </div>
          <p className="text-sm font-bold text-slate-900">{status?.timezone}</p>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-slate-600" />
            <p className="text-xs font-semibold text-slate-600">Last Sync</p>
          </div>
          <motion.p
            className="text-sm font-bold text-slate-900"
            key={timeAgo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {timeAgo}
          </motion.p>
        </div>

        <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
          <div className="text-xs font-semibold text-indigo-600 mb-2">
            Upcoming
          </div>
          <motion.p
            className="text-2xl font-bold text-indigo-700"
            whileHover={{ scale: 1.1 }}
          >
            {status?.upcomingAppointments}
          </motion.p>
        </div>
      </div>

      {/* Business Details */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-50 border border-slate-200">
        <p className="text-xs font-semibold text-slate-600 mb-1">Business</p>
        <p className="text-lg font-bold text-slate-900">{status?.businessName}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSync}
          disabled={isRefreshing}
          className="flex-1 px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold text-sm transition-all shadow-elite-sm hover:shadow-elite-md flex items-center justify-center gap-2"
        >
          <motion.div
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw className="w-4 h-4" />
          </motion.div>
          {isRefreshing ? 'Syncing...' : 'Sync Now'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSettings}
          className="flex-1 px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-sm transition-all shadow-elite-sm flex items-center justify-center gap-2 border border-slate-200"
        >
          <Settings className="w-4 h-4" />
          Settings
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CalendarSyncStatus;
