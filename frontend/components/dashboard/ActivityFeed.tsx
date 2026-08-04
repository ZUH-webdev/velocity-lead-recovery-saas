import {
  CalendarCheck,
  MessageSquare,
  PhoneMissed,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import type { ActivityFeedItem, ActivityType } from '../../lib/mock-data';
import { formatRelativeTime } from '../../lib/mock-data';

const activityIcons: Record<ActivityType, typeof PhoneMissed> = {
  lead_recovered: Sparkles,
  appointment_booked: CalendarCheck,
  call_missed: PhoneMissed,
  sms_sent: MessageSquare,
  lead_qualified: UserCheck,
};

const activityColors: Record<ActivityType, string> = {
  lead_recovered: 'text-[#c9a97a] bg-[#fdf6ec]',
  appointment_booked: 'text-[#16a34a] bg-[#f0fdf4]',
  call_missed: 'text-[#dc2626] bg-[#fef2f2]',
  sms_sent: 'text-[#2563eb] bg-[#eff6ff]',
  lead_qualified: 'text-[#16a34a] bg-[#f0fdf4]',
};

interface ActivityFeedProps {
  items: ActivityFeedItem[];
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Recent Activity</h3>
      <div className="mt-4 space-y-4">
        {items.map((item, index) => {
          const Icon = activityIcons[item.type];
          const colorClass = activityColors[item.type];

          return (
            <div key={item.id} className="relative flex gap-3 pl-1">
              {index < items.length - 1 ? (
                <span className="absolute left-[15px] top-8 h-[calc(100%+4px)] w-px bg-[#f4f4f5]" />
              ) : null}
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 pb-1">
                <p className="text-sm font-medium text-[#09090b]">{item.message}</p>
                <p className="mt-0.5 text-xs text-[#a1a1aa]">{formatRelativeTime(item.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}