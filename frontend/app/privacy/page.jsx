import Link from 'next/link';
import { Shield, Lock, Database, FileText, ArrowLeft, House } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-gradient-to-b from-slate-50 via-slate-100 to-zinc-200/50 min-h-screen w-full py-20 px-4 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[560px] h-[360px] bg-slate-200/40 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-8 md:p-14 relative z-10">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              <Shield className="h-3.5 w-3.5 text-slate-900" />
              [ COMPLIANCE PROTOCOL ]
            </div>

            <div>
              <h1 className="font-serif text-slate-950 text-4xl md:text-5xl font-normal tracking-tight">
                Privacy Policy
              </h1>
              <p className="mt-3 italic text-slate-600 leading-relaxed text-sm md:text-base">
                Last updated: June 2, 2026
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

        <div className="fixed right-4 top-4 z-20 sm:hidden">
          <Link
            href="/"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition hover:bg-slate-50 hover:text-slate-950"
            aria-label="Go back home"
          >
            <House className="h-5 w-5" />
          </Link>
        </div>

        <div className="mt-10 rounded-r-xl border-l-2 border-slate-900 bg-slate-50 p-5 text-sm text-slate-700 mb-10">
          We protect clinical and operational data with a narrow, purpose-built privacy posture. Velocity only processes the
          information needed to recover missed opportunities, support patient communication workflows, and keep partners in
          control of their records. We do not sell customer data, and we keep processing boundaries tightly scoped to the
          services our clients authorize.
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="flex items-center gap-2 text-slate-900 font-semibold text-lg font-sans">
              <Database className="h-4 w-4 text-slate-500" />
              1. Data Collection
            </h2>
            <div className="mt-3 space-y-4 text-slate-600 leading-relaxed">
              <p>
                Velocity collects only the operational data required to run the platform. That includes Lead phone strings,
                SMS transaction histories, call recordings, call metadata, appointment status updates, and user-authored
                configuration fields that help route and recover missed interactions.
              </p>
              <p>
                In practice, these inputs are used to identify missed-call events, generate follow-up actions, track delivery
                outcomes, and preserve the audit trail our clinical partners need for internal review and compliance checks.
                We keep the collection scope limited to the smallest useful data set for the workflow in use.
              </p>
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-slate-900 font-semibold text-lg font-sans">
              <Lock className="h-4 w-4 text-slate-500" />
              2. AI &amp; Data Processing
            </h2>
            <div className="mt-3 space-y-4 text-slate-600 leading-relaxed">
              <p>
                Our AI engines process customer data within secure, isolated execution loops. Internal Knowledge Documents
                and semantic chunk vectors are analyzed only to support retrieval, routing, and message generation functions
                that belong to the service you have enabled.
              </p>
              <p>
                We do not allow unrestricted model access to raw systems data. Instead, data is segmented, scoped, and
                handled inside controlled privacy boundaries so the system can respond intelligently without broad exposure
                of unrelated records. Access to these loops is restricted, logged, and evaluated against service necessity.
              </p>
              <p>
                When AI outputs are generated, they are constrained by the source documents, workflow rules, and tenant-level
                permissions associated with the customer environment. This helps ensure the system stays operationally
                useful while preserving the confidentiality of partner data.
              </p>
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-slate-900 font-semibold text-lg font-sans">
              <FileText className="h-4 w-4 text-slate-500" />
              3. Data Retention
            </h2>
            <div className="mt-3 space-y-4 text-slate-600 leading-relaxed">
              <p>
                Retention is driven by compliance preservation variables, account status, operational necessity, and
                contractual obligations. We retain records only as long as required to deliver the service, support customer
                workflows, satisfy legal duties, or maintain traceability for regulated operations.
              </p>
              <p>
                When a tenant requests deletion or offboarding, we follow controlled disposal procedures aligned to the data
                type involved, preserving only what must remain for security logs, dispute resolution, or legal hold. Backup
                cycles, deletion queues, and retention windows are reviewed to keep disposal consistent with privacy and
                compliance commitments.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500 leading-relaxed">
          Questions about this policy can be directed to your Velocity account representative or the privacy contact listed
          in your service agreement.
        </div>
      </div>
    </main>
  );
}