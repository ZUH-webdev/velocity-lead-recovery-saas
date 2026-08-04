'use client';

import { useState } from 'react';
import { Calendar, CalendarDays, CheckCircle, Clock, List } from 'lucide-react';
import AppointmentCalendar from '../../../../components/dashboard/AppointmentCalendar';
import type { Appointment, AppointmentStatus } from '../../../../lib/mock-data';
import { appointments as initialAppointments } from '../../../../lib/mock-data';

const statusStyles: Record<AppointmentStatus, string> = {
  Scheduled: 'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]',
  Confirmed: 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]',
  Cancelled: 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]',
  Completed: 'bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]',
};

function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

function PatientAvatar({ name }: { name?: string }) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';
  return (
    <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#09090b] text-[11px] font-semibold text-white">
      {initials}
    </div>
  );
}

export default function AppointmentsPage() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [appointments, setAppointments] = useState(initialAppointments);

  const updateStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#a1a1aa]">Schedule</p>
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[#09090b]">Appointments</h1>
        <p className="mt-1 text-sm text-[#71717a]">Manage and track all scheduled appointments</p>
      </div>

      <div className="inline-flex gap-0.5 rounded-[10px] border border-[#e4e4e7] bg-[#f4f4f5] p-[3px]">
        <button
          type="button"
          onClick={() => setView('calendar')}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-[7px] text-[13px] font-medium transition-all ${
            view === 'calendar'
              ? 'bg-white text-[#09090b] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
              : 'text-[#71717a] hover:text-[#09090b]'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          Calendar
        </button>
        <button
          type="button"
          onClick={() => setView('list')}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-[7px] text-[13px] font-medium transition-all ${
            view === 'list'
              ? 'bg-white text-[#09090b] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
              : 'text-[#71717a] hover:text-[#09090b]'
          }`}
        >
          <List className="h-3.5 w-3.5" />
          List
        </button>
      </div>

      {view === 'calendar' ? (
        <AppointmentCalendar appointments={appointments} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e4e4e7] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="border-b border-[#f4f4f5] px-5 py-3.5">
            <p className="text-[13px] text-[#71717a]">
              <strong className="text-[#09090b]">{appointments.length}</strong> appointments total
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#f4f4f5]">
                  {['Patient Name', 'Business', 'Date & Time', 'Status', 'Reminder Sent', 'Actions'].map((label) => (
                    <th
                      key={label}
                      className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.07em] text-[#a1a1aa]"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f4f4f5]">
                        <CalendarDays className="h-[18px] w-[18px] text-[#a1a1aa]" />
                      </div>
                      <p className="text-sm font-medium text-[#09090b]">No appointments yet</p>
                      <p className="mt-1 text-[13px] text-[#a1a1aa]">Appointments will appear here when leads are booked</p>
                    </td>
                  </tr>
                ) : null}
                {appointments.map((appt, i) => (
                  <tr
                    key={appt.id}
                    className={`hover:bg-[#fafafa] ${i < appointments.length - 1 ? 'border-b border-[#f4f4f5]' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <PatientAvatar name={appt.patientName} />
                        <span className="text-[13px] font-medium text-[#09090b]">{appt.patientName || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#3f3f46]">{appt.business || '—'}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-[#09090b]">
                        {new Date(appt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="mt-0.5 text-xs text-[#a1a1aa]">
                        {new Date(appt.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <AppointmentStatusBadge status={appt.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {appt.reminderSent ? (
                          <>
                            <CheckCircle className="h-[13px] w-[13px] text-[#16a34a]" />
                            <span className="text-xs text-[#16a34a]">Sent</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-[13px] w-[13px] text-[#a1a1aa]" />
                            <span className="text-xs text-[#a1a1aa]">Pending</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {appt.status !== 'Confirmed' && appt.status !== 'Cancelled' && appt.status !== 'Completed' ? (
                          <button
                            type="button"
                            onClick={() => updateStatus(appt.id, 'Confirmed')}
                            className="rounded-md border border-[#09090b] bg-[#09090b] px-3 py-1 text-xs font-medium text-white transition hover:bg-[#1c1c1e]"
                          >
                            Confirm
                          </button>
                        ) : null}
                        {appt.status !== 'Cancelled' && appt.status !== 'Completed' ? (
                          <button
                            type="button"
                            onClick={() => updateStatus(appt.id, 'Cancelled')}
                            className="rounded-md border border-[#fecaca] px-3 py-1 text-xs font-medium text-[#dc2626] hover:bg-[#fef2f2]"
                          >
                            Cancel
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="rounded-md border border-[#e4e4e7] px-3 py-1 text-xs font-medium text-[#09090b] hover:bg-[#f4f4f5]"
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
        </div>
      )}
    </div>
  );
}
