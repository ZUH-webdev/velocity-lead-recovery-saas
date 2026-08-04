import { Globe, HelpCircle, PenLine, PhoneMissed, Users } from 'lucide-react';
import type { Lead, LeadSource, LeadStatus } from '../../lib/mock-data';
import { formatRelativeTime } from '../../lib/mock-data';

const statusStyles: Record<LeadStatus, string> = {
  Qualified: 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]',
  Contacted: 'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]',
  Booked: 'bg-[#fdf6ec] text-[#c9a97a] border-[#f5e6cc]',
  Lost: 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]',
};

const sourceConfig: Record<LeadSource, { icon: typeof PhoneMissed; label: string }> = {
  'Missed Call': { icon: PhoneMissed, label: 'Missed Call' },
  'Web Form': { icon: Globe, label: 'Web Form' },
  Manual: { icon: PenLine, label: 'Manual' },
};

function SourceBadge({ source }: { source: LeadSource }) {
  const config = sourceConfig[source] || { icon: HelpCircle, label: source };
  const Icon = config.icon;
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3 w-3 text-[#a1a1aa]" />
      <span className="text-xs text-[#71717a]">{config.label}</span>
    </div>
  );
}

function LeadAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#09090b] text-[10px] font-semibold text-white">
      {initials || '?'}
    </div>
  );
}

function LeadScoreBar({ score }: { score: number }) {
  const barColor = score > 60 ? '#16a34a' : score > 30 ? '#c9a97a' : '#dc2626';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#f4f4f5]">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, score)}%`, background: barColor }}
        />
      </div>
      <span className="text-xs font-medium" style={{ color: barColor }}>
        {score}
      </span>
    </div>
  );
}

interface LeadsTableProps {
  leads: Lead[];
  onView?: (lead: Lead) => void;
  showBusiness?: boolean;
  showSource?: boolean;
  showCreatedAt?: boolean;
  onDelete?: (lead: Lead) => void;
}

export default function LeadsTable({
  leads,
  onView,
  showBusiness = false,
  showSource = false,
  showCreatedAt = false,
  onDelete,
}: LeadsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-[#f4f4f5] text-[10px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">
            <th className="pb-3 pr-4 font-semibold">Name</th>
            <th className="pb-3 pr-4 font-semibold">Phone</th>
            {showBusiness ? <th className="pb-3 pr-4 font-semibold">Business</th> : null}
            <th className="pb-3 pr-4 font-semibold">Status</th>
            <th className="pb-3 pr-4 font-semibold">Lead Score</th>
            {showSource ? <th className="pb-3 pr-4 font-semibold">Source</th> : null}
            <th className="pb-3 pr-4 font-semibold">{showCreatedAt ? 'Created At' : 'Last Contact'}</th>
            <th className="pb-3 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td colSpan={6 + Number(showBusiness) + Number(showSource)} className="py-12 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f4f4f5]">
                  <Users className="h-[18px] w-[18px] text-[#a1a1aa]" />
                </div>
                <p className="text-sm font-medium text-[#09090b]">No leads found</p>
                <p className="mt-1 text-[13px] text-[#a1a1aa]">
                  Leads will appear here when calls are missed or forms are submitted
                </p>
              </td>
            </tr>
          ) : null}
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-[#f4f4f5] last:border-b-0 hover:bg-[#fafafa]">
              <td className="py-3.5 pr-4">
                <div className="flex items-center gap-2.5">
                  <LeadAvatar name={lead.name} />
                  <span className="font-medium text-[#09090b]">{lead.name}</span>
                </div>
              </td>
              <td className="py-3.5 pr-4 font-mono text-[#71717a]">{lead.phone}</td>
              {showBusiness ? <td className="py-3.5 pr-4 text-[#71717a]">{lead.business}</td> : null}
              <td className="py-3.5 pr-4">
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="py-3.5 pr-4">
                <LeadScoreBar score={lead.leadScore} />
              </td>
              {showSource ? (
                <td className="py-3.5 pr-4">
                  <SourceBadge source={lead.source} />
                </td>
              ) : null}
              <td className="py-3.5 pr-4 text-[#a1a1aa]">
                {showCreatedAt
                  ? new Date(lead.createdAt).toLocaleDateString()
                  : formatRelativeTime(lead.lastContact)}
              </td>
              <td className="py-3.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView?.(lead)}
                    className="rounded-lg border border-[#e4e4e7] px-3 py-1.5 text-xs font-medium text-[#09090b] hover:bg-[#f4f4f5]"
                  >
                    View
                  </button>
                  {onDelete ? (
                    <button
                      type="button"
                      onClick={() => onDelete(lead)}
                      className="rounded-lg border border-[#e4e4e7] px-3 py-1.5 text-xs font-medium text-[#dc2626] hover:bg-[#fef2f2]"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { statusStyles, LeadScoreBar };