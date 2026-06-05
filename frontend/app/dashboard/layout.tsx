import React from 'react';
import SidebarClient from '../components/SidebarClient';
import HeaderClient from '../components/HeaderClient';
import ProtectedRoute from '../../src/components/ProtectedRoute';

export const metadata = {
  title: 'Velocity Dashboard — Lead Recovery & Analytics',
  description:
    'Access Velocity dashboard: monitor recovered leads, campaign performance, SMS/email follow-ups, and team activity in one place.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div>
        <SidebarClient />
        <HeaderClient />
        <main style={{ marginLeft: 280, padding: '2rem' }}>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
