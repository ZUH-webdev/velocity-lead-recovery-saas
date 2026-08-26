import { prisma } from "../config/prisma";
import { GoogleCalendarService } from "./google-calendar.service";
import { CalendlyService } from "./calendly.service";
import { EhrFhirService } from "./ehr-fhir.service";
import { isWithinBusinessHours } from "./datetime-parser.service";
import type { Appointment, Tenant } from "../generated/prisma/client";

export interface CreateAppointmentInput {
  leadId: string;
  serviceId?: string | null;
  assignedToMemberId?: string | null;
  datetime: Date;
  durationMinutes: number;
  notes?: string | null;
  summary?: string;
}

export type CreateAppointmentResult =
  | { ok: true; appointment: Appointment }
  | { ok: false; reason: "lead_not_found" }
  | { ok: false; reason: "conflict" };

// Best-effort EHR sync — logs and swallows failures so a FHIR server being
// down or misconfigured never blocks a booking/reschedule/cancel.
async function syncToEhr(
  tenantId: string,
  ehrConnected: boolean,
  leadPhone: string,
  appointment: { id: string; datetime: Date; durationMinutes: number; status: string; ehrAppointmentId: string | null },
) {
  if (!ehrConnected) return;
  try {
    const patient = await EhrFhirService.findPatientByPhone(tenantId, leadPhone);
    const patientId = (patient as { id?: string } | null)?.id ?? null;
    const ehrAppointmentId = await EhrFhirService.syncAppointment(tenantId, appointment, patientId);
    if (ehrAppointmentId && ehrAppointmentId !== appointment.ehrAppointmentId) {
      await prisma.appointment.update({ where: { id: appointment.id }, data: { ehrAppointmentId } });
    }
  } catch (err) {
    console.error("[Appointments] EHR sync failed:", err);
  }
}

// Single source of truth for "is this slot free" — used by both the manual
// booking endpoint and the automated SMS flow. Calendly is an alternate
// booking backend to Google Calendar (a tenant picks one, not both), so
// whichever is actually connected is what gets checked.
export async function checkAvailability(tenant: Tenant, range: { start: Date; end: Date }): Promise<boolean> {
  if (tenant.calendlyConnected) return CalendlyService.isSlotFree(tenant.id, range);
  return GoogleCalendarService.checkAvailability(tenant.id, range);
}

// Core booking logic, callable directly (no HTTP round-trip) so the SMS
// conversation flow can create real Appointment rows — including the same
// Google Calendar / EHR sync the manual booking endpoint gets — without
// going through Express. `appointments.controller.ts` wraps this for the
// HTTP route; this function has no req/res dependency.
export async function createAppointment(
  tenant: Tenant,
  input: CreateAppointmentInput,
): Promise<CreateAppointmentResult> {
  const lead = await prisma.lead.findFirst({ where: { id: input.leadId, tenantId: tenant.id } });
  if (!lead) return { ok: false, reason: "lead_not_found" };

  const start = input.datetime;
  const end = new Date(start.getTime() + input.durationMinutes * 60_000);
  const usingCalendly = tenant.calendlyConnected;

  let available = true;
  try {
    available = await checkAvailability(tenant, { start, end });
  } catch (err) {
    console.error("[Appointments] availability check failed:", err);
  }
  if (!available) return { ok: false, reason: "conflict" };

  const appointment = await prisma.appointment.create({
    data: {
      tenantId: tenant.id,
      leadId: input.leadId,
      serviceId: input.serviceId ?? null,
      assignedToMemberId: input.assignedToMemberId ?? null,
      datetime: start,
      durationMinutes: input.durationMinutes,
      notes: input.notes ?? null,
    },
  });

  // Calendly's API has no endpoint to create a booking on the host's behalf
  // (bookings only happen via a Calendly scheduling link the invitee
  // completes themselves) — only Google Calendar supports this.
  if (!usingCalendly) {
    try {
      const googleEventId = await GoogleCalendarService.createCalendarEvent(tenant.id, {
        ...appointment,
        summary: input.summary ?? `Appointment — ${lead.firstName}${lead.lastName ? ` ${lead.lastName}` : ""}`,
      });
      if (googleEventId) {
        await prisma.appointment.update({ where: { id: appointment.id }, data: { googleEventId } });
      }
    } catch (err) {
      console.error("[Appointments] calendar sync failed on create:", err);
    }
  }

  await syncToEhr(tenant.id, tenant.ehrConnected, lead.phone, {
    id: appointment.id,
    datetime: appointment.datetime,
    durationMinutes: appointment.durationMinutes,
    status: appointment.status,
    ehrAppointmentId: appointment.ehrAppointmentId,
  });

  const result = await prisma.appointment.findUnique({ where: { id: appointment.id } });
  return { ok: true, appointment: result! };
}

// A bounded heuristic scan for open slots near a requested (conflicting)
// time — NOT a full freebusy/gap analysis of the connected calendar. It
// checks the same slot on the next few candidate days, plus later same-day
// slots, stopping once `maxResults` free ones are found or the search
// window is exhausted. Good enough to offer 2-3 alternatives in an SMS
// reply; not a substitute for a real scheduling UI.
export async function findNextAvailableSlots(
  tenant: Tenant,
  requestedStart: Date,
  durationMinutes: number,
  businessHours: { start: number; end: number },
  tenantTimezone: string,
  maxResults = 3,
): Promise<Date[]> {
  const found: Date[] = [];
  const stepMinutes = 30;
  const maxCandidates = 20;

  let candidate = new Date(requestedStart.getTime() + stepMinutes * 60_000);

  for (let i = 0; i < maxCandidates && found.length < maxResults; i++) {
    if (isWithinBusinessHours(candidate, tenantTimezone, businessHours)) {
      const end = new Date(candidate.getTime() + durationMinutes * 60_000);
      try {
        const free = await checkAvailability(tenant, { start: candidate, end });
        if (free) found.push(new Date(candidate));
      } catch (err) {
        console.error("[Appointments] slot search availability check failed:", err);
      }
    }
    candidate = new Date(candidate.getTime() + stepMinutes * 60_000);
  }

  return found;
}
