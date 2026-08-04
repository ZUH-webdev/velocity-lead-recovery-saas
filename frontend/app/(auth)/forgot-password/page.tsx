'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import AuthShell from '../../../components/AuthShell';
import { api } from '../../../lib/api';
import { Banner } from '../../../components/ErrorBanner';
import { isNetworkError } from '../../../lib/errors';

interface Banner {
  type: 'error' | 'success' | 'info';
  message: string;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBanner(null);

    if (!email.trim()) {
      setBanner({ type: 'error', message: 'Email is required.' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      setSubmitted(true);
    } catch (err: unknown) {
      // Only surface an error for connectivity issues — a failed request for
      // any other reason (e.g. rate limiting) should never reveal whether the
      // email exists, so it still falls through to the same success state.
      if (isNetworkError(err)) {
        setBanner({
          type: 'error',
          message: "Can't connect right now. Please check your internet and try again.",
        });
      } else {
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
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
              Check your email.
            </h2>
            <p className="text-sm text-slate-600">
              If an account exists for <strong>{email.trim()}</strong>, we&apos;ve sent a
              password reset link. It expires in 1 hour.
            </p>
          </div>

          <div className="mt-8 text-center text-sm text-slate-600">
            <Link href="/sign-in" className="font-semibold text-[#0f172a] hover:underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

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
            Reset your password.
          </h2>
          <p className="text-sm text-slate-600">
            Enter the email on your account and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>

        {banner && (
          <div className="mt-6">
            <Banner type={banner.type} message={banner.message} onDismiss={() => setBanner(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="sr-only">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@clinic.com"
              disabled={loading}
              autoComplete="email"
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:border-slate-950 focus:ring-2 focus:ring-slate-950/5 outline-none transition-all duration-200 font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 text-white hover:bg-slate-900 font-medium py-3 rounded-xl transition-all duration-200 shadow-sm text-sm tracking-wide mt-2 flex items-center justify-center gap-2"
          >
            {loading ? 'Sending...' : 'Send reset link'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Remembered your password?{' '}
          <Link href="/sign-in" className="text-[#0f172a] hover:underline transition hover:text-black">
            Sign in
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
