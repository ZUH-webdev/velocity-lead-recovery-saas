import type { Metadata } from 'next';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LegalPageLayout from '../../../components/LegalPageLayout';
import { LegalSection, StatusBadge, type ServiceStatus } from '../../../components/LegalComponents';

export const metadata: Metadata = {
  title: 'System Status',
  description: 'Real-time operational status of all Velocity services, including the AI voice agent and SMS recovery engine.',
};

const services: { name: string; status: ServiceStatus }[] = [
  { name: 'AI Voice Agent', status: 'operational' },
  { name: 'SMS Recovery Engine', status: 'operational' },
  { name: 'Webhook Processing', status: 'operational' },
  { name: 'Dashboard API', status: 'operational' },
  { name: 'Email Notifications', status: 'operational' },
];

export default function SystemStatusPage() {
  return (
    <>
      <Header />
      <LegalPageLayout
        badge="System Monitoring"
        title="System Status"
        subtitle="Real-time operational status of all Velocity services."
      >
        <LegalSection title="Services">
          <div className="flex flex-col gap-2">
            {services.map(({ name, status }) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-[10px] border border-[#e4e4e7] bg-white px-5 py-3.5"
              >
                <span className="text-sm font-medium text-[#09090b]">{name}</span>
                <StatusBadge status={status} />
              </div>
            ))}
          </div>
        </LegalSection>
      </LegalPageLayout>
      <Footer />
    </>
  );
}
