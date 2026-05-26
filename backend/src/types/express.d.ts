import type { Tenant, TenantMember } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      tenant?: Tenant;
      member?: TenantMember;
    }
  }
}
