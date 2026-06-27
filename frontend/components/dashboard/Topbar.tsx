'use client';

import { Bell, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/leads': 'Leads',
  '/dashboard/appointments': 'Appointments',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/settings': 'Settings',
};

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return 'VL';
}

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const title =
    routeTitles[pathname] ||
    Object.entries(routeTitles).find(([path]) => pathname.startsWith(path))?.[1] ||
    'Dashboard';

  const displayName = user?.fullName || user?.name || 'Velocity User';
  const email = user?.email || 'user@clinic.com';
  const initials = getInitials(displayName, email);

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-[#1e1e1e] bg-[#0a0a0a] px-4 md:left-[240px] md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[#888888] hover:bg-[#1a1a1a] hover:text-[#f5f5f5] md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-[#f5f5f5]">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative rounded-lg p-2 text-[#888888] transition hover:bg-[#1a1a1a] hover:text-[#f5f5f5]"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#c9a97a]" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c9a97a]/20 text-xs font-semibold text-[#c9a97a]">
          {initials}
        </div>
      </div>
    </header>
  );
}