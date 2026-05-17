"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const dashboardMetrics = [
  { label: 'Response speed', value: '< 2 min' },
  { label: 'Live leads', value: '128' },
  { label: 'Booking rate', value: '86%' },
];

const trustPoints = ['JWT-backed sessions', 'Clinical workflow ready', 'Secure workspace access'];

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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10 text-slate-900 sm:px-6 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <section className="relative hidden lg:flex lg:items-center lg:justify-center">
          <div className="relative w-full max-w-2xl">
            <div className="rounded-3xl bg-gradient-to-b from-white to-blue-50/50 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.06)] border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-100 bg-white">
                    <Image src="/velocity-logo.webp" alt="Velocity" width={36} height={36} className="h-8 w-8 object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Velocity</p>
                    <p className="text-xs text-slate-500">Clinical recovery workspace</p>
                  </div>
                </div>
                <div className="text-sm text-slate-500">Workspace preview</div>
              </div>

              <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase tracking-[0.12em]">Company Performance</p>
                  <p className="mt-3 text-3xl font-extrabold text-slate-900">$11,656,060</p>
                  <p className="mt-2 text-sm text-slate-500">Total claims paid</p>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase tracking-[0.12em]">Bookings</p>
                  <p className="mt-3 text-3xl font-extrabold text-slate-900">86%</p>
                  <p className="mt-2 text-sm text-slate-500">Booking rate (30d)</p>
                </div>

                <div className="md:col-span-2 mt-2 rounded-2xl bg-gradient-to-r from-slate-50 to-white p-4 border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-500 uppercase tracking-[0.12em]">Live leads</p>
                  <div className="mt-3 flex items-baseline gap-3">
                    <p className="text-2xl font-semibold text-slate-900">128</p>
                    <p className="text-sm text-slate-500">Active conversations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.32, ease: 'circOut' }}
            className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.06)] border border-slate-100 xl:p-10"
          >
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-xl bg-slate-50 grid place-items-center border border-slate-100">
                <svg className="h-7 w-7 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            <div className="text-center mt-4 mb-6">
              <h3 className="text-3xl font-semibold text-slate-900">Welcome back</h3>
              <p className="mt-2 text-sm text-slate-500">Sign in to your Velocity workspace</p>
            </div>

            <AnimatePresence>
              {banner ? (
                <motion.div
                  key={banner.message}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  className={`mb-4 rounded-lg px-4 py-3 text-sm ${banner.type === 'error' ? 'bg-rose-50 border border-rose-100 text-rose-700' : 'bg-emerald-50 border border-emerald-100 text-emerald-700'}`}
                >
                  {banner.message}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="flex justify-between items-center text-xs text-slate-600">
                  <span>Email address</span>
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@clinic.com"
                    disabled={loading}
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="flex justify-between items-center text-xs text-slate-600">
                  <span>Password</span>
                </label>
                <div className="mt-2 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-3 text-slate-500"
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
                className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogle}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
              >
                <span className="h-5 w-5 grid place-items-center rounded-full bg-white ring-1 ring-slate-200">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                    <path fill="#4285F4" d="M21.35 11.1h-9.18v2.96h5.27c-.23 1.38-1.49 4.05-5.27 4.05a5.86 5.86 0 0 1 0-11.71c1.69 0 2.83.72 3.48 1.34l2.37-2.29C16.51 4 14.67 3 12.17 3 7.6 3 4 6.58 4 11.01s3.6 8.01 8.17 8.01c4.78 0 7.95-3.36 7.95-8.1 0-.54-.06-.95-.13-1.38Z" />
                  </svg>
                </span>
                Sign in with Google
              </button>
            </div>

            <div className="mt-5 text-center text-sm text-slate-500">
              New here? <Link href="/signup" className="font-medium text-slate-900">Create account</Link>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
