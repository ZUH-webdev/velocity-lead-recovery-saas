import React from 'react';
import ProvidersClient from './providers/ProvidersClient';
import './globals.css';

export const metadata = {
  title: 'Velocity - Elite Dashboard',
  description: 'Lead recovery and appointment booking dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-[#e0e5ec] text-slate-950 antialiased">
        <ProvidersClient>{children}</ProvidersClient>
      </body>
    </html>
  );
}
