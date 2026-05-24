"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, MailWarning, ShieldCheck } from 'lucide-react';
import { authService } from '../../src/services/authService';
import AuthShell from '../../src/components/pages/AuthShell';
import { dmSans, dmSerif } from '../../src/components/pages/authFonts';

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
        await authService.verify({ token });

        if (!active) return;

        setBanner({ type: 'success', message: 'Verification complete. Redirecting to your dashboard.' });
        setTimeout(() => router.replace('/dashboard'), 900);
      } catch (error: unknown) {
        if (!active) return;

        setBanner({
          type: 'error',
          message: error instanceof Error ? error.message : 'Unable to complete verification right now.',
        });
      } finally {
        if (active) setLoading(false);
      }
    };

    void verifyAccount();

    return () => {
      active = false;
    };
  }, [router, token]);

  const StatusIcon = banner?.type === 'success' ? CheckCircle2 : banner?.type === 'error' ? MailWarning : ShieldCheck;

  return (
    <AuthShell stats={[]}>
      <div className={dmSans.className}>
        <div className="flex items-center justify-between">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            <StatusIcon className="h-5 w-5" />
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Account verification
          </div>
        </div>

        <div className="mt-8">
          <h1 className={`${dmSerif.className} mt-4 whitespace-nowrap text-[clamp(2.35rem,5vw,3.75rem)] font-normal leading-[0.9] tracking-[-0.05em] text-slate-950`}>
            Verify your account.
          </h1>
          <p className="mt-4 max-w-[34rem] text-[15px] leading-8 text-slate-500">
            Complete the verification link from your email, then you&apos;ll be routed into your workspace.
          </p>
        </div>

        {banner ? (
          <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${banner.type === 'error' ? 'border-rose-100 bg-rose-50 text-rose-700' : banner.type === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-sky-100 bg-sky-50 text-sky-700'}`}>
            {banner.message}
          </div>
        ) : null}

        <div className="mt-8 space-y-4">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
            {loading ? 'Checking verification status...' : 'If you arrived here from a verification email, this page will finish the flow for you.'}
          </div>

          <button
            type="button"
            onClick={() => router.replace('/signin')}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[18px] bg-[#0F172A] px-6 text-[14px] font-semibold tracking-[0.02em] text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition duration-150 hover:bg-[#111c33] active:scale-[0.99]"
          >
            Go to sign in
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="text-center text-[13px] text-slate-500">
            Need a new link?{' '}
            <Link href="/signup" className="font-semibold text-[#388BFD] transition hover:text-[#1d6fe0]">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}