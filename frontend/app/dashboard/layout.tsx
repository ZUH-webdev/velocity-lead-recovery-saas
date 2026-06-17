import DashboardShell from './DashboardShell';

export const metadata = {
  title: 'Velocity Dashboard — Lead Recovery & Analytics',
  description:
    'Access Velocity dashboard: monitor recovered leads, campaign performance, SMS/email follow-ups, and team activity in one place.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
