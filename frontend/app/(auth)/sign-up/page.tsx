'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthShell from '../../../components/AuthShell';
import { api } from '../../../lib/api';
import { Banner } from '../../../components/ErrorBanner';
import { getFriendlyError } from '../../../lib/errors';

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
  const [registered, setRegistered] = useState(false);
  const [resending, setResending] = useState(false);

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
    if (password.length > 72) {
      setBanner({ type: 'error', message: 'Password cannot exceed 72 characters.' });
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setBanner({ type: 'error', message: 'Password must contain at least one number.' });
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
      setRegistered(true);
    } catch (err: unknown) {
      setBanner({ type: 'error', message: getFriendlyError(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-verification', { email: email.trim() });
      setBanner({
        type: 'success',
        message: 'A new verification link has been sent. Please check your inbox.',
      });
    } catch {
      // Silent — never reveal whether the email exists
      setBanner({
        type: 'success',
        message: 'A new verification link has been sent. Please check your inbox.',
      });
    } finally {
      setResending(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <AuthShell stats={stats}>
      <div className="relative font-body">
        <div className="flex justify-center">
          <Image
            src="/velocity-logo.webp"
            alt="Velocity"
            width={40}
            height={42}
            className="object-contain brightness-0"
          />
        </div>

        <div className="mt-6 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#09090b] tracking-tight leading-tight">
            Create your account.
          </h2>
          <p className="mt-3 text-sm text-[#71717a] leading-relaxed">
            Launch your workspace in minutes and turn every missed call into a revenue opportunity.
          </p>
        </div>

        {banner && (
          <div className="mt-6">
            <Banner type={banner.type} message={banner.message} onDismiss={() => setBanner(null)} />
            {registered && (
              <p className="-mt-2 text-sm text-[#71717a]">
                Didn&apos;t receive the email?{' '}
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resending}
                  className="font-semibold text-[#c9a97a] underline transition-colors hover:text-[#b8935e] disabled:opacity-60"
                >
                  {resending ? 'Sending...' : 'Resend verification email'}
                </button>
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSignUp} className="mt-8 space-y-4">
          <div>
            <label className="sr-only">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Dr. Maya Chen"
              disabled={loading}
              autoComplete="name"
              className="h-[52px] w-full bg-white border border-[#e4e4e7] text-[#09090b] rounded-full px-5 text-sm placeholder:text-[#a1a1aa] focus:border-[#09090b] focus:ring-2 focus:ring-[#09090b]/5 outline-none transition-all duration-200 font-sans"
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
              className="h-[52px] w-full bg-white border border-[#e4e4e7] text-[#09090b] rounded-full px-5 text-sm placeholder:text-[#a1a1aa] focus:border-[#09090b] focus:ring-2 focus:ring-[#09090b]/5 outline-none transition-all duration-200 font-sans"
            />
          </div>

          <div>
            <span className="px-1 text-sm text-[#a1a1aa]">Minimum 8 characters</span>
            <div className="relative mt-2">
              <label className="sr-only">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                disabled={loading}
                autoComplete="new-password"
                className="h-[52px] w-full bg-white border border-[#e4e4e7] text-[#09090b] rounded-full pl-5 pr-12 text-sm placeholder:text-[#a1a1aa] focus:border-[#09090b] focus:ring-2 focus:ring-[#09090b]/5 outline-none transition-all duration-200 font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a1a1aa] transition-colors hover:text-[#71717a]"
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
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#09090b] text-white text-sm font-medium tracking-wide transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 mt-2"
          >
            {loading ? 'Creating account...' : 'Create account'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e4e4e7]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a1a1aa]">or</span>
          <div className="h-px flex-1 bg-[#e4e4e7]" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="flex h-[52px] w-full items-center justify-center gap-3 rounded-full border border-[#e4e4e7] bg-white px-4 text-[14px] font-semibold text-[#09090b] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition hover:bg-[#fafafa]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" className="shrink-0">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center text-sm text-[#71717a]">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="font-medium text-[#c9a97a] transition-colors hover:text-[#b8935e]"
          >
            Sign in
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}