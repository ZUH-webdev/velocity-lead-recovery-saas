import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  PhoneMissed,
  MessageSquare,
  Mic,
  CalendarCheck2,
  BarChart3,
  RefreshCcw,
  BellRing,
  History,
} from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Whitepaper: The Cost of the Missed Call',
  description:
    'How AI-powered recovery turns your busiest, highest-intent moments — the calls you can’t answer — into booked appointments instead of lost revenue.',
};

const steps = [
  {
    title: 'Detect',
    body: 'A call to your business line goes unanswered. Velocity’s Twilio integration catches the missed-call event in real time.',
  },
  {
    title: 'Engage',
    body: 'Within seconds, an AI-driven SMS conversation opens with the caller, acknowledging the missed call and asking how it can help — no hold music, no callback queue.',
  },
  {
    title: 'Qualify',
    body: 'The conversation asks the right follow-up questions (what they need, when they’re available) and scores the lead based on intent.',
  },
  {
    title: 'Book',
    body: 'Once qualified, Velocity checks your connected calendar and books the appointment directly, no back-and-forth required.',
  },
  {
    title: 'Remind',
    body: 'Automated reminders reduce no-shows between booking and the appointment date.',
  },
];

const capabilities = [
  {
    icon: PhoneMissed,
    title: 'Missed-Call Recovery',
    body: 'Every unanswered call automatically becomes a follow-up conversation, not a lost lead.',
  },
  {
    icon: MessageSquare,
    title: 'AI SMS Conversations',
    body: 'Natural, on-brand text conversations that qualify leads without a human typing a single message.',
  },
  {
    icon: Mic,
    title: 'AI Voice Agent',
    body: 'For calls that go straight to voicemail or after hours, an AI voice agent can answer, qualify, and book directly.',
  },
  {
    icon: CalendarCheck2,
    title: 'Real-Time Appointment Booking',
    body: 'Leads are booked straight into your connected calendar the moment they qualify.',
  },
  {
    icon: BarChart3,
    title: 'Lead Scoring',
    body: 'Every conversation is scored so your team knows which leads need a human touch first.',
  },
  {
    icon: RefreshCcw,
    title: 'Calendar Sync',
    body: 'Two-way sync keeps Velocity and your existing calendar consistent, no double-booking.',
  },
  {
    icon: BellRing,
    title: 'Automated Reminders',
    body: 'Reduce no-shows with SMS reminders sent ahead of every booked appointment.',
  },
  {
    icon: History,
    title: 'Full Conversation History',
    body: 'Every lead’s full conversation and scoring history is visible to your front desk before they ever call back.',
  },
];

const industries = [
  {
    title: 'Dental & Orthodontic Practices',
    body: 'Same-day and emergency requests are the most time-sensitive calls you’ll ever get — and the easiest to lose to the next practice on the list.',
  },
  {
    title: 'Med Spas & Aesthetic Clinics',
    body: 'High-ticket consultations deserve a fast, polished response, even when the front desk is with a client.',
  },
  {
    title: 'Real Estate Teams',
    body: 'A buyer calling about a listing is calling three other agents too. Speed to response is the deal.',
  },
  {
    title: 'Salons & Specialty Services',
    body: 'Recurring clients rebooking or new clients inquiring — both convert better with an immediate reply.',
  },
];

const costRows = [
  { label: 'Missed calls per week', value: '20 (example)' },
  { label: 'Estimated close rate if reached quickly', value: '30% (example)' },
  { label: 'Average appointment value', value: '$250 (example)' },
  { label: 'Recoverable weekly revenue', value: '~$1,500' },
  { label: 'Recoverable annual revenue', value: '~$78,000' },
];

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono-ui text-[12px] font-[500] uppercase tracking-[0.12em] text-[#c9a97a]">
      {children}
    </span>
  );
}

export default function WhitepaperPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-heading text-[#111827]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(17,24,39,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,24,39,0.045)_1px,transparent_1px)] bg-[size:43px_43px] opacity-[0.26]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),rgba(255,255,255,0.98)_38%,rgba(255,255,255,1)_72%)]" />

      <div className="relative">
        <Header />

        <main style={{ paddingTop: 'var(--header-height)' }}>
          {/* Cover / Hero */}
          <section className="mx-auto max-w-[1440px] px-[24px] pb-[70px] pt-[60px] md:px-[40px] md:pb-[90px] md:pt-[80px] lg:px-[80px]">
            <div className="mx-auto max-w-[760px] text-center">
              <span className="inline-flex h-[31px] items-center gap-[9px] rounded-full border border-[#e6eaef] bg-white px-[14px] font-mono-ui text-[11px] font-[400] uppercase tracking-[0.14em] text-[#678096] shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                <span className="h-[9px] w-[9px] rounded-full bg-[#c9a97a]" />
                Whitepaper
              </span>

              <h1 className="mt-[32px] font-hero text-[clamp(32px,7vw,64px)] font-[600] leading-[1.1] tracking-[-0.02em] text-[#0f0f10]">
                The Cost of the Missed Call
              </h1>

              <p className="mx-auto mt-[24px] max-w-[620px] font-body text-[17px] font-[400] leading-[1.7] text-[#4b5563] md:text-[18px]">
                How AI-powered recovery turns your busiest, highest-intent moments — the calls you can&apos;t answer —
                into booked appointments instead of lost revenue.
              </p>

              <p className="mt-[24px] font-mono-ui text-[11px] font-[400] uppercase tracking-[0.14em] text-[#9ca3af]">
                8 min read &middot; Updated August 2026
              </p>
            </div>
          </section>

          {/* Executive Summary */}
          <section className="border-t border-[#e5e7eb]">
            <div className="mx-auto max-w-[1440px] px-[24px] py-[70px] md:px-[40px] md:py-[90px] lg:px-[80px]">
              <div className="mx-auto max-w-[760px]">
                <SectionEyebrow>Executive Summary</SectionEyebrow>
                <h2 className="mt-[20px] font-hero text-[clamp(26px,3.6vw,38px)] font-[500] leading-[1.15] tracking-[-0.02em] text-[#0f0f10]">
                  Executive Summary
                </h2>

                <div className="mt-[28px] flex flex-col gap-[22px] font-body text-[16px] font-[400] leading-[1.75] text-[#374151] md:text-[17px]">
                  <p>
                    Every local business built on inbound calls — dental practices, med spas, real estate teams, salons
                    — runs into the same wall: the phone rings during the exact moment staff can least afford to pick
                    it up. Mid-procedure. Mid-appointment. After hours. The caller doesn&apos;t leave a voicemail. They call
                    the next name on their list instead.
                  </p>
                  <p>
                    This is not a staffing problem. It&apos;s a timing problem, and timing problems are exactly what
                    automation is good at solving. Velocity detects the missed call the moment it happens, opens an
                    AI-driven SMS conversation with the caller within seconds, qualifies their intent, and books the
                    appointment directly into your calendar — all before they&apos;ve had a chance to call your
                    competitor.
                  </p>
                  <p>
                    This whitepaper walks through the mechanics of that recovery, what it costs a typical practice to
                    leave it unaddressed, and how Velocity&apos;s architecture keeps every conversation compliant,
                    on-brand, and handed off cleanly to your front desk.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* The Problem */}
          <section className="border-t border-[#e5e7eb] bg-[#FAFAFA]">
            <div className="mx-auto max-w-[1440px] px-[24px] py-[70px] md:px-[40px] md:py-[90px] lg:px-[80px]">
              <div className="mx-auto max-w-[760px]">
                <SectionEyebrow>The Problem</SectionEyebrow>
                <h2 className="mt-[20px] font-hero text-[clamp(26px,3.6vw,38px)] font-[500] leading-[1.2] tracking-[-0.02em] text-[#0f0f10]">
                  Every Unanswered Call Is a Decision Being Made Without You
                </h2>

                <div className="mt-[28px] flex flex-col gap-[22px] font-body text-[16px] font-[400] leading-[1.75] text-[#374151] md:text-[17px]">
                  <p>
                    Local service businesses lose leads not because demand is weak, but because the moment of highest
                    intent — someone picking up the phone to book — is also the moment staff are least available to
                    answer. A patient calling about a same-day appointment, a homebuyer calling about a listing, a client
                    trying to rebook: if the call isn&apos;t answered live, most won&apos;t leave a voicemail. They&apos;ll
                    call the next result on their search instead.
                  </p>
                  <p>
                    The gap between &lsquo;the phone rang&rsquo; and &lsquo;someone followed up&rsquo; is where revenue
                    quietly disappears — not tracked in any dashboard, not visible in any report, just a caller who
                    tried once and moved on.
                  </p>
                </div>

                <blockquote className="mt-[40px] border-l-2 border-[#c9a97a] pl-[24px] font-hero text-[clamp(20px,2.6vw,28px)] font-[500] leading-[1.35] tracking-[-0.01em] text-[#c9a97a]">
                  &ldquo;The lead was never lost. It was never followed up with fast enough.&rdquo;
                </blockquote>
              </div>
            </div>
          </section>

          {/* The Hidden Cost */}
          <section className="border-t border-[#e5e7eb]">
            <div className="mx-auto max-w-[1440px] px-[24px] py-[70px] md:px-[40px] md:py-[90px] lg:px-[80px]">
              <div className="mx-auto max-w-[760px]">
                <SectionEyebrow>The Hidden Cost</SectionEyebrow>
                <h2 className="mt-[20px] font-hero text-[clamp(26px,3.6vw,38px)] font-[500] leading-[1.2] tracking-[-0.02em] text-[#0f0f10]">
                  What a Missed Call Actually Costs
                </h2>

                <p className="mt-[24px] font-body text-[16px] font-[400] leading-[1.75] text-[#374151] md:text-[17px]">
                  The math is simple once you run it — plug in your own numbers to see where you stand:
                </p>

                <div className="mt-[32px] overflow-hidden rounded-[14px] border border-[#eceff3] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
                  {costRows.map((row, i) => (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between gap-[16px] px-[20px] py-[16px] md:px-[28px] ${
                        i !== costRows.length - 1 ? 'border-b border-[#eceff3]' : ''
                      } ${i >= costRows.length - 2 ? 'bg-[rgba(201,169,122,0.06)]' : ''}`}
                    >
                      <span className="font-body text-[14px] font-[400] text-[#6b7280] md:text-[15px]">
                        {row.label}
                      </span>
                      <span
                        className={`font-mono-ui text-[14px] font-[500] md:text-[15px] ${
                          i >= costRows.length - 2 ? 'text-[#c9a97a]' : 'text-[#111827]'
                        }`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-[16px] font-body text-[13px] font-[400] leading-[1.6] text-[#9ca3af]">
                  These are illustrative figures for a mid-sized practice. Replace with your own call volume and average
                  ticket size to estimate your recovery potential.
                </p>
              </div>
            </div>
          </section>

          {/* The Solution */}
          <section className="border-t border-[#e5e7eb] bg-[#FAFAFA]">
            <div className="mx-auto max-w-[1440px] px-[24px] py-[70px] md:px-[40px] md:py-[90px] lg:px-[80px]">
              <div className="mx-auto max-w-[760px]">
                <SectionEyebrow>The Solution</SectionEyebrow>
                <h2 className="mt-[20px] font-hero text-[clamp(26px,3.6vw,38px)] font-[500] leading-[1.2] tracking-[-0.02em] text-[#0f0f10]">
                  How Velocity Recovers the Conversation
                </h2>

                <p className="mt-[24px] font-body text-[16px] font-[400] leading-[1.75] text-[#374151] md:text-[17px]">
                  Velocity doesn&apos;t try to prevent missed calls — it makes them irrelevant. The moment a call goes
                  unanswered, Velocity takes over the follow-up automatically, in the channel callers already prefer:
                  text message.
                </p>

                <div className="mt-[44px] flex flex-col gap-[32px]">
                  {steps.map((step, i) => (
                    <div key={step.title} className="flex gap-[20px] md:gap-[28px]">
                      <div className="flex flex-col items-center">
                        <span className="font-hero text-[22px] font-[600] text-[#c9a97a]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {i !== steps.length - 1 && (
                          <span className="mt-[8px] w-[1px] flex-1 bg-[#e5e7eb]" />
                        )}
                      </div>
                      <div className="pb-[4px]">
                        <h3 className="font-heading text-[17px] font-[700] text-[#0f0f10]">{step.title}</h3>
                        <p className="mt-[8px] font-body text-[15px] font-[400] leading-[1.7] text-[#6b7280]">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Core Capabilities */}
          <section className="border-t border-[#e5e7eb]">
            <div className="mx-auto max-w-[1200px] px-[24px] py-[70px] md:px-[40px] md:py-[90px] lg:px-[80px]">
              <div className="mx-auto max-w-[760px]">
                <SectionEyebrow>Core Capabilities</SectionEyebrow>
                <h2 className="mt-[20px] font-hero text-[clamp(26px,3.6vw,38px)] font-[500] leading-[1.2] tracking-[-0.02em] text-[#0f0f10]">
                  What&apos;s Under the Hood
                </h2>
              </div>

              <div className="mt-[44px] grid grid-cols-1 gap-[20px] sm:grid-cols-2 lg:grid-cols-4">
                {capabilities.map((cap) => (
                  <div
                    key={cap.title}
                    className="rounded-[12px] border border-[#e5e7eb] bg-white p-[22px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-colors duration-200 hover:border-[rgba(201,169,122,0.4)]"
                  >
                    <div className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-[8px] border border-[#e5e7eb] bg-white text-[#0f0f10] shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
                      <cap.icon size={18} />
                    </div>
                    <h3 className="mt-[16px] font-heading text-[15px] font-[700] text-[#0f0f10]">{cap.title}</h3>
                    <p className="mt-[8px] font-body text-[13px] font-[400] leading-[1.6] text-[#6b7280]">
                      {cap.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Industries */}
          <section className="border-t border-[#e5e7eb] bg-[#FAFAFA]">
            <div className="mx-auto max-w-[1200px] px-[24px] py-[70px] md:px-[40px] md:py-[90px] lg:px-[80px]">
              <div className="mx-auto max-w-[760px]">
                <SectionEyebrow>Built For These Industries</SectionEyebrow>
                <h2 className="mt-[20px] font-hero text-[clamp(26px,3.6vw,38px)] font-[500] leading-[1.2] tracking-[-0.02em] text-[#0f0f10]">
                  Where Missed Calls Cost the Most
                </h2>
              </div>

              <div className="mt-[44px] grid grid-cols-1 gap-[20px] md:grid-cols-2">
                {industries.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[12px] border border-[#e5e7eb] bg-white p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                  >
                    <div className="mb-[12px] h-[1px] w-[24px] bg-[#c9a97a]" />
                    <h3 className="font-heading text-[16px] font-[700] text-[#0f0f10]">{item.title}</h3>
                    <p className="mt-[10px] font-body text-[14px] font-[400] leading-[1.7] text-[#6b7280]">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Security & Compliance */}
          <section className="border-t border-[#e5e7eb]">
            <div className="mx-auto max-w-[1440px] px-[24px] py-[70px] md:px-[40px] md:py-[90px] lg:px-[80px]">
              <div className="mx-auto max-w-[760px]">
                <SectionEyebrow>Security &amp; Compliance</SectionEyebrow>
                <h2 className="mt-[20px] font-hero text-[clamp(26px,3.6vw,38px)] font-[500] leading-[1.2] tracking-[-0.02em] text-[#0f0f10]">
                  Built to Handle Real Conversations Responsibly
                </h2>

                <p className="mt-[24px] font-body text-[16px] font-[400] leading-[1.75] text-[#374151] md:text-[17px]">
                  Automated outreach to real customers carries real compliance obligations. Velocity&apos;s messaging
                  infrastructure is built on Twilio&apos;s compliant messaging stack, with A2P registration handled per
                  business, opt-out language included in every automated conversation, and lead data isolated per tenant
                  at the database level. Practices handling patient information should still confirm their own
                  regulatory obligations (e.g. HIPAA) apply to how they use any communications tool, including Velocity.
                </p>
              </div>
            </div>
          </section>

          {/* Closing CTA */}
          <section className="border-t border-[#e5e7eb] bg-[#FAFAFA]">
            <div className="mx-auto flex max-w-[800px] flex-col items-center gap-[28px] px-[24px] py-[100px] text-center md:px-[40px] lg:px-[80px]">
              <h2 className="font-hero text-[clamp(28px,5vw,48px)] font-[600] leading-[1.15] tracking-[-0.02em] text-[#0f0f10]">
                See How Many Leads You&apos;re Currently Losing
              </h2>

              <p className="mx-auto max-w-[560px] font-body text-[16px] font-[400] leading-[1.65] text-[#6b7280] md:text-[17px]">
                Connect your business line and Velocity will show you what missed-call recovery looks like for your
                actual call volume — not an estimate.
              </p>

              <Link
                href="/sign-up"
                className="font-body mt-[8px] inline-flex min-h-[44px] w-full max-w-[320px] items-center justify-center gap-[12px] rounded-[6px] bg-[#0f172a] px-[28px] py-[16px] text-[15px] font-[600] tracking-[0.01em] text-white shadow-[0_8px_24px_rgba(15,23,42,0.18)] md:w-auto md:max-w-none"
              >
                Book a Demo
                <ArrowRight className="h-[18px] w-[18px] stroke-[2.2]" />
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
