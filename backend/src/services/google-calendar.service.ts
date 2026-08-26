import { google } from "googleapis";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { encryptSecret, decryptSecret } from "../utils/crypto";
import type { Appointment } from "../generated/prisma/client";

const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";

// A tenant doesn't hold its own Google identity — a member connects their
// Google account for the whole tenant. We treat the most recently linked
// active member's Google account (one that actually granted calendar scope,
// as opposed to one only ever used to sign in) as "the tenant's" connection.
async function findTenantGoogleAccount(tenantId: string) {
  const members = await prisma.tenantMember.findMany({
    where: { tenantId, status: "ACTIVE" },
    select: { userId: true },
  });
  const userIds = members.map((m) => m.userId);
  if (userIds.length === 0) return null;

  return prisma.authAccount.findFirst({
    where: {
      userId: { in: userIds },
      provider: "google",
      refreshToken: { not: null },
      scope: { contains: CALENDAR_SCOPE },
    },
    orderBy: { updatedAt: "desc" },
  });
}

async function getAuthorizedClient(tenantId: string) {
  const account = await findTenantGoogleAccount(tenantId);
  if (!account || !account.accessToken || !account.refreshToken) return null;

  const oauth2Client = new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);

  oauth2Client.setCredentials({
    access_token: decryptSecret(account.accessToken),
    refresh_token: decryptSecret(account.refreshToken),
    expiry_date: account.expiresAt ? account.expiresAt.getTime() : null,
  });

  const isExpired = !account.expiresAt || account.expiresAt.getTime() <= Date.now() + 60_000;
  if (isExpired) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    await prisma.authAccount.update({
      where: { id: account.id },
      data: {
        accessToken: credentials.access_token
          ? encryptSecret(credentials.access_token)
          : account.accessToken,
        expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
      },
    });
    oauth2Client.setCredentials(credentials);
  }

  return oauth2Client;
}

function isNotFoundError(err: unknown): boolean {
  const code = (err as { code?: number })?.code;
  return code === 404 || code === 410;
}

export const GoogleCalendarService = {
  async isConnected(tenantId: string): Promise<boolean> {
    const account = await findTenantGoogleAccount(tenantId);
    return !!account;
  },

  // Returns the created Google event id, or null if the tenant has no active
  // calendar connection — callers should treat null as "skip, don't fail booking".
  async createCalendarEvent(
    tenantId: string,
    appointment: Appointment & { summary?: string },
  ): Promise<string | null> {
    const auth = await getAuthorizedClient(tenantId);
    if (!auth) return null;

    const calendar = google.calendar({ version: "v3", auth });
    const end = new Date(appointment.datetime.getTime() + appointment.durationMinutes * 60_000);

    const { data } = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: appointment.summary ?? "Velocity Appointment",
        description: appointment.notes ?? null,
        start: { dateTime: appointment.datetime.toISOString() },
        end: { dateTime: end.toISOString() },
      },
    });

    return data.id ?? null;
  },

  async updateCalendarEvent(tenantId: string, appointment: Appointment): Promise<void> {
    if (!appointment.googleEventId) return;
    const auth = await getAuthorizedClient(tenantId);
    if (!auth) return;

    const calendar = google.calendar({ version: "v3", auth });
    const end = new Date(appointment.datetime.getTime() + appointment.durationMinutes * 60_000);

    try {
      await calendar.events.patch({
        calendarId: "primary",
        eventId: appointment.googleEventId,
        requestBody: {
          start: { dateTime: appointment.datetime.toISOString() },
          end: { dateTime: end.toISOString() },
        },
      });
    } catch (err) {
      if (!isNotFoundError(err)) throw err;
    }
  },

  async deleteCalendarEvent(tenantId: string, appointmentId: string): Promise<void> {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment?.googleEventId) return;

    const auth = await getAuthorizedClient(tenantId);
    if (!auth) return;

    const calendar = google.calendar({ version: "v3", auth });
    try {
      await calendar.events.delete({ calendarId: "primary", eventId: appointment.googleEventId });
    } catch (err) {
      if (!isNotFoundError(err)) throw err;
    }
  },

  // Returns true when the slot is free (or when there's no calendar connection
  // to check against — callers shouldn't block booking on an integration that
  // isn't connected).
  async checkAvailability(tenantId: string, timeRange: { start: Date; end: Date }): Promise<boolean> {
    const auth = await getAuthorizedClient(tenantId);
    if (!auth) return true;

    const calendar = google.calendar({ version: "v3", auth });
    const { data } = await calendar.freebusy.query({
      requestBody: {
        timeMin: timeRange.start.toISOString(),
        timeMax: timeRange.end.toISOString(),
        items: [{ id: "primary" }],
      },
    });

    const busy = data.calendars?.primary?.busy ?? [];
    return busy.length === 0;
  },

  // Clears the tenant-linking member's stored tokens and revokes them with
  // Google. Leaves the AuthAccount row (and sign-in identity) intact.
  async disconnect(userId: string): Promise<void> {
    const account = await prisma.authAccount.findUnique({
      where: { userId_provider: { userId, provider: "google" } },
    });
    if (!account?.refreshToken) return;

    try {
      const refreshToken = decryptSecret(account.refreshToken);
      await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(refreshToken)}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    } catch {
      // Revocation failing (e.g. already revoked) shouldn't block clearing local state.
    }

    await prisma.authAccount.update({
      where: { id: account.id },
      data: { accessToken: null, refreshToken: null, scope: null, expiresAt: null },
    });
  },
};
