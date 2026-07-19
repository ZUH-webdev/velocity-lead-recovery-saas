import { CalendarClock } from 'lucide-react';

// Previously dynamically imported a CalendarPage component from src/, which
// was removed in the src/ -> app/ migration with no replacement. Not linked
// from the dashboard nav today.
export default function CalendarPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-10 text-center">
      <CalendarClock className="h-10 w-10 text-[#c9a97a]" />
      <h2 className="mt-4 text-lg font-medium text-[#f5f5f5]">Calendar coming soon</h2>
      <p className="mt-2 max-w-sm text-sm text-[#888888]">
        Appointment scheduling and calendar sync are on the way. Check back soon.
      </p>
    </div>
  );
}
