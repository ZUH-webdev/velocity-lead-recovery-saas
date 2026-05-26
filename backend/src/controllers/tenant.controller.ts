import type { Request, Response } from "express";
import { TenantService } from "../services/tenant.service";
import { HttpResponse } from "../utils/httpResponse";

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

    if (!name || !email || !industry || !phone || !websiteURL) {
      HttpResponse.badRequest(
        "name, email, industry, phone and websiteURL are required",
      ).send(res);
      return;
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof industry !== "string" ||
      typeof phone !== "string" ||
      typeof websiteURL !== "string"
    ) {
      HttpResponse.badRequest("All fields must be strings").send(res);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      HttpResponse.badRequest("Invalid email address").send(res);
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

    if (!invitedEmail || !roleId) {
      HttpResponse.badRequest("invitedEmail and roleId are required").send(res);
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
      roleId,
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
