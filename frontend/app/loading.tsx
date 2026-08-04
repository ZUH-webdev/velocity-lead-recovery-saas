import { PhoneOff } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-4 py-16 sm:px-6">
      <style>{`
        @keyframes velocity-loading-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes velocity-loading-ring {
          0% { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes velocity-loading-dot {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-4px); }
        }
        .vload-icon {
          animation: velocity-loading-pulse 1.6s ease-in-out infinite;
        }
        .vload-ring {
          animation: velocity-loading-ring 1.8s ease-out infinite;
        }
        .vload-ring-delay {
          animation-delay: 0.5s;
        }
        .vload-dot {
          animation: velocity-loading-dot 1.4s ease-in-out infinite;
        }
        .vload-dot-1 { animation-delay: 0s; }
        .vload-dot-2 { animation-delay: 0.15s; }
        .vload-dot-3 { animation-delay: 0.3s; }
        @media (prefers-reduced-motion: reduce) {
          .vload-icon, .vload-ring, .vload-dot {
            animation: none !important;
          }
        }
      `}</style>

      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        <div className="vload-icon relative mb-8 flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
          <span className="vload-ring absolute inset-0 rounded-full border-2 border-[#c9a97a]/40" />
          <span className="vload-ring vload-ring-delay absolute inset-0 rounded-full border-2 border-[#c9a97a]/40" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#fdf6ec] sm:h-28 sm:w-28">
            <PhoneOff className="h-10 w-10 text-[#c9a97a] sm:h-12 sm:w-12" strokeWidth={1.75} />
          </div>
        </div>

        <h1 className="font-hero text-xl font-[500] tracking-[-0.01em] text-[#111827] sm:text-2xl">
          Reconnecting the call
        </h1>

        <p className="mt-3 max-w-sm font-body text-[15px] leading-[1.65] text-[#6b7280] sm:text-[16px]">
          Give us a moment while we pull things together.
        </p>

        <div className="mt-6 flex items-center gap-1.5">
          <span className="vload-dot vload-dot-1 h-2 w-2 rounded-full bg-[#c9a97a]" />
          <span className="vload-dot vload-dot-2 h-2 w-2 rounded-full bg-[#c9a97a]" />
          <span className="vload-dot vload-dot-3 h-2 w-2 rounded-full bg-[#c9a97a]" />
        </div>
      </div>
    </div>
  );
}
