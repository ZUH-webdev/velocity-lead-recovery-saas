"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#e0e5ec]">
      <div className="animate-pulse text-sm font-medium text-gray-500">
        Loading Velocity Engine...
      </div>
    </div>
  );
}