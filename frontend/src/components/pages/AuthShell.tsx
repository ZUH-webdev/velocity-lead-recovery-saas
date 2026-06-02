"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Home } from 'lucide-react';

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
    <main className="bg-gradient-to-b from-slate-50 via-slate-100 to-zinc-200/50 min-h-screen w-full flex flex-col items-center justify-center p-4 relative text-slate-900">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-slate-200/40 blur-[120px] rounded-full pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-[480px] bg-white border border-slate-200/80 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] p-8 md:p-10 relative z-10"
      >
        <Link href="/" className="absolute left-4 top-4 rounded-lg p-2 text-slate-700 hover:bg-slate-50">
          <Home className="h-5 w-5" />
        </Link>
        {children}
      </motion.div>
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
