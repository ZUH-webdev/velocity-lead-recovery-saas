import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { useCalendarEvents } from '../../hooks/useLeads';
import { useAppStore } from '../../store/appStore';
import { generateMockCalendarStatus, generateMockEvents } from '../../utils/mockData';

export const CalendarPage = ({ onNavigate }) => {
  const { businessSettings } = useAppStore();
  const { events: apiEvents, loading: eventsLoading } = useCalendarEvents();
  const [events, setEvents] = useState([]);
  const [syncEnabled, setSyncEnabled] = useState(
    businessSettings.googleCalendarConnected
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    if (apiEvents && apiEvents.length > 0) {
      setEvents(apiEvents);
    } else {
      setEvents(generateMockEvents(8));
    }
  }, [apiEvents]);

  const handleSync = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setEvents(generateMockEvents(8));
    setIsRefreshing(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10 pt-4"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
          <Calendar className="w-9 h-9 text-indigo-500" />
          Appointment Manager
        </h1>
        <p className="text-slate-500 mt-2">
          Sync and manage all upcoming appointments from your calendar
        </p>
      </motion.div>

      {/* Sync Card */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Sync Status & Control */}
        <div className="card-elite rounded-2xl p-6">
          <div className="space-y-6">
            {/* Sync Status */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Google Calendar
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg border border-slate-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-slate-900">
                      Status
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg border border-slate-200/50">
                  <span className="text-sm font-medium text-slate-900">
                    Auto Sync
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSyncEnabled(!syncEnabled)}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      syncEnabled ? 'bg-indigo-500' : 'bg-slate-300'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full ${
                        syncEnabled ? 'right-1' : 'left-1'
                      }`}
                    />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Manual Sync Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSync}
              disabled={isRefreshing}
              className="w-full px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              {isRefreshing ? 'Syncing...' : 'Sync Now'}
            </motion.button>

            {/* Integration Info */}
            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200/50">
              <p className="text-xs text-blue-700 leading-relaxed">
                <span className="font-semibold">💡 Tip:</span> Your calendar is
                synced every 30 minutes. Enable auto-sync to keep appointments
                updated in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Upcoming Events (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Upcoming Appointments
          </h3>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {eventsLoading ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-slate-100 rounded-xl animate-pulse"
                />
              ))
            ) : events.length > 0 ? (
              events.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    delay: idx * 0.05,
                  }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="card-elite rounded-xl p-4 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                        {event.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {event.patientName || 'Patient'}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-slate-400 hover:text-indigo-500" />
                    </motion.button>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {format(new Date(event.startTime), 'MMM dd, yyyy • h:mm a')}
                      </span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{event.location}</span>
                      </div>
                    )}

                    {event.patientPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{event.patientPhone}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Calendar Stats */}
      <motion.section
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          { label: 'Today', value: events.filter((e) => {
            const eventDate = new Date(e.startTime);
            const today = new Date();
            return eventDate.toDateString() === today.toDateString();
          }).length },
          { label: 'This Week', value: events.length },
          { label: 'Conversion Rate', value: '87%' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="card-elite rounded-xl p-4 text-center"
          >
            <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.section>
    </motion.div>
  );
};

export default CalendarPage;
