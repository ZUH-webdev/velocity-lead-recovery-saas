import Link from 'next/link';
import { ShieldCheck, Lock, Database, FileSearch, ArrowLeft } from 'lucide-react';

const pillars = [
  {
    title: 'HIPAA Alignment',
    description:
      'Strict access protocols, point-to-point database encryption mechanisms, and secure server isolation layers govern how patient data is handled across the platform.',
  },
  {
    title: 'SOC 2 Data Integrity',
    description:
      'Encrypted log pipelines, immutable backend user activity auditing configurations, and token session validation rules preserve traceability and operational accountability.',
  },
  {
    title: 'Data Encryption Standards',
    description:
      'AES-256 data-at-rest cryptographic protections and TLS 1.3 data-in-transit pipelines protect PHI and related operational records end to end.',
  },
];

export default function ComplianceSecurityPage() {
  return (
    <main className="bg-gradient-to-b from-slate-50 via-slate-100 to-zinc-200/50 min-h-screen w-full py-20 px-4 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[580px] h-[380px] bg-slate-200/40 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-8 md:p-14 relative z-10">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-900" />
              [ ENTERPRISE TRUST ]
            </div>

            <div>
              <h1 className="font-serif text-slate-950 text-4xl md:text-5xl font-normal tracking-tight">
                Security &amp; Compliance Framework
              </h1>
              <p className="mt-4 max-w-3xl text-slate-600 leading-relaxed text-sm md:text-base">
                Velocity is built to safeguard protected health information (PHI) with healthcare-grade controls spanning
                access governance, encryption, system integrity, and auditability. Our operating model is designed for
                clinical SaaS environments where privacy, resilience, and traceable administrative actions are mandatory.
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </div>

        <section className="mt-10">
          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.02)]"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Active Control</span>
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-slate-900 font-semibold text-lg">{pillar.title}</h2>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-r-xl border-l-2 border-slate-900 bg-slate-50 p-5 md:p-6">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-lg">
            <FileSearch className="h-4 w-4 text-slate-500" />
            Security Control Logs
          </div>
          <div className="mt-4 space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
            <p>
              Server security operations are continuously monitored through structured alerting, access-event review,
              and segmented infrastructure controls that limit exposure across clinical tenants.
            </p>
            <p>
              System penetration cycles are conducted on a recurring schedule to identify configuration drift,
              authentication weaknesses, and application-layer attack surfaces before they can impact production workflows.
            </p>
            <p>
              Automated backend compliance monitoring evaluates encryption status, session validation, privilege changes,
              and log consistency so deviations can be escalated quickly and recorded for audit readiness.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              'Server hardening checks',
              'Pen test cadence tracking',
              'Automated audit escalation',
            ].map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500 leading-relaxed">
          These controls support enterprise trust expectations for healthcare and clinical SaaS deployments while keeping
          PHI handling narrow, measurable, and reviewable.
        </div>
      </div>
    </main>
  );
}