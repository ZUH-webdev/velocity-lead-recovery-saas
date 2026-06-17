'use client';

import { useState } from 'react';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#111111]">
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="min-h-screen pt-16 md:ml-[240px]">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
