import React, { useState } from 'react';
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuth } from '../context/AuthContext';

const SidebarContent = ({ navItems, currentPage, handleNavigation, businessSettings, handleLogout, loggingOut }) => (
  <>
    {/* Logo Section */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 md:mb-8 flex items-center gap-3"
    >
      <Link href="/dashboard" className="flex items-center gap-3 no-underline">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl flex-shrink-0 overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #d4d9e2, #eef3f8)',
            boxShadow: '6px 6px 12px var(--neu-dark), -6px -6px 12px var(--neu-light)',
          }}
        >
          <Image src="/velocity-logo.webp" alt="Velocity" width={32} height={32} className="object-contain" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--neu-text-dark)' }}>
            Velocity
          </h1>
          <p className="text-xs" style={{ color: 'var(--neu-text-light)' }}>V2 Elite</p>
        </div>
      </Link>
    </motion.div>

    {/* Business Name */}
    <div
      className="mb-6 rounded-2xl px-4 py-3 border"
      style={{
        background: 'var(--neu-bg)',
        borderColor: 'rgba(255, 255, 255, 0.4)',
        boxShadow: 'inset 6px 6px 12px var(--neu-dark), inset -6px -6px 12px var(--neu-light)',
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--neu-text-light)' }}>
        Clinic
      </p>
      <p className="text-sm font-medium mt-1 truncate" style={{ color: 'var(--neu-text-dark)' }}>
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
            className="w-full group relative text-left px-4 py-3 rounded-2xl transition-all duration-300 flex items-start gap-3 border"
            style={{
              background: isActive ? 'var(--neu-bg)' : 'var(--neu-bg)',
              borderColor: isActive ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.2)',
              boxShadow: isActive
                ? 'inset 6px 6px 12px var(--neu-dark), inset -6px -6px 12px var(--neu-light)'
                : 'none',
            }}
          >
            <Icon
              className="w-5 h-5 mt-0.5 flex-shrink-0 transition-colors"
              style={{
                color: isActive ? '#6366f1' : 'var(--neu-text-light)',
              }}
            />

            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold transition-colors"
                style={{
                  color: isActive ? '#6366f1' : 'var(--neu-text-dark)',
                }}
              >
                {item.label}
              </p>
              <p
                className="text-xs transition-colors mt-0.5"
                style={{
                  color: isActive ? 'rgba(99, 102, 241, 0.7)' : 'var(--neu-text-light)',
                }}
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
      className="mt-6 space-y-2 pt-6"
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <button
        className="w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-2 rounded-2xl transition-all duration-300 border"
        style={{
          color: 'var(--neu-text-dark)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          boxShadow: 'inset 4px 4px 8px rgba(190, 195, 207, 0.1)',
        }}
        onClick={() => handleNavigation('help')}
      >
        <Settings className="w-4 h-4 flex-shrink-0" />
        <span>Help & Support</span>
      </button>
      <motion.button
        whileHover={{
          boxShadow: 'inset 4px 4px 8px rgba(190, 195, 207, 0.2)',
        }}
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-2 rounded-2xl transition-all duration-300 disabled:opacity-50 border"
        style={{
          color: '#ff3b5c',
          borderColor: 'rgba(255, 59, 92, 0.3)',
          background: 'var(--neu-bg)',
          boxShadow: 'inset 4px 4px 8px rgba(190, 195, 207, 0.1)',
        }}
      >
        <LogOut className="w-4 h-4 flex-shrink-0" />
        <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
      </motion.button>
    </motion.div>
  </>
);

export const Sidebar = ({ onNavigate, isOpen = true, onClose }) => {
  const { currentPage, setCurrentPage, businessSettings } = useAppStore();
  const { logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.replace('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
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
    if (onClose) onClose();
  };

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div
        className="hidden md:fixed md:top-4 md:left-4 md:z-30 md:flex md:flex-col md:overflow-hidden md:rounded-3xl md:border md:p-6"
        style={{
          width: '256px',
          height: 'calc(100vh - 2rem)',
          background: 'var(--neu-bg)',
          borderColor: 'rgba(255, 255, 255, 0.6)',
          boxShadow: '18px 18px 36px var(--neu-dark), -18px -18px 36px var(--neu-light)',
        }}
      >
        <SidebarContent
          navItems={navItems}
          currentPage={currentPage}
          handleNavigation={handleNavigation}
          businessSettings={businessSettings}
          handleLogout={handleLogout}
          loggingOut={loggingOut}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden fixed top-4 left-4 z-30 flex flex-col overflow-hidden rounded-3xl border p-4"
            style={{
              width: 'min(calc(100vw - 2rem), 280px)',
              height: 'calc(100vh - 2rem)',
              background: 'var(--neu-bg)',
              borderColor: 'rgba(255, 255, 255, 0.6)',
              boxShadow: '18px 18px 36px var(--neu-dark), -18px -18px 36px var(--neu-light)',
            }}
          >
            <SidebarContent
              navItems={navItems}
              currentPage={currentPage}
              handleNavigation={handleNavigation}
              businessSettings={businessSettings}
              handleLogout={handleLogout}
              loggingOut={loggingOut}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
