import Link from 'next/link';
import { ShieldCheck, Users, CreditCard, ArrowLeft, House } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <main className="bg-gradient-to-b from-slate-50 via-slate-100 to-zinc-200/50 min-h-screen w-full py-20 px-4 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[560px] h-[360px] bg-slate-200/40 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-8 md:p-14 relative z-10">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-900" />
              [ PLATFORM GOVERNANCE ]
            </div>

            <div>
              <h1 className="font-serif text-slate-950 text-4xl md:text-5xl font-normal tracking-tight">
                Terms of Service
              </h1>
              <p className="mt-3 italic text-slate-600 leading-relaxed text-sm md:text-base">
                Effective Date: June 2, 2026
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
          These Terms govern access to and use of the Velocity platform by business customers operating across one or more
          tenant workspaces. By provisioning an account, the customer confirms that it has authority to bind the
          underlying organization and accepts responsibility for the conduct of all authorized users.
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="flex items-center gap-2 text-slate-900 font-semibold text-lg">
              <Users className="h-4 w-4 text-slate-500" />
              1. Account &amp; Workspace Integrity
            </h2>
            <div className="mt-3 space-y-4 text-slate-600 leading-relaxed">
              <p>
                The provisioning organization creates a Tenant container that represents its clinical legal entity,
                operating group, or other designated business unit. Each Tenant is logically separated so configuration,
                records, and operational activity remain scoped to that workspace.
              </p>
              <p>
                The customer must safeguard all administrative user profiles associated with that Tenant. Credentials,
                permissions, and recovery controls must be managed as confidential access assets. The customer is
                responsible for all activity performed through authorized accounts, and it must promptly revoke access for
                users who no longer require it.
              </p>
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-slate-900 font-semibold text-lg">
              <ShieldCheck className="h-4 w-4 text-slate-500" />
              2. Usage Policies for Conversational AI
            </h2>
            <div className="mt-3 space-y-4 text-slate-600 leading-relaxed">
              <p>
                Any use of conversational AI, automated telephone dialers, messaging assistants, or WhatsApp engines must
                comply with applicable laws, carrier rules, privacy obligations, and global telecommunication standards.
                Customers may use the platform only for lawful business communications that fall within their consent and
                engagement framework.
              </p>
              <p>
                The customer must ensure that outreach timing, opt-out handling, identity disclosures, and message content
                remain aligned with the requirements that govern each jurisdiction in which it operates. Velocity may
                impose technical safeguards, throttles, or workflow restrictions when needed to reduce abuse, protect
                recipients, or preserve platform integrity.
              </p>
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-slate-900 font-semibold text-lg">
              <CreditCard className="h-4 w-4 text-slate-500" />
              3. Subscription &amp; Billing Mechanics
            </h2>
            <div className="mt-3 space-y-4 text-slate-600 leading-relaxed">
              <p>
                Billing is determined by a structured event matrix that tracks usage parameters such as call minutes, SMS
                counts, AI tokens, storage bytes, and any other metered activity defined in the applicable order form or
                service plan.
              </p>
              <p>
                Usage may be aggregated across one or more Tenant workspaces depending on the subscription model in effect.
                The customer authorizes Velocity to calculate fees based on the recorded usage events, apply plan-specific
                rates, and invoice the account on the cadence stated in the commercial agreement.
              </p>
              <p>
                If a billing dispute arises, the customer must notify us within the permitted review window. Unused capacity,
                credits, or promotional allowances are governed by the plan terms and do not automatically roll over unless
                expressly stated otherwise.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500 leading-relaxed">
          Continued access to the platform signifies acceptance of these terms and any updates published in accordance
          with the governing agreement.
        </div>
      </div>
    </main>
  );
}