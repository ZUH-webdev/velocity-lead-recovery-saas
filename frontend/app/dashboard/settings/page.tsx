"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const SettingsPage = dynamic(() => import('../../../src/components/pages/SettingsPage'), { ssr: false });

export default function Page() {
  return <SettingsPage />;
}
