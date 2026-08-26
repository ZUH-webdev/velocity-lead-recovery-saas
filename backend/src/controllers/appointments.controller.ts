import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { HttpResponse } from "../utils/httpResponse";
import { GoogleCalendarService } from "../services/google-calendar.service";
import { EhrFhirService } from "../services/ehr-fhir.service";
import { createAppointment } from "../services/appointments.service";

// Best-effort EHR sync — logs and swallows failures so a FHIR server being
// down or misconfigured never blocks a reschedule/cancel. (Duplicated here,
// not in appointments.service.ts, because reschedule/cancel weren't pulled
// into that service in this pass — only `create` needed to become callable
// internally, for the SMS booking flow. See services/appointments.service.ts.)
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

export class AppointmentsController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const appointments = await prisma.appointment.findMany({
        where: { tenantId: req.tenant!.id },
        include: { lead: true, service: true },
        orderBy: { datetime: "asc" },
      });
      HttpResponse.ok("Appointments", appointments).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { leadId, serviceId, assignedToMemberId, datetime, durationMinutes, notes } = req.body as {
        leadId?: string;
        serviceId?: string;
        assignedToMemberId?: string;
        datetime?: string;
        durationMinutes?: number;
        notes?: string;
      };

      if (!leadId || !datetime || !durationMinutes) {
        HttpResponse.badRequest("leadId, datetime, and durationMinutes are required").send(res);
        return;
      }

      const result = await createAppointment(req.tenant!, {
        leadId,
        serviceId: serviceId ?? null,
        assignedToMemberId: assignedToMemberId ?? null,
        datetime: new Date(datetime),
        durationMinutes,
        notes: notes ?? null,
      });

      if (!result.ok) {
        if (result.reason === "lead_not_found") {
          HttpResponse.notFound("Lead not found").send(res);
          return;
        }
        HttpResponse.conflict("That time slot is already booked on the connected calendar").send(res);
        return;
      }

      HttpResponse.created("Appointment booked", result.appointment).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async reschedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { datetime, durationMinutes } = req.body as { datetime?: string; durationMinutes?: number };

      if (!id) {
        HttpResponse.badRequest("Appointment id is required").send(res);
        return;
      }
      if (!datetime) {
        HttpResponse.badRequest("datetime is required").send(res);
        return;
      }

      const tenant = req.tenant!;
      const tenantId = tenant.id;
      const existing = await prisma.appointment.findFirst({ where: { id, tenantId }, include: { lead: true } });
      if (!existing) {
        HttpResponse.notFound("Appointment not found").send(res);
        return;
      }

      const appointment = await prisma.appointment.update({
        where: { id },
        data: {
          datetime: new Date(datetime),
          durationMinutes: durationMinutes ?? existing.durationMinutes,
          status: "RESCHEDULED",
        },
      });

      if (!tenant.calendlyConnected) {
        try {
          await GoogleCalendarService.updateCalendarEvent(tenantId, appointment);
        } catch (err) {
          console.error("[Appointments] calendar sync failed on reschedule:", err);
        }
      }

      await syncToEhr(tenantId, tenant.ehrConnected, existing.lead.phone, {
        id: appointment.id,
        datetime: appointment.datetime,
        durationMinutes: appointment.durationMinutes,
        status: appointment.status,
        ehrAppointmentId: appointment.ehrAppointmentId,
      });

      HttpResponse.ok("Appointment rescheduled", appointment).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tenant = req.tenant!;
      const tenantId = tenant.id;

      if (!id) {
        HttpResponse.badRequest("Appointment id is required").send(res);
        return;
      }

      const existing = await prisma.appointment.findFirst({ where: { id, tenantId }, include: { lead: true } });
      if (!existing) {
        HttpResponse.notFound("Appointment not found").send(res);
        return;
      }

      if (!tenant.calendlyConnected) {
        try {
          await GoogleCalendarService.deleteCalendarEvent(tenantId, id);
        } catch (err) {
          console.error("[Appointments] calendar sync failed on cancel:", err);
        }
      }

      const appointment = await prisma.appointment.update({
        where: { id },
        data: { status: "CANCELED" },
      });

      await syncToEhr(tenantId, tenant.ehrConnected, existing.lead.phone, {
        id: appointment.id,
        datetime: appointment.datetime,
        durationMinutes: appointment.durationMinutes,
        status: appointment.status,
        ehrAppointmentId: appointment.ehrAppointmentId,
      });

      HttpResponse.ok("Appointment canceled", appointment).send(res);
    } catch (err) {
      next(err);
    }
  }
}
