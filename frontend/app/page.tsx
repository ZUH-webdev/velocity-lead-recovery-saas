"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Activity, Shield, PhoneCall, Globe, MessageSquare, Calendar, Check, ChevronDown } from 'lucide-react';

const navItems = [
  { label: 'Platform', href: '#platform' },
  { label: 'Mechanism', href: '#mechanism' },
  { label: 'Results', href: '#results' },
  { label: 'FAQ', href: '#faq' },
];

const feedRows = [
  { time: '11:42:05', event: 'CALL_DROPPED', status: '[DETECTED]', tone: 'text-[#9aa3b7]' },
  { time: '11:42:12', event: 'INTENT_ANALYSIS', status: '[PROCESSING]', tone: 'text-[#9aa3b7]' },
  { time: '11:43:00', event: 'VOICE_FOLLOWUP', status: '[INITIATED]', tone: 'text-[#b88243]' },
  { time: '11:45:22', event: 'APPOINTMENT', status: '[SECURED]', tone: 'text-[#24b883]' },
];

const faqItems = [
  {
    question: 'How does AI voice perform with older patient demographics?',
    answer:
      "Velocity's voice engine is calibrated for clarity across all age groups. Speech rate, enunciation, and response patience are tuned specifically for healthcare contexts where older patients are the primary demographic.",
  },
  {
    question: 'Does Velocity integrate with Epic and Cerner?',
    answer:
      'Yes. Velocity has native bi-directional integrations with Epic, Cerner, Athenahealth, and most major EHR/PMS platforms via HL7 and FHIR protocols. Setup typically completes within one business week.',
  },
  {
    question: 'Is this HIPAA and SOC 2 Type II compliant?',
    answer:
      'Velocity is fully HIPAA compliant and SOC 2 Type II certified. All voice data is encrypted in transit and at rest. BAAs are executed with every customer prior to go-live.',
  },
  {
    question: 'What happens if a patient asks a complex medical question?',
    answer:
      'Velocity is scoped strictly to scheduling and follow-up workflows. If a patient asks a clinical question outside that scope, the system gracefully routes to a live staff member or advises the patient to contact the practice directly.',
  },
];

function TopNav() {
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
      className="fixed top-0 left-0 right-0 z-[1000] py-[14px] bg-[rgba(255,255,255,0.9)] backdrop-blur-[19px] border-b border-[rgba(0,0,0,0.06)] transition duration-300"
      style={{ WebkitBackdropFilter: 'blur(16px)' }}
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center px-[24px] md:px-[40px] lg:px-[80px]">
        <Link href="/" className="flex items-center gap-[12px] justify-self-start">
          <Image src="/velocity-logo.webp" alt="Velocity" width={28} height={28} priority className="h-[28px] w-[28px] object-contain" />
          <span className="font-hero text-[24px] font-[800] leading-none tracking-[-0.02em] text-[#111827]">
            VELOCITY
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-[20px] lg:gap-[46px] justify-self-center">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="font-body text-[15px] font-[500] leading-none tracking-[0em] text-[#6b7280]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block justify-self-end">
          <Link
            href="/signin"
            className="inline-flex min-h-[44px] h-auto lg:h-[44px] py-[10px] lg:py-0 items-center gap-[12px] rounded-[8px] bg-[#0f172a] px-[20px] lg:px-[24px] font-body text-[15px] font-[600] tracking-[0.01em] text-white shadow-[0_8px_24px_rgba(15,23,42,0.18)]"
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
          className="justify-self-end md:hidden inline-flex h-[44px] w-[44px] items-center justify-center rounded-[8px] text-[#111827]"
        >
          <span className="text-[26px] leading-none">{isMenuOpen ? '×' : '☰'}</span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full bg-[rgba(255,255,255,0.97)] backdrop-blur-[16px] border-b border-[#f3f4f6]" style={{ WebkitBackdropFilter: 'blur(16px)' }}>
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex min-h-[44px] items-center border-b border-[#f3f4f6] px-[24px] py-[16px] font-body text-[16px] font-[500] text-[#6b7280]"
              >
                {item.label}
              </Link>
            ))}
            <div className="p-[24px]">
              <Link
                href="/signin"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-[12px] rounded-[8px] bg-[#0f172a] px-[24px] py-[12px] font-body text-[15px] font-[600] tracking-[0.01em] text-white shadow-[0_8px_24px_rgba(15,23,42,0.18)]"
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

function HeroCard() {
  return (
    <div className="w-full max-w-[444px] rounded-[18px] border border-[#eceff3] bg-white mt-[40px] md:mt-[20px] lg:mt-[40px] px-[22px] md:px-[24px] lg:px-[28px] pb-[18px] md:pb-[20px] lg:pb-[21px] pt-[20px] md:pt-[22px] lg:pt-[24px] shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
      <div className="flex items-center mt-[20px] justify-between">
        <span className="font-mono-ui text-[12px] font-[400] uppercase tracking-[0.08em] text-[#6b7280]">Live Feed</span>
        <Activity className="h-[18px] w-[18px] text-[#b88243]" />
      </div>

      <div className="mt-[20px] space-y-[20px]">
        {feedRows.map((row) => (
          <div key={row.event} className="grid grid-cols-[84px_1fr_auto] items-center gap-[18px]">
            <span className="font-mono-ui text-[12px] font-[400] tracking-[0.08em] text-[#6b7280]">
              {row.time}
            </span>
            <span className="font-mono-ui text-[12px] font-[400] tracking-[0.08em] text-[#1f2937]">
              {row.event}
            </span>
            <span className={`font-mono-ui text-[12px] font-[500] tracking-[0.04em] ${row.tone}`}>
              {row.status}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-[42px] flex items-center justify-between border-t border-transparent pt-[6px]">
        <span className="font-mono-ui text-[12px] font-[400] uppercase tracking-[0.08em] text-[#6b7280]">Recovery Confidence</span>
        <span className="font-mono-ui text-[12px] font-[500] tracking-[0.04em] text-[#111827]">98.2%</span>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section id="platform" style={{ scrollMarginTop: 'var(--header-height)' }} className="mx-auto flex flex-col md:flex-row max-w-[1440px] justify-between gap-[40px] md:gap-[32px] lg:gap-[72px] px-[24px] md:px-[40px] lg:px-[80px] pt-[36px] mt-9">
      <div className="w-full max-w-[640px] pt-[12px]">
        <div className="inline-flex h-[31px] items-center gap-[9px] rounded-full border border-[#e6eaef] bg-white px-[14px] font-mono-ui text-[11px] font-[400] uppercase tracking-[0.1em] text-[#678096] shadow-[0_1px_0_rgba(15,23,42,0.02)]">
          <span className="h-[9px] w-[9px] rounded-full bg-[#7ddcc1]" />
          <span>System Active:</span>
          <span>99.9% Uptime</span>
        </div>

        <h1 className="font-hero mt-[46px] max-w-[620px] text-[clamp(36px,8vw,52px)] md:text-[clamp(40px,5vw,64px)] lg:text-[clamp(48px,6vw,80px)] font-[500] leading-[1.05] tracking-[-0.02em] text-[#0f0f10]">
          Every missed call
          <br />
          costs you.
        </h1>

        <p className="font-body mt-[30px] max-w-[620px] text-[18px] font-[400] leading-[1.65] text-[#4b5563]">
          Velocity is the intelligence that runs while you focus on care. It works in the margins to recover what was
          already yours.
        </p>

        <div className="mt-[40px] flex flex-col md:flex-row items-stretch md:items-center gap-[12px] md:gap-[16px]">
          <Link
            href="#"
            className="font-body inline-flex min-h-[44px] h-[57px] w-full md:w-auto justify-center items-center gap-[12px] rounded-[6px] bg-[#0f172a] px-[28px] text-[15px] font-[600] tracking-[0.01em] text-white shadow-[0_8px_24px_rgba(15,23,42,0.18)]"
          >
            Calculate Revenue Leak
            <ArrowRight className="h-[18px] w-[18px] stroke-[2.2]" />
          </Link>

          <Link
            href="#"
            className="font-body inline-flex min-h-[44px] h-[57px] w-full md:w-auto justify-center items-center rounded-[6px] border border-[#dfe4ea] bg-white px-[31px] text-[15px] font-[600] tracking-[0.01em] text-[#111827] shadow-[0_1px_0_rgba(15,23,42,0.02)]"
          >
            Read the Whitepaper
          </Link>
        </div>

        <div className="mt-[73px] flex items-center gap-[18px] font-mono-ui text-[11px] font-[400] uppercase tracking-[0.1em] text-[#6b7280]">
          <Shield className="h-[17px] w-[17px] stroke-[1.9] text-[#aab3c2]" />
          <span>HIPAA Compliant</span>
          <span className="text-[#c8ced8]">•</span>
          <span>SOC2 Type II Certified</span>
        </div>
      </div>

      <div className="mt-[40px] w-full max-w-[445px]">
        <HeroCard />
      </div>
    </section>
  );
}

function StatSection() {
  const logos = ['MAYO', 'NYU Langone', 'Cedars', 'MOUNT SINAI'];

  return (
    // full-width section with approx 80px vertical padding // figma ref
    <section className="w-full bg-white">
      <div className="mx-auto flex flex-col md:flex-row max-w-[1440px] items-start md:items-center justify-between gap-[32px] md:gap-[24px] lg:gap-[40px] px-[24px] md:px-[40px] lg:px-[80px] py-[80px]">
        {/* two-column layout: left ~45%, right ~55% (estimated) // figma ref */}
        <div className="w-full md:w-[45%]">
          {/* font-size ~36-40px and heading stack match Figma // figma ref */}
          <h2 className="font-hero text-[clamp(24px,3.6vw,36px)] font-[500] leading-[1.15] tracking-[-0.015em] text-[#0f0f10]">
            91% of unreturned voicemails
            <br />
            result in a lost patient.
          </h2>

          {/* divider: 60px x 3px amber/gold // figma ref */}
          <div className="mt-[16px] w-[60px] h-[3px] bg-[#B8860B]" />
        </div>

        <div className="w-full md:w-[55%]">
          {/* logo spacing and wordmark sizing approximated from the reference // figma ref */}
          <div className="grid grid-cols-2 justify-items-center gap-x-[24px] gap-y-[20px] md:flex md:items-center md:justify-end md:gap-[28px] lg:gap-[56px] font-heading text-[14px] md:text-[15px] lg:text-[18px] font-[700] tracking-[0.05em] text-[#9ca3af]">
            {logos.map((logo) => (
              <div key={logo} className="text-[#9ca3af]">
                {logo === 'MOUNT SINAI' ? (
                  <div className="leading-[1] text-[14px] md:text-[15px] lg:text-[18px] font-[700] text-[#9ca3af]">
                    <span className="block">MOUNT</span>
                    <span className="block">SINAI</span>
                  </div>
                ) : (
                  <span className="uppercase tracking-[0.05em]">{logo}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function RootPage() {
  useEffect(() => {
    const header = document.querySelector('header');

    function updateHeaderHeight() {
      if (header) {
        document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
      }
    }

    function onScroll() {
      if (!header) return;
      if (window.scrollY > 10) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="font-heading min-h-screen overflow-hidden bg-white text-[#111827]">
      {/* approx: faint grid and soft tonal wash to match the Figma background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(17,24,39,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,24,39,0.045)_1px,transparent_1px)] bg-[size:43px_43px] opacity-[0.26]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),rgba(255,255,255,0.98)_38%,rgba(255,255,255,1)_72%)]" />
      <div className="relative">
        <TopNav />
        <main style={{ paddingTop: 'var(--header-height)' }}>
          <HeroSection />
          <StatSection />
          <ImpactSection />
          <MechanismSection />
          <VoiceFollowupSection />
          <AutomatedCalendarSection />
          <StatsSection />
          <TestimonialSection />
          <TestimonialCardsSection />
          <FAQAccordionSection />
          <FinalCtaFooterSection />
        </main>
      </div>
    </div>
  );
}

function VoiceFollowupSection() {
  return (
    <section className="w-full bg-[#FAFAFA]">
      <div className="mx-auto max-w-[1440px] px-[24px] md:px-[40px] lg:px-[80px] py-[100px]">
        <div className="flex flex-col md:flex-row items-center gap-[40px] md:gap-[32px] lg:gap-[60px]">
          <div className="w-full md:w-[45%]">
            <h3 className="font-hero text-[clamp(28px,3vw,42px)] font-[800] leading-tight tracking-[-0.02em] text-[#0f0f10] mb-[20px]">
              AI Voice Follow-up
            </h3>

            <p className="font-body text-[17px] font-[400] leading-[1.7] text-[#374151] mb-[32px]">
              When a call drops, Velocity initiates a hyper-realistic AI voice protocol within 45 seconds. It sounds human, acts clinical, and books immediately.
            </p>

            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center gap-[12px]">
                <Check className="h-[16px] w-[16px] text-[#b5895a]" />
                <span className="font-body text-[15px] font-[400] text-[#374151]">Zero latency response protocols.</span>
              </div>

              <div className="flex items-center gap-[12px]">
                <Check className="h-[16px] w-[16px] text-[#b5895a]" />
                <span className="font-body text-[15px] font-[400] text-[#374151]">Practice-specific persona mapping.</span>
              </div>

              <div className="flex items-center gap-[12px]">
                <Check className="h-[16px] w-[16px] text-[#b5895a]" />
                <span className="font-body text-[15px] font-[400] text-[#374151]">Full compliance with healthcare recording laws.</span>
              </div>
            </div>
          </div>

          <div className="h-[2px] w-[40px] bg-[#c9a97a] my-[32px] md:hidden" />

          <div className="hidden lg:block h-[70%] w-[2px] bg-[#c9a97a] self-center" />

          <div className="w-full md:w-[55%]">
            <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-[28px] shadow-[0_2px_16px_rgba(0,0,0,0.05)] max-w-full">
              <div className="flex items-center gap-[14px] mb-[28px]">
                <div className="w-[42px] h-[42px] flex items-center justify-center rounded-[8px] border border-[#e5e7eb]">
                  <PhoneCall className="h-[18px] w-[18px] text-[#0f0f10]" />
                </div>

                <div>
                  <div className="font-body text-[15px] font-[600] text-[#0f0f10]">Inbound Call Missed</div>
                  <div className="text-[13px] text-[#9ca3af]">+1 (555) 019-2834</div>
                </div>
              </div>

              <div className="flex flex-col gap-[14px] font-mono-ui text-[13px] leading-[1.5]">
                <div className="text-[#9ca3af]">00:00:45 &gt; INITIATE OUTBOUND SEQUENCE</div>
                <div className="text-[#9ca3af]">00:00:48 &gt; CONNECTION ESTABLISHED</div>

                <div className="text-[#96510c] font-[400]">"Hi, this is Sarah from Dr. Miller's office. I saw we just missed your call. Are you looking to schedule an appointment?"</div>

                <div style={{ borderLeft: '3px solid #e5e7eb' }} className="pl-[12px] text-[#6b7280]">"Yes, I was hoping to get in this week."</div>

                <div className="text-[#9ca3af]">00:01:12 &gt; INTENT_CONFIRMED : SCHEDULING</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactSection() {
  return (
    // centered typographic section with light warm gray background // figma ref
    <section className="w-full bg-[#FAFAFA]">
      <div className="mx-auto max-w-[1440px] px-[24px] md:px-[40px] lg:px-[80px] py-[80px] md:py-[100px]">
        <div className="mx-auto text-center" style={{ maxWidth: '820px' }}>
          <h3 className="font-hero mx-auto mb-[32px] text-[clamp(26px,5vw,52px)] font-[500] leading-[1.2] tracking-[-0.02em] text-[#0f0f10]">
            The silence of a missed call isn't an operational flaw. It's a clinical failure disguised as a busy day.
          </h3>
        </div>

        <div className="mx-auto max-w-full md:max-w-[620px] text-center">
          <p className="font-body mx-auto text-[17px] font-[400] leading-[1.7] text-[#6b7280]">
            Every day, modern practices lose revenue not because of poor care, but because of poor capture. The margins
            of your schedule are bleeding out in voicemails, abandoned forms, and unreturned texts.
          </p>
        </div>
      </div>
    </section>
  );
}

function MechanismSection() {
  const cards = [
    {
      stage: 'STAGE 01',
      title: 'Signal Detection',
      body: 'Velocity monitors telephony lines and digital endpoints with zero-latency detection for dropped intent.',
      icon: <PhoneCall size={22} />,
    },
    {
      stage: 'STAGE 02',
      title: 'Clinical Triaging',
      body: 'NLP models analyze caller history, urgency, and practice rules to determine the optimal recovery path.',
      icon: <Globe size={22} />,
    },
    {
      stage: 'STAGE 03',
      title: 'Precision Engagement',
      body: 'Automated but deeply human AI voice or SMS sequences engage the patient before they call a competitor.',
      icon: <MessageSquare size={22} />,
    },
    {
      stage: 'STAGE 04',
      title: 'Revenue Capture',
      body: 'Direct integration with EMR/PMS calendars secures the appointment. The loop is closed.',
      icon: <Calendar size={22} />,
    },
  ];

  return (
    <section id="mechanism" style={{ scrollMarginTop: 'var(--header-height)' }} className="w-full bg-white">
      <div className="mx-auto max-w-[1440px] px-[24px] md:px-[40px] lg:px-[80px] py-[100px]">
          <div className="w-full">
          <div className="mb-[16px]">
            <span className="font-mono-ui text-[12px] font-[500] tracking-[0.12em] uppercase text-[#b5895a]">THE MECHANISM</span>
          </div>

          <h3 className="font-hero text-[clamp(28px,4vw,48px)] font-[500] leading-[1.1] tracking-[-0.02em] text-[#0f0f10] mb-[60px]">
            Inevitable recovery.
          </h3>

          {/* Horizontal timeline: icons sit on a center line, text blocks sit below each node */}
          <div className="relative">
            <div className="absolute left-0 right-0 top-[36px] z-0">
              <div className="border-t border-[#eceff3]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[28px] items-start">
              {cards.map((c, i) => (
                <div key={i} className="flex flex-col items-start max-[479px]:py-[20px] max-[479px]:px-[16px]">
                  <div className="w-full flex justify-start z-10">
                    <div className="inline-flex items-center justify-center w-[52px] h-[52px] rounded-[8px] border border-[#e5e7eb] bg-white mb-[24px] text-[#0f0f10] shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
                      {c.icon}
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="font-mono-ui text-[11px] font-[400] tracking-[0.1em] uppercase text-[#9ca3af] mb-[8px]">
                      {c.stage}
                    </div>

                    <div className="font-heading text-[20px] font-[700] text-[#0f0f10] mb-[12px]">{c.title}</div>

                    <div className="font-body text-[14px] font-[400] leading-[1.65] text-[#6b7280]">{c.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AutomatedCalendarSection() {
  return (
    <section className="w-full bg-[#FAFAFA]">
      <div className="mx-auto max-w-[1440px] px-[24px] md:px-[40px] lg:px-[80px] py-[80px]">
        <div className="flex flex-col md:flex-row items-center gap-[40px] md:gap-[32px] lg:gap-[60px]">
          <div className="w-full md:w-[45%]">
            <div className="bg-white border border-[#e5e7eb] rounded-[14px] px-[20px] md:px-[22px] lg:px-[24px] py-[24px] md:py-[26px] lg:py-[28px] shadow-[0_2px_20px_rgba(0,0,0,0.05)] max-w-full">
              <div className="flex items-center justify-between mb-[24px]">
                <div className="font-body text-[15px] font-[600] text-[#0f0f10]">Calendar Synchronization</div>

                <div className="font-mono-ui text-[11px] font-[500] tracking-[0.08em] uppercase text-[#16a34a] bg-[rgba(22,163,74,0.08)] border border-[rgba(22,163,74,0.2)] rounded-[6px] px-[10px] py-[4px]">
                  LIVE SYNC
                </div>
              </div>

              <div className="flex flex-col gap-[10px]">
                <div className="flex items-center justify-between border border-[#e5e7eb] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] bg-white">
                  <div className="font-body text-[14px] font-[400] text-[#374151]">Tuesday, 9:00 AM</div>
                  <div className="font-body text-[14px] text-[#9ca3af] line-through">Unavailable</div>
                </div>

                <div className="flex items-center justify-between border border-[#c9a97a] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] bg-[#fffaf5]">
                  <div className="font-body text-[14px] font-[500] text-[#b5895a]">Tuesday, 10:30 AM</div>
                  <div className="font-body text-[14px] font-[700] text-[#0f0f10]">Auto-Booked</div>
                </div>

                <div className="flex items-center justify-between border border-[#e5e7eb] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] bg-white">
                  <div className="font-body text-[14px] font-[400] text-[#374151]">Tuesday, 11:15 AM</div>
                  <div className="font-body text-[14px] text-[#9ca3af] line-through">Unavailable</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[55%]">
            <h3 className="font-hero text-[clamp(28px,3vw,42px)] font-[800] leading-[1.1] tracking-[-0.02em] text-[#0f0f10] mb-[20px]">
              Automated Calendar Sync
            </h3>

            <p className="font-body text-[17px] font-[400] leading-[1.7] text-[#374151] mb-[28px]">
              Velocity reads your practice management software in real-time, finds the exact slot, and books the patient without front-desk intervention.
            </p>

            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center gap-[12px]">
                <Check className="h-[14px] w-[14px] text-[#b5895a]" />
                <span className="font-body text-[15px] font-[400] text-[#374151]">Bi-directional EMR integration.</span>
              </div>

              <div className="flex items-center gap-[12px]">
                <Check className="h-[14px] w-[14px] text-[#b5895a]" />
                <span className="font-body text-[15px] font-[400] text-[#374151]">Provider-specific scheduling rules.</span>
              </div>

              <div className="flex items-center gap-[12px]">
                <Check className="h-[14px] w-[14px] text-[#b5895a]" />
                <span className="font-body text-[15px] font-[400] text-[#374151]">No double-bookings. Mathematical certainty.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [val1, setVal1] = useState(0);
  const [val2, setVal2] = useState(0);
  const [val3, setVal3] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const duration = 1800;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    function animate(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = ease(t);
      setVal1(Math.round(42 * eased));
      setVal2(parseFloat((3 * eased).toFixed(2)));
      setVal3(parseFloat((3.2 * eased).toFixed(2)));

      if (t < 1) requestAnimationFrame(animate);
    }

    const raf1 = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf1);
  }, [visible]);

  return (
    <section id="results" style={{ scrollMarginTop: 'var(--header-height)' }} className="relative w-full bg-[#0a0a0a] text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)' }} />

      <div ref={ref} className="mx-auto relative max-w-[1440px] px-[24px] md:px-[40px] lg:px-[80px] py-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-[rgba(255,255,255,0.08)]">
          <div className="flex flex-col items-start px-0 py-[48px] border-b border-[rgba(255,255,255,0.08)] last:border-b-0 md:py-0 md:border-b-0 md:px-[32px] lg:px-[72px]">
            <div style={{ textShadow: '0 0 80px rgba(201,169,122,0.15)' }} className="font-hero text-[clamp(58px,12vw,84px)] md:text-[clamp(56px,7vw,84px)] lg:text-[clamp(64px,8vw,100px)] font-[800] leading-[1] tracking-[-0.03em]">
              <span className="text-white">{val1}</span>
              <span className="text-[#c9a97a]">%</span>
            </div>

            <div className="mt-[24px] mb-[12px]">
              <span className="block h-[1px] w-[24px] bg-[#c9a97a] mb-[16px]" />
              <div className="font-mono-ui text-[14px] font-[500] tracking-[0.2em] uppercase text-[rgb(245,242,242)]">RECOVERY RATE</div>
            </div>

            <div className="max-w-[280px] text-[14px] font-body text-[rgba(255,255,255,0.6)]">
              Of all missed calls converted to scheduled appointments automatically.
            </div>
          </div>

          <div className="flex flex-col items-start px-0 py-[48px] border-b border-[rgba(255,255,255,0.08)] last:border-b-0 md:py-0 md:border-b-0 md:px-[32px] lg:px-[72px]">
            <div style={{ textShadow: '0 0 80px rgba(201,169,122,0.15)' }} className="font-hero text-[clamp(58px,12vw,84px)] md:text-[clamp(56px,7vw,84px)] lg:text-[clamp(64px,8vw,100px)] font-[800] leading-[1] tracking-[-0.03em]">
              <span className="text-white">&lt;{Math.round(val2)}</span>
              <span className="text-[#c9a97a]">m</span>
            </div>

            <div className="mt-[24px] mb-[12px]">
              <span className="block h-[1px] w-[24px] bg-[#c9a97a] mb-[16px]" />
              <div className="font-mono-ui text-[14px] font-[500] tracking-[0.2em] uppercase text-[rgb(245,242,242)]">ENGAGEMENT TIME</div>
            </div>

            <div className="max-w-[280px] text-[14px] font-body text-[rgba(255,255,255,0.6)]">
              Average time from abandoned call to initial AI response protocol.
            </div>
          </div>

          <div className="flex flex-col items-start px-0 py-[48px] border-b border-[rgba(255,255,255,0.08)] last:border-b-0 md:py-0 md:border-b-0 md:px-[32px] lg:px-[72px]">
            <div style={{ textShadow: '0 0 80px rgba(201,169,122,0.15)' }} className="font-hero text-[clamp(58px,12vw,84px)] md:text-[clamp(56px,7vw,84px)] lg:text-[clamp(64px,8vw,100px)] font-[800] leading-[1] tracking-[-0.03em]">
              <span className="text-white">{val3.toFixed(1)}</span>
              <span className="text-[#c9a97a]">x</span>
            </div>

            <div className="mt-[24px] mb-[12px]">
              <span className="block h-[1px] w-[24px] bg-[#c9a97a] mb-[16px]" />
              <div className="font-mono-ui text-[14px] font-[500] tracking-[0.2em] uppercase text-[rgb(245,242,242)]">90-DAY ROI</div>
            </div>

            <div className="max-w-[280px] text-[14px] font-body text-[rgba(255,255,255,0.6)]">
              Verified revenue multiplier measured against platform subscription cost.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[860px] px-[24px] md:px-[40px] lg:px-[80px] py-[80px] md:py-[100px] lg:py-[120px] text-center">
        <div className="font-hero text-[clamp(26px,4vw,52px)] font-[500] leading-[1.2] tracking-[-0.02em] text-[#0f0f10] mb-[48px]">
          "Velocity fundamentally changed our unit economics. We thought we had a lead volume problem. We actually had a capture problem."
        </div>

        <div className="mx-auto w-[40px] h-[1px] bg-[#e5e7eb] mb-[32px]" />

        <div className="flex flex-col items-center gap-[6px]">
          <div className="font-body text-[16px] font-[500] text-[#0f0f10]">Dr. Sarah Jenkins, MD</div>
          <div className="font-mono-ui text-[11px] font-[400] tracking-[0.15em] uppercase text-[#9ca3af]">FOUNDER, ADVANCED DERMATOLOGY PARTNERS</div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCardsSection() {
  return (
    <section className="w-full bg-white mlr-auto">
      <div className="mx-auto max-w-[1520px] px-[24px] md:px-[40px] lg:px-[80px] pt-0 pb-[100px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          <div className="border border-[#e5e7eb] rounded-[12px] px-[24px] py-[28px] md:p-[28px] lg:p-[40px] min-h-[260px] flex flex-col justify-between max-w-full">
            <div className="text-[16px] font-body font-[400] leading-[1.75] text-[#374151] mb-[32px]">
              "Most healthcare SaaS feels like a toy. Velocity feels like a clinical instrument. It runs quietly in the background, and every Monday I look at a dashboard showing tens of thousands in recovered revenue."
            </div>

            <div className="flex flex-col gap-[4px]">
              <div className="font-body text-[15px] font-[500] text-[#0f0f10]">Marcus Chen</div>
              <div className="font-mono-ui text-[11px] font-[400] tracking-[0.12em] uppercase text-[#9ca3af]">DIRECTOR OF OPERATIONS, PACIFIC DENTAL</div>
            </div>
          </div>

          <div className="border border-[#e5e7eb] rounded-[12px] px-[24px] py-[28px] md:p-[28px] lg:p-[40px] min-h-[260px] flex flex-col justify-between max-w-full">
            <div className="text-[16px] font-body font-[400] leading-[1.75] text-[#374151] mb-[32px]">
              "We were losing patients to competitors simply because they answered the phone faster. Velocity leveled the playing field instantly. The AI voice is so natural, patients don't even realize they're talking to a system until they show up."
            </div>

            <div className="flex flex-col gap-[4px]">
              <div className="font-body text-[15px] font-[500] text-[#0f0f10]">Elena Rostova</div>
              <div className="font-mono-ui text-[11px] font-[400] tracking-[0.12em] uppercase text-[#9ca3af]">PRACTICE MANAGER, NY CARDIOLOGY</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQAccordionSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" style={{ scrollMarginTop: 'var(--header-height)' }} className="w-full bg-[#fafafa]">
      <div className="mx-auto w-full max-w-[760px] px-[20px] py-[80px] md:px-[40px] md:py-[100px]">
        <h2 className="mb-[56px] text-center font-hero text-[clamp(28px,3.5vw,44px)] font-[700] tracking-[-0.02em] text-[#0f0f10]">
          Rigorous Evaluation
        </h2>

        <div className="flex flex-col gap-[12px]">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className="group rounded-[10px] border border-[#e5e7eb] bg-white transition-all duration-200 hover:border-[#d1d5db] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-[16px] px-[18px] py-[20px] text-left md:px-[28px] md:py-[24px]"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="font-body text-[15px] md:text-[16px] font-[500] leading-[1.5] text-[#0f0f10]">
                    {item.question}
                  </span>

                  <ChevronDown
                    className={`h-[18px] w-[18px] shrink-0 text-[#9ca3af] transition-transform duration-[250ms] ease-in-out ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                <div
                  className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                  style={{ maxHeight: isOpen ? '220px' : '0px' }}
                >
                  <div className="mx-[18px] mb-[20px] border-t border-[#f3f4f6] pt-[16px] md:mx-[28px] md:mb-[24px]">
                    <p className="font-body text-[14px] md:text-[15px] font-[400] leading-[1.7] text-[#6b7280]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCtaFooterSection() {
  return (
    <div className="bg-[#0a0a0a] isolate">
      <section className="w-full bg-[#0a0a0a]">
        <div className="mx-auto flex max-w-[800px] flex-col items-center gap-[32px] px-[24px] md:px-[40px] lg:px-[80px] py-[100px] text-center">
          <h2 className="font-hero text-[clamp(32px,6vw,72px)] font-[600] leading-[1.1] tracking-[-0.03em] text-white">
            Stop losing what you've already earned.
          </h2>

          <p className="mx-auto max-w-[560px] font-body text-[16px] md:text-[18px] font-[400] leading-[1.65] text-[rgba(255,255,255,0.45)]">
            Deploy the intelligence that captures every opportunity in the margins of your practice.
          </p>

          <Link
            href="#"
            className="mt-[8px] inline-flex min-h-[44px] w-full max-w-[320px] items-center justify-center gap-[8px] rounded-[8px] bg-white px-[40px] py-[18px] font-body text-[16px] font-[600] text-[#0f0f10] transition-colors duration-200 hover:bg-[#f3f4f6] md:w-auto md:max-w-none"
          >
            Begin the Assessment →
          </Link>
        </div>
      </section>

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
            <span className="font-hero text-[14px] font-[700] tracking-[0.08em] text-white">
              VELOCITY
            </span>
          </Link>

          <nav className="order-2 flex w-full flex-wrap items-center justify-center gap-x-[24px] gap-y-[16px] sm:order-3 md:order-2 md:w-auto md:flex-1 md:gap-x-[32px] md:gap-y-[12px]">
            <Link href="#" className="font-mono-ui text-[11px] font-[400] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.79)]  transition-colors duration-200 hover:text-[rgba(255,255,255,0.7)]">
              Privacy
            </Link>
            <Link href="#" className="font-mono-ui text-[11px] font-[400] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.79)]  transition-colors duration-200 hover:text-[rgba(255,255,255,0.7)]">
              Terms
            </Link>
            <Link href="#" className="font-mono-ui text-[11px] font-[400] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.79)]  transition-colors duration-200 hover:text-[rgba(255,255,255,0.7)]">
              Compliance
            </Link>
            <Link href="#" className="font-mono-ui text-[11px] font-[400] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.79)] transition-colors duration-200 hover:text-[rgba(255,255,255,0.7)]">
              System Status
            </Link>
          </nav>

          <div className="order-3 sm:order-2 md:order-3 font-mono-ui text-[11px] font-[400] tracking-[0.05em] whitespace-nowrap text-[rgba(255,255,255,0.79)] ">
            © 2026 Velocity Health Intelligence, Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}