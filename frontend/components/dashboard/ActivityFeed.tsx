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
  lead_recovered: 'text-[#c9a97a] bg-[#c9a97a]/10',
  appointment_booked: 'text-[#7ddcc1] bg-[#7ddcc1]/10',
  call_missed: 'text-[#facc15] bg-[#facc15]/10',
  sms_sent: 'text-blue-400 bg-blue-500/10',
  lead_qualified: 'text-[#4ade80] bg-[#4ade80]/10',
};

interface ActivityFeedProps {
  items: ActivityFeedItem[];
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
      <h3 className="text-xs uppercase tracking-widest text-[#888888]">Recent Activity</h3>
      <div className="mt-4 space-y-4">
        {items.map((item, index) => {
          const Icon = activityIcons[item.type];
          const colorClass = activityColors[item.type];

          return (
            <div key={item.id} className="relative flex gap-3 pl-1">
              {index < items.length - 1 ? (
                <span className="absolute left-[15px] top-8 h-[calc(100%+4px)] w-px bg-[#2a2a2a]" />
              ) : null}
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 pb-1">
                <p className="text-sm text-[#f5f5f5]">{item.message}</p>
                <p className="mt-0.5 text-xs text-[#888888]">{formatRelativeTime(item.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
