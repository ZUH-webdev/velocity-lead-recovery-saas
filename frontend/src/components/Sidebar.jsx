import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ onNavigate }) => {
  const { currentPage, setCurrentPage, businessSettings } = useAppStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
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

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Executive overview',
    },
    {
      id: 'leads',
      label: 'Live Leads',
      icon: Users,
      description: 'Command center',
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      description: 'Appointments',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Configuration',
    },
  ];

  const handleNavigation = (pageId) => {
    setCurrentPage(pageId);
    if (onNavigate) onNavigate(pageId);
  };

  return (
    <div
      className="fixed top-4 left-4 z-30 flex flex-col overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-xl p-6"
      style={{ width: '256px', height: 'calc(100vh - 2rem)' }}
    >
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-3"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg flex-shrink-0">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Velocity
          </h1>
          <p className="text-xs text-slate-500">V2 Elite</p>
        </div>
      </motion.div>

      {/* Business Name */}
      <div className="mb-6 rounded-2xl px-4 py-3 bg-slate-50 border border-slate-200">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
          Clinic
        </p>
        <p className="text-sm font-medium text-slate-900 mt-1 truncate">
          {businessSettings?.businessName || 'Clinic Name'}
        </p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => handleNavigation(item.id)}
              className={`w-full group relative text-left px-4 py-3 rounded-2xl transition-all duration-300 flex items-start gap-3 ${
                isActive
                  ? 'bg-indigo-50 border border-indigo-200'
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Icon
                className={`w-5 h-5 mt-0.5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-slate-600 group-hover:text-indigo-500'
                }`}
              />

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold transition-colors ${
                    isActive ? 'text-indigo-900' : 'text-slate-900'
                  }`}
                >
                  {item.label}
                </p>
                <p
                  className={`text-xs transition-colors mt-0.5 ${
                    isActive ? 'text-indigo-700' : 'text-slate-500'
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 space-y-2 border-t border-slate-200 pt-6"
      >
        <button className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 flex items-center gap-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200">
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span>Help & Support</span>
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full px-4 py-3 text-left text-sm font-medium text-rose-700 flex items-center gap-2 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50 border border-transparent hover:border-rose-200"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Sidebar;
