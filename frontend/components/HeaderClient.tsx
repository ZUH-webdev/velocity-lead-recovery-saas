"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HeaderClient() {
  const router = useRouter();

  return (
    <header className="fixed top-4 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 rounded-2xl mx-6" style={{ background: 'transparent' }}>
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-sm px-3 py-2 rounded-md">Back</button>
      </div>

      <div className="flex items-center gap-4">
        <Image src="/velocity-logo.webp" alt="Velocity" width={36} height={36} />
      </div>
    </header>
  );
}
