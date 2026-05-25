"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Globe } from '../ui/Globe';

interface StatItem {
  label: string;
  value: string;
  subtext: string;
}

interface Props {
  children: React.ReactNode;
  stats?: StatItem[];
}

export default function AuthShell({ children, stats = [] }: Props) {
  return (
    <main className="auth-shell relative min-h-screen overflow-hidden bg-[#050B17] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_20%),radial-gradient(circle_at_50%_100%,rgba(56,139,253,0.08),transparent_26%)]" />
      <div className="relative grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative overflow-hidden border-b border-white/10 bg-[#030712] px-6 py-6 sm:px-8 lg:border-b-0 lg:border-r lg:border-white/10 lg:px-12 lg:py-6">
          <div className="relative flex flex-col">
            <Link href="/" className="flex items-center gap-3 self-start">
              <img src="/velocity-logo.webp" alt="Velocity" className="h-9 w-auto" />
              <span className="text-[15px] font-semibold tracking-[0.26em] text-white">Velocity</span>
            </Link>

            <div className="flex items-start justify-start pt-6 lg:pt-8">
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                className="relative w-full max-w-[520px]"
              >
                  <Globe />
                </motion.div>
            </div>

            {/* Stats cards removed from auth UI. Hover tooltips on globe markers will show short status. */}
          </div>
        </section>

        <section className="flex items-start justify-center px-5 pt-6 sm:px-8 lg:px-10 lg:pt-8">
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="font-body w-full max-w-[560px] rounded-[34px] border border-slate-200/80 bg-white p-6 text-slate-900 shadow-[0_30px_120px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-8 lg:p-10"
          >
            {children}
          </motion.div>
        </section>
      </div>
    </main>
  );
}

// Helper: convert lon/lat to overlay percentage position inside circle
export function latLonToPercent(lat, lon) {
  // left: 50% + (lon / 360) * 100
  const left = 50 + (lon / 360) * 100;
  // top: 50% - (lat / 180) * 100
  const top = 50 - (lat / 180) * 100;
  return { left, top };
}
