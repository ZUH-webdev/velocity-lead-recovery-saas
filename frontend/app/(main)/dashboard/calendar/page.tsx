import { CalendarClock } from 'lucide-react';

// Previously dynamically imported a CalendarPage component from src/, which
// was removed in the src/ -> app/ migration with no replacement. Not linked
// from the dashboard nav today.
export default function CalendarPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-xl border border-[#e4e4e7] bg-white p-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <CalendarClock className="h-10 w-10 text-[#c9a97a]" />
      <h2 className="mt-4 text-lg font-medium text-[#09090b]">Calendar coming soon</h2>
      <p className="mt-2 max-w-sm text-sm text-[#71717a]">
        Appointment scheduling and calendar sync are on the way. Check back soon.
      </p>
    </div>
  );
}
