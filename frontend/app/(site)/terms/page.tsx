import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LegalPageLayout from '../../../components/LegalPageLayout';
import { LegalIntro, LegalParagraph, LegalSection } from '../../../components/LegalComponents';

export default function TermsOfServicePage() {
  return (
    <>
      <Header variant="dark" />
      <LegalPageLayout badge="Platform Governance" title="Terms of Service" lastUpdated="June 2, 2026">
        <LegalIntro>
          These Terms govern access to and use of the Velocity platform by business customers operating across one
          or more tenant workspaces. By provisioning an account, the customer confirms that it has authority to bind
          the underlying organization and accepts responsibility for the conduct of all authorized users.
        </LegalIntro>

        <LegalSection number={1} title="Account & Workspace Integrity">
          <LegalParagraph>
            The provisioning organization creates a Tenant container that represents its clinical legal entity,
            operating group, or other designated business unit. Each Tenant is logically separated so configuration,
            records, and operational activity remain scoped to that workspace.
          </LegalParagraph>
          <LegalParagraph>
            The customer must safeguard all administrative user profiles associated with that Tenant. Credentials,
            permissions, and recovery controls must be managed as confidential access assets. The customer is
            responsible for all activity performed through authorized accounts, and it must promptly revoke access
            for users who no longer require it.
          </LegalParagraph>
        </LegalSection>

        <LegalSection number={2} title="Usage Policies for Conversational AI">
          <LegalParagraph>
            Any use of conversational AI, automated telephone dialers, messaging assistants, or WhatsApp engines must
            comply with applicable laws, carrier rules, privacy obligations, and global telecommunication standards.
            Customers may use the platform only for lawful business communications that fall within their consent
            and engagement framework.
          </LegalParagraph>
          <LegalParagraph>
            The customer must ensure that outreach timing, opt-out handling, identity disclosures, and message
            content remain aligned with the requirements that govern each jurisdiction in which it operates. Velocity
            may impose technical safeguards, throttles, or workflow restrictions when needed to reduce abuse, protect
            recipients, or preserve platform integrity.
          </LegalParagraph>
        </LegalSection>

        <LegalSection number={3} title="Subscription & Billing Mechanics">
          <LegalParagraph>
            Billing is determined by a structured event matrix that tracks usage parameters such as call minutes,
            SMS counts, AI tokens, storage bytes, and any other metered activity defined in the applicable order form
            or service plan.
          </LegalParagraph>
          <LegalParagraph>
            Usage may be aggregated across one or more Tenant workspaces depending on the subscription model in
            effect. The customer authorizes Velocity to calculate fees based on the recorded usage events, apply
            plan-specific rates, and invoice the account on the cadence stated in the commercial agreement.
          </LegalParagraph>
          <LegalParagraph>
            If a billing dispute arises, the customer must notify us within the permitted review window. Unused
            capacity, credits, or promotional allowances are governed by the plan terms and do not automatically roll
            over unless expressly stated otherwise.
          </LegalParagraph>
        </LegalSection>

        <div className="mt-4 border-t border-[#e4e4e7] pt-6 text-sm leading-relaxed text-[#71717a]">
          Continued access to the platform signifies acceptance of these terms and any updates published in
          accordance with the governing agreement.
        </div>
      </LegalPageLayout>
      <Footer />
    </>
  );
}
