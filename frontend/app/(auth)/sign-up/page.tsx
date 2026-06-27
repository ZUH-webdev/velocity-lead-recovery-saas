'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthShell from '../../../components/AuthShell';
import { api } from '../../../lib/api';

interface Banner {
  type: 'error' | 'success' | 'info';
  message: string;
}

const stats = [
  { label: 'Follow-up coverage', value: '98%', subtext: 'AI outreach across the workday' },
  { label: 'Recovery lift', value: '3.1x', subtext: 'Faster missed-call conversion' },
  { label: 'Live conversations', value: '24/7', subtext: 'Inbound intent never sleeps' },
];

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!fullName.trim()) {
      setBanner({ type: 'error', message: 'Full name is required.' });
      return false;
    }
    if (!email.trim()) {
      setBanner({ type: 'error', message: 'Email is required.' });
      return false;
    }
    if (password.length < 8) {
      setBanner({ type: 'error', message: 'Password must be at least 8 characters.' });
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBanner(null);
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.post('/auth/register', {
        email: email.trim(),
        password,
        fullName: fullName.trim(),
      });
      setBanner({ type: 'success', message: 'Check your email to verify your account.' });
    } catch (err: unknown) {
      setBanner({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to create account.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setBanner({ type: 'info', message: 'Google OAuth is not connected yet.' });
  };

  return (
    <AuthShell stats={stats}>
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
            Create your account.
          </h2>
          <p className="text-sm text-slate-600">
            Launch your workspace in minutes and turn every missed call into a revenue opportunity.
          </p>
        </div>

        {banner && (
          <div className={`mt-6 rounded-lg px-4 py-3 text-sm ${
            banner.type === 'error'   ? 'border border-rose-100 bg-rose-50 text-rose-700' :
            banner.type === 'success' ? 'border border-emerald-100 bg-emerald-50 text-emerald-700' :
                                        'border border-sky-100 bg-sky-50 text-sky-700'
          }`}>
            {banner.message}
          </div>
        )}

        <form onSubmit={handleSignUp} className="mt-6 space-y-4">
          <div>
            <label className="sr-only">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Dr. Maya Chen"
              disabled={loading}
              autoComplete="name"
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:border-slate-950 focus:ring-2 focus:ring-slate-950/5 outline-none transition-all duration-200 font-sans"
            />
          </div>

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

          <div>
            <span className="text-sm text-slate-400">Minimum 8 characters</span>
            <div className="relative mt-2">
              <label className="sr-only">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 text-white hover:bg-slate-900 font-medium py-3 rounded-xl transition-all duration-200 shadow-sm text-sm tracking-wide mt-2 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating account...' : 'Create account'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="flex h-[52px] w-full items-center justify-center gap-3 rounded-[10px] border border-[#dfe4ea] bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-[0_6px_18px_rgba(15,23,42,0.04)] transition hover:border-slate-300 hover:bg-slate-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" className="shrink-0">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/signin" className="text-[#0f172a] hover:underline transition hover:text-black">
            Sign in
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}