"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('../../src/components/Dashboard'), { ssr: false });

export default function Page() {
  return <Dashboard />;
}
