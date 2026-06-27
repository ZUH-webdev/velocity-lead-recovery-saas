"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const CalendarPage = dynamic(() => import('../../../../src/components/pages/CalendarPage'), { ssr: false });

export default function Page() {
  return <CalendarPage />;
}
