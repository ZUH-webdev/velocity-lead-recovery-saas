'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import type { Appointment, AppointmentStatus } from '../../lib/mock-data';

const statusStyles: Record<AppointmentStatus, string> = {
  Scheduled: 'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]',
  Confirmed: 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]',
  Cancelled: 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]',
  Completed: 'bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]',
};

function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function AppointmentCalendar({ appointments }: AppointmentCalendarProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(today.toISOString().split('T')[0]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const countsByDate = useMemo(() => {
    const map: Record<string, number> = {};
    appointments.forEach((appt) => {
      const key = appt.date.split('T')[0];
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [appointments]);

  const selectedAppointments = useMemo(() => {
    if (!selectedDate) return [];
    return appointments.filter((a) => a.date.startsWith(selectedDate));
  }, [appointments, selectedDate]);

  const monthLabel = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-[#09090b]">{monthLabel}</h3>
          <div className="flex gap-1">
            <button type="button" onClick={prevMonth} className="rounded-lg p-2 text-[#71717a] hover:bg-[#f4f4f5]">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={nextMonth} className="rounded-lg p-2 text-[#71717a] hover:bg-[#f4f4f5]">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="aspect-square" />;

            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const count = countsByDate[dateKey] || 0;
            const isSelected = selectedDate === dateKey;
            const isToday =
              today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => setSelectedDate(dateKey)}
                className={`relative flex aspect-square flex-col items-center justify-center gap-1 rounded-lg text-sm transition ${
                  isSelected ? 'bg-[#fdf6ec]' : 'hover:bg-[#fafafa]'
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] ${
                    isToday ? 'bg-[#09090b] font-bold text-white' : 'font-normal text-[#09090b]'
                  }`}
                >
                  {day}
                </span>
                {count > 0 ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#c9a97a] bg-[#fdf6ec] text-[10px] font-bold text-[#c9a97a]">
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sticky top-6 overflow-hidden rounded-xl border border-[#e4e4e7] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="border-b border-[#f4f4f5] px-4 py-3.5">
          <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-[#a1a1aa]">
            {selectedDate
              ? new Date(selectedDate + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase()
              : 'SELECT A DAY'}
          </p>
          <p className="text-[15px] font-semibold tracking-[-0.2px] text-[#09090b]">
            {selectedDate
              ? new Date(selectedDate + 'T12:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'long' })
              : 'Click a day to view appointments'}
          </p>
        </div>
        <div className="py-2">
          {selectedAppointments.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-[13px] text-[#a1a1aa]">No appointments this day</p>
            </div>
          ) : (
            selectedAppointments.map((appt, i) => (
              <div
                key={appt.id}
                className={`px-4 py-3 ${i < selectedAppointments.length - 1 ? 'border-b border-[#f4f4f5]' : ''}`}
              >
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-[#09090b]">{appt.patientName}</p>
                  <AppointmentStatusBadge status={appt.status} />
                </div>
                <p className="mb-1 text-xs text-[#71717a]">{appt.business}</p>
                <div className="flex items-center gap-1">
                  <Clock className="h-[11px] w-[11px] text-[#a1a1aa]" />
                  <span className="text-xs text-[#a1a1aa]">
                    {new Date(appt.date).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}