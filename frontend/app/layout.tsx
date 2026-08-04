import React from 'react';
import type { Metadata } from 'next';
import ProvidersClient from '../providers/ProvidersClient';
import StructuredData from '../components/StructuredData';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://velocity-ai.site'),
  title: {
    default: 'Velocity — AI Lead Recovery & Appointment Booking for Local Businesses',
    template: '%s | Velocity',
  },
  description:
    'Velocity is an AI-powered lead recovery platform that turns missed calls into booked appointments — automatically. Built for dental practices, med spas, real estate teams, and salons.',
  keywords: [
    'missed call recovery',
    'AI lead recovery',
    'appointment booking software',
    'AI SMS follow-up',
    'dental practice software',
    'med spa booking software',
    'automated lead qualification',
  ],
  authors: [{ name: 'Zain Ul Hassan', url: 'https://velocity-ai.site/about' }],
  creator: 'Zain Ul Hassan',
  publisher: 'Velocity',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://velocity-ai.site',
  },
  openGraph: {
    type: 'website',
    url: 'https://velocity-ai.site',
    siteName: 'Velocity',
    title: 'Velocity — AI Lead Recovery & Appointment Booking',
    description: 'Turn missed calls into booked appointments, automatically.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Velocity — AI Lead Recovery Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Velocity — AI Lead Recovery & Appointment Booking',
    description: 'Turn missed calls into booked appointments, automatically.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'xf2PpYg8zEyTV7tgKQtX9VxEvKoYBNJdb5W6KggmTzI',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-white text-slate-950 antialiased">
        <StructuredData />
        <ProvidersClient>{children}</ProvidersClient>
      </body>
    </html>
  );
}
