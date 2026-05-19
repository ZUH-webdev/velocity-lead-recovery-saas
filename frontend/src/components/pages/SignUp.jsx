"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building2, Eye, EyeOff, HeartPulse, Lock, Mail, Phone, Sparkles, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dmSerif } from './authFonts';
import AuthShell from './AuthShell';

const industryOptions = [
  'Medical Practice',
  'Urgent Care',
  'Dental Clinic',
  'Physical Therapy',
  'Behavioral Health',
  'Specialty Clinic',
  'Home Health',
  'Other Clinical Practice',
];

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
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState(industryOptions[0]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signUp } = useAuth();
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setBanner(null);
    if (!validateForm()) return;
    setLoading(true);
    try {
      await signUp({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        companyName: companyName.trim(),
        phone: phone.trim(),
        industry,
        remember: true,
      });
      setBanner({ type: 'success', message: 'Workspace created successfully. Redirecting to your dashboard.' });
      setTimeout(() => router.replace('/dashboard'), 800);
    } catch (err) {
      setBanner({ type: 'error', message: err.message || 'Failed to create account.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setBanner({ type: 'info', message: 'Google OAuth is not connected yet.' });
  };

  return (
    <AuthShell stats={stats}>
      <div className="flex items-center justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
          <HeartPulse className="h-5 w-5" />
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Create workspace
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          <Sparkles className="h-4 w-4 text-[#388BFD]" />
          Premium onboarding
        </div>
        <h1 className={`${dmSerif.className} mt-4 text-[clamp(2.2rem,5vw,3.4rem)] leading-[0.94] tracking-[-0.04em] text-slate-950`}>
          Create an account.
        </h1>
      </div>

      {banner ? (
        <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${banner.type === 'error' ? 'border-rose-100 bg-rose-50 text-rose-700' : 'border-emerald-100 bg-emerald-50 text-emerald-700'}`}>
          {banner.message}
        </div>
      ) : null}

      <form onSubmit={handleSignUp} className="mt-8 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-[6px]">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Full name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Maya Chen"
                disabled={loading}
                autoComplete="name"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-[14px] text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow,transform] duration-150 placeholder:text-slate-400 focus:border-[#388BFD] focus:outline-none focus:ring-4 focus:ring-[#388BFD]/10"
              />
            </div>
          </div>

          <div className="space-y-[6px]">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@clinic.com"
                disabled={loading}
                autoComplete="email"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-[14px] text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow,transform] duration-150 placeholder:text-slate-400 focus:border-[#388BFD] focus:outline-none focus:ring-4 focus:ring-[#388BFD]/10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-[6px]">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Company name</label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Northlake Family Clinic"
                disabled={loading}
                autoComplete="organization"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-[14px] text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow,transform] duration-150 placeholder:text-slate-400 focus:border-[#388BFD] focus:outline-none focus:ring-4 focus:ring-[#388BFD]/10"
              />
            </div>
          </div>

          <div className="space-y-[6px]">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Phone</label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                disabled={loading}
                autoComplete="tel"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-[14px] text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow,transform] duration-150 placeholder:text-slate-400 focus:border-[#388BFD] focus:outline-none focus:ring-4 focus:ring-[#388BFD]/10"
              />
            </div>
          </div>
        </div>

        <div className="space-y-[6px]">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Industry</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            disabled={loading}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-[14px] text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow,transform] duration-150 focus:border-[#388BFD] focus:outline-none focus:ring-4 focus:ring-[#388BFD]/10"
          >
            {industryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-[6px]">
          <div className="flex items-center justify-between gap-3">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Password</label>
            <span className="text-[12px] font-medium text-slate-400">Minimum 8 characters</span>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a secure password"
              disabled={loading}
              autoComplete="new-password"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-[14px] text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow,transform] duration-150 placeholder:text-slate-400 focus:border-[#388BFD] focus:outline-none focus:ring-4 focus:ring-[#388BFD]/10"
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
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F172A] px-6 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition duration-150 hover:bg-[#111c33] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creating workspace...' : 'Create account'}
          {!loading ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
      </form>

      <div className="mt-5">
        <button
          type="button"
          onClick={handleGoogle}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:border-slate-300 hover:bg-slate-50"
        >
          <span className="grid h-5 w-5 place-items-center">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path fill="#4285F4" d="M21.35 11.1h-9.18v2.96h5.27c-.23 1.38-1.49 4.05-5.27 4.05a5.86 5.86 0 0 1 0-11.71c1.69 0 2.83.72 3.48 1.34l2.37-2.29C16.51 4 14.67 3 12.17 3 7.6 3 4 6.58 4 11.01s3.6 8.01 8.17 8.01c4.78 0 7.95-3.36 7.95-8.1 0-.54-.06-.95-.13-1.38Z" />
            </svg>
          </span>
          Sign up with Google
        </button>
      </div>

      <div className="mt-6 text-center text-[13px] text-slate-500">
        Already have an account?{' '}
        <Link href="/signin" className="font-semibold text-[#388BFD] transition hover:text-[#1d6fe0]">
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
}
