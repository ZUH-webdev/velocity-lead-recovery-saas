'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useTenant } from '../../../../context/TenantContext';
import { api } from '../../../../lib/api';
import { getFriendlyError } from '../../../../lib/errors';

const IANA_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'UTC',
];

const MAX_AVATAR_BYTES = 3 * 1024 * 1024; // 3MB — keeps the base64 payload comfortably under the backend's 5MB cap

type Tab = 'profile' | 'business' | 'integrations' | 'notifications';

const tabs: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'business', label: 'Business' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'notifications', label: 'Notifications' },
];

const businessTypes = ['Dental', 'Med Spa', 'Real Estate', 'Other'];

type IntegrationId = 'twilio' | 'google' | 'calendly' | 'ehr';

interface IntegrationMeta {
  id: IntegrationId;
  name: string;
  description: string;
}

const integrationMeta: IntegrationMeta[] = [
  { id: 'twilio', name: 'Twilio', description: 'Missed-call SMS recovery, on your own dedicated Velocity number.' },
  { id: 'google', name: 'Google Calendar', description: 'Two-way appointment sync with your connected calendar.' },
];

type IntegrationStatus = Record<IntegrationId, { connected: boolean }>;

const defaultIntegrationStatus: IntegrationStatus = {
  twilio: { connected: false },
  google: { connected: false },
  calendly: { connected: false },
  ehr: { connected: false },
};

type TwilioConnectionStatus = 'not_connected' | 'provisioning' | 'active' | 'suspended';

interface TwilioStatus {
  connectionStatus: TwilioConnectionStatus;
  integrationEnabled: boolean;
  phoneNumber: string | null;
}

const defaultTwilioStatus: TwilioStatus = {
  connectionStatus: 'not_connected',
  integrationEnabled: false,
  phoneNumber: null,
};

interface CalendlyStatus {
  connected: boolean;
  name?: string;
  email?: string;
  schedulingUrl?: string;
}

const defaultCalendlyStatus: CalendlyStatus = { connected: false };

interface EhrStatus {
  connected: boolean;
  fhirBaseUrl?: string | null;
  clientId?: string | null;
}

const defaultEhrStatus: EhrStatus = { connected: false };

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

function CalendlyCard({
  status,
  onConnect,
  onDisconnect,
}: {
  status: CalendlyStatus;
  onConnect: (apiKey: string) => Promise<void>;
  onDisconnect: () => Promise<void>;
}) {
  const [apiKey, setApiKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!apiKey.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await onConnect(apiKey.trim());
      setApiKey('');
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDisconnect = async () => {
    setBusy(true);
    setError(null);
    try {
      await onDisconnect();
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fafafa] text-xs font-bold text-[#c9a97a]">CA</div>
        <div>
          <p className="font-medium text-[#09090b]">Calendly</p>
          <span className={`text-xs ${status.connected ? 'text-[#16a34a]' : 'text-[#71717a]'}`}>
            {status.connected ? `Connected${status.name ? ` as ${status.name}` : ''}` : 'Not connected'}
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs text-[#71717a]">
        {status.connected
          ? 'An alternate booking backend to Google Calendar — used for availability checks. New bookings go through your Calendly scheduling link, not created by Velocity directly.'
          : 'Connect a Calendly Personal Access Token to use Calendly instead of Google Calendar for availability.'}
      </p>

      {error ? <p className="mt-2 text-xs font-medium text-[#dc2626]">{error}</p> : null}

      {status.connected ? (
        <button
          type="button"
          disabled={busy}
          onClick={handleDisconnect}
          className="mt-4 rounded-lg border border-[#e4e4e7] px-4 py-2 text-sm font-medium text-[#09090b] hover:bg-[#f4f4f5] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? 'Working…' : 'Disconnect'}
        </button>
      ) : (
        <div className="mt-4 space-y-2">
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Personal Access Token"
            type="password"
            className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none"
          />
          <button
            type="button"
            disabled={busy || !apiKey.trim()}
            onClick={handleConnect}
            className="rounded-lg bg-[#c9a97a] px-4 py-2 text-sm font-medium text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? 'Validating…' : 'Connect Calendly'}
          </button>
        </div>
      )}
    </div>
  );
}

function EhrCard({
  status,
  onConnect,
  onDisconnect,
}: {
  status: EhrStatus;
  onConnect: (fields: { fhirBaseUrl: string; clientId: string; clientSecret: string }) => Promise<void>;
  onDisconnect: () => Promise<void>;
}) {
  const [fhirBaseUrl, setFhirBaseUrl] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = fhirBaseUrl.trim() && clientId.trim() && clientSecret.trim();

  const handleConnect = async () => {
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    try {
      await onConnect({ fhirBaseUrl: fhirBaseUrl.trim(), clientId: clientId.trim(), clientSecret: clientSecret.trim() });
      setClientSecret('');
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDisconnect = async () => {
    setBusy(true);
    setError(null);
    try {
      await onDisconnect();
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fafafa] text-xs font-bold text-[#c9a97a]">EH</div>
        <div>
          <p className="font-medium text-[#09090b]">EHR Platform (FHIR)</p>
          <span className={`text-xs ${status.connected ? 'text-[#16a34a]' : 'text-[#71717a]'}`}>
            {status.connected ? 'Connected' : 'Not connected'}
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs text-[#71717a]">
        {status.connected
          ? `Generic FHIR connector — ${status.fhirBaseUrl}. Only works with EHRs that expose a SMART on FHIR backend-services (client credentials) endpoint; some vendors (e.g. Epic) require additional app registration/BAA before this will connect.`
          : 'Connect any EHR that exposes a SMART on FHIR backend-services endpoint. Not a plug-and-play fit for every vendor — some require a signed BAA and app registration first.'}
      </p>

      {error ? <p className="mt-2 text-xs font-medium text-[#dc2626]">{error}</p> : null}

      {status.connected ? (
        <button
          type="button"
          disabled={busy}
          onClick={handleDisconnect}
          className="mt-4 rounded-lg border border-[#e4e4e7] px-4 py-2 text-sm font-medium text-[#09090b] hover:bg-[#f4f4f5] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? 'Working…' : 'Disconnect'}
        </button>
      ) : (
        <div className="mt-4 space-y-2">
          <input
            value={fhirBaseUrl}
            onChange={(e) => setFhirBaseUrl(e.target.value)}
            placeholder="FHIR base URL (e.g. https://ehr.example.com/fhir/r4)"
            className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none"
          />
          <input
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Client ID"
            className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none"
          />
          <input
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            placeholder="Client Secret"
            type="password"
            className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none"
          />
          <button
            type="button"
            disabled={busy || !canSubmit}
            onClick={handleConnect}
            className="rounded-lg bg-[#c9a97a] px-4 py-2 text-sm font-medium text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? 'Validating…' : 'Connect EHR'}
          </button>
        </div>
      )}
    </div>
  );
}

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return 'VL';
}

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { tenant, refetchTenant } = useTenant();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [integrations, setIntegrations] = useState<IntegrationStatus>(defaultIntegrationStatus);
  const [integrationsLoading, setIntegrationsLoading] = useState(true);
  const [pendingIntegration, setPendingIntegration] = useState<IntegrationId | null>(null);
  const [twilioStatus, setTwilioStatus] = useState<TwilioStatus>(defaultTwilioStatus);
  const [twilioBusy, setTwilioBusy] = useState(false);
  const [calendlyStatus, setCalendlyStatus] = useState<CalendlyStatus>(defaultCalendlyStatus);
  const [ehrStatus, setEhrStatus] = useState<EhrStatus>(defaultEhrStatus);
  const [integrationBanner, setIntegrationBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [notifications, setNotifications] = useState({
    emailLeads: true,
    smsBookings: true,
    dailySummary: false,
    appointmentReminders: true,
  });

  const displayName = user?.fullName || user?.name || '';
  const [fullNameInput, setFullNameInput] = useState(displayName);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [timezoneInput, setTimezoneInput] = useState('America/New_York');
  const [businessHoursStartInput, setBusinessHoursStartInput] = useState(9);
  const [businessHoursEndInput, setBusinessHoursEndInput] = useState(17);
  const [isSavingHours, setIsSavingHours] = useState(false);
  const [hoursSaveMessage, setHoursSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!tenant) return;
    setTimezoneInput(tenant.timezone);
    setBusinessHoursStartInput(tenant.businessHoursStart);
    setBusinessHoursEndInput(tenant.businessHoursEnd);
  }, [tenant]);

  const handleSaveBusinessHours = async () => {
    setIsSavingHours(true);
    setHoursSaveMessage(null);
    try {
      await api.put('/tenant', {
        timezone: timezoneInput,
        businessHoursStart: businessHoursStartInput,
        businessHoursEnd: businessHoursEndInput,
      });
      await refetchTenant();
      setHoursSaveMessage({ type: 'success', text: 'Timezone and business hours updated — used by the AI booking flow.' });
    } catch (err) {
      setHoursSaveMessage({ type: 'error', text: getFriendlyError(err) });
    } finally {
      setIsSavingHours(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_AVATAR_BYTES) {
      setSaveMessage({ type: 'error', text: 'Image is too large. Please choose a file under 3MB.' });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const payload: { fullName?: string; avatarURL?: string } = {
        fullName: fullNameInput.trim(),
      };
      if (avatarPreview) payload.avatarURL = avatarPreview;

      const res = await api.patch('/auth/me', payload);
      const updatedUser = res.data?.data?.user;
      if (updatedUser) updateUser(updatedUser);

      setSaveMessage({ type: 'success', text: 'Profile updated successfully.' });
      setAvatarPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setSaveMessage({ type: 'error', text: getFriendlyError(err) });
    } finally {
      setIsSaving(false);
    }
  };

  const fetchIntegrations = async () => {
    setIntegrationsLoading(true);
    try {
      const res = await api.get('/tenant/integrations');
      const data = res.data?.data as Partial<IntegrationStatus> | undefined;
      if (data) setIntegrations({ ...defaultIntegrationStatus, ...data });
    } catch {
      // Leave defaults (all disconnected) if the status check fails.
    } finally {
      setIntegrationsLoading(false);
    }
  };

  const fetchTwilioStatus = async () => {
    try {
      const res = await api.get('/tenant/integrations/twilio');
      const data = res.data?.data as Partial<TwilioStatus> | undefined;
      if (data) setTwilioStatus({ ...defaultTwilioStatus, ...data });
    } catch {
      // Leave defaults (not connected) if the status check fails.
    }
  };

  const fetchCalendlyStatus = async () => {
    try {
      const res = await api.get('/tenant/integrations/calendly');
      const data = res.data?.data as Partial<CalendlyStatus> | undefined;
      if (data) setCalendlyStatus({ ...defaultCalendlyStatus, ...data });
    } catch {
      // Leave defaults (not connected) if the status check fails.
    }
  };

  const fetchEhrStatus = async () => {
    try {
      const res = await api.get('/tenant/integrations/ehr');
      const data = res.data?.data as Partial<EhrStatus> | undefined;
      if (data) setEhrStatus({ ...defaultEhrStatus, ...data });
    } catch {
      // Leave defaults (not connected) if the status check fails.
    }
  };

  useEffect(() => {
    fetchIntegrations();
    fetchTwilioStatus();
    fetchCalendlyStatus();
    fetchEhrStatus();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const integration = params.get('integration');
    const status = params.get('status');
    if (!integration || !status) return;

    if (status === 'connected') {
      setIntegrationBanner({ type: 'success', text: `${integration === 'google' ? 'Google Calendar' : integration} connected successfully.` });
      fetchIntegrations();
    } else if (status === 'error') {
      setIntegrationBanner({ type: 'error', text: `Failed to connect ${integration === 'google' ? 'Google Calendar' : integration}. Please try again.` });
    }

    setActiveTab('integrations');
    window.history.replaceState(null, '', '/dashboard/settings');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnectGoogle = async () => {
    setPendingIntegration('google');
    setIntegrationBanner(null);
    try {
      const res = await api.get('/auth/google/calendar/init');
      const url = res.data?.data?.url;
      if (url) window.location.href = url;
    } catch (err) {
      setIntegrationBanner({ type: 'error', text: getFriendlyError(err) });
      setPendingIntegration(null);
    }
  };

  const handleDisconnectGoogle = async () => {
    setPendingIntegration('google');
    setIntegrationBanner(null);
    try {
      await api.post('/tenant/integrations/google/disconnect');
      await fetchIntegrations();
      setIntegrationBanner({ type: 'success', text: 'Google Calendar disconnected.' });
    } catch (err) {
      setIntegrationBanner({ type: 'error', text: getFriendlyError(err) });
    } finally {
      setPendingIntegration(null);
    }
  };

  const handleProvisionTwilio = async () => {
    setTwilioBusy(true);
    setIntegrationBanner(null);
    try {
      const res = await api.post('/tenant/integrations/twilio/provision');
      const data = res.data?.data as Partial<TwilioStatus> | undefined;
      if (data) setTwilioStatus({ ...defaultTwilioStatus, ...data });
      setIntegrationBanner({ type: 'success', text: 'Twilio number provisioned. Turn the toggle on to start automated recovery.' });
    } catch (err) {
      setIntegrationBanner({ type: 'error', text: getFriendlyError(err) });
    } finally {
      setTwilioBusy(false);
    }
  };

  const handleToggleTwilio = async (enabled: boolean) => {
    setTwilioBusy(true);
    setIntegrationBanner(null);
    try {
      const res = await api.patch('/tenant/integrations/twilio', { enabled });
      const data = res.data?.data as Partial<TwilioStatus> | undefined;
      if (data) setTwilioStatus({ ...defaultTwilioStatus, ...data });
    } catch (err) {
      setIntegrationBanner({ type: 'error', text: getFriendlyError(err) });
    } finally {
      setTwilioBusy(false);
    }
  };

  const handleConnectCalendly = async (apiKey: string) => {
    // Let errors propagate — CalendlyCard shows the specific validation message inline.
    const res = await api.post('/tenant/integrations/calendly', { apiKey });
    const data = res.data?.data as Partial<CalendlyStatus> | undefined;
    if (data) setCalendlyStatus({ ...defaultCalendlyStatus, ...data });
  };

  const handleDisconnectCalendly = async () => {
    await api.delete('/tenant/integrations/calendly');
    setCalendlyStatus(defaultCalendlyStatus);
  };

  const handleConnectEhr = async (fields: { fhirBaseUrl: string; clientId: string; clientSecret: string }) => {
    const res = await api.post('/tenant/integrations/ehr', fields);
    const data = res.data?.data as Partial<EhrStatus> | undefined;
    setEhrStatus({ ...defaultEhrStatus, connected: true, fhirBaseUrl: fields.fhirBaseUrl, clientId: fields.clientId, ...data });
  };

  const handleDisconnectEhr = async () => {
    await api.delete('/tenant/integrations/ehr');
    setEhrStatus(defaultEhrStatus);
  };

  return (
    <div className="space-y-6">
      <div className="-mx-4 overflow-x-auto px-4 pb-0.5 [-webkit-overflow-scrolling:touch] sm:mx-0 sm:px-0">
        <div className="flex w-max min-w-full gap-2 whitespace-nowrap border-b border-[#e4e4e7] pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-[#c9a97a] text-black'
                  : 'text-[#71717a] hover:bg-white hover:text-[#09090b]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'profile' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Profile</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-[#71717a]">Full Name</label>
                <input
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[#71717a]">Email</label>
                <input
                  defaultValue={user?.email || ''}
                  type="email"
                  disabled
                  className="w-full rounded-lg border border-[#e4e4e7] bg-[#f4f4f5] px-3 py-2 text-sm text-[#a1a1aa]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[#71717a]">Avatar</label>
                <div className="flex items-center gap-3">
                  {avatarPreview || user?.avatarURL ? (
                    <img
                      src={avatarPreview || user?.avatarURL}
                      alt="Avatar preview"
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c9a97a]/20 text-sm font-semibold text-[#c9a97a]">
                      {getInitials(fullNameInput, user?.email)}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="text-sm text-[#71717a]"
                  />
                </div>
              </div>
              {saveMessage ? (
                <p className={`text-xs font-medium ${saveMessage.type === 'success' ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                  {saveMessage.text}
                </p>
              ) : null}
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="rounded-lg bg-[#c9a97a] px-4 py-2 text-sm font-medium text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? 'Saving…' : 'Save Profile'}
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
            <button type="button" className="rounded-lg bg-[#c9a97a] px-4 py-2 text-sm font-medium text-black hover:opacity-90">
              Save Business Settings
            </button>
          </div>
        </div>
      ) : null}

      {activeTab === 'business' ? (
        <div className="mt-6 max-w-xl rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Timezone &amp; Business Hours</h3>
          <p className="mt-1 text-xs text-[#71717a]">
            Used by the AI to interpret times patients text in ("Monday at 2pm") and to reject times outside your hours.
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs text-[#71717a]">Timezone</label>
              <select
                value={timezoneInput}
                onChange={(e) => setTimezoneInput(e.target.value)}
                className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none"
              >
                {IANA_TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-[#71717a]">Opens at (hour, 0-23)</label>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={businessHoursStartInput}
                  onChange={(e) => setBusinessHoursStartInput(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[#71717a]">Closes at (hour, 0-23)</label>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={businessHoursEndInput}
                  onChange={(e) => setBusinessHoursEndInput(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#09090b] focus:border-[#c9a97a] focus:outline-none"
                />
              </div>
            </div>
            {hoursSaveMessage ? (
              <p className={`text-xs font-medium ${hoursSaveMessage.type === 'success' ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                {hoursSaveMessage.text}
              </p>
            ) : null}
            <button
              type="button"
              onClick={handleSaveBusinessHours}
              disabled={isSavingHours}
              className="rounded-lg bg-[#c9a97a] px-4 py-2 text-sm font-medium text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingHours ? 'Saving…' : 'Save Timezone & Hours'}
            </button>
          </div>
        </div>
      ) : null}

      {activeTab === 'integrations' ? (
        <div className="space-y-4">
          {integrationBanner ? (
            <p className={`rounded-lg px-4 py-2 text-sm font-medium ${integrationBanner.type === 'success' ? 'bg-[#16a34a]/10 text-[#16a34a]' : 'bg-[#dc2626]/10 text-[#dc2626]'}`}>
              {integrationBanner.text}
            </p>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            {integrationMeta.map((meta) => {
              const isGoogle = meta.id === 'google';
              const isTwilio = meta.id === 'twilio';

              const connected = isTwilio
                ? twilioStatus.connectionStatus === 'active' && twilioStatus.integrationEnabled
                : integrations[meta.id]?.connected ?? false;
              const isPending = pendingIntegration === meta.id;

              const twilioStatusLabel =
                twilioStatus.connectionStatus === 'provisioning' ? 'Provisioning…'
                : twilioStatus.connectionStatus === 'suspended' ? 'Suspended'
                : twilioStatus.connectionStatus === 'active'
                  ? (twilioStatus.integrationEnabled ? 'Connected' : 'Connected (paused)')
                  : 'Not connected';

              return (
                <div key={meta.id} className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fafafa] text-xs font-bold text-[#c9a97a]">
                        {meta.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-[#09090b]">{meta.name}</p>
                        <span className={`text-xs ${connected ? 'text-[#16a34a]' : 'text-[#71717a]'}`}>
                          {isTwilio
                            ? twilioStatusLabel
                            : integrationsLoading ? 'Checking…' : connected ? 'Connected' : 'Not connected'}
                        </span>
                      </div>
                    </div>
                    {isTwilio && twilioStatus.connectionStatus === 'active' ? (
                      <Toggle enabled={twilioStatus.integrationEnabled} onChange={handleToggleTwilio} />
                    ) : null}
                  </div>

                  <p className="mt-3 text-xs text-[#71717a]">
                    {isTwilio && twilioStatus.phoneNumber ? `Your number: ${twilioStatus.phoneNumber}` : meta.description}
                  </p>

                  {isGoogle ? (
                    <button
                      type="button"
                      disabled={isPending || integrationsLoading}
                      onClick={connected ? handleDisconnectGoogle : handleConnectGoogle}
                      className={`mt-4 rounded-lg px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60 ${
                        connected
                          ? 'border border-[#e4e4e7] text-[#09090b] hover:bg-[#f4f4f5]'
                          : 'bg-[#c9a97a] text-black hover:opacity-90'
                      }`}
                    >
                      {isPending ? 'Working…' : connected ? 'Disconnect' : 'Connect with Google'}
                    </button>
                  ) : null}

                  {isTwilio && twilioStatus.connectionStatus !== 'active' ? (
                    <button
                      type="button"
                      disabled={twilioBusy}
                      onClick={handleProvisionTwilio}
                      className="mt-4 rounded-lg bg-[#c9a97a] px-4 py-2 text-sm font-medium text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {twilioBusy ? 'Provisioning…' : 'Set Up Twilio'}
                    </button>
                  ) : null}
                </div>
              );
            })}

            <CalendlyCard
              status={calendlyStatus}
              onConnect={handleConnectCalendly}
              onDisconnect={handleDisconnectCalendly}
            />
            <EhrCard status={ehrStatus} onConnect={handleConnectEhr} onDisconnect={handleDisconnectEhr} />
          </div>
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
