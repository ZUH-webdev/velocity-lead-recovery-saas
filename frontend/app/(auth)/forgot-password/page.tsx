'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import AuthShell from '../../../components/AuthShell';
import { api } from '../../../lib/api';

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
    } catch {
      // Always show the same success state — never reveal whether the email exists.
      setSubmitted(true);
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
          <div
            className={`mt-6 rounded-lg px-4 py-3 text-sm ${
              banner.type === 'error'
                ? 'border border-rose-100 bg-rose-50 text-rose-700'
                : 'border border-sky-100 bg-sky-50 text-sky-700'
            }`}
          >
            {banner.message}
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
