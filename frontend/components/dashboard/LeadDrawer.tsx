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
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[#2a2a2a] bg-[#111111] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#2a2a2a] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#f5f5f5]">{lead.name}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#888888] hover:bg-[#1a1a1a] hover:text-[#f5f5f5]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <section className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-[#888888]">Contact Info</h3>
            <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 text-sm">
              <p className="text-[#f5f5f5]">{lead.phone}</p>
              <p className="mt-1 text-[#888888]">{lead.email}</p>
              <p className="mt-1 text-[#888888]">{lead.business}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[lead.status]}`}>
                  {lead.status}
                </span>
                <span className="text-xs text-[#888888]">{lead.source}</span>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <h3 className="text-xs uppercase tracking-widest text-[#888888]">Lead Score</h3>
            <div className="mt-3 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4">
              <div className="flex items-center justify-between">
                <LeadScoreBar score={lead.leadScore} />
                <span className="text-2xl font-semibold text-[#c9a97a]">{lead.leadScore}</span>
              </div>
              <div className="mt-4 space-y-2">
                {lead.scoreBreakdown.map((item) => (
                  <div key={item.factor} className="flex items-center justify-between text-sm">
                    <span className="text-[#888888]">{item.factor}</span>
                    <span className="font-medium text-[#f5f5f5]">{item.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6">
            <h3 className="text-xs uppercase tracking-widest text-[#888888]">Conversation</h3>
            <div className="mt-3 space-y-3">
              {lead.conversation.map((msg, i) => (
                <div
                  key={`${msg.timestamp}-${i}`}
                  className={`rounded-xl px-4 py-3 text-sm ${
                    msg.direction === 'outbound'
                      ? 'ml-4 border border-[#2a2a2a] bg-[#1a1a1a] text-[#f5f5f5]'
                      : 'mr-4 border border-[#c9a97a]/20 bg-[#c9a97a]/5 text-[#f5f5f5]'
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className="mt-1 text-xs text-[#888888]">{formatRelativeTime(msg.timestamp)}</p>
                </div>
              ))}
            </div>
          </section>

          {appointment ? (
            <section className="mt-6">
              <h3 className="text-xs uppercase tracking-widest text-[#888888]">Linked Appointment</h3>
              <div className="mt-3 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 text-sm">
                <p className="font-medium text-[#f5f5f5]">
                  {new Date(appointment.date).toLocaleString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
                <p className="mt-1 text-[#888888]">{appointment.business}</p>
                <span className="mt-2 inline-flex rounded-full border border-[#7ddcc1]/20 bg-[#7ddcc1]/10 px-2.5 py-0.5 text-xs font-medium text-[#7ddcc1]">
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