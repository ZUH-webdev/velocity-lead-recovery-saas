import type { Tenant, TenantMember, User as PrismaUser } from "../generated/prisma/client";

export {};

declare global {
  namespace Express {
    // @types/passport normally supplies this augmentation, but our production
    // build strips devDependencies before compiling — so it has to live here,
    // in a file we own and ship, rather than depend on that package existing
    // at build time. Extending PrismaUser keeps `Express.User` and `req.user`
    // pointing at the same real shape instead of an empty stub.
    interface User extends PrismaUser {}

    interface Request {
      userId?: string;
      user?: User;
      tenant?: Tenant;
      member?: TenantMember;
    }
  }
}