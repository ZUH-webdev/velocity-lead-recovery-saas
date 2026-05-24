"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Globe2,
  LineChart,
  MessageSquare,
  PhoneCall,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Globe } from '../src/components/ui/Globe';
import { dmSans, dmSerif } from '../src/components/pages/authFonts';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
];

const valuePillars = [
  {
    icon: PhoneCall,
    title: 'Instant Voice Response',
    text: 'AI phone agents dial missed calls back within 30 seconds to capture intent before it decays.',
  },
  {
    icon: MessageSquare,
    title: 'Omnichannel Context',
    text: 'Every conversation stays coherent across text, web forms, and WhatsApp without manual handoffs.',
  },
  {
    icon: CalendarDays,
    title: 'Secure Automated Booking',
    text: 'Patient intent converts directly into confirmed appointments with no extra admin entry.',
  },
];

const AnimatedSection = motion.div as any;

interface SectionKickerProps {
  children: React.ReactNode;
}

function SectionKicker({ children }: SectionKickerProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 backdrop-blur-md">
      <Sparkles className="h-3.5 w-3.5 text-orange-500" />
      <span>{children}</span>
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white/70 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-6">
          <Link href="/" className={`${dmSans.className} flex items-center gap-3`}>
            <div className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-slate-950 text-white shadow-sm">
              <Zap className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-slate-100 bg-white">
                <Image src="/velocity-logo.webp" alt="Velocity" fill sizes="40px" className="object-cover" priority />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Revenue recovery</p>
                <span className="block text-lg font-semibold tracking-tight text-slate-950">Velocity</span>
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="text-sm font-medium tracking-wide text-slate-600 transition hover:text-slate-950">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/signin" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5 hover:bg-slate-900"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="isolate relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute bottom-[-10%] left-1/2 z-0 h-[900px] w-[900px] -translate-x-1/2 animate-[spin_120s_linear_infinite] opacity-[0.25]">
        <Globe className="absolute inset-0 h-full w-full max-w-none" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(248,250,252,0.92)_38%,rgba(241,245,249,0.82)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.04),transparent_35%),radial-gradient(circle_at_bottom,rgba(249,115,22,0.08),transparent_55%)]" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Revenue recovery for modern clinics
        </p>

        <h1 className={`${dmSerif.className} mb-6 max-w-3xl text-5xl font-normal tracking-tight leading-[1.15] text-slate-900 md:text-6xl`}>
          Never lose a patient to a missed call again.
        </h1>

        <p className="mb-8 max-w-2xl text-base font-normal leading-relaxed text-slate-600 md:text-lg">
          Velocity deploys intelligent AI phone and messaging assistants that instantly engage, answer, and book missed
          opportunities 24/7. Every unanswered call becomes a structured recovery path, not an abandoned lead.
        </p>

        <div className="grid w-full gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/50 bg-white/60 p-6 text-left shadow-[0_8px_30px_rgb(0,0,0,0.01)] backdrop-blur-md">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Pipeline</p>
            <p className="font-medium text-slate-800">Voice, text, and booking automation in one system.</p>
          </div>

          <div className="rounded-2xl border border-slate-200/50 bg-white/60 p-6 text-left shadow-[0_8px_30px_rgb(0,0,0,0.01)] backdrop-blur-md">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Outcome</p>
            <p className="font-medium text-slate-800">More recovered patients with less front-desk effort.</p>
          </div>
        </div>

        <Link
          href="#workspace"
          className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-transform duration-200 hover:translate-x-1 hover:text-slate-950"
        >
          See AI In Action
          <span className="transition-transform duration-200 group-hover:translate-x-1">-&gt;</span>
        </Link>
      </div>
    </section>
  );
}

export default function RootPage() {
  return (
    <div className={`${dmSans.className} relative min-h-screen overflow-hidden bg-[#030712] text-slate-950`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.10),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_30%)]" />
      <div className="pointer-events-none absolute left-[-6rem] top-10 h-72 w-72 rounded-full bg-orange-500/10 blur-[110px]" />
      <div className="pointer-events-none absolute right-[-8rem] top-96 h-80 w-80 rounded-full bg-white/6 blur-[130px]" />

      <Navbar />

      <main className="relative pb-24 pt-4">
        <HeroSection />

        <section id="features" className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-slate-800/70 bg-[#050B17] p-5 shadow-[0_35px_100px_rgba(0,0,0,0.25)] sm:p-7"
          >
            <div className="flex items-end justify-between gap-6 border-b border-slate-800/70 pb-5">
              <div>
                <SectionKicker>Live Clinic Workspace</SectionKicker>
                <h2 className={`${dmSerif.className} mt-4 text-3xl font-normal tracking-tight text-white sm:text-4xl`}>
                  Operational clarity, built for recovery teams.
                </h2>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 md:inline-flex">
                <Globe2 className="h-4 w-4 text-orange-500" />
                Global activity
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950 p-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.18),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.06),transparent_30%)]" />
                <div className="relative grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-white/5 p-4 text-white">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">Recovered Revenue</p>
                    <p className="mt-5 text-4xl font-semibold tracking-tight">$4,820</p>
                    <p className="mt-2 text-sm text-white/60">This month</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-white p-4">
                    <div className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
                      Automated Capture
                    </div>
                    <p className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">94%</p>
                    <p className="mt-2 text-sm text-slate-600">Capture rate</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-white p-4">
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Conversations
                    </div>
                    <p className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">18</p>
                    <p className="mt-2 text-sm text-slate-600">Live right now</p>
                  </div>
                </div>

                <div className="relative mt-5 rounded-[1.5rem] border border-slate-800 bg-white/5 p-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
                    <div className="rounded-2xl border border-slate-800 bg-white/5 p-4 text-white">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">Queue signal</p>
                      <div className="mt-4 space-y-3">
                        {[
                          ['3 min ago', 'Missed call recovered', 'Booked'],
                          ['14 min ago', 'Text follow-up sent', 'Warm'],
                          ['36 min ago', 'Calendar sync confirmed', 'Done'],
                        ].map(([time, label, status]) => (
                          <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                            <div>
                              <p className="text-xs text-white/45">{time}</p>
                              <p className="mt-1 text-sm text-white">{label}</p>
                            </div>
                            <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-[10px] font-semibold text-orange-200">
                              {status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Global network map</p>
                        <BadgeCheck className="h-5 w-5 text-orange-500" />
                      </div>
                      <div className="mt-4 grid aspect-[1.05/1] place-items-center rounded-[1.4rem] border border-slate-100 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08),transparent_40%)]">
                        <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] border border-slate-100 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:18px_18px]">
                          <div className="absolute left-[18%] top-[18%] h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_20px_#f97316]" />
                          <div className="absolute left-[54%] top-[34%] h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_20px_#f97316]" />
                          <div className="absolute left-[72%] top-[62%] h-3.5 w-3.5 rounded-full bg-orange-500 shadow-[0_0_20px_#f97316]" />
                          <div className="absolute left-[38%] top-[74%] h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_20px_#f97316]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950 p-5 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">Motion system</p>
                <div className="mt-4 space-y-4">
                  {[
                    ['Lead capture', 'Respond within 30 seconds'],
                    ['Booking', 'Secure schedule confirmation'],
                    ['Follow-up', 'Continue across channels'],
                  ].map(([title, text], index) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-orange-500">
                          {index === 0 ? <PhoneCall className="h-4.5 w-4.5" /> : index === 1 ? <Shield className="h-4.5 w-4.5" /> : <LineChart className="h-4.5 w-4.5" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{title}</p>
                          <p className="mt-1 text-sm text-white/55">{text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
            className="grid gap-5 md:grid-cols-3"
          >
            {valuePillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                  <div className="flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-950">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-semibold text-slate-400">0{index + 1}</div>
                  </div>
                  <h3 className={`${dmSerif.className} mt-6 text-2xl font-normal tracking-tight text-slate-950`}>
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.text}</p>
                </div>
              );
            })}
          </AnimatedSection>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionKicker>Pricing</SectionKicker>
                <h2 className={`${dmSerif.className} mt-4 text-3xl font-normal tracking-tight text-slate-950 sm:text-4xl`}>
                  Launch with the right operating layer for your clinic.
                </h2>
              </div>
              <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950">
                Request access
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {[
                ['Pilot', '$1,500', 'Focused missed-call recovery'],
                ['Scale', '$2,900', 'Multi-channel automation layer'],
                ['Enterprise', 'Custom', 'Multi-location control and support'],
              ].map(([name, price, text], index) => (
                <div key={name} className={`rounded-[1.5rem] border p-5 ${index === 1 ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-100 bg-white text-slate-950'}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${index === 1 ? 'text-white/50' : 'text-slate-500'}`}>{name}</p>
                  <div className="mt-4 flex items-end gap-2">
                    <span className={`${dmSerif.className} text-4xl font-normal tracking-tight`}>{price}</span>
                    <span className={`pb-1 text-sm ${index === 1 ? 'text-white/55' : 'text-slate-500'}`}>/ month</span>
                  </div>
                  <p className={`mt-3 text-sm leading-7 ${index === 1 ? 'text-white/70' : 'text-slate-600'}`}>{text}</p>
                  <Link
                    href="/signup"
                    className={`mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${index === 1 ? 'bg-white text-slate-950' : 'border border-slate-200 bg-slate-950 text-white'}`}
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>
      </main>
    </div>
  );
}