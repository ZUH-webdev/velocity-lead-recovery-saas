import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[rgba(255,255,255,0.08)] bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-[20px] px-[24px] py-[32px] text-center sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-[16px] sm:gap-y-[14px] sm:text-left md:flex-nowrap md:px-[40px] lg:px-[80px]">
        <Link href="/" className="order-1 inline-flex items-center gap-[10px] md:order-1">
          <Image
            src="/velocity-logo.webp"
            alt="Velocity"
            width={18}
            height={18}
            className="h-[18px] w-[18px] object-contain brightness-0 invert"
          />
          <span className="font-hero text-[14px] font-[700] tracking-[0.08em] text-white">VELOCITY</span>
        </Link>

        <nav className="order-2 flex w-full flex-wrap items-center justify-center gap-x-[24px] gap-y-[16px] sm:order-3 md:order-2 md:w-auto md:flex-1 md:gap-x-[32px] md:gap-y-[12px]">
          <Link
            href="/about"
            className="font-mono-ui text-[11px] font-[400] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.79)] transition-colors duration-200 hover:text-[rgba(255,255,255,0.7)]"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="font-mono-ui text-[11px] font-[400] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.79)] transition-colors duration-200 hover:text-[rgba(255,255,255,0.7)]"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="font-mono-ui text-[11px] font-[400] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.79)] transition-colors duration-200 hover:text-[rgba(255,255,255,0.7)]"
          >
            Terms
          </Link>
          <Link
            href="/compliance"
            className="font-mono-ui text-[11px] font-[400] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.79)] transition-colors duration-200 hover:text-[rgba(255,255,255,0.7)]"
          >
            Compliance
          </Link>
          <Link
            href="/status"
            className="font-mono-ui text-[11px] font-[400] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.79)] transition-colors duration-200 hover:text-[rgba(255,255,255,0.7)]"
          >
            System Status
          </Link>
        </nav>

        <div className="order-3 whitespace-nowrap font-mono-ui text-[11px] font-[400] tracking-[0.05em] text-[rgba(255,255,255,0.79)] sm:order-2 md:order-3">
          © 2026 Velocity Health Intelligence, Inc.
        </div>
      </div>
    </footer>
  );
}
