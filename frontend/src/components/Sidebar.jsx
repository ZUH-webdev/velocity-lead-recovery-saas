import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  ChevronDown,
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
    <div className="glass-sidebar fixed left-0 top-0 h-screen w-64 flex flex-col py-6 px-4 border-r border-slate-200/50">
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-3 px-2"
      >
        <div className="p-2 rounded-lg bg-indigo-500/10 backdrop-blur-sm">
          <Zap className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Velocity
          </h1>
          <p className="text-xs text-slate-500">V2 Elite</p>
        </div>
      </motion.div>

      {/* Business Name */}
      <div className="mb-6 px-2 py-3 bg-slate-50/50 rounded-lg border border-slate-200/30">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Clinic
        </p>
        <p className="text-sm font-medium text-slate-900 mt-1 truncate">
          {businessSettings.businessName}
        </p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2">
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
              className={`w-full group relative text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-start gap-3 ${
                isActive
                  ? 'bg-indigo-50 border border-indigo-200/50'
                  : 'hover:bg-slate-100/50 text-slate-700'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-indigo-500/5 rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 40 }}
                />
              )}

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
        className="pt-6 border-t border-slate-200/30 space-y-2"
      >
        <button className="w-full px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100/50 transition-all duration-300 flex items-center gap-2 text-sm font-medium">
          <Settings className="w-4 h-4" />
          <span>Help & Support</span>
        </button>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full px-4 py-3 rounded-xl text-slate-700 hover:bg-rose-50 transition-all duration-300 flex items-center gap-2 text-sm font-medium hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-4 h-4" />
          <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
        </button>
      </motion.div>
    </div>
  );
};
