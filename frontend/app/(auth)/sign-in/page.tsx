'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Mail, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import AuthShell from '../../../components/AuthShell';

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

  const { login, user } = useAuth();
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
      const loggedInUser = await login(email.trim(), password);
      setBanner({ type: 'success', message: 'Signed in successfully. Redirecting…' });

      // Use returned user — state update is async and won't be ready yet
      if (!loggedInUser?.hasOnboarded) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      setBanner({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to sign in.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setBanner({
      type: 'info',
      message:
        'Google OAuth is not connected yet. Keep the button in the layout for the final integration.',
    });
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
            Welcome back.
          </h2>
          <p className="text-sm text-slate-600">
            Resume your recovery workflow and keep every high-intent patient conversation
            moving.
          </p>
        </div>

        {banner ? (
          <div
            className={`mt-6 rounded-lg px-4 py-3 text-sm ${banner.type === 'error' ? 'border border-rose-100 bg-rose-50 text-rose-700' : banner.type === 'success' ? 'border border-emerald-100 bg-emerald-50 text-emerald-700' : 'border border-sky-100 bg-sky-50 text-sky-700'}`}
          >
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
              <Link href="#" className="text-sm text-slate-600 hover:underline">
                Forgot password?
              </Link>
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
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
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
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            or
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="flex h-[52px] w-full items-center justify-center gap-3 rounded-[10px] border border-[#dfe4ea] bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-[0_6px_18px_rgba(15,23,42,0.04)] transition hover:border-slate-300 hover:bg-slate-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="20"
            height="20"
            className="shrink-0"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          Sign in with Google
        </button>

        <div className="mt-6 text-center text-[13px] text-slate-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="text-[#0f172a] hover:underline transition hover:text-black"
          >
            Create account
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
