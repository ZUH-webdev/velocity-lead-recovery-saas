'use client';
import React, { Suspense } from 'react';
import VerifyClient from './VerifyClient';
import { useSearchParams } from 'next/navigation';

function VerifyPageInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || undefined;

  return <VerifyClient token={token} />;
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyPageInner />
    </Suspense>
  );
}