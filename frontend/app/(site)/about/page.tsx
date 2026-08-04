import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { ScrollRevealGroup, ScrollRevealItem } from '../../../components/ScrollReveal';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Velocity was founded by Zain Ul Hassan to help local healthcare businesses stop losing patients in the silence after a missed call.',
};

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


function TeamAvatar({ initials, accent }: { initials: string; accent: string }) {
  return (
    <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `linear-gradient(135deg, ${accent}22 0%, transparent 50%), repeating-linear-gradient(45deg, ${accent}11 0px, ${accent}11 1px, transparent 1px, transparent 8px)`,
        }}
      />
      <div
        className="pointer-events-none absolute -right-2 -top-2 h-8 w-8 rotate-45 border border-[#e5e7eb]"
        style={{ background: `${accent}18` }}
      />
      <span className="relative font-mono-ui text-[13px] font-[500] tracking-[0.12em] text-[#0f0f10]">{initials}</span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-heading text-[#111827]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(17,24,39,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,24,39,0.045)_1px,transparent_1px)] bg-[size:43px_43px] opacity-[0.26]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),rgba(255,255,255,0.98)_38%,rgba(255,255,255,1)_72%)]" />

      <div className="relative">
        <Header />

        <main style={{ paddingTop: 'var(--header-height)' }}>
          {/* Hero */}
          <section className="mx-auto max-w-[1440px] px-[24px] md:px-[40px] lg:px-[80px] pb-[80px] pt-[60px] md:pb-[100px] md:pt-[80px]">
            <ScrollRevealGroup className="mx-auto max-w-[820px]" direction="up" stagger={0.1} delayChildren={0.04} hero>
              <ScrollRevealItem direction="up" hero>
                <div className="flex flex-wrap items-center gap-[16px]">
                  <span className="inline-flex h-[31px] items-center gap-[9px] rounded-full border border-[#e6eaef] bg-white px-[14px] font-mono-ui text-[11px] font-[400] uppercase tracking-[0.1em] text-[#678096] shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                    <span className="h-[9px] w-[9px] rounded-full bg-[#c9a97a]" />
                    About Velocity
                  </span>
                  <span className="font-mono-ui text-[11px] font-[400] uppercase tracking-[0.14em] text-[#9ca3af]">
                    Est. 2025
                  </span>
                </div>
              </ScrollRevealItem>

              <ScrollRevealItem className="mt-[40px] md:mt-[48px]" direction="up" hero>
                <h1 className="font-hero text-[clamp(36px,7vw,72px)] font-[500] leading-[1.05] tracking-[-0.03em] text-[#0f0f10]">
                  Built to recover what modern practices quietly lose.
                </h1>
              </ScrollRevealItem>

              <ScrollRevealItem className="mt-[28px] max-w-[640px]" direction="up" hero>
                <p className="font-body text-[18px] font-[400] leading-[1.7] text-[#4b5563]">
                  Velocity was founded on a single observation — healthcare practices weren&apos;t losing patients because of
                  bad care. They were losing them in the silence after a missed call.
                </p>
              </ScrollRevealItem>

              <ScrollRevealItem className="mt-[20px]" direction="up" hero>
                <p className="font-mono-ui text-[12px] font-[500] uppercase tracking-[0.12em] text-[#9ca3af]">
                  Zain Ul Hassan, Founder of Velocity
                </p>
              </ScrollRevealItem>
            </ScrollRevealGroup>
          </section>

          {/* What is Velocity */}
          <section className="border-t border-[#e5e7eb]">
            <div className="mx-auto max-w-[1440px] px-[24px] py-[80px] md:px-[40px] md:py-[100px] lg:px-[80px]">
              <ScrollRevealGroup className="mx-auto max-w-[760px]" stagger={0.1}>
                <ScrollRevealItem direction="up">
                  <span className="font-mono-ui text-[12px] font-[500] uppercase tracking-[0.12em] text-[#c9a97a]">
                    What is Velocity
                  </span>
                </ScrollRevealItem>

                <ScrollRevealItem className="mt-[20px]" direction="up">
                  <p className="font-body text-[17px] font-[400] leading-[1.75] text-[#374151] md:text-[18px]">
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
          <section className="border-t border-[#e5e7eb] bg-[#FAFAFA]">
            <div className="mx-auto max-w-[1440px] px-[24px] py-[80px] md:px-[40px] md:py-[100px] lg:px-[80px]">
              <ScrollRevealGroup stagger={0.08}>
                <ScrollRevealItem direction="up">
                  <span className="font-mono-ui text-[12px] font-[500] uppercase tracking-[0.12em] text-[#c9a97a]">
                    Who it helps
                  </span>
                </ScrollRevealItem>

                <ScrollRevealItem className="mt-[20px] mb-[40px]" direction="up">
                  <h2 className="font-hero text-[clamp(28px,4vw,44px)] font-[500] leading-[1.1] tracking-[-0.02em] text-[#0f0f10]">
                    Velocity is built for
                  </h2>
                </ScrollRevealItem>

                <ScrollRevealGroup className="grid grid-cols-1 gap-[16px] md:grid-cols-2" stagger={0.1}>
                  {audienceItems.map((item) => (
                    <ScrollRevealItem
                      key={item}
                      direction="up"
                      className="group rounded-[12px] border border-[#e5e7eb] bg-white px-[24px] py-[22px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-colors duration-300 hover:border-[rgba(201,169,122,0.4)]"
                    >
                      <div className="mb-[12px] h-[1px] w-[24px] bg-[#c9a97a] transition-all duration-300 group-hover:w-[40px]" />
                      <p className="font-body text-[15px] font-[400] leading-[1.65] text-[#374151]">{item}</p>
                    </ScrollRevealItem>
                  ))}
                </ScrollRevealGroup>
              </ScrollRevealGroup>
            </div>
          </section>

          {/* Founding team */}
          <section className="border-t border-[#e5e7eb]">
            <div className="mx-auto max-w-[1440px] px-[24px] py-[80px] md:px-[40px] md:py-[100px] lg:px-[80px]">
              <ScrollRevealGroup stagger={0.08}>
                <ScrollRevealItem direction="up">
                  <span className="font-mono-ui text-[12px] font-[500] uppercase tracking-[0.12em] text-[#c9a97a]">
                    The founding team
                  </span>
                </ScrollRevealItem>

                <ScrollRevealItem className="mt-[20px] mb-[48px]" direction="up">
                  <h2 className="font-hero text-[clamp(28px,4vw,44px)] font-[500] leading-[1.1] tracking-[-0.02em] text-[#0f0f10]">
                    The people behind the platform
                  </h2>
                </ScrollRevealItem>

                <div className="grid grid-cols-1 gap-[24px] lg:grid-cols-2">
                  {teamMembers.map((member) => (
                    <ScrollRevealItem key={member.name} direction="up">
                      <div
                        className="relative h-full overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white p-[28px] md:p-[32px]"
                        style={{
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        }}
                      >
                        <div
                          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-[60px]"
                          style={{ background: `${member.accent}12` }}
                        />

                        <div className="relative flex items-start gap-[20px]">
                          <TeamAvatar initials={member.initials} accent={member.accent} />

                          <div className="min-w-0 flex-1">
                            <h3 className="font-hero text-[20px] font-[600] leading-tight tracking-[-0.01em] text-[#0f0f10]">
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

                        <p className="relative mt-[24px] font-body text-[15px] font-[400] leading-[1.75] text-[#374151]">
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
          <section className="border-t border-[#e5e7eb]">
            <div className="mx-auto max-w-[1440px] px-[24px] py-[80px] md:px-[40px] md:py-[120px] lg:px-[80px]">
              <ScrollRevealGroup className="mx-auto max-w-[860px] text-center" stagger={0.12}>
                <ScrollRevealItem direction="up">
                  <span className="font-mono-ui text-[12px] font-[500] uppercase tracking-[0.12em] text-[#c9a97a]">
                    Our mission
                  </span>
                </ScrollRevealItem>

                <ScrollRevealItem className="mt-[32px]" direction="up">
                  <blockquote className="font-hero text-[clamp(24px,4vw,44px)] font-[500] leading-[1.25] tracking-[-0.02em] text-[#0f0f10]">
                    &ldquo;We didn&apos;t build Velocity to add another tool to a practice&apos;s stack. We built it to close
                    the gap between intent and revenue — automatically, intelligently, and without adding to anyone&apos;s
                    workload.&rdquo;
                  </blockquote>
                </ScrollRevealItem>

                <ScrollRevealItem className="mt-[40px]" direction="up">
                  <div className="mx-auto h-[1px] w-[40px] bg-[#e5e7eb]" />
                  <p className="mt-[24px] font-body text-[16px] font-[500] text-[#0f0f10]">Zain Ul Hassan</p>
                  <p className="mt-[6px] font-mono-ui text-[11px] font-[400] uppercase tracking-[0.15em] text-[#9ca3af]">
                    Founder
                  </p>
                </ScrollRevealItem>
              </ScrollRevealGroup>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-[#0a0a0a]">
            <ScrollRevealGroup
              className="mx-auto flex max-w-[800px] flex-col items-center gap-[32px] px-[24px] py-[100px] text-center md:px-[40px] lg:px-[80px]"
              stagger={0.12}
            >
              <ScrollRevealItem direction="up">
                <p className="font-mono-ui text-[11px] font-[400] uppercase tracking-[0.14em] text-[rgba(255,255,255,0.45)]">
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
                  className="inline-flex min-h-[44px] items-center justify-center gap-[8px] rounded-[8px] border-2 border-white bg-white px-[36px] py-[16px] font-body text-[16px] font-[600] text-[#09090b] transition-all duration-200 hover:bg-transparent hover:text-white"
                >
                  See Velocity in Action
                  <ArrowRight className="h-[18px] w-[18px] stroke-[2.2]" />
                </Link>
              </ScrollRevealItem>
            </ScrollRevealGroup>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}