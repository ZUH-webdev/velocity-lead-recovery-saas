import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Activity, Shield } from 'lucide-react';
import { dmSans } from '../src/components/pages/authFonts';

const navItems = ['Platform', 'Mechanism', 'Results', 'FAQ'];

const feedRows = [
  { time: '11:42:05', event: 'CALL_DROPPED', status: '[DETECTED]', tone: 'text-[#9aa3b7]' },
  { time: '11:42:12', event: 'INTENT_ANALYSIS', status: '[PROCESSING]', tone: 'text-[#9aa3b7]' },
  { time: '11:43:00', event: 'VOICE_FOLLOWUP', status: '[INITIATED]', tone: 'text-[#b88243]' },
  { time: '11:45:22', event: 'APPOINTMENT', status: '[SECURED]', tone: 'text-[#24b883]' },
];

function TopNav() {
  return (
    <header className="relative z-10 pt-[26px]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-[31px]">
        <Link href="/" className="flex items-center gap-[12px] justify-self-start">
          <Image src="/velocity-logo.webp" alt="Velocity" width={28} height={28} priority className="h-[28px] w-[28px] object-contain" />
          <span className="text-[24px] font-[800] leading-none tracking-[-0.03em] text-[#111827]">
            VELOCITY
          </span>
        </Link>

        <nav className="flex items-center gap-[46px] justify-self-center">
          {navItems.map((item) => (
            <Link key={item} href="#" className="text-[18px] font-[600] leading-none tracking-[-0.02em] text-[#9ca3af]">
              {item}
            </Link>
          ))}
        </nav>

        <div className="justify-self-end">
          <Link
            href="#"
            className="inline-flex h-[47px] items-center gap-[12px] rounded-[8px] bg-[#0f172a] px-[24px] text-[18px] font-[600] tracking-[-0.02em] text-white shadow-[0_8px_24px_rgba(15,23,42,0.18)]"
          >
            Evaluate Velocity
            <ArrowRight className="h-[18px] w-[18px] stroke-[2.2]" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroCard() {
  return (
    <div className="w-full max-w-[444px] rounded-[18px] border border-[#eceff3] bg-white px-[28px] pb-[21px] pt-[24px] shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-[500] uppercase tracking-[0.12em] text-[#a8afbf]">Live Feed</span>
        <Activity className="h-[18px] w-[18px] text-[#b88243]" />
      </div>

      <div className="mt-[20px] space-y-[20px]">
        {feedRows.map((row) => (
          <div key={row.event} className="grid grid-cols-[84px_1fr_auto] items-center gap-[18px]">
            <span className="font-mono text-[15px] font-[500] tracking-[-0.01em] text-[#a8afbf]">
              {row.time}
            </span>
            <span className="font-mono text-[16px] font-[500] tracking-[-0.02em] text-[#1f2937]">
              {row.event}
            </span>
            <span className={`font-mono text-[14px] font-[500] tracking-[-0.01em] ${row.tone}`}>
              {row.status}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-[42px] flex items-center justify-between border-t border-transparent pt-[6px]">
        <span className="text-[16px] font-[500] uppercase tracking-[0.12em] text-[#a8afbf]">Recovery Confidence</span>
        <span className="font-mono text-[18px] font-[700] tracking-[-0.02em] text-[#111827]">98.2%</span>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="mx-auto flex max-w-[1440px] justify-between gap-[72px] px-[31px] pt-[103px]">
      <div className="w-full max-w-[640px] pt-[52px]">
        <div className="inline-flex h-[31px] items-center gap-[9px] rounded-full border border-[#e6eaef] bg-white px-[14px] text-[14px] font-[500] tracking-[-0.01em] text-[#678096] shadow-[0_1px_0_rgba(15,23,42,0.02)]">
          <span className="h-[9px] w-[9px] rounded-full bg-[#7ddcc1]" />
          <span className="font-mono uppercase tracking-[0.03em]">System Active:</span>
          <span className="font-mono uppercase tracking-[0.03em]">99.9% Uptime</span>
        </div>

        <h1 className="mt-[42px] max-w-[620px] text-[80px] font-[700] leading-[0.96] tracking-[-0.07em] text-[#111827]">
          Every missed call
          <br />
          costs you.
        </h1>

        <p className="mt-[30px] max-w-[620px] text-[29px] font-[400] leading-[1.5] tracking-[-0.03em] text-[#667085]">
          Velocity is the intelligence that runs while you focus on care. It works in the margins to recover what was
          already yours.
        </p>

        <div className="mt-[40px] flex items-center gap-[16px]">
          <Link
            href="#"
            className="inline-flex h-[57px] items-center gap-[12px] rounded-[6px] bg-[#0f172a] px-[28px] text-[19px] font-[600] tracking-[-0.02em] text-white shadow-[0_8px_24px_rgba(15,23,42,0.18)]"
          >
            Calculate Revenue Leak
            <ArrowRight className="h-[18px] w-[18px] stroke-[2.2]" />
          </Link>

          <Link
            href="#"
            className="inline-flex h-[57px] items-center rounded-[6px] border border-[#dfe4ea] bg-white px-[31px] text-[19px] font-[500] tracking-[-0.02em] text-[#111827] shadow-[0_1px_0_rgba(15,23,42,0.02)]"
          >
            Read the Whitepaper
          </Link>
        </div>

        <div className="mt-[73px] flex items-center gap-[18px] text-[14px] font-[500] tracking-[0.14em] text-[#9aa3b3]">
          <Shield className="h-[17px] w-[17px] stroke-[1.9] text-[#aab3c2]" />
          <span className="uppercase">HIPAA Compliant</span>
          <span className="text-[#c8ced8]">•</span>
          <span className="uppercase">SOC2 Type II Certified</span>
        </div>
      </div>

      <div className="mt-[132px] w-full max-w-[445px]">
        <HeroCard />
      </div>
    </section>
  );
}

export default function RootPage() {
  return (
    <div className={`${dmSans.className} min-h-screen overflow-hidden bg-white text-[#111827]`}>
      {/* approx: faint grid and soft tonal wash to match the Figma background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(17,24,39,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,24,39,0.045)_1px,transparent_1px)] bg-[size:43px_43px] opacity-[0.26]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),rgba(255,255,255,0.98)_38%,rgba(255,255,255,1)_72%)]" />
      <div className="relative">
        <TopNav />
        <main>
          <HeroSection />
        </main>
      </div>
    </div>
  );
}