import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LegalPageLayout from '../../../components/LegalPageLayout';
import { LegalList, LegalParagraph, LegalSection } from '../../../components/LegalComponents';

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
    <>
      <Header variant="dark" />
      <LegalPageLayout
        badge="Enterprise Trust"
        title="Security & Compliance Framework"
        subtitle="Velocity is built to safeguard protected health information (PHI) with healthcare-grade controls spanning access governance, encryption, system integrity, and auditability. Our operating model is designed for clinical SaaS environments where privacy, resilience, and traceable administrative actions are mandatory."
      >
        <LegalSection title="Active Controls">
          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between border-b border-[#f4f4f5] pb-3">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#a1a1aa]">Active Control</span>
                  <div className="h-2.5 w-2.5 rounded-full bg-[#16a34a]" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#09090b]">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#3f3f46]">{pillar.description}</p>
              </article>
            ))}
          </div>
        </LegalSection>

        <LegalSection title="Security Control Logs">
          <LegalParagraph>
            Server security operations are continuously monitored through structured alerting, access-event review,
            and segmented infrastructure controls that limit exposure across clinical tenants.
          </LegalParagraph>
          <LegalParagraph>
            System penetration cycles are conducted on a recurring schedule to identify configuration drift,
            authentication weaknesses, and application-layer attack surfaces before they can impact production
            workflows.
          </LegalParagraph>
          <LegalParagraph>
            Automated backend compliance monitoring evaluates encryption status, session validation, privilege
            changes, and log consistency so deviations can be escalated quickly and recorded for audit readiness.
          </LegalParagraph>
          <LegalList items={['Server hardening checks', 'Pen test cadence tracking', 'Automated audit escalation']} />
        </LegalSection>

        <div className="mt-4 border-t border-[#e4e4e7] pt-6 text-sm leading-relaxed text-[#71717a]">
          These controls support enterprise trust expectations for healthcare and clinical SaaS deployments while
          keeping PHI handling narrow, measurable, and reviewable.
        </div>
      </LegalPageLayout>
      <Footer />
    </>
  );
}
