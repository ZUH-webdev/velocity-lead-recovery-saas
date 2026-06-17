'use client';

import { useState } from 'react';
import { useAuth } from '../../../src/context/AuthContext';

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
      className={`relative h-6 w-11 rounded-full transition ${enabled ? 'bg-[#c9a97a]' : 'bg-[#2a2a2a]'}`}
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
      <div className="flex flex-wrap gap-2 border-b border-[#2a2a2a] pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-[#c9a97a] text-black'
                : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-[#f5f5f5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
            <h3 className="text-xs uppercase tracking-widest text-[#888888]">Profile</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-[#888888]">Full Name</label>
                <input
                  defaultValue={user?.fullName || user?.name || ''}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[#888888]">Email</label>
                <input
                  defaultValue={user?.email || ''}
                  type="email"
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[#888888]">Avatar</label>
                <input type="file" accept="image/*" className="text-sm text-[#888888]" />
              </div>
              <button type="button" className="rounded-lg bg-[#c9a97a] px-4 py-2 text-sm font-medium text-black hover:opacity-90">
                Save Profile
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
            <h3 className="text-xs uppercase tracking-widest text-[#888888]">Change Password</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-[#888888]">Current Password</label>
                <input type="password" className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[#888888]">New Password</label>
                <input type="password" className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[#888888]">Confirm Password</label>
                <input type="password" className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none" />
              </div>
              <button type="button" className="rounded-lg border border-[#2a2a2a] px-4 py-2 text-sm font-medium text-[#f5f5f5] hover:bg-[#111111]">
                Update Password
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === 'business' ? (
        <div className="max-w-xl rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
          <h3 className="text-xs uppercase tracking-widest text-[#888888]">Business Settings</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs text-[#888888]">Business Name</label>
              <input defaultValue="Dr. Smith Dental" className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#888888]">Phone Number</label>
              <input defaultValue="(555) 123-4567" className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#888888]">Website</label>
              <input defaultValue="https://drsmithdental.com" className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#888888]">Business Type</label>
              <select className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none">
                {businessTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#888888]">Timezone</label>
              <select className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none">
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
              <div key={integration.id} className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111111] text-xs font-bold text-[#c9a97a]">
                      {integration.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[#f5f5f5]">{integration.name}</p>
                      <span
                        className={`text-xs ${connected ? 'text-[#4ade80]' : 'text-[#888888]'}`}
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
                    <input placeholder="Account SID" className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none" />
                    <input placeholder="Auth Token" type="password" className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none" />
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
                    className="mt-4 w-full rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none"
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
              className="flex items-center justify-between rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-5 py-4"
            >
              <span className="text-sm text-[#f5f5f5]">{label}</span>
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
