'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Appointment } from '../../lib/mock-data';

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
      <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-[#f5f5f5]">{monthLabel}</h3>
          <div className="flex gap-1">
            <button type="button" onClick={prevMonth} className="rounded-lg p-2 text-[#888888] hover:bg-[#111111]">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={nextMonth} className="rounded-lg p-2 text-[#888888] hover:bg-[#111111]">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-widest text-[#888888]">
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
                className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition ${
                  isSelected
                    ? 'bg-[#c9a97a]/20 text-[#c9a97a] ring-1 ring-[#c9a97a]'
                    : 'text-[#f5f5f5] hover:bg-[#111111]'
                } ${isToday && !isSelected ? 'ring-1 ring-[#2a2a2a]' : ''}`}
              >
                {day}
                {count > 0 ? (
                  <span className="absolute bottom-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#c9a97a] px-1 text-[10px] font-bold text-black">
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
        <h3 className="text-xs uppercase tracking-widest text-[#888888]">
          {selectedDate
            ? new Date(selectedDate + 'T12:00:00').toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })
            : 'Select a day'}
        </h3>
        <div className="mt-4 space-y-3">
          {selectedAppointments.length === 0 ? (
            <p className="text-sm text-[#888888]">No appointments scheduled.</p>
          ) : (
            selectedAppointments.map((appt) => (
              <div key={appt.id} className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-3">
                <p className="font-medium text-[#f5f5f5]">{appt.patientName}</p>
                <p className="text-xs text-[#888888]">{appt.business}</p>
                <p className="mt-1 text-sm text-[#c9a97a]">
                  {new Date(appt.date).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
