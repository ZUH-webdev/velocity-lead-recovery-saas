import Image from 'next/image';
import Link from 'next/link';

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Compliance', href: '/compliance' },
  { label: 'System Status', href: '/status' },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#e4e4e7] bg-white px-[24px] py-[32px] md:px-[80px] md:py-[40px]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-[20px] text-center md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-[24px] md:text-left">
        <Link href="/" className="inline-flex items-center gap-[10px]">
          <Image
              src="/velocity-logo.webp"
            alt="Velocity"
            width={22}
            height={22}
            className="h-[22px] w-[22px] object-contain"
          />
          <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#09090b]">VELOCITY</span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-[16px] md:gap-[32px]">
          {footerLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#a1a1aa] transition-colors duration-150 hover:text-[#09090b]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <p className="m-0 whitespace-nowrap text-[12px] tracking-[0.02em] text-[#a1a1aa]">
          © 2026 Velocity Health Intelligence, Inc.
        </p>
      </div>
    </footer>
  );
}
