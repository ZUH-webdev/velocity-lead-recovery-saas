"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Mail, Shield,} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dmSans, dmSerif } from './authFonts';
import AuthShell from './AuthShell';

const stats = [
  { label: 'Recovered revenue', value: '$4.2M', subtext: 'Annual run rate restored' },
  { label: 'Answer rate', value: '92%', subtext: 'Live clinic coverage' },
  { label: 'Missed calls captured', value: '14', subtext: 'Auto saved today' },
];

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async (e) => {
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
    } catch (err) {
      setBanner({ type: 'error', message: err.message || 'Failed to sign in.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setBanner({ type: 'info', message: 'Google OAuth is not connected yet. Keep the button in the layout for the final integration.' });
  };

  return (
    <AuthShell stats={stats}>
      <div className={dmSans.className}>
      <div className="flex items-center justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
          <Shield className="h-5 w-5" />
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Secure access
        </div>
      </div>

      <div className="mt-8">
        {/* <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          <Sparkles className="h-4 w-4 text-[#388BFD]" />
          Premium login
        </div> */}
        <h1 className={`${dmSerif.className} mt-4 whitespace-nowrap text-[clamp(2.35rem,5vw,3.75rem)] font-normal leading-[0.9] tracking-[-0.05em] text-slate-950`}>
          Welcome back.
        </h1>
        {/* <p className="mt-4 max-w-[34rem] text-[15px] leading-8 text-slate-500">
          Sign in to reopen your clinic workflow, recover every missed lead, and keep high-intent conversations moving.
        </p> */}
      </div>

      {banner ? (
        <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${banner.type === 'error' ? 'border-rose-100 bg-rose-50 text-rose-700' : 'border-emerald-100 bg-emerald-50 text-emerald-700'}`}>
          {banner.message}
        </div>
      ) : null}

      <form onSubmit={handleSignIn} className="mt-8 space-y-5">
        <div className="space-y-[6px]">
          <label className="block text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500">Email address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@clinic.com"
              disabled={loading}
              autoComplete="email"
              className="h-12 w-full rounded-[18px] border border-slate-200 bg-white py-3 pl-11 pr-4 text-[15px] text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow,transform] duration-150 placeholder:text-slate-400 focus:border-[#388BFD] focus:outline-none focus:ring-4 focus:ring-[#388BFD]/10"
            />
          </div>
        </div>

        <div className="space-y-[6px]">
          <div className="flex items-center justify-between gap-3">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500">Password</label>
            <Link href="#" className="text-[12px] font-semibold text-[#388BFD] transition hover:text-[#1d6fe0]">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              autoComplete="current-password"
              className="h-12 w-full rounded-[18px] border border-slate-200 bg-white px-4 pr-12 text-[15px] text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow,transform] duration-150 placeholder:text-slate-400 focus:border-[#388BFD] focus:outline-none focus:ring-4 focus:ring-[#388BFD]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
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
          className="flex h-12 w-full items-center justify-center gap-2 rounded-[18px] bg-[#0F172A] px-6 text-[14px] font-semibold tracking-[0.02em] text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition duration-150 hover:bg-[#111c33] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
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
        className="flex h-12 w-full items-center justify-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:border-slate-300 hover:bg-slate-50"
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
        <Link href="/signup" className="font-semibold text-[#388BFD] transition hover:text-[#1d6fe0]">
          Create account
        </Link>
      </div>
      </div>
    </AuthShell>
  );
}
