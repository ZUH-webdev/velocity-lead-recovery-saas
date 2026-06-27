import React from 'react';
import ProvidersClient from '../providers/ProvidersClient';
import './globals.css';

export const metadata = {
  title: 'Velocity — Revenue Recovery & Lead Recovery Platform',
  description:
    'Recover lost revenue with Velocity: automated lead recovery, SMS & email follow-ups, calendar sync, and actionable analytics for sales teams.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-white text-slate-950 antialiased">
        <ProvidersClient>{children}</ProvidersClient>
      </body>
    </html>
  );
}
