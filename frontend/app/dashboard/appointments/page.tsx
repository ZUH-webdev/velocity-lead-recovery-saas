'use client';

import { useState } from 'react';
import { Calendar, List } from 'lucide-react';
import AppointmentCalendar from '../../../components/dashboard/AppointmentCalendar';
import type { Appointment, AppointmentStatus } from '../../../lib/mock-data';
import { appointments as initialAppointments } from '../../../lib/mock-data';

const statusStyles: Record<AppointmentStatus, string> = {
  Scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Confirmed: 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20',
  Cancelled: 'bg-[#f87171]/10 text-[#f87171] border-[#f87171]/20',
  Completed: 'bg-[#888888]/10 text-[#888888] border-[#888888]/20',
};

export default function AppointmentsPage() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [appointments, setAppointments] = useState(initialAppointments);

  const updateStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setView('calendar')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            view === 'calendar'
              ? 'bg-[#c9a97a] text-black'
              : 'border border-[#2a2a2a] text-[#f5f5f5] hover:bg-[#1a1a1a]'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Calendar
        </button>
        <button
          type="button"
          onClick={() => setView('list')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            view === 'list'
              ? 'bg-[#c9a97a] text-black'
              : 'border border-[#2a2a2a] text-[#f5f5f5] hover:bg-[#1a1a1a]'
          }`}
        >
          <List className="h-4 w-4" />
          List
        </button>
      </div>

      {view === 'calendar' ? (
        <AppointmentCalendar appointments={appointments} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a] text-xs uppercase tracking-widest text-[#888888]">
                <th className="pb-3 pr-4 font-medium">Patient Name</th>
                <th className="pb-3 pr-4 font-medium">Business</th>
                <th className="pb-3 pr-4 font-medium">Date & Time</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Reminder Sent</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="border-b border-[#2a2a2a]/60 hover:bg-[#111111]/50">
                  <td className="py-3.5 pr-4 font-medium text-[#f5f5f5]">{appt.patientName}</td>
                  <td className="py-3.5 pr-4 text-[#888888]">{appt.business}</td>
                  <td className="py-3.5 pr-4 text-[#888888]">
                    {new Date(appt.date).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[appt.status]}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-[#888888]">{appt.reminderSent ? 'Yes' : 'No'}</td>
                  <td className="py-3.5">
                    <div className="flex flex-wrap gap-2">
                      {appt.status !== 'Confirmed' && appt.status !== 'Cancelled' ? (
                        <button
                          type="button"
                          onClick={() => updateStatus(appt.id, 'Confirmed')}
                          className="rounded-lg bg-[#c9a97a] px-3 py-1.5 text-xs font-medium text-black hover:opacity-90"
                        >
                          Confirm
                        </button>
                      ) : null}
                      {appt.status !== 'Cancelled' && appt.status !== 'Completed' ? (
                        <button
                          type="button"
                          onClick={() => updateStatus(appt.id, 'Cancelled')}
                          className="rounded-lg border border-[#2a2a2a] px-3 py-1.5 text-xs font-medium text-[#f87171] hover:bg-[#111111]"
                        >
                          Cancel
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="rounded-lg border border-[#2a2a2a] px-3 py-1.5 text-xs font-medium text-[#f5f5f5] hover:bg-[#111111]"
                      >
                        Reschedule
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
