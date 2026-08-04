import type { Metadata } from 'next';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LegalPageLayout from '../../../components/LegalPageLayout';
import { LegalIntro, LegalParagraph, LegalSection } from '../../../components/LegalComponents';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Velocity collects, processes, and retains data — including AI data handling — to support missed-call recovery and appointment booking for our clients.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <LegalPageLayout badge="Compliance Protocol" title="Privacy Policy" lastUpdated="June 2, 2026">
        <LegalIntro>
          We protect clinical and operational data with a narrow, purpose-built privacy posture. Velocity only
          processes the information needed to recover missed opportunities, support patient communication workflows,
          and keep partners in control of their records. We do not sell customer data, and we keep processing
          boundaries tightly scoped to the services our clients authorize.
        </LegalIntro>

        <LegalSection number={1} title="Data Collection">
          <LegalParagraph>
            Velocity collects only the operational data required to run the platform. That includes Lead phone
            strings, SMS transaction histories, call recordings, call metadata, appointment status updates, and
            user-authored configuration fields that help route and recover missed interactions.
          </LegalParagraph>
          <LegalParagraph>
            In practice, these inputs are used to identify missed-call events, generate follow-up actions, track
            delivery outcomes, and preserve the audit trail our clinical partners need for internal review and
            compliance checks. We keep the collection scope limited to the smallest useful data set for the workflow
            in use.
          </LegalParagraph>
        </LegalSection>

        <LegalSection number={2} title="AI & Data Processing">
          <LegalParagraph>
            Our AI engines process customer data within secure, isolated execution loops. Internal Knowledge
            Documents and semantic chunk vectors are analyzed only to support retrieval, routing, and message
            generation functions that belong to the service you have enabled.
          </LegalParagraph>
          <LegalParagraph>
            We do not allow unrestricted model access to raw systems data. Instead, data is segmented, scoped, and
            handled inside controlled privacy boundaries so the system can respond intelligently without broad
            exposure of unrelated records. Access to these loops is restricted, logged, and evaluated against service
            necessity.
          </LegalParagraph>
          <LegalParagraph>
            When AI outputs are generated, they are constrained by the source documents, workflow rules, and
            tenant-level permissions associated with the customer environment. This helps ensure the system stays
            operationally useful while preserving the confidentiality of partner data.
          </LegalParagraph>
        </LegalSection>

        <LegalSection number={3} title="Data Retention">
          <LegalParagraph>
            Retention is driven by compliance preservation variables, account status, operational necessity, and
            contractual obligations. We retain records only as long as required to deliver the service, support
            customer workflows, satisfy legal duties, or maintain traceability for regulated operations.
          </LegalParagraph>
          <LegalParagraph>
            When a tenant requests deletion or offboarding, we follow controlled disposal procedures aligned to the
            data type involved, preserving only what must remain for security logs, dispute resolution, or legal
            hold. Backup cycles, deletion queues, and retention windows are reviewed to keep disposal consistent with
            privacy and compliance commitments.
          </LegalParagraph>
        </LegalSection>

        <div className="mt-4 border-t border-[#e4e4e7] pt-6 text-sm leading-relaxed text-[#71717a]">
          Questions about this policy can be directed to your Velocity account representative or the privacy contact
          listed in your service agreement.
        </div>
      </LegalPageLayout>
      <Footer />
    </>
  );
}
