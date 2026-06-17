import type { Lead, LeadStatus } from '../../lib/mock-data';
import { formatRelativeTime } from '../../lib/mock-data';

const statusStyles: Record<LeadStatus, string> = {
  Qualified: 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20',
  Contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Booked: 'bg-[#c9a97a]/10 text-[#c9a97a] border-[#c9a97a]/20',
  Lost: 'bg-[#f87171]/10 text-[#f87171] border-[#f87171]/20',
};

function LeadScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#2a2a2a]">
        <div
          className="h-full rounded-full bg-[#c9a97a]"
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
      <span className="text-xs text-[#888888]">{score}</span>
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
          <tr className="border-b border-[#2a2a2a] text-xs uppercase tracking-widest text-[#888888]">
            <th className="pb-3 pr-4 font-medium">Name</th>
            <th className="pb-3 pr-4 font-medium">Phone</th>
            {showBusiness ? <th className="pb-3 pr-4 font-medium">Business</th> : null}
            <th className="pb-3 pr-4 font-medium">Status</th>
            <th className="pb-3 pr-4 font-medium">Lead Score</th>
            {showSource ? <th className="pb-3 pr-4 font-medium">Source</th> : null}
            <th className="pb-3 pr-4 font-medium">{showCreatedAt ? 'Created At' : 'Last Contact'}</th>
            <th className="pb-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-[#2a2a2a]/60 hover:bg-[#1a1a1a]/50">
              <td className="py-3.5 pr-4 font-medium text-[#f5f5f5]">{lead.name}</td>
              <td className="py-3.5 pr-4 text-[#888888]">{lead.phone}</td>
              {showBusiness ? <td className="py-3.5 pr-4 text-[#888888]">{lead.business}</td> : null}
              <td className="py-3.5 pr-4">
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="py-3.5 pr-4">
                <LeadScoreBar score={lead.leadScore} />
              </td>
              {showSource ? <td className="py-3.5 pr-4 text-[#888888]">{lead.source}</td> : null}
              <td className="py-3.5 pr-4 text-[#888888]">
                {showCreatedAt
                  ? new Date(lead.createdAt).toLocaleDateString()
                  : formatRelativeTime(lead.lastContact)}
              </td>
              <td className="py-3.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView?.(lead)}
                    className="rounded-lg bg-[#c9a97a] px-3 py-1.5 text-xs font-medium text-black hover:opacity-90"
                  >
                    View
                  </button>
                  {onDelete ? (
                    <button
                      type="button"
                      onClick={() => onDelete(lead)}
                      className="rounded-lg border border-[#2a2a2a] px-3 py-1.5 text-xs font-medium text-[#f87171] hover:bg-[#1a1a1a]"
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
