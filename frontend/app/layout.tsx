import React from 'react';
import ProvidersClient from './providers/ProvidersClient';
import './globals.css';

export const metadata = {
  title: 'Velocity',
  description: 'Velocity revenue recovery platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/velocity-logo-black.svg" />
        <link rel="apple-touch-icon" href="/velocity-logo-black.svg" />
      </head>
      <body className="min-h-screen bg-white text-slate-950 antialiased">
        <ProvidersClient>{children}</ProvidersClient>
      </body>
    </html>
  );
}
