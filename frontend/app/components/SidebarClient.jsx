"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Calendar, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SidebarClient({ onNavigate }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, description: 'Executive overview' },
    { id: 'leads', label: 'Live Leads', href: '/dashboard/live-leads', icon: Users, description: 'Command center' },
    { id: 'calendar', label: 'Calendar', href: '/dashboard/calendar', icon: Calendar, description: 'Appointments' },
    { id: 'settings', label: 'Settings', href: '/dashboard/settings', icon: Settings, description: 'Configuration' },
  ];

  return (
    <div className="hidden md:fixed md:top-4 md:left-4 md:z-30 md:flex md:flex-col md:overflow-hidden md:rounded-3xl md:border md:p-6" style={{ width: 256, height: 'calc(100vh - 2rem)', background: 'var(--neu-bg)' }}>
      <div className="mb-6 md:mb-8 flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-3 no-underline">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(145deg, #d4d9e2, #eef3f8)' }}>
            <Image src="/velocity-logo.webp" alt="Velocity" width={32} height={32} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--neu-text-dark)' }}>Velocity</h1>
            <p className="text-xs" style={{ color: 'var(--neu-text-light)' }}>V2 Elite</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => router.push(item.href)} className="w-full text-left px-4 py-3 rounded-2xl flex items-start gap-3 border">
              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--neu-text-dark)' }}>{item.label}</p>
                <p className="text-xs" style={{ color: 'var(--neu-text-light)' }}>{item.description}</p>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-6 space-y-2 pt-6" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}>
        <button className="w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-2 rounded-2xl border" onClick={() => router.push('/dashboard/settings')}>Help & Support</button>
        <button className="w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-2 rounded-2xl border" onClick={() => router.push('/signin')}>Sign Out</button>
      </div>
    </div>
  );
}
