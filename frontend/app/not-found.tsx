import Link from 'next/link';
import { Home, PhoneOff } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-4 py-16 sm:px-6">
      <style>{`
        @keyframes velocity-404-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes velocity-404-ring {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes velocity-404-fade-up {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .v404-icon-wrap {
          animation: velocity-404-float 3.5s ease-in-out infinite;
        }
        .v404-ring {
          animation: velocity-404-ring 2.2s ease-out infinite;
        }
        .v404-ring-delay {
          animation-delay: 0.6s;
        }
        .v404-fade-1 {
          animation: velocity-404-fade-up 0.6s ease-out both;
        }
        .v404-fade-2 {
          animation: velocity-404-fade-up 0.6s ease-out 0.1s both;
        }
        .v404-fade-3 {
          animation: velocity-404-fade-up 0.6s ease-out 0.2s both;
        }
        .v404-fade-4 {
          animation: velocity-404-fade-up 0.6s ease-out 0.3s both;
        }
        @media (prefers-reduced-motion: reduce) {
          .v404-icon-wrap, .v404-ring, .v404-fade-1, .v404-fade-2, .v404-fade-3, .v404-fade-4 {
            animation: none !important;
          }
        }
      `}</style>

      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        <div className="v404-icon-wrap v404-fade-1 relative mb-8 flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
          <span className="v404-ring absolute inset-0 rounded-full border-2 border-[#c9a97a]/40" />
          <span className="v404-ring v404-ring-delay absolute inset-0 rounded-full border-2 border-[#c9a97a]/40" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#fdf6ec] sm:h-28 sm:w-28">
            <PhoneOff className="h-10 w-10 text-[#c9a97a] sm:h-12 sm:w-12" strokeWidth={1.75} />
          </div>
        </div>

        <p className="v404-fade-2 font-hero text-6xl font-[500] tracking-[-0.02em] text-[#0f0f10] sm:text-7xl">
          404
        </p>

        <h1 className="v404-fade-3 mt-3 font-hero text-xl font-[500] tracking-[-0.01em] text-[#111827] sm:text-2xl">
          This lead went cold
        </h1>

        <p className="v404-fade-3 mt-3 max-w-sm font-body text-[15px] leading-[1.65] text-[#6b7280] sm:text-[16px]">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
        </p>

        <Link
          href="/"
          className="v404-fade-4 font-body mt-8 inline-flex min-h-[44px] h-[48px] items-center gap-[12px] rounded-[8px] bg-[#0f172a] px-[24px] text-[15px] font-[600] tracking-[0.01em] text-white shadow-[0_8px_24px_rgba(15,23,42,0.18)] transition-opacity hover:opacity-90 active:scale-95"
        >
          <Home className="h-[16px] w-[16px] stroke-[2.2]" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
