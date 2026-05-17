"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const LeadsPage = dynamic(() => import('../../../src/components/pages/LeadsPage'), { ssr: false });

export default function Page() {
  return <LeadsPage />;
}
