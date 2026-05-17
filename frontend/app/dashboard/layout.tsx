import React from 'react';
import SidebarClient from '../components/SidebarClient';
import HeaderClient from '../components/HeaderClient';
import ProtectedRoute from '../../src/components/ProtectedRoute';

export const metadata = {
  title: 'Velocity Dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SidebarClient />
      <HeaderClient />
      <ProtectedRoute>
        <main style={{ marginLeft: 280, padding: '2rem' }}>{children}</main>
      </ProtectedRoute>
    </div>
  );
}
