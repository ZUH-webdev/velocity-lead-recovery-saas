'use client';

import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';

type Tab = 'profile' | 'business' | 'integrations' | 'notifications';

const tabs: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'business', label: 'Business' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'notifications', label: 'Notifications' },
];

const businessTypes = ['Dental', 'Med Spa', 'Real Estate', 'Other'];

const integrations = [
  { id: 'twilio', name: 'Twilio', type: 'toggle' as const, connected: true },
  { id: 'google', name: 'Google Calendar', type: 'oauth' as const, connected: false },
  { id: 'calendly', name: 'Calendly', type: 'apikey' as const, connected: false },
  { id: 'ehr', name: 'EHR Platform', type: 'apikey' as const, connected: true },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative h-6 w-11 rounded-full transition ${enabled ? 'bg-[#c9a97a]' : 'bg-[#e4e4e7]'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${enabled ? 'left-[22px]' : 'left-0.5'}`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [integrationState, setIntegrationState] = useState(
    Object.fromEntries(integrations.map((i) => [i.id, i.connected])),
  );
  const [notifications, setNotifications] = useState({
    emailLeads: true,
    smsBookings: true,
    dailySummary: false,
    appointmentReminders: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-[#e4e4e7] pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-[#c9a97a] text-black'
                : 'text-[#71717a] hover:bg-white hover:text-[#09090b]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Profile</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-[#71717a]">Full Name</label>
                <input
                  defaultValue={user?.fullName || user?.name || ''}
                  className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[#71717a]">Email</label>
                <input
                  defaultValue={user?.email || ''}
                  type="email"
                  className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[#71717a]">Avatar</label>
                <input type="file" accept="image/*" className="text-sm text-[#71717a]" />
              </div>
              <button type="button" className="rounded-lg bg-[#c9a97a] px-4 py-2 text-sm font-medium text-black hover:opacity-90">
                Save Profile
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Change Password</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-[#71717a]">Current Password</label>
                <input type="password" className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[#71717a]">New Password</label>
                <input type="password" className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[#71717a]">Confirm Password</label>
                <input type="password" className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none" />
              </div>
              <button type="button" className="rounded-lg border border-[#e4e4e7] px-4 py-2 text-sm font-medium text-[#09090b] hover:bg-[#f4f4f5]">
                Update Password
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === 'business' ? (
        <div className="max-w-xl rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Business Settings</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs text-[#71717a]">Business Name</label>
              <input defaultValue="Dr. Smith Dental" className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#71717a]">Phone Number</label>
              <input defaultValue="(555) 123-4567" className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#71717a]">Website</label>
              <input defaultValue="https://drsmithdental.com" className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#71717a]">Business Type</label>
              <select className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none">
                {businessTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#71717a]">Timezone</label>
              <select className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none">
                <option>America/New_York</option>
                <option>America/Chicago</option>
                <option>America/Denver</option>
                <option>America/Los_Angeles</option>
              </select>
            </div>
            <button type="button" className="rounded-lg bg-[#c9a97a] px-4 py-2 text-sm font-medium text-black hover:opacity-90">
              Save Business Settings
            </button>
          </div>
        </div>
      ) : null}

      {activeTab === 'integrations' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {integrations.map((integration) => {
            const connected = integrationState[integration.id];
            return (
              <div key={integration.id} className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fafafa] text-xs font-bold text-[#c9a97a]">
                      {integration.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[#09090b]">{integration.name}</p>
                      <span
                        className={`text-xs ${connected ? 'text-[#16a34a]' : 'text-[#71717a]'}`}
                      >
                        {connected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                  <Toggle
                    enabled={connected}
                    onChange={(v) => setIntegrationState((s) => ({ ...s, [integration.id]: v }))}
                  />
                </div>
                {integration.type === 'toggle' && connected ? (
                  <div className="mt-4 space-y-3">
                    <input placeholder="Account SID" className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none" />
                    <input placeholder="Auth Token" type="password" className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none" />
                  </div>
                ) : null}
                {integration.type === 'oauth' ? (
                  <button type="button" className="mt-4 rounded-lg bg-[#c9a97a] px-4 py-2 text-sm font-medium text-black hover:opacity-90">
                    Connect with Google
                  </button>
                ) : null}
                {integration.type === 'apikey' ? (
                  <input
                    placeholder="API Key"
                    type="password"
                    className="mt-4 w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {activeTab === 'notifications' ? (
        <div className="max-w-xl space-y-4">
          {[
            { key: 'emailLeads' as const, label: 'Email alerts for new leads' },
            { key: 'smsBookings' as const, label: 'SMS alerts for new bookings' },
            { key: 'dailySummary' as const, label: 'Daily summary email' },
            { key: 'appointmentReminders' as const, label: 'Appointment reminder notifications' },
          ].map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl border border-[#e4e4e7] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <span className="text-sm text-[#09090b]">{label}</span>
              <Toggle
                enabled={notifications[key]}
                onChange={(v) => setNotifications((n) => ({ ...n, [key]: v }))}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
