import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Globe } from 'lucide-react';
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

const founder = {
  photo: '/ZU.jpeg',
  name: 'Zain Ul Hassan',
  role: 'Founder',
  accent: '#c9a97a',
  description:
    "Zain designed and built Velocity entirely on his own — every layer of it, from the landing page and lead recovery dashboard to the third-party API architecture behind them. A specialist in Next.js, React, and high-fidelity UI systems, he shapes how practices interact with the platform day-to-day. Velocity's design philosophy — clinical precision, zero friction — is his. He single-handedly built the Twilio-powered missed-call recovery pipeline and the connection framework Velocity's roadmap of integrations (Google Calendar, Calendly, EHR platforms) will build on.",
  credentials: [
    { label: 'Specialization', value: 'Next.js, React, high-fidelity UI systems' },
    { label: 'Built', value: 'Twilio-powered missed-call recovery pipeline' },
    { label: 'Roadmap', value: 'Google Calendar, Calendly, EHR platforms' },
  ],
};

type ProfileIcon = 'website' | 'linkedin' | 'github' | 'upwork';

const founderLinks: { label: string; href: string; icon: ProfileIcon }[] = [
  { label: 'zainulhassan.site', href: 'https://zainulhassan.site', icon: 'website' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/zain-ul-hassan-dev', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/ZUH-webdev', icon: 'github' },
  { label: 'Upwork', href: 'https://www.upwork.com/freelancers/~01143c0f702d75da0d', icon: 'upwork' },
];

// Brand marks (Simple Icons paths) — lucide-react v1 no longer ships brand icons.
const profileIconPaths: Record<Exclude<ProfileIcon, 'website'>, string> = {
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  github:
    'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  upwork:
    'M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z',
};

function ProfileGlyph({ icon }: { icon: ProfileIcon }) {
  if (icon === 'website') {
    return <Globe aria-hidden="true" className="h-[14px] w-[14px] shrink-0 stroke-[2]" />;
  }
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true" className="shrink-0">
      <path d={profileIconPaths[icon]} />
    </svg>
  );
}

function FounderPhoto({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-[18px] border border-[#e5e7eb] bg-[#f3f4f6] shadow-[0_1px_3px_rgba(0,0,0,0.06)] md:h-[136px] md:w-[136px] lg:h-[160px] lg:w-[160px]">
      <Image
        src={src}
        alt={`Portrait of ${name}, founder of Velocity`}
        fill
        sizes="(min-width: 1024px) 160px, (min-width: 768px) 136px, 120px"
        className="object-cover"
      />
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

          {/* Founder */}
          <section className="border-t border-[#e5e7eb]">
            <div className="mx-auto max-w-[1440px] px-[24px] py-[80px] md:px-[40px] md:py-[100px] lg:px-[80px]">
              <ScrollRevealGroup stagger={0.08}>
                <ScrollRevealItem direction="up">
                  <span className="font-mono-ui text-[12px] font-[500] uppercase tracking-[0.12em] text-[#c9a97a]">
                    The founder
                  </span>
                </ScrollRevealItem>

                <ScrollRevealItem className="mt-[20px] mb-[48px]" direction="up">
                  <h2 className="font-hero text-[clamp(28px,4vw,44px)] font-[500] leading-[1.1] tracking-[-0.02em] text-[#0f0f10]">
                    The person behind the platform
                  </h2>
                </ScrollRevealItem>

                <ScrollRevealItem direction="up">
                  <article
                    className="relative grid grid-cols-1 overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white lg:grid-cols-[minmax(300px,4fr)_minmax(0,7fr)]"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                  >
                    <div
                      className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full blur-[70px]"
                      style={{ background: `${founder.accent}14` }}
                    />

                    {/* Identity panel */}
                    <div className="relative flex flex-col gap-[28px] border-b border-[#e5e7eb] bg-[#FAFAFA]/70 p-[28px] md:p-[40px] lg:border-b-0 lg:border-r lg:p-[48px]">
                      <div className="flex flex-col items-start gap-[20px] sm:flex-row sm:items-center lg:flex-col lg:items-start">
                        <FounderPhoto src={founder.photo} name={founder.name} />

                        <div className="min-w-0">
                          <h3 className="font-hero text-[24px] font-[600] leading-tight tracking-[-0.01em] text-[#0f0f10] md:text-[28px]">
                            {founder.name}
                          </h3>
                          <span
                            className="mt-[12px] inline-flex rounded-full border px-[12px] py-[5px] font-mono-ui text-[10px] font-[500] uppercase tracking-[0.1em]"
                            style={{
                              borderColor: `${founder.accent}40`,
                              background: `${founder.accent}12`,
                              color: founder.accent,
                            }}
                          >
                            {founder.role}
                          </span>
                        </div>
                      </div>

                      <ul className="flex flex-wrap items-center gap-x-[24px] gap-y-[12px] lg:mt-auto">
                        {founderLinks.map(({ label, href, icon }) => (
                          <li key={label}>
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${founder.name} on ${label} (opens in a new tab)`}
                              className="inline-flex min-h-[32px] items-center gap-[8px] text-[12px] font-medium uppercase tracking-[0.06em] text-[#a1a1aa] transition-colors duration-150 hover:text-[#09090b]"
                            >
                              <ProfileGlyph icon={icon} />
                              {label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bio + credentials */}
                    <div className="relative p-[28px] md:p-[40px] lg:p-[56px]">
                      <p className="max-w-[680px] font-body text-[16px] font-[400] leading-[1.8] text-[#374151] md:text-[17px]">
                        {founder.description}
                      </p>

                      <dl className="mt-[36px] grid grid-cols-1 gap-[20px] border-t border-[#e5e7eb] pt-[28px] md:grid-cols-3 md:gap-[24px]">
                        {founder.credentials.map(({ label, value }) => (
                          <div key={label}>
                            <dt className="font-mono-ui text-[11px] font-[500] uppercase tracking-[0.12em] text-[#9ca3af]">
                              {label}
                            </dt>
                            <dd className="mt-[8px] font-body text-[14px] font-[400] leading-[1.6] text-[#0f0f10]">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </article>
                </ScrollRevealItem>
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
                    &ldquo;I didn&apos;t build Velocity to add another tool to a practice&apos;s stack. I built it to close
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