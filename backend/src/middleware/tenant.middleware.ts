import { prisma } from "../config/prisma";
import { HttpResponse } from "../utils/httpResponse";
import type { Request, Response, NextFunction } from "express";

export async function resolveTenant(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const tenantId = req.headers["x-tenant-id"];

  if (!tenantId || typeof tenantId !== "string") {
    HttpResponse.badRequest("Missing x-tenant-id header").send(res);
    return;
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      HttpResponse.notFound("Tenant not found").send(res);
      return;
    }

    if (!tenant.isActive) {
      HttpResponse.forbidden("Tenant account is inactive").send(res);
      return;
    }

    // Cross-check: user must be an active member of this tenant
    const member = await prisma.tenantMember.findFirst({
      where: {
        tenantId: tenant.id,
        userId: req.userId!,
        status: "ACTIVE",
      },
    });

    if (!member) {
      HttpResponse.forbidden("You are not a member of this tenant").send(res);
      return;
    }

    req.tenant = tenant;
    req.member = member;
    next();
  } catch {
    HttpResponse.internalError().send(res);
  }
}