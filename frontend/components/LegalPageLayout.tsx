'use client';

import type { ReactNode } from 'react';

interface LegalPageLayoutProps {
  badge: string;
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  children: ReactNode;
}

export default function LegalPageLayout({
  badge,
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div
      style={{ paddingTop: 'var(--header-height)' }}
      className="min-h-screen bg-white antialiased"
    >
      {/* Hero header */}
      <div className="border-b border-[#1c1c1e] bg-[#09090b] px-[clamp(24px,6vw,80px)] py-[clamp(48px,8vw,80px)]">
        <div className="mx-auto max-w-[760px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-[20px] border border-[#2a2a2a] bg-[#1c1c1e] px-[14px] py-[5px]">
            <span className="h-[6px] w-[6px] rounded-full bg-[#c9a97a]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#a1a1aa]">{badge}</span>
          </div>

          <h1 className="mb-3 text-[clamp(28px,5vw,42px)] font-bold leading-[1.15] tracking-[-0.5px] text-white">
            {title}
          </h1>

          {subtitle ? (
            <p className="mb-4 text-[clamp(14px,2vw,16px)] leading-[1.6] text-[#71717a]">{subtitle}</p>
          ) : null}

          {lastUpdated ? <p className="m-0 text-xs italic text-[#52525b]">Last updated: {lastUpdated}</p> : null}
        </div>
      </div>

      {/* Content area */}
      <div className="mx-auto max-w-[760px] px-[clamp(24px,6vw,40px)] py-[clamp(40px,6vw,64px)]">{children}</div>
    </div>
  );
}
