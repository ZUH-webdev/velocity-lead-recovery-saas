import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings,
  Bell,
  Lock,
  Users,
  Zap,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useAuth } from '../../context/AuthContext';

export const SettingsPage = ({ onNavigate }) => {
  const { businessSettings, setBusinessSettings } = useAppStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState(businessSettings.businessName);
  const [timezone, setTimezone] = useState(businessSettings.timezone);
  const [smsEnabled, setSmsEnabled] = useState(businessSettings.smsEnabled);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/signin', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
    }
  };

  const handleSaveSettings = () => {
    setBusinessSettings({
      businessName,
      timezone,
      smsEnabled,
    });
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
      className="space-y-8 pb-20"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
          <Settings className="w-9 h-9 text-indigo-500" />
          Settings & Configuration
        </h1>
        <p className="text-slate-500 mt-2">
          Manage your clinic settings, integrations, and preferences
        </p>
      </motion.div>

      {/* Settings Grid */}
      <motion.section
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left: Business Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="card-elite rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              Business Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Clinic Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                >
                  <option value="EST">Eastern Time (EST)</option>
                  <option value="CST">Central Time (CST)</option>
                  <option value="MST">Mountain Time (MST)</option>
                  <option value="PST">Pacific Time (PST)</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveSettings}
                className="w-full px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-all shadow-sm hover:shadow-md"
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>

          {/* Integration Settings */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="card-elite rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500" />
              Integrations
            </h3>

            <div className="space-y-3">
              {[
                {
                  name: 'Google Calendar',
                  description: 'Sync appointments and availability',
                  enabled: businessSettings.googleCalendarConnected,
                },
                {
                  name: 'SMS Service',
                  description: 'Enable SMS messaging for leads',
                  enabled: smsEnabled,
                },
                {
                  name: 'AI Assistant',
                  description: 'Powered by Velocity AI',
                  enabled: true,
                },
              ].map((integration, idx) => (
                <motion.div
                  key={idx}
                  className="p-4 border border-slate-200 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {integration.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {integration.description}
                    </p>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      integration.enabled
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {integration.enabled ? 'Active' : 'Inactive'}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="card-elite rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-500" />
              Notifications
            </h3>

            <div className="space-y-4">
              {[
                {
                  label: 'Email Notifications',
                  desc: 'Receive updates via email',
                },
                {
                  label: 'SMS Alerts',
                  desc: 'Critical alerts via SMS',
                },
                {
                  label: 'In-App Notifications',
                  desc: 'Real-time in-dashboard alerts',
                },
              ].map((notif, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{notif.label}</p>
                    <p className="text-xs text-slate-500">{notif.desc}</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      notificationsEnabled ? 'bg-indigo-500' : 'bg-slate-300'
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
                        notificationsEnabled ? 'right-1' : 'left-1'
                      }`}
                    />
                  </motion.button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Quick Links & Support */}
        <div className="space-y-6">
          {/* Account Section */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="card-elite rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Account</h3>

            <div className="space-y-2">
              {[
                { icon: Lock, label: 'Change Password', color: 'text-slate-600' },
                {
                  icon: Users,
                  label: 'Manage Team Members',
                  color: 'text-slate-600',
                },
                {
                  icon: HelpCircle,
                  label: 'Help & Documentation',
                  color: 'text-slate-600',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 4 }}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="card-elite rounded-2xl p-6 border-rose-200 bg-rose-50"
          >
            <h3 className="text-lg font-semibold text-rose-900 mb-4">
              Danger Zone
            </h3>

            <motion.button
              onClick={handleLogout}
              disabled={loggingOut}
              whileHover={{ scale: loggingOut ? 1 : 1.02 }}
              whileTap={{ scale: loggingOut ? 1 : 0.98 }}
              className="w-full px-4 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              {loggingOut ? 'Signing out...' : 'Sign Out'}
            </motion.button>

            <p className="text-xs text-rose-700 mt-3">
              You will be logged out from all devices.
            </p>
          </motion.div>

          {/* System Info */}
          <motion.div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-semibold">v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="font-semibold text-emerald-600">Operational</span>
            </div>
            <div className="flex justify-between">
              <span>Uptime</span>
              <span className="font-semibold">99.97%</span>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default SettingsPage;
