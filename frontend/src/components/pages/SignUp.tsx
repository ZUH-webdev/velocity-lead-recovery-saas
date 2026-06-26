"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building2, Eye, EyeOff, HeartPulse, Lock, Mail, User } from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import AuthShell from './AuthShell';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const validateForm = () => {
    if (!companyName.trim()) {
      setBanner({ type: 'error', message: 'Company name is required.' });
      return false;
    }
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
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
        })
      });
      setBanner({ type: 'success', message: 'Check your email to verify your account.' });
    } catch (err: unknown) {
      setBanner({ type: 'error', message: err instanceof Error ? err.message : 'Failed to create account.' });
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
          <Image src="/velocity-logo.webp" alt="Velocity" width={44} height={46} className="object-contain brightness-0" />
        </div>

        <div className="mt-6 text-center">
          <h2 className="font-serif text-3xl font-normal text-slate-950 tracking-tight text-center mt-6 mb-2">Create your workspace.</h2>
          <p className="text-sm text-slate-600">Launch your workspace in minutes and turn every missed call into revenue opportunities.</p>
        </div>

        {banner ? (
          <div className={`mt-6 rounded-lg px-4 py-3 text-sm ${banner.type === 'error' ? 'border border-rose-100 bg-rose-50 text-rose-700' : banner.type === 'success' ? 'border border-emerald-100 bg-emerald-50 text-emerald-700' : 'border border-sky-100 bg-sky-50 text-sky-700'}`}>
            {banner.message}
          </div>
        ) : null}

        <form onSubmit={handleSignUp} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          </div>

          <div>
            <label className="sr-only">Company name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Northlake Family Clinic"
              disabled={loading}
              autoComplete="organization"
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:border-slate-950 focus:ring-2 focus:ring-slate-950/5 outline-none transition-all duration-200 font-sans"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="sr-only">Password</label>
              <span className="text-sm text-slate-400">Minimum 8 characters</span>
            </div>
            <div className="relative mt-2">
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
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                aria-label="Toggle password visibility"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="sr-only">Phone</label>
              <input type="tel" placeholder="(555) 555-5555" className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:border-slate-950 focus:ring-2 focus:ring-slate-950/5 outline-none transition-all duration-200 font-sans" />
            </div>
            <div>
              <label className="sr-only">Industry</label>
              <select className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:border-slate-950 focus:ring-2 focus:ring-slate-950/5 outline-none transition-all duration-200 font-sans">
                <option value="healthcare">Healthcare</option>
                <option value="dental">Dental</option>
                <option value="vet">Veterinary</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 text-white hover:bg-slate-900 font-medium py-3 rounded-xl transition-all duration-200 shadow-sm text-sm tracking-wide mt-2 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating workspace...' : 'Create account'}
            {!loading ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium py-3 rounded-xl text-sm transition-all"
          >
            <span className="grid h-5 w-5 place-items-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path fill="#4285F4" d="M21.35 11.1h-9.18v2.96h5.27c-.23 1.38-1.49 4.05-5.27 4.05a5.86 5.86 0 0 1 0-11.71c1.69 0 2.83.72 3.48 1.34l2.37-2.29C16.51 4 14.67 3 12.17 3 7.6 3 4 6.58 4 11.01s3.6 8.01 8.17 8.01c4.78 0 7.95-3.36 7.95-8.1 0-.54-.06-.95-.13-1.38Z" />
              </svg>
            </span>
            Sign up with Google
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/signin" className="font-medium text-slate-950 underline">Sign in</Link>
        </div>
      </div>
    </AuthShell>
  );
}
