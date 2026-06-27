'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, MailWarning, ShieldCheck } from 'lucide-react';
import { api } from '../../../lib/api';
import AuthShell from '../../../components/AuthShell';
import { setRefreshToken, setToken } from '../../../lib/auth';

interface Banner {
  type: 'error' | 'success' | 'info';
  message: string;
}

interface Props {
  token?: string;
}

export default function VerifyClient({ token }: Props) {
  const router = useRouter();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setBanner({
        type: 'info',
        message: 'This verification link is incomplete. Please sign in to continue.',
      });
      return;
    }

    let active = true;

    const verifyAccount = async () => {
      setLoading(true);
      try {
        const res = await api.post(`/auth/verify?token=${token}`);
        if (!active) return;

        const payload = res.data?.data;

        // Persist tokens so AuthContext picks them up on next load
        if (payload?.accessToken) {
          setToken(payload.accessToken);
          setRefreshToken(payload.refreshToken);
        }

        setBanner({ type: 'success', message: 'Email verified! Redirecting…' });

        setTimeout(() => {
          // New users have never onboarded
          router.replace('/onboarding');
        }, 1500);
      } catch {
        if (!active) return;
        setBanner({ type: 'error', message: 'Invalid or expired verification link.' });
      } finally {
        if (active) setLoading(false);
      }
    };

    void verifyAccount();

    return () => {
      active = false;
    };
  }, [router, token]);

  const StatusIcon =
    banner?.type === 'success'
      ? CheckCircle2
      : banner?.type === 'error'
        ? MailWarning
        : ShieldCheck;

  return (
    <AuthShell stats={[]}>
      <div className="font-body">
        <div className="flex items-center justify-between">
          <div className="grid h-12 w-12 place-items-center rounded-[14px] border border-slate-200 bg-white text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <StatusIcon className="h-5 w-5" />
          </div>
          <div className="font-mono-ui rounded-full border border-[#e6eaef] bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
            Account verification
          </div>
        </div>

        <div className="mt-8">
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.1em] text-[#6b7280]">
            Verification flow
          </p>
          <h1 className="font-hero mt-3 whitespace-nowrap text-[clamp(2.25rem,5vw,3.45rem)] font-[700] leading-[0.95] tracking-[-0.03em] text-[#0f172a]">
            Verify your account.
          </h1>
          <p className="mt-4 max-w-[34rem] text-[15px] leading-7 text-slate-600">
            Complete the verification link from your email, then you&apos;ll be routed
            into your workspace.
          </p>
        </div>

        {banner ? (
          <div
            className={`mt-6 rounded-[16px] border px-4 py-3 text-sm ${banner.type === 'error' ? 'border-rose-100 bg-rose-50 text-rose-700' : banner.type === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-sky-100 bg-sky-50 text-sky-700'}`}
          >
            {banner.message}
          </div>
        ) : null}

        <div className="mt-8 space-y-4">
          <div className="rounded-[12px] border border-[#e6eaef] bg-white px-4 py-4 text-sm leading-7 text-slate-600 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
            {loading
              ? 'Checking verification status...'
              : 'If you arrived here from a verification email, this page will finish the flow for you.'}
          </div>

          <button
            type="button"
            onClick={() => router.replace('/sign-in')}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#0f172a] px-6 text-[14px] font-semibold tracking-[0.02em] text-white shadow-[0_10px_26px_rgba(15,23,42,0.18)] transition duration-150 hover:bg-black active:scale-[0.99]"
          >
            Go to sign in
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="text-center text-[13px] text-slate-500">
            Need a new link?{' '}
            <Link
              href="/sign-up"
              className="font-semibold text-[#0f172a] transition hover:text-black"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
