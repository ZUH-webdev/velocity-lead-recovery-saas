'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthShell from '../../../components/AuthShell';
import { api } from '../../../lib/api';
import { Banner } from '../../../components/ErrorBanner';
import { getFriendlyError } from '../../../lib/errors';

interface Banner {
  type: 'error' | 'success' | 'info';
  message: string;
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || undefined;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBanner(null);

    if (!token) {
      setBanner({ type: 'error', message: 'This reset link is invalid or incomplete.' });
      return;
    }
    if (password.length < 8) {
      setBanner({ type: 'error', message: 'Password must be at least 8 characters.' });
      return;
    }
    if (!/[0-9]/.test(password)) {
      setBanner({ type: 'error', message: 'Password must contain at least one number.' });
      return;
    }
    if (password !== confirm) {
      setBanner({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setBanner({ type: 'success', message: 'Password reset. Redirecting to sign in…' });
      setTimeout(() => router.replace('/sign-in'), 1500);
    } catch (err: unknown) {
      setBanner({ type: 'error', message: getFriendlyError(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell stats={[]}>
      <div className="relative font-body">
        <div className="absolute left-1/2 -translate-x-1/2 -top-10">
          <Image
            src="/velocity-logo.webp"
            alt="Velocity"
            width={44}
            height={46}
            className="object-contain brightness-0"
          />
        </div>

        <div className="mt-6 text-center">
          <h2 className="font-serif text-3xl font-normal text-slate-950 tracking-tight text-center mt-6 mb-2">
            Set a new password.
          </h2>
          <p className="text-sm text-slate-600">Choose a new password for your account.</p>
        </div>

        {banner && (
          <div className="mt-6">
            <Banner type={banner.type} message={banner.message} onDismiss={() => setBanner(null)} />
          </div>
        )}

        {!token ? (
          <div className="mt-6 text-center text-[13px] text-slate-500">
            Need a new link?{' '}
            <Link href="/forgot-password" className="font-semibold text-[#0f172a] hover:underline">
              Request password reset
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <span className="text-sm text-slate-400">Minimum 8 characters, at least 1 number</span>
              <div className="relative mt-2">
                <label className="sr-only">New password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:border-slate-950 focus:ring-2 focus:ring-slate-950/5 outline-none transition-all duration-200 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  aria-label="Toggle password visibility"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="sr-only">Confirm new password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm new password"
                disabled={loading}
                autoComplete="new-password"
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:border-slate-950 focus:ring-2 focus:ring-slate-950/5 outline-none transition-all duration-200 font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 text-white hover:bg-slate-900 font-medium py-3 rounded-xl transition-all duration-200 shadow-sm text-sm tracking-wide mt-2 flex items-center justify-center gap-2"
            >
              {loading ? 'Resetting...' : 'Reset password'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-slate-600">
          <Link href="/sign-in" className="text-[#0f172a] hover:underline transition hover:text-black">
            Back to sign in
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
