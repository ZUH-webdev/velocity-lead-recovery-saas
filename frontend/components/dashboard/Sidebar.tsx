'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart2,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { clearToken } from '../../lib/auth';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/leads', label: 'Leads', icon: Users },
  { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarCheck },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return 'VL';
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, activeTenantId, logout } = useAuth();

  const displayName = user?.fullName || user?.name || 'Velocity User';
  const email = user?.email || 'user@clinic.com';
  const initials = getInitials(displayName, email);

  const handleLogout = async () => {
    await logout(); // clears tokens, calls backend, redirects to /signin
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-[#1e1e1e] px-5 py-5">
        <Image
          src="/velocity-logo.webp"
          alt="Velocity"
          width={32}
          height={34}
          className="object-contain"
        />
        <span className="text-lg font-semibold tracking-tight text-[#f5f5f5]">
          Velocity
        </span>
        <button
          type="button"
          onClick={onMobileClose}
          className="ml-auto rounded-lg p-1 text-[#888888] hover:bg-[#1a1a1a] md:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={onMobileClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'border-l-2 border-[#c9a97a] bg-[#1a1a1a] pl-[10px] text-[#f5f5f5]'
                  : 'border-l-2 border-transparent text-[#888888] hover:bg-[#1a1a1a] hover:text-[#f5f5f5]'
              )}
            >
              <Icon
                className={cn('h-4 w-4', active ? 'text-[#c9a97a]' : 'text-[#888888]')}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#1e1e1e] p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c9a97a]/20 text-xs font-semibold text-[#c9a97a]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#f5f5f5]">{displayName}</p>
            <p className="truncate text-xs text-[#888888]">{email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#2a2a2a] px-4 py-2 text-sm font-medium text-[#f5f5f5] transition hover:bg-[#1a1a1a]"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onMobileClose}
          aria-label="Close sidebar overlay"
        />
      ) : null}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-[240px] border-r border-[#1e1e1e] bg-[#0f0f0f] transition-transform md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
