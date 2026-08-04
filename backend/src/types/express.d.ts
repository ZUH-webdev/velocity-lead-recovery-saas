import type { Tenant, TenantMember, User } from "../generated/prisma/client";

export {};

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: User;        // ← ADD THIS
      tenant?: Tenant;
      member?: TenantMember;
    }
  }
}