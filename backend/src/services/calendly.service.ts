import { prisma } from "../config/prisma";
import { encryptSecret, decryptSecret } from "../utils/crypto";

const CALENDLY_BASE = "https://api.calendly.com";

export class CalendlyApiError extends Error {}

interface CalendlyUser {
  uri: string;
  name: string;
  email: string;
  schedulingUrl: string;
  currentOrganization: string;
}

async function calendlyFetch(path: string, apiKey: string): Promise<any> {
  const res = await fetch(`${CALENDLY_BASE}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    throw new CalendlyApiError(`Calendly API returned ${res.status} for ${path}`);
  }
  return res.json();
}

export const CalendlyService = {
  // Confirms a token is real and live before it's ever stored. Throws
  // CalendlyApiError on an invalid/expired token or Calendly-side failure.
  async validateApiKey(apiKey: string): Promise<CalendlyUser> {
    const body = await calendlyFetch("/users/me", apiKey);
    const resource = body.resource;
    return {
      uri: resource.uri,
      name: resource.name,
      email: resource.email,
      schedulingUrl: resource.scheduling_url,
      currentOrganization: resource.current_organization,
    };
  },

  async getApiKeyForTenant(tenantId: string): Promise<string | null> {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant?.calendlyApiKey) return null;
    return decryptSecret(tenant.calendlyApiKey);
  },

  async connectTenant(tenantId: string, apiKey: string): Promise<CalendlyUser> {
    const user = await this.validateApiKey(apiKey);
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { calendlyApiKey: encryptSecret(apiKey), calendlyConnected: true },
    });
    return user;
  },

  async disconnectTenant(tenantId: string): Promise<void> {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { calendlyApiKey: null, calendlyConnected: false },
    });
  },

  async getEventTypes(tenantId: string) {
    const apiKey = await this.getApiKeyForTenant(tenantId);
    if (!apiKey) throw new CalendlyApiError("Tenant has no connected Calendly account");

    const user = await this.validateApiKey(apiKey);
    const body = await calendlyFetch(`/event_types?user=${encodeURIComponent(user.uri)}`, apiKey);
    return body.collection;
  },

  async getScheduledEvents(tenantId: string, range: { start: Date; end: Date }) {
    const apiKey = await this.getApiKeyForTenant(tenantId);
    if (!apiKey) throw new CalendlyApiError("Tenant has no connected Calendly account");

    const user = await this.validateApiKey(apiKey);
    const params = new URLSearchParams({
      user: user.uri,
      min_start_time: range.start.toISOString(),
      max_start_time: range.end.toISOString(),
    });
    const body = await calendlyFetch(`/scheduled_events?${params.toString()}`, apiKey);
    return body.collection as Array<{ start_time: string; end_time: string; status: string }>;
  },

  // Calendly's public API has no endpoint to create a booking on a host's
  // behalf — bookings only happen through a Calendly scheduling link/embed
  // that the invitee completes themselves. So "availability" is the only
  // conflict-checking signal available here; there is no createEvent to pair
  // with it. See ehr-fhir / google-calendar services for contrast.
  async isSlotFree(tenantId: string, timeRange: { start: Date; end: Date }): Promise<boolean> {
    try {
      const events = await this.getScheduledEvents(tenantId, timeRange);
      const activeEvents = events.filter((e) => e.status !== "canceled");
      return activeEvents.length === 0;
    } catch (err) {
      console.error("[Calendly] availability check failed:", err);
      return true; // don't block booking on a Calendly outage
    }
  },
};
