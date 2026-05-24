import React from 'react';
import VerifyClient from './VerifyClient';

export default function VerifyPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const token = typeof searchParams.token === 'string' ? searchParams.token : undefined;

  return <VerifyClient token={token} />;
}