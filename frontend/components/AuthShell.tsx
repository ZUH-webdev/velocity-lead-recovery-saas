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
    <main className="bg-[#fafafa] min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 sm:p-6 relative text-[#09090b]">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-[440px] bg-white border border-[#e4e4e7] rounded-[20px] shadow-[0_20px_60px_rgba(9,9,11,0.06)] p-8 sm:p-9 md:p-10 relative z-10"
      >
        <Link
          href="/"
          className="absolute left-4 top-4 rounded-full p-2 text-[#71717a] transition-colors hover:bg-[#fafafa] hover:text-[#09090b]"
        >
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
