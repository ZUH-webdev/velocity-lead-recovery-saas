'use client';

import { X } from 'lucide-react';
import type { Lead } from '../../lib/mock-data';
import { formatRelativeTime, getAppointmentByLeadId } from '../../lib/mock-data';
import { statusStyles, LeadScoreBar } from './LeadsTable';

interface LeadDrawerProps {
  lead: Lead | null;
  onClose: () => void;
}

export default function LeadDrawer({ lead, onClose }: LeadDrawerProps) {
  if (!lead) return null;

  const appointment = getAppointmentByLeadId(lead.id);

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/60"
        onClick={onClose}
        aria-label="Close drawer overlay"
      />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[#e4e4e7] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#f4f4f5] bg-white px-6 py-4">
          <div>
            <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-[#a1a1aa]">
              Lead Detail
            </p>
            <h2 className="text-base font-bold tracking-[-0.3px] text-[#09090b]">{lead.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e4e4e7] text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#09090b]"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-5 flex items-center gap-2.5">
            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[lead.status]}`}>
              {lead.status}
            </span>
            <div className="flex items-center gap-1.5 rounded-full border border-[#e4e4e7] bg-[#f4f4f5] px-2.5 py-0.5">
              <span className="text-[11px] font-semibold text-[#71717a]">Score:</span>
              <span
                className="text-[11px] font-bold"
                style={{
                  color: lead.leadScore > 60 ? '#16a34a' : lead.leadScore > 30 ? '#c9a97a' : '#dc2626',
                }}
              >
                {lead.leadScore}
              </span>
            </div>
          </div>

          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Contact Info</h3>
            <div className="rounded-xl border border-[#e4e4e7] bg-white p-4 text-sm shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <p className="text-[#09090b]">{lead.phone}</p>
              <p className="mt-1 text-[#71717a]">{lead.email}</p>
              <p className="mt-1 text-[#71717a]">{lead.business}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-[#71717a]">{lead.source}</span>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Lead Score</h3>
            <div className="mt-3 rounded-xl border border-[#e4e4e7] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between">
                <LeadScoreBar score={lead.leadScore} />
                <span className="text-2xl font-semibold text-[#c9a97a]">{lead.leadScore}</span>
              </div>
              <div className="mt-4 space-y-2">
                {lead.scoreBreakdown.map((item) => (
                  <div key={item.factor} className="flex items-center justify-between text-sm">
                    <span className="text-[#71717a]">{item.factor}</span>
                    <span className="font-medium text-[#09090b]">{item.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Conversation</h3>
            <div className="mt-3 space-y-3">
              {lead.conversation.map((msg, i) => (
                <div
                  key={`${msg.timestamp}-${i}`}
                  className={`rounded-xl px-4 py-3 text-sm ${
                    msg.direction === 'outbound'
                      ? 'ml-4 border border-[#e4e4e7] bg-white text-[#09090b]'
                      : 'mr-4 border border-[#c9a97a]/20 bg-[#fdf6ec] text-[#09090b]'
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className="mt-1 text-xs text-[#71717a]">{formatRelativeTime(msg.timestamp)}</p>
                </div>
              ))}
            </div>
          </section>

          {appointment ? (
            <section className="mt-6">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Linked Appointment</h3>
              <div className="mt-3 rounded-xl border border-[#e4e4e7] bg-white p-4 text-sm shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <p className="font-medium text-[#09090b]">
                  {new Date(appointment.date).toLocaleString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
                <p className="mt-1 text-[#71717a]">{appointment.business}</p>
                <span className="mt-2 inline-flex rounded-full border border-[#7ddcc1]/40 bg-[#f0fdf4] px-2.5 py-0.5 text-xs font-medium text-[#16a34a]">
                  {appointment.status}
                </span>
              </div>
            </section>
          ) : null}
        </div>
      </aside>
    </>
  );
}