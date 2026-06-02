"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Mail, Shield,} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthShell from './AuthShell';

interface Banner {
  type: 'error' | 'success' | 'info';
  message: string;
}

const stats = [
  { label: 'Recovered revenue', value: '$4.2M', subtext: 'Annual run rate restored' },
  { label: 'Answer rate', value: '92%', subtext: 'Live clinic coverage' },
  { label: 'Missed calls captured', value: '14', subtext: 'Auto saved today' },
];

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBanner(null);

    if (!email.trim() || !password.trim()) {
      setBanner({ type: 'error', message: 'Email and password are required.' });
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      setBanner({ type: 'success', message: 'Signed in successfully. Redirecting to your workspace.' });
      setTimeout(() => router.replace('/dashboard'), 700);
    } catch (err: unknown) {
      setBanner({ type: 'error', message: err instanceof Error ? err.message : 'Failed to sign in.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setBanner({ type: 'info', message: 'Google OAuth is not connected yet. Keep the button in the layout for the final integration.' });
  };

  return (
    <AuthShell stats={stats}>
      <div className="relative font-body">
        <div className="absolute left-1/2 -translate-x-1/2 -top-10">
          <Image src="/velocity-logo.webp" alt="Velocity" width={44} height={46} className="object-contain brightness-0" />
        </div>

        <div className="mt-6 text-center">
          <h2 className="font-serif text-3xl font-normal text-slate-950 tracking-tight text-center mt-6 mb-2">Welcome back.</h2>
          <p className="text-sm text-slate-600">Resume your recovery workflow and keep every high-intent patient conversation moving.</p>
          <div className="mt-2 text-sm text-slate-500">
            New here? <Link href="/signup" className="text-slate-950 font-medium underline">Create account</Link>
          </div>
        </div>

        {banner ? (
          <div className={`mt-6 rounded-lg px-4 py-3 text-sm ${banner.type === 'error' ? 'border border-rose-100 bg-rose-50 text-rose-700' : banner.type === 'success' ? 'border border-emerald-100 bg-emerald-50 text-emerald-700' : 'border border-sky-100 bg-sky-50 text-sky-700'}`}>
            {banner.message}
          </div>
        ) : null}

        <form onSubmit={handleSignIn} className="mt-6 space-y-4">
          <div>
            <label className="sr-only">Email address</label>
            <div className="relative">
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
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="sr-only">Password</label>
              <Link href="#" className="text-sm text-slate-600 hover:underline">Forgot password?</Link>
            </div>
            <div className="relative mt-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={loading}
                autoComplete="current-password"
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:border-slate-950 focus:ring-2 focus:ring-slate-950/5 outline-none transition-all duration-200 font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
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
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading ? <ArrowRight className="h-4 w-4" /> : null}
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
        <span className="grid h-5 w-5 place-items-center">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path fill="#4285F4" d="M21.35 11.1h-9.18v2.96h5.27c-.23 1.38-1.49 4.05-5.27 4.05a5.86 5.86 0 0 1 0-11.71c1.69 0 2.83.72 3.48 1.34l2.37-2.29C16.51 4 14.67 3 12.17 3 7.6 3 4 6.58 4 11.01s3.6 8.01 8.17 8.01c4.78 0 7.95-3.36 7.95-8.1 0-.54-.06-.95-.13-1.38Z" />
          </svg>
        </span>
        Sign in with Google
      </button>

      <div className="mt-6 text-center text-[13px] text-slate-500">
        New here?{' '}
        <Link href="/signup" className="font-semibold text-[#0f172a] transition hover:text-black">
          Create account
        </Link>
      </div>
      </div>
    </AuthShell>
  );
}
