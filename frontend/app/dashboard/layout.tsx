import DashboardShell from './DashboardShell';
import ProtectedRoute from '../../src/components/ProtectedRoute';

export const metadata = {
  title: 'Velocity Dashboard — Lead Recovery & Analytics',
  description:
    'Access Velocity dashboard: monitor recovered leads, campaign performance, SMS/email follow-ups, and team activity in one place.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
