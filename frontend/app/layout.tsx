import React from 'react';
import ProvidersClient from './providers/ProvidersClient';
import '../src/index.css';

export const metadata = {
  title: 'Velocity - Elite Dashboard',
  description: 'Lead recovery and appointment booking dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#e0e5ec' }}>
        <ProvidersClient>{children}</ProvidersClient>
      </body>
    </html>
  );
}
