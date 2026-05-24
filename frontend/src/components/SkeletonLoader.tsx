import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-5 rounded-xl bg-white border border-slate-200 shadow-elite-sm"
  >
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-skeleton rounded-lg w-3/4 animate-skeleton-loading" />
          <div className="h-4 bg-skeleton rounded-lg w-1/2 animate-skeleton-loading" />
        </div>
        <div className="h-8 w-12 bg-skeleton rounded-lg animate-skeleton-loading" />
      </div>

      {/* Badge skeleton */}
      <div className="flex gap-2">
        <div className="h-7 w-24 bg-skeleton rounded-full animate-skeleton-loading" />
        <div className="h-7 w-20 bg-skeleton rounded-full animate-skeleton-loading" />
      </div>

      {/* Footer skeleton */}
      <div className="pt-3 border-t border-slate-200 flex justify-between">
        <div className="h-4 w-16 bg-skeleton rounded animate-skeleton-loading" />
        <div className="h-4 w-8 bg-skeleton rounded animate-skeleton-loading" />
      </div>
    </div>
  </motion.div>
);

export const SkeletonStat = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-4 rounded-lg bg-white border border-slate-200 shadow-elite-sm"
  >
    <div className="space-y-3">
      <div className="h-4 w-1/2 bg-skeleton rounded animate-skeleton-loading" />
      <div className="h-8 w-3/4 bg-skeleton rounded animate-skeleton-loading" />
    </div>
  </motion.div>
);

interface SkeletonContainerProps {
  count?: number;
}

export const SkeletonContainer = ({ count = 6 }: SkeletonContainerProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
