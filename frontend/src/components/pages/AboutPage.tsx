"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ScrollRevealGroup, ScrollRevealItem } from '../ScrollReveal';

const navItems = [
  { label: 'The Platform', href: '/#platform' },
  { label: 'How It Works', href: '/#mechanism' },
  { label: 'The Impact', href: '/#results' },
  { label: 'Who We Are', href: '/about' },
];

const audienceItems = [
  'Dental clinics losing patients to voicemail',
  'Med spas with high inquiry volume and low follow-up rates',
  'Specialty practices where every missed appointment is thousands in revenue',
  'Any local healthcare business where speed-to-lead determines who gets the patient',
];

  const teamMembers = [
    {
      initials: 'ZUH',
      name: 'Zain Ul Hassan',
      role: 'Founder & Frontend Architect',
      accent: '#c9a97a',
      description:
        "Zain built Velocity's entire frontend experience — from the landing page to the lead recovery dashboard. A specialist in Next.js, React, and high-fidelity UI systems, he shapes how practices interact with the platform day-to-day. Velocity's design philosophy — clinical precision, zero friction — is his. He also architected and integrated all third-party API connections, including Twilio, Google Calendar, Calendly, and EHR platform pipelines that power Velocity's real-time recovery workflows.",
    },
    {
      initials: 'MZ',
      name: 'Muhammad Zain',
      role: 'Co-Founder & Backend Architect',
      accent: '#7ddcc1',
      description:
        "Muhammad engineered the infrastructure that makes Velocity work at speed. He designed the API architecture, database systems, and the AI conversation engine that qualifies leads and books appointments without human intervention. He also built and trained Velocity's AI Voice Agent — the hyper-realistic voice protocol that engages patients within 45 seconds of a missed call, sounding human, acting clinical, and closing the loop automatically.",
    },
  ];


function DarkTopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[1000] border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,10,0.88)] py-[14px] backdrop-blur-[19px] transition duration-300"
      style={{ WebkitBackdropFilter: 'blur(16px)' }}
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center px-[24px] md:grid-cols-[1fr_auto_1fr] md:px-[40px] lg:px-[80px]">
        <Link href="/" className="flex items-center gap-[12px] justify-self-start">
          <Image
            src="/velocity-logo.webp"
            alt="Velocity"
            width={22}
            height={23}
            className="h-[25px] w-[25px] object-contain brightness-0 invert"
          />
          <span className="font-hero text-[24px] font-[800] leading-none tracking-[-0.02em] text-white">
            VELOCITY
          </span>
        </Link>

        <nav className="hidden items-center gap-[20px] justify-self-center md:flex lg:gap-[46px]">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`font-body text-[15px] font-[500] leading-none tracking-[0em] transition-colors ${
                item.href === '/about' ? 'text-white' : 'text-[rgba(255,255,255,0.55)] hover:text-[rgba(255,255,255,0.85)]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden justify-self-end md:block">
          <Link
            href="/signin"
            className="inline-flex min-h-[44px] h-auto items-center gap-[12px] rounded-[8px] bg-white px-[20px] py-[10px] font-body text-[15px] font-[600] tracking-[0.01em] text-[#0f0f10] shadow-[0_8px_24px_rgba(255,255,255,0.08)] lg:h-[44px] lg:px-[24px] lg:py-0"
          >
            Evaluate Velocity
            <ArrowRight className="h-[18px] w-[18px] stroke-[2.2]" />
          </Link>
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-[8px] text-white justify-self-end md:hidden"
        >
          <span className="text-[26px] leading-none">{isMenuOpen ? '×' : '☰'}</span>
        </button>
      </div>

      {isMenuOpen && (
        <div
          className="absolute left-0 right-0 top-full border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,10,0.97)] backdrop-blur-[16px] md:hidden"
          style={{ WebkitBackdropFilter: 'blur(16px)' }}
        >
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex min-h-[44px] items-center border-b border-[rgba(255,255,255,0.06)] px-[24px] py-[16px] font-body text-[16px] font-[500] text-[rgba(255,255,255,0.65)]"
              >
                {item.label}
              </Link>
            ))}
            <div className="p-[24px]">
              <Link
                href="/signin"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-[12px] rounded-[8px] bg-white px-[24px] py-[12px] font-body text-[15px] font-[600] tracking-[0.01em] text-[#0f0f10]"
              >
                Evaluate Velocity
                <ArrowRight className="h-[18px] w-[18px] stroke-[2.2]" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function TeamAvatar({ initials, accent }: { initials: string; accent: string }) {
  return (
    <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `linear-gradient(135deg, ${accent}22 0%, transparent 50%), repeating-linear-gradient(45deg, ${accent}11 0px, ${accent}11 1px, transparent 1px, transparent 8px)`,
        }}
      />
      <div
        className="pointer-events-none absolute -right-2 -top-2 h-8 w-8 rotate-45 border border-[rgba(255,255,255,0.08)]"
        style={{ background: `${accent}18` }}
      />
      <span className="relative font-mono-ui text-[13px] font-[500] tracking-[0.12em] text-white">{initials}</span>
    </div>
  );
}

function AboutFooter() {
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
            className="font-mono-ui text-[11px] font-[400] uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:text-[rgba(255,255,255,0.7)]"
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
        </nav>

        <div className="order-3 whitespace-nowrap font-mono-ui text-[11px] font-[400] tracking-[0.05em] text-[rgba(255,255,255,0.79)] sm:order-2 md:order-3">
          © 2026 Velocity Health Intelligence, Inc.
        </div>
      </div>
    </footer>
  );
}

export default function AboutPage() {
  useEffect(() => {
    const header = document.querySelector('header');

    function updateHeaderHeight() {
      if (header) {
        document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
      }
    }

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] font-heading text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:43px_43px] opacity-[0.35]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,169,122,0.06),transparent_42%)]" />

      <div className="relative">
        <DarkTopNav />

        <main style={{ paddingTop: 'var(--header-height)' }}>
          {/* Hero */}
          <section className="mx-auto max-w-[1440px] px-[24px] md:px-[40px] lg:px-[80px] pb-[80px] pt-[60px] md:pb-[100px] md:pt-[80px]">
            <ScrollRevealGroup className="mx-auto max-w-[820px]" direction="up" stagger={0.1} delayChildren={0.04} hero>
              <ScrollRevealItem direction="up" hero>
                <div className="flex flex-wrap items-center gap-[16px]">
                  <span className="inline-flex h-[31px] items-center gap-[9px] rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] px-[14px] font-mono-ui text-[11px] font-[400] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.55)]">
                    <span className="h-[9px] w-[9px] rounded-full bg-[#c9a97a]" />
                    About Velocity
                  </span>
                  <span className="font-mono-ui text-[11px] font-[400] uppercase tracking-[0.14em] text-[rgba(255,255,255,0.35)]">
                    Est. 2025
                  </span>
                </div>
              </ScrollRevealItem>

              <ScrollRevealItem className="mt-[40px] md:mt-[48px]" direction="up" hero>
                <h1 className="font-hero text-[clamp(36px,7vw,72px)] font-[500] leading-[1.05] tracking-[-0.03em] text-white">
                  Built to recover what modern practices quietly lose.
                </h1>
              </ScrollRevealItem>

              <ScrollRevealItem className="mt-[28px] max-w-[640px]" direction="up" hero>
                <p className="font-body text-[18px] font-[400] leading-[1.7] text-[rgba(255,255,255,0.55)]">
                  Velocity was founded on a single observation — healthcare practices weren&apos;t losing patients because of
                  bad care. They were losing them in the silence after a missed call.
                </p>
              </ScrollRevealItem>
            </ScrollRevealGroup>
          </section>

          {/* What is Velocity */}
          <section className="border-t border-[rgba(255,255,255,0.06)]">
            <div className="mx-auto max-w-[1440px] px-[24px] py-[80px] md:px-[40px] md:py-[100px] lg:px-[80px]">
              <ScrollRevealGroup className="mx-auto max-w-[760px]" stagger={0.1}>
                <ScrollRevealItem direction="up">
                  <span className="font-mono-ui text-[12px] font-[500] uppercase tracking-[0.12em] text-[#c9a97a]">
                    What is Velocity
                  </span>
                </ScrollRevealItem>

                <ScrollRevealItem className="mt-[20px]" direction="up">
                  <p className="font-body text-[17px] font-[400] leading-[1.75] text-[rgba(255,255,255,0.65)] md:text-[18px]">
                    Velocity is an AI-powered lead recovery and appointment booking platform built for high-intent
                    healthcare businesses — dental clinics, med spas, and specialty practices. When a call is missed or a
                    form is submitted, Velocity launches an automated AI conversation via SMS or voice — qualifying the
                    lead, answering questions, and booking the appointment directly into the practice calendar. No
                    front-desk intervention required.
                  </p>
                </ScrollRevealItem>
              </ScrollRevealGroup>
            </div>
          </section>

          {/* Who it helps */}
          <section className="border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.015)]">
            <div className="mx-auto max-w-[1440px] px-[24px] py-[80px] md:px-[40px] md:py-[100px] lg:px-[80px]">
              <ScrollRevealGroup stagger={0.08}>
                <ScrollRevealItem direction="up">
                  <span className="font-mono-ui text-[12px] font-[500] uppercase tracking-[0.12em] text-[#c9a97a]">
                    Who it helps
                  </span>
                </ScrollRevealItem>

                <ScrollRevealItem className="mt-[20px] mb-[40px]" direction="up">
                  <h2 className="font-hero text-[clamp(28px,4vw,44px)] font-[500] leading-[1.1] tracking-[-0.02em] text-white">
                    Velocity is built for
                  </h2>
                </ScrollRevealItem>

                <ScrollRevealGroup className="grid grid-cols-1 gap-[16px] md:grid-cols-2" stagger={0.1}>
                  {audienceItems.map((item) => (
                    <ScrollRevealItem
                      key={item}
                      direction="up"
                      className="group rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-[24px] py-[22px] transition-colors duration-300 hover:border-[rgba(201,169,122,0.25)] hover:bg-[rgba(255,255,255,0.04)]"
                    >
                      <div className="mb-[12px] h-[1px] w-[24px] bg-[#c9a97a] transition-all duration-300 group-hover:w-[40px]" />
                      <p className="font-body text-[15px] font-[400] leading-[1.65] text-[rgba(255,255,255,0.7)]">{item}</p>
                    </ScrollRevealItem>
                  ))}
                </ScrollRevealGroup>
              </ScrollRevealGroup>
            </div>
          </section>

          {/* Founding team */}
          <section className="border-t border-[rgba(255,255,255,0.06)]">
            <div className="mx-auto max-w-[1440px] px-[24px] py-[80px] md:px-[40px] md:py-[100px] lg:px-[80px]">
              <ScrollRevealGroup stagger={0.08}>
                <ScrollRevealItem direction="up">
                  <span className="font-mono-ui text-[12px] font-[500] uppercase tracking-[0.12em] text-[#c9a97a]">
                    The founding team
                  </span>
                </ScrollRevealItem>

                <ScrollRevealItem className="mt-[20px] mb-[48px]" direction="up">
                  <h2 className="font-hero text-[clamp(28px,4vw,44px)] font-[500] leading-[1.1] tracking-[-0.02em] text-white">
                    The people behind the platform
                  </h2>
                </ScrollRevealItem>

                <div className="grid grid-cols-1 gap-[24px] lg:grid-cols-2">
                  {teamMembers.map((member) => (
                    <ScrollRevealItem key={member.name} direction="up">
                      <div
                        className="relative h-full overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-[28px] md:p-[32px]"
                        style={{
                          boxShadow: `0 0 60px ${member.accent}08, inset 0 1px 0 rgba(255,255,255,0.06)`,
                        }}
                      >
                        <div
                          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-[60px]"
                          style={{ background: `${member.accent}12` }}
                        />

                        <div className="relative flex items-start gap-[20px]">
                          <TeamAvatar initials={member.initials} accent={member.accent} />

                          <div className="min-w-0 flex-1">
                            <h3 className="font-hero text-[20px] font-[600] leading-tight tracking-[-0.01em] text-white">
                              {member.name}
                            </h3>
                            <span
                              className="mt-[10px] inline-flex rounded-[6px] border px-[10px] py-[4px] font-mono-ui text-[10px] font-[500] uppercase tracking-[0.1em]"
                              style={{
                                borderColor: `${member.accent}40`,
                                background: `${member.accent}12`,
                                color: member.accent,
                              }}
                            >
                              {member.role}
                            </span>
                          </div>
                        </div>

                        <p className="relative mt-[24px] font-body text-[15px] font-[400] leading-[1.75] text-[rgba(255,255,255,0.6)]">
                          {member.description}
                        </p>
                      </div>
                    </ScrollRevealItem>
                  ))}
                </div>
              </ScrollRevealGroup>
            </div>
          </section>

          {/* Mission */}
          <section className="border-t border-[rgba(255,255,255,0.06)]">
            <div className="mx-auto max-w-[1440px] px-[24px] py-[80px] md:px-[40px] md:py-[120px] lg:px-[80px]">
              <ScrollRevealGroup className="mx-auto max-w-[860px] text-center" stagger={0.12}>
                <ScrollRevealItem direction="up">
                  <span className="font-mono-ui text-[12px] font-[500] uppercase tracking-[0.12em] text-[#c9a97a]">
                    Our mission
                  </span>
                </ScrollRevealItem>

                <ScrollRevealItem className="mt-[32px]" direction="up">
                  <blockquote className="font-hero text-[clamp(24px,4vw,44px)] font-[500] leading-[1.25] tracking-[-0.02em] text-white">
                    &ldquo;We didn&apos;t build Velocity to add another tool to a practice&apos;s stack. We built it to close
                    the gap between intent and revenue — automatically, intelligently, and without adding to anyone&apos;s
                    workload.&rdquo;
                  </blockquote>
                </ScrollRevealItem>

                <ScrollRevealItem className="mt-[40px]" direction="up">
                  <div className="mx-auto h-[1px] w-[40px] bg-[rgba(255,255,255,0.15)]" />
                  <p className="mt-[24px] font-body text-[16px] font-[500] text-white">Zain Ul Hassan</p>
                  <p className="mt-[6px] font-mono-ui text-[11px] font-[400] uppercase tracking-[0.15em] text-[rgba(255,255,255,0.4)]">
                    Founder
                  </p>
                </ScrollRevealItem>
              </ScrollRevealGroup>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-[rgba(255,255,255,0.06)]">
            <ScrollRevealGroup
              className="mx-auto flex max-w-[800px] flex-col items-center gap-[32px] px-[24px] py-[100px] text-center md:px-[40px] lg:px-[80px]"
              stagger={0.12}
            >
              <ScrollRevealItem direction="up">
                <p className="font-mono-ui text-[11px] font-[400] uppercase tracking-[0.14em] text-[rgba(255,255,255,0.35)]">
                  Founded 2025
                </p>
              </ScrollRevealItem>

              <ScrollRevealItem direction="up">
                <h2 className="font-hero text-[clamp(28px,5vw,52px)] font-[600] leading-[1.1] tracking-[-0.03em] text-white">
                  Ready to see it work?
                </h2>
              </ScrollRevealItem>

              <ScrollRevealItem direction="up">
                <Link
                  href="/#platform"
                  className="inline-flex min-h-[44px] items-center justify-center gap-[8px] rounded-[8px] border border-[rgba(255,255,255,0.15)] bg-white px-[36px] py-[16px] font-body text-[16px] font-[600] text-[#0f0f10] transition-colors duration-200 hover:bg-[#f3f4f6]"
                >
                  See Velocity in Action
                  <ArrowRight className="h-[18px] w-[18px] stroke-[2.2]" />
                </Link>
              </ScrollRevealItem>
            </ScrollRevealGroup>
          </section>
        </main>

        <AboutFooter />
      </div>
    </div>
  );
}
