'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart2,
  Bell,
  CalendarCheck,
  CheckCircle,
  LogOut,
  Menu,
  PhoneCall,
  PhoneMissed,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/leads': 'Leads',
  '/dashboard/appointments': 'Appointments',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/settings': 'Settings',
};

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'New lead recovered',
    description: 'Dr. Smith Dental — missed call from +1 (555) 234-5678',
    time: 'Just now',
    unread: true,
    Icon: PhoneCall,
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
  },
  {
    id: '2',
    title: 'Appointment confirmed',
    description: 'Emily Chen confirmed her 10:30 AM slot',
    time: '3 mins ago',
    unread: true,
    Icon: CalendarCheck,
    iconBg: '#fdf6ec',
    iconColor: '#c9a97a',
  },
  {
    id: '3',
    title: 'Lead qualified',
    description: 'Sarah Williams responded YES to booking SMS',
    time: '1 hour ago',
    unread: true,
    Icon: CheckCircle,
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
  },
  {
    id: '4',
    title: 'Daily summary ready',
    description: '14 leads recovered, 6 appointments booked today',
    time: '3 hours ago',
    unread: false,
    Icon: BarChart2,
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
  },
  {
    id: '5',
    title: 'Missed call detected',
    description: 'Radiant Med Spa — unknown caller, recovery initiated',
    time: '5 hours ago',
    unread: false,
    Icon: PhoneMissed,
    iconBg: '#fef2f2',
    iconColor: '#dc2626',
  },
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

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const title =
    routeTitles[pathname] ||
    Object.entries(routeTitles).find(([path]) => pathname.startsWith(path))?.[1] ||
    'Dashboard';

  const displayName = user?.fullName || user?.name || 'Velocity User';
  const email = user?.email || 'user@clinic.com';
  const initials = getInitials(displayName, email);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-[#e4e4e7] bg-white px-4 md:left-[240px] md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#09090b] md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold tracking-[-0.2px] text-[#09090b]">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="relative rounded-lg p-2 text-[#71717a] transition hover:bg-[#f4f4f5] hover:text-[#09090b]"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 ? (
              <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full border-[1.5px] border-white bg-[#c9a97a]" />
            ) : null}
          </button>

          {notificationsOpen ? (
            <>
              <button
                type="button"
                className="fixed inset-0 z-[100] bg-black/40 md:hidden"
                onClick={() => setNotificationsOpen(false)}
                aria-label="Close notifications overlay"
              />
              <div className="fixed inset-0 z-[110] m-auto h-fit w-[calc(100vw-32px)] max-w-[360px] overflow-hidden rounded-[14px] border border-[#e4e4e7] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] md:absolute md:inset-auto md:right-0 md:top-12 md:z-[100] md:m-0 md:h-auto md:w-[360px] md:max-w-none">
              <div className="flex items-center justify-between border-b border-[#f4f4f5] px-5 py-4">
                <div>
                  <p className="text-sm font-bold tracking-[-0.2px] text-[#09090b]">Notifications</p>
                  <p className="mt-0.5 text-xs text-[#a1a1aa]">{unreadCount} unread</p>
                </div>
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-xs font-medium text-[#c9a97a] hover:opacity-80"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif, i) => (
                  <div
                    key={notif.id}
                    className={`flex cursor-pointer items-start gap-3 px-5 py-3.5 transition hover:bg-[#fafafa] ${
                      i < notifications.length - 1 ? 'border-b border-[#f4f4f5]' : ''
                    } ${notif.unread ? 'bg-[#fdfcfb]' : ''}`}
                  >
                    <div
                      className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px]"
                      style={{ background: notif.iconBg }}
                    >
                      <notif.Icon className="h-[15px] w-[15px]" style={{ color: notif.iconColor }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`mb-0.5 text-[13px] leading-snug text-[#09090b] ${
                          notif.unread ? 'font-semibold' : 'font-normal'
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="mb-1 text-xs leading-snug text-[#71717a]">{notif.description}</p>
                      <p className="text-[11px] text-[#a1a1aa]">{notif.time}</p>
                    </div>
                    {notif.unread ? (
                      <div className="mt-1 h-[7px] w-[7px] shrink-0 rounded-full bg-[#c9a97a]" />
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="border-t border-[#f4f4f5] px-5 py-3 text-center">
                <button type="button" className="text-[13px] font-medium text-[#71717a] hover:text-[#09090b]">
                  View all notifications →
                </button>
              </div>
              </div>
            </>
          ) : null}
        </div>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotificationsOpen(false);
            }}
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#c9a97a]/15 text-xs font-semibold text-[#c9a97a]"
            aria-label="Open profile menu"
          >
            {user?.avatarURL ? (
              <img src={user.avatarURL} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </button>

          {profileOpen ? (
            <div className="absolute right-0 top-12 z-[100] w-[260px] overflow-hidden rounded-[14px] border border-[#e4e4e7] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)]">
              <div className="border-b border-[#f4f4f5] px-5 py-4">
                <div className="flex items-center gap-3">
                  {user?.avatarURL ? (
                    <img
                      src={user.avatarURL}
                      alt={displayName}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#09090b] text-sm font-bold text-white">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#09090b]">{displayName}</p>
                    <p className="mt-0.5 truncate text-xs text-[#a1a1aa]">{email}</p>
                  </div>
                </div>
              </div>

              <div className="py-1.5">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-5 py-2.5 text-[13px] font-medium text-[#09090b] transition hover:bg-[#fafafa]"
                >
                  <Settings className="h-[14px] w-[14px] text-[#71717a]" />
                  Settings
                </Link>
                <Link
                  href="/dashboard/settings?tab=profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-5 py-2.5 text-[13px] font-medium text-[#09090b] transition hover:bg-[#fafafa]"
                >
                  <UserIcon className="h-[14px] w-[14px] text-[#71717a]" />
                  Edit Profile
                </Link>

                <div className="my-1.5 h-px bg-[#f4f4f5]" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-5 py-2.5 text-left text-[13px] font-medium text-[#dc2626] transition hover:bg-[#fef2f2]"
                >
                  <LogOut className="h-[14px] w-[14px] text-[#dc2626]" />
                  Sign out
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
