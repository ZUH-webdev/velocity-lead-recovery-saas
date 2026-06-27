'use client';
import React from 'react';
import VerifyClient from './VerifyClient';
import { useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || undefined;

  return <VerifyClient token={token} />;
}