import { prisma } from "../config/prisma";
import { encryptSecret, decryptSecret } from "../utils/crypto";

export class FhirApiError extends Error {}

interface SmartConfiguration {
  token_endpoint?: string;
  scopes_supported?: string[];
  token_endpoint_auth_methods_supported?: string[];
}

function normalizeBaseUrl(fhirBaseUrl: string): string {
  return fhirBaseUrl.replace(/\/$/, "");
}

async function discoverSmartConfiguration(fhirBaseUrl: string): Promise<SmartConfiguration> {
  const base = normalizeBaseUrl(fhirBaseUrl);
  const res = await fetch(`${base}/.well-known/smart-configuration`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new FhirApiError(
      `Server did not expose a SMART configuration at .well-known/smart-configuration (${res.status})`,
    );
  }
  return res.json() as Promise<SmartConfiguration>;
}

// The "lightweight capability-statement request" the task asks for — confirms
// the base URL actually points at a FHIR server before anything is saved.
async function fetchCapabilityStatement(fhirBaseUrl: string) {
  const base = normalizeBaseUrl(fhirBaseUrl);
  const res = await fetch(`${base}/metadata`, {
    headers: { Accept: "application/fhir+json" },
  });
  if (!res.ok) {
    throw new FhirApiError(`FHIR metadata endpoint returned ${res.status}`);
  }
  const body = (await res.json()) as { resourceType?: string; fhirVersion?: string; software?: { name?: string } };
  if (body.resourceType !== "CapabilityStatement") {
    throw new FhirApiError("Response from /metadata was not a FHIR CapabilityStatement");
  }
  return body;
}

// SMART Backend Services, "client-confidential-symmetric" profile: client_id
// + client_secret sent via HTTP Basic auth to the discovered token endpoint.
// NOTE: this is the simpler of the two SMART backend-service auth profiles.
// Some vendors — Epic specifically — require the asymmetric profile instead
// (a signed JWT client assertion backed by a registered public/private
// keypair, no client_secret at all). That flow is NOT implemented here; see
// the compliance note in the integration summary.
async function requestAccessToken(
  tokenEndpoint: string,
  clientId: string,
  clientSecret: string,
  scope = "system/Patient.read system/Appointment.read system/Appointment.write",
): Promise<string> {
  const res = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials", scope }),
  });
  if (!res.ok) {
    throw new FhirApiError(
      `Token request failed (${res.status}) — check the client ID/secret and that the app has been granted these scopes`,
    );
  }
  const body = (await res.json()) as { access_token?: string };
  if (!body.access_token) throw new FhirApiError("Token response had no access_token");
  return body.access_token;
}

export const EhrFhirService = {
  // Validates a FHIR base URL + credentials WITHOUT persisting anything —
  // used both for a "test connection" step and before saving on connect.
  async validateConnection(fhirBaseUrl: string, clientId: string, clientSecret: string) {
    const capabilityStatement = await fetchCapabilityStatement(fhirBaseUrl);
    const smartConfig = await discoverSmartConfiguration(fhirBaseUrl);
    if (!smartConfig.token_endpoint) {
      throw new FhirApiError("Server's SMART configuration has no token_endpoint");
    }
    await requestAccessToken(smartConfig.token_endpoint, clientId, clientSecret);

    return {
      fhirVersion: capabilityStatement.fhirVersion as string | undefined,
      software: capabilityStatement.software?.name as string | undefined,
    };
  },

  async connectTenant(tenantId: string, fhirBaseUrl: string, clientId: string, clientSecret: string) {
    const info = await this.validateConnection(fhirBaseUrl, clientId, clientSecret);

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        ehrFhirBaseUrl: fhirBaseUrl,
        ehrClientId: clientId,
        ehrClientSecret: encryptSecret(clientSecret),
        ehrConnected: true,
      },
    });

    return info;
  },

  async disconnectTenant(tenantId: string) {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { ehrFhirBaseUrl: null, ehrClientId: null, ehrClientSecret: null, ehrConnected: false },
    });
  },

  async getAccessTokenForTenant(tenantId: string): Promise<{ baseUrl: string; token: string } | null> {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant?.ehrFhirBaseUrl || !tenant.ehrClientId || !tenant.ehrClientSecret) return null;

    const clientSecret = decryptSecret(tenant.ehrClientSecret);
    const smartConfig = await discoverSmartConfiguration(tenant.ehrFhirBaseUrl);
    if (!smartConfig.token_endpoint) throw new FhirApiError("Server's SMART configuration has no token_endpoint");

    const token = await requestAccessToken(smartConfig.token_endpoint, tenant.ehrClientId, clientSecret);
    return { baseUrl: normalizeBaseUrl(tenant.ehrFhirBaseUrl), token };
  },

  // Minimal patient matching by phone number only — does not pull or store
  // any clinical data, just enough to know "this lead is an existing patient".
  async findPatientByPhone(tenantId: string, phone: string) {
    const auth = await this.getAccessTokenForTenant(tenantId);
    if (!auth) return null;

    const res = await fetch(`${auth.baseUrl}/Patient?phone=${encodeURIComponent(phone)}`, {
      headers: { Authorization: `Bearer ${auth.token}`, Accept: "application/fhir+json" },
    });
    if (!res.ok) throw new FhirApiError(`Patient search failed (${res.status})`);

    const bundle = (await res.json()) as { entry?: Array<{ resource: unknown }> };
    return bundle.entry?.[0]?.resource ?? null;
  },

  // Creates (or, when an ehrAppointmentId already exists, updates) a minimal
  // FHIR Appointment resource — status/time/participant only. Deliberately
  // does not touch clinical notes or any other PHI-bearing fields.
  async syncAppointment(
    tenantId: string,
    appointment: { datetime: Date; durationMinutes: number; status: string; ehrAppointmentId?: string | null },
    patientId?: string | null,
  ): Promise<string | null> {
    const auth = await this.getAccessTokenForTenant(tenantId);
    if (!auth) return null;

    const end = new Date(appointment.datetime.getTime() + appointment.durationMinutes * 60_000);
    const fhirStatus = appointment.status === "CANCELED" ? "cancelled" : "booked";

    const resource: Record<string, unknown> = {
      resourceType: "Appointment",
      status: fhirStatus,
      start: appointment.datetime.toISOString(),
      end: end.toISOString(),
      participant: [
        {
          actor: patientId ? { reference: `Patient/${patientId}` } : undefined,
          status: "accepted",
        },
      ],
    };
    if (appointment.ehrAppointmentId) resource.id = appointment.ehrAppointmentId;

    const method = appointment.ehrAppointmentId ? "PUT" : "POST";
    const url = appointment.ehrAppointmentId
      ? `${auth.baseUrl}/Appointment/${appointment.ehrAppointmentId}`
      : `${auth.baseUrl}/Appointment`;

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/fhir+json",
      },
      body: JSON.stringify(resource),
    });

    if (!res.ok) {
      throw new FhirApiError(`FHIR Appointment ${method} failed (${res.status})`);
    }

    const saved = (await res.json()) as { id?: string };
    return saved.id ?? appointment.ehrAppointmentId ?? null;
  },
};
