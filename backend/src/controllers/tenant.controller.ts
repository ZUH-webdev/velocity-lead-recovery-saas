import type { Request, Response } from "express";
import { TenantService } from "../services/tenant.service";
import { HttpResponse } from "../utils/httpResponse";
import { GoogleCalendarService } from "../services/google-calendar.service";
import { TwilioProvisioningService } from "../services/twilio-provisioning.service";
import { CalendlyService } from "../services/calendly.service";
import { EhrFhirService } from "../services/ehr-fhir.service";
import { prisma } from "../config/prisma";

export class TenantController {
  // ── Tenant ────────────────────────────────────────────────────────────────

  static async get(req: Request, res: Response): Promise<void> {
    const result = await TenantService.get();
    result.send(res);
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const { tenantId } = req.params;

    if (!tenantId || typeof tenantId !== "string") {
      HttpResponse.badRequest("Invalid tenant ID").send(res);
      return;
    }

    const result = await TenantService.getById(tenantId);
    result.send(res);
  }

  static async create(req: Request, res: Response): Promise<void> {
    const { name, email, industry, phone, websiteURL } = req.body;

    const fieldsPresent =
      !!name && !!email && !!industry && !!phone && !!websiteURL &&
      typeof name === "string" &&
      typeof email === "string" &&
      typeof industry === "string" &&
      typeof phone === "string" &&
      typeof websiteURL === "string";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fieldsPresent || !emailRegex.test(email)) {
      HttpResponse.unprocessable("Please fill in all required business details.").send(res);
      return;
    }

    if (!req.userId) {
      return HttpResponse.unauthorized("User ID missing in request").send(res);
    }
    const result = await TenantService.create(
      req.userId,
      name,
      email,
      industry,
      phone,
      websiteURL,
    );
    result.send(res);
  }

  static async update(req: Request, res: Response): Promise<void> {
    const allowed = [
      "name",
      "email",
      "industry",
      "phone",
      "website",
      "address",
      "timezone",
      "workingHours",
      "businessHoursStart",
      "businessHoursEnd",
    ];
    const body = req.body;

    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      HttpResponse.badRequest("Request body cannot be empty").send(res);
      return;
    }

    const invalidKeys = Object.keys(body).filter(
      (key) => !allowed.includes(key),
    );
    if (invalidKeys.length > 0) {
      HttpResponse.badRequest(`Invalid fields: ${invalidKeys.join(", ")}`).send(
        res,
      );
      return;
    }

    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        HttpResponse.badRequest("Invalid email address").send(res);
        return;
      }
    }

    const result = await TenantService.update(req.tenant!.id, body);
    result.send(res);
  }

  static async deactivate(req: Request, res: Response): Promise<void> {
    const tenantId = req.params?.tenantId;

    if (!tenantId || typeof tenantId !== "string") {
      HttpResponse.badRequest("Invalid tenant ID").send(res);
      return;
    }
    const result = await TenantService.deactivate(tenantId);
    result.send(res);
  }

  static async activate(req: Request, res: Response): Promise<void> {
    const { tenantId } = req.params;

    if (!tenantId || typeof tenantId !== "string") {
      HttpResponse.badRequest("Invalid tenant ID").send(res);
      return;
    }

    const result = await TenantService.activate(tenantId);
    result.send(res);
  }

  // ── Integrations ─────────────────────────────────────────────────────────

  static async getIntegrations(req: Request, res: Response): Promise<void> {
    const tenant = req.tenant!;
    const googleConnected = await GoogleCalendarService.isConnected(tenant.id);

    HttpResponse.ok("Integration status", {
      twilio: {
        connected: tenant.twilioConnectionStatus === "active" && tenant.twilioIntegrationEnabled,
        connectionStatus: tenant.twilioConnectionStatus,
        integrationEnabled: tenant.twilioIntegrationEnabled,
        phoneNumber: tenant.twilioPhoneNumber,
      },
      google: { connected: googleConnected },
      calendly: { connected: tenant.calendlyConnected },
      ehr: { connected: tenant.ehrConnected },
    }).send(res);
  }

  static async disconnectGoogleCalendar(req: Request, res: Response): Promise<void> {
    await GoogleCalendarService.disconnect(req.userId!);
    HttpResponse.ok("Google Calendar disconnected").send(res);
  }

  // ── Twilio (per-tenant subaccount) ──────────────────────────────────────────

  static async getTwilioIntegration(req: Request, res: Response): Promise<void> {
    const tenant = req.tenant!;
    HttpResponse.ok("Twilio integration status", {
      connectionStatus: tenant.twilioConnectionStatus,
      integrationEnabled: tenant.twilioIntegrationEnabled,
      phoneNumber: tenant.twilioPhoneNumber,
    }).send(res);
  }

  static async provisionTwilio(req: Request, res: Response, next: (err: unknown) => void): Promise<void> {
    const tenant = req.tenant!;

    if (tenant.twilioConnectionStatus === "active") {
      HttpResponse.conflict("Twilio is already provisioned for this tenant").send(res);
      return;
    }

    try {
      await TwilioProvisioningService.provisionTenant(tenant.id);
      const updated = await prisma.tenant.findUnique({ where: { id: tenant.id } });
      HttpResponse.ok("Twilio provisioned", {
        connectionStatus: updated?.twilioConnectionStatus,
        integrationEnabled: updated?.twilioIntegrationEnabled,
        phoneNumber: updated?.twilioPhoneNumber,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async updateTwilioIntegration(req: Request, res: Response): Promise<void> {
    const tenant = req.tenant!;
    const { enabled } = req.body as { enabled?: boolean };

    if (typeof enabled !== "boolean") {
      HttpResponse.badRequest("`enabled` (boolean) is required").send(res);
      return;
    }

    if (enabled && tenant.twilioConnectionStatus !== "active") {
      HttpResponse.unprocessable("Twilio must be provisioned before it can be enabled").send(res);
      return;
    }

    const updated = await prisma.tenant.update({
      where: { id: tenant.id },
      data: { twilioIntegrationEnabled: enabled },
    });

    HttpResponse.ok("Twilio integration updated", {
      connectionStatus: updated.twilioConnectionStatus,
      integrationEnabled: updated.twilioIntegrationEnabled,
      phoneNumber: updated.twilioPhoneNumber,
    }).send(res);
  }

  // ── Calendly ─────────────────────────────────────────────────────────────

  static async getCalendlyIntegration(req: Request, res: Response): Promise<void> {
    const tenant = req.tenant!;
    HttpResponse.ok("Calendly integration status", { connected: tenant.calendlyConnected }).send(res);
  }

  static async connectCalendly(req: Request, res: Response): Promise<void> {
    const { apiKey } = req.body as { apiKey?: string };
    if (!apiKey || typeof apiKey !== "string") {
      HttpResponse.badRequest("`apiKey` is required").send(res);
      return;
    }

    try {
      const user = await CalendlyService.connectTenant(req.tenant!.id, apiKey);
      HttpResponse.ok("Calendly connected", {
        connected: true,
        name: user.name,
        email: user.email,
        schedulingUrl: user.schedulingUrl,
      }).send(res);
    } catch {
      // Deliberately vague to the client — don't leak Calendly's raw error
      // body, but the real cause (bad token vs Calendly outage) is logged
      // server-side by CalendlyService.
      HttpResponse.unprocessable("Could not verify that Calendly API key — check it and try again").send(res);
    }
  }

  static async disconnectCalendly(req: Request, res: Response): Promise<void> {
    await CalendlyService.disconnectTenant(req.tenant!.id);
    HttpResponse.ok("Calendly disconnected").send(res);
  }

  // ── EHR (generic FHIR connector) ────────────────────────────────────────────

  static async getEhrIntegration(req: Request, res: Response): Promise<void> {
    const tenant = req.tenant!;
    HttpResponse.ok("EHR integration status", {
      connected: tenant.ehrConnected,
      fhirBaseUrl: tenant.ehrFhirBaseUrl,
      clientId: tenant.ehrClientId,
    }).send(res);
  }

  static async connectEhr(req: Request, res: Response): Promise<void> {
    const { fhirBaseUrl, clientId, clientSecret } = req.body as {
      fhirBaseUrl?: string;
      clientId?: string;
      clientSecret?: string;
    };

    if (!fhirBaseUrl || !clientId || !clientSecret) {
      HttpResponse.badRequest("`fhirBaseUrl`, `clientId`, and `clientSecret` are all required").send(res);
      return;
    }

    try {
      const info = await EhrFhirService.connectTenant(req.tenant!.id, fhirBaseUrl, clientId, clientSecret);
      HttpResponse.ok("EHR connected", { connected: true, ...info }).send(res);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not validate the FHIR connection";
      HttpResponse.unprocessable(message).send(res);
    }
  }

  static async disconnectEhr(req: Request, res: Response): Promise<void> {
    await EhrFhirService.disconnectTenant(req.tenant!.id);
    HttpResponse.ok("EHR disconnected").send(res);
  }

  // ── Members ───────────────────────────────────────────────────────────────

  static async getMembers(req: Request, res: Response): Promise<void> {
    if (!req.tenant || !req.tenant.id) {
      HttpResponse.badRequest("Tenant context missing").send(res);
      return;
    }

    const result = await TenantService.getMembers(req.tenant!.id);
    result.send(res);
  }

  static async inviteMember(req: Request, res: Response): Promise<void> {
    const { invitedEmail, roleId, jobTitle, department } = req.body;

    if (!invitedEmail) {
      HttpResponse.badRequest("invitedEmail is required").send(res);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(invitedEmail)) {
      HttpResponse.badRequest("Invalid email address").send(res);
      return;
    }

    const result = await TenantService.inviteMember(
      req.tenant!.id,
      req.member!.id, // ← pass inviter's memberId
      invitedEmail,
      roleId,         // now optional
      jobTitle,
      department,
    );
    result.send(res);
  }

  static async acceptInvite(req: Request, res: Response): Promise<void> {
    const { fullName, password } = req.body;
    const {token} = req.query;

    if (!token || !fullName || !password) {
      HttpResponse.badRequest("token, fullName and password are required").send(
        res,
      );
      return;
    }

    if (typeof password === "string" && password.length < 8) {
      HttpResponse.badRequest("Password must be at least 8 characters").send(
        res,
      );
      return;
    }

    const result = await TenantService.acceptInvite(token as string, fullName, password);
    result.send(res);
  }

  static async updateMember(req: Request, res: Response): Promise<void> {
    const { memberId } = req.params;
    const body = req.body;

    if (!memberId || typeof memberId !== "string") {
      HttpResponse.badRequest("Invalid member ID").send(res);
      return;
    }

    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      HttpResponse.badRequest("Request body cannot be empty").send(res);
      return;
    }

    const allowed = [
      "roleId",
      "status",
      "jobTitle",
      "department",
      "isAvailable",
      "workingHours",
    ];
    const invalidKeys = Object.keys(body).filter(
      (key) => !allowed.includes(key),
    );
    if (invalidKeys.length > 0) {
      HttpResponse.badRequest(`Invalid fields: ${invalidKeys.join(", ")}`).send(
        res,
      );
      return;
    }

    const validStatuses = ["INVITED", "ACTIVE", "SUSPENDED", "LEFT"];
    if (body.status && !validStatuses.includes(body.status)) {
      HttpResponse.badRequest(
        `status must be one of: ${validStatuses.join(", ")}`,
      ).send(res);
      return;
    }

    if (
      body.isAvailable !== undefined &&
      typeof body.isAvailable !== "boolean"
    ) {
      HttpResponse.badRequest("isAvailable must be a boolean").send(res);
      return;
    }

    const result = await TenantService.updateMember(
      req.tenant!.id,
      memberId,
      body,
    );
    result.send(res);
  }

  static async removeMember(req: Request, res: Response): Promise<void> {
    const { memberId } = req.params;

    if (!memberId || typeof memberId !== "string") {
      HttpResponse.badRequest("Invalid member ID").send(res);
      return;
    }

    const result = await TenantService.removeMember(req.tenant!.id, memberId);
    result.send(res);
  }

  // ── Roles ─────────────────────────────────────────────────────────────────

  static async getRoles(req: Request, res: Response): Promise<void> {
    const result = await TenantService.getRoles(req.tenant!.id);
    result.send(res);
  }

  static async createRole(req: Request, res: Response): Promise<void> {
    const { key, name, description, permissionIds } = req.body;

    if (!key || !name || !description) {
      HttpResponse.badRequest("key, name and description are required").send(
        res,
      );
      return;
    }

    if (
      typeof key !== "string" ||
      typeof name !== "string" ||
      typeof description !== "string"
    ) {
      HttpResponse.badRequest("key, name and description must be strings").send(
        res,
      );
      return;
    }

    if (!/^[a-z_]+$/.test(key)) {
      HttpResponse.badRequest(
        "key must be lowercase letters and underscores only",
      ).send(res);
      return;
    }

    if (permissionIds !== undefined) {
      if (!Array.isArray(permissionIds)) {
        HttpResponse.badRequest("permissionIds must be an array").send(res);
        return;
      }

      if (permissionIds.some((id: unknown) => typeof id !== "string")) {
        HttpResponse.badRequest("All permissionIds must be strings").send(res);
        return;
      }
    }

    const result = await TenantService.createRole(
      req.tenant!.id,
      key,
      name,
      description,
      permissionIds ?? [],
    );
    result.send(res);
  }

  static async updateRole(req: Request, res: Response): Promise<void> {
    const { roleId } = req.params;
    const { permissionIds, ...data } = req.body;

    if (!roleId || typeof roleId !== "string") {
      HttpResponse.badRequest("Invalid role ID").send(res);
      return;
    }

    if (
      !data ||
      (Object.keys(data).length === 0 && permissionIds === undefined)
    ) {
      HttpResponse.badRequest("Request body cannot be empty").send(res);
      return;
    }

    const allowed = ["name", "description"];
    const invalidKeys = Object.keys(data).filter(
      (key) => !allowed.includes(key),
    );
    if (invalidKeys.length > 0) {
      HttpResponse.badRequest(`Invalid fields: ${invalidKeys.join(", ")}`).send(
        res,
      );
      return;
    }

    if (permissionIds !== undefined) {
      if (!Array.isArray(permissionIds)) {
        HttpResponse.badRequest("permissionIds must be an array").send(res);
        return;
      }

      if (permissionIds.some((id: unknown) => typeof id !== "string")) {
        HttpResponse.badRequest("All permissionIds must be strings").send(res);
        return;
      }
    }

    const result = await TenantService.updateRole(
      req.tenant!.id,
      roleId,
      data,
      permissionIds,
    );
    result.send(res);
  }

  static async deleteRole(req: Request, res: Response): Promise<void> {
    const { roleId } = req.params;

    if (!roleId || typeof roleId !== "string") {
      HttpResponse.badRequest("Invalid role ID").send(res);
      return;
    }

    const result = await TenantService.deleteRole(req.tenant!.id, roleId);
    result.send(res);
  }

  // ── Permissions ───────────────────────────────────────────────────────────

  static async getPermissions(req: Request, res: Response): Promise<void> {
    const result = await TenantService.getPermissions(req.tenant!.id);
    result.send(res);
  }

  static async overrideMemberPermission(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { memberId } = req.params;
    const { permissionId, type } = req.body;

    if (!memberId || typeof memberId !== "string") {
      HttpResponse.badRequest("Invalid member ID").send(res);
      return;
    }

    if (!permissionId || typeof permissionId !== "string") {
      HttpResponse.badRequest("permissionId is required").send(res);
      return;
    }

    if (!type || !["GRANT", "REVOKE"].includes(type)) {
      HttpResponse.badRequest("type must be either GRANT or REVOKE").send(res);
      return;
    }

    const result = await TenantService.overrideMemberPermission(
      req.tenant!.id,
      memberId,
      permissionId,
      type,
    );
    result.send(res);
  }

  static async removeMemberPermissionOverride(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { memberId, permissionId } = req.params;

    if (!memberId || typeof memberId !== "string") {
      HttpResponse.badRequest("Invalid member ID").send(res);
      return;
    }

    if (!permissionId || typeof permissionId !== "string") {
      HttpResponse.badRequest("Invalid permission ID").send(res);
      return;
    }

    const result = await TenantService.removeMemberPermissionOverride(
      req.tenant!.id,
      memberId,
      permissionId,
    );
    result.send(res);
  }
}
