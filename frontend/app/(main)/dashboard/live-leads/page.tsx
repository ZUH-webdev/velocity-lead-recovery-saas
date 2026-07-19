import { redirect } from 'next/navigation';

// live-leads pointed at a component that no longer exists (removed in the
// src/ -> app/ migration) and isn't linked from the dashboard nav. The real
// leads table lives at /dashboard/leads.
export default function LiveLeadsPage() {
  redirect('/dashboard/leads');
}
