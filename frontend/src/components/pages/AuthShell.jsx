"use client";

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Globe } from '../ui/Globe';

export default function AuthShell({ children, stats = [] }) {
  return (
    <main className="auth-shell relative min-h-screen overflow-hidden bg-[#050B17] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_20%),radial-gradient(circle_at_50%_100%,rgba(56,139,253,0.08),transparent_26%)]" />
      <div className="relative grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative overflow-hidden border-b border-white/10 bg-[#030712] px-6 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:border-white/10 lg:px-12 lg:py-10">
          <div className="relative flex h-full min-h-screen flex-col">
            <div className="flex items-center gap-3">
              <img src="/velocity-logo.webp" alt="Velocity" className="h-9 w-auto" />
              <span className="text-[15px] font-semibold tracking-[0.26em] text-white">Velocity</span>
            </div>

            <div className="flex flex-1 items-center justify-center py-10 lg:py-14">
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                className="relative h-[min(72vw,620px)] w-full max-w-[620px]"
              >
                <Globe />
              </motion.div>
            </div>

            {stats.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
                className="grid gap-3 pb-1 sm:grid-cols-2 xl:grid-cols-3"
              >
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="relative overflow-hidden rounded-3xl border border-white/6 bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-4 shadow-[0_30px_60px_rgba(2,6,23,0.6)] backdrop-blur-lg flex flex-col items-center justify-center min-h-[100px]"
                  >
                    <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)' }} />
                    <div className="relative">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/50 text-center">
                        {stat.label}
                      </div>
                      <div className="mt-2 text-[clamp(1.9rem,4vw,2.2rem)] font-extrabold leading-none tracking-[-0.03em] bg-clip-text text-transparent bg-gradient-to-b from-[#9bd8ff] to-[#6aa9ff] text-center">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-[12px] leading-5 text-white/40 text-center">{stat.subtext}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : null}
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full max-w-[560px] rounded-[32px] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.95)_100%)] p-6 text-slate-900 shadow-[0_28px_120px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:p-8 lg:p-10"
          >
            {children}
          </motion.div>
        </section>
      </div>
    </main>
  );
}
