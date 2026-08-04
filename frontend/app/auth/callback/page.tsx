'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setToken } from '../../../lib/auth';
import { useAuth } from '../../../context/AuthContext';

const ERROR_MESSAGES: Record<string, string> = {
  google_failed: 'google_auth_failed',
  server_error: 'server_error',
};

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { initAuth } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const status = searchParams.get('status');
    const error = searchParams.get('error');

    if (error) {
      router.replace(`/sign-in?error=${ERROR_MESSAGES[error] || 'unknown_error'}`);
      return;
    }

    if (!token) {
      router.replace('/sign-in?error=no_token');
      return;
    }

    setToken(token);

    initAuth()
      .then((user) => {
        const hasWorkspace = user?.hasWorkspace ?? status === 'dashboard';
        router.replace(hasWorkspace ? '/dashboard' : '/onboarding');
      })
      .catch(() => {
        router.replace('/sign-in?error=server_error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 rounded-full border-[3px] border-slate-200 border-t-slate-950 animate-spin" />
      <p className="text-sm text-slate-500">Signing you in with Google…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackInner />
    </Suspense>
  );
}
