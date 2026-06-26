import { prisma } from "../config/prisma";
import { HttpResponse } from "../utils/httpResponse";
import { sendMemberInviteEmail } from "../utils/send-mail";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { env } from "../config/env";
import { generateTokens } from "../utils/auth";

// ── Default permissions seeded globally (once) ─────────────────────────────

const DEFAULT_PERMISSIONS = [
  { key: "leads:read", name: "View leads", description: "View leads" },
  { key: "leads:write", name: "Manage leads", description: "Create and update leads" },
  { key: "leads:delete", name: "Delete leads", description: "Delete leads" },
  { key: "conversations:read", name: "View conversations", description: "View conversations" },
  { key: "conversations:write", name: "Manage conversations", description: "Manage conversations" },
  { key: "appointments:read", name: "View appointments", description: "View appointments" },
  { key: "appointments:write", name: "Manage appointments", description: "Create and update appointments" },
  { key: "members:read", name: "View members", description: "View team members" },
  { key: "members:write", name: "Manage members", description: "Invite and update members" },
  { key: "members:delete", name: "Remove members", description: "Remove members" },
  { key: "roles:read", name: "View roles", description: "View roles" },
  { key: "roles:write", name: "Manage roles", description: "Create and update roles" },
  { key: "roles:delete", name: "Delete roles", description: "Delete roles" },
  { key: "knowledge:read", name: "View knowledge", description: "View knowledge base" },
  { key: "knowledge:write", name: "Upload knowledge", description: "Upload knowledge documents" },
  { key: "knowledge:delete", name: "Delete knowledge", description: "Delete knowledge documents" },
  { key: "agent:read", name: "View agent", description: "View AI agent settings" },
  { key: "agent:write", name: "Manage agent", description: "Update AI agent settings" },
  { key: "settings:read", name: "View settings", description: "View tenant settings" },
  { key: "settings:write", name: "Manage settings", description: "Update tenant settings" },
  { key: "billing:read", name: "View billing", description: "View billing and invoices" },
  { key: "billing:write", name: "Manage billing", description: "Manage billing and subscriptions" },
];

// Keys assigned to each system role
const ROLE_PERMISSION_MAP: Record<string, string[]> = {
  owner: DEFAULT_PERMISSIONS.map((p) => p.key), // all
  admin: [
    "leads:read", "leads:write", "leads:delete",
    "conversations:read", "conversations:write",
    "appointments:read", "appointments:write",
    "members:read", "members:write", "members:delete",
    "roles:read", "roles:write", "roles:delete",
    "knowledge:read", "knowledge:write", "knowledge:delete",
    "agent:read", "agent:write",
    "settings:read", "settings:write",
    "billing:read",
  ],
  receptionist: [
    "leads:read", "leads:write",
    "conversations:read", "conversations:write",
    "appointments:read", "appointments:write",
    "knowledge:read",
  ],
  viewer: [
    "leads:read",
    "conversations:read",
    "appointments:read",
    "knowledge:read",
  ],
};

const SYSTEM_ROLES = [
  { key: "owner", name: "Owner", description: "Full access to everything including billing" },
  { key: "admin", name: "Admin", description: "Manage staff, leads, and settings" },
  { key: "receptionist", name: "Receptionist", description: "View and manage leads and conversations" },
  { key: "viewer", name: "Viewer", description: "Read-only dashboard access" },
];

/**
 * Ensure all global permissions exist (upsert by key), then seed system roles
 * for the new tenant and assign the creator as Owner member.
 */
async function seedTenantDefaults(tenantId: string, userId: string) {
  // 1. Upsert all global permissions (they are shared, not per-tenant)
  const permissions = await Promise.all(
    DEFAULT_PERMISSIONS.map((p) =>
      prisma.permission.upsert({
        where: { key: p.key },
        update: {},
        create: { key: p.key, name: p.name, description: p.description },
      }),
    ),
  );

  const permissionMap = Object.fromEntries(permissions.map((p) => [p.key, p.id]));

  // 2. Create system roles with their permission links
  const roles = await Promise.all(
    SYSTEM_ROLES.map((r) =>
      prisma.role.create({
        data: {
          tenantId,
          key: r.key,
          name: r.name,
          description: r.description,
          isSystemRole: true,
          permissions: {
            create: (ROLE_PERMISSION_MAP[r.key] ?? [])
              .filter((key) => permissionMap[key] !== undefined)
              .map((key) => ({
                permission: { connect: { id: permissionMap[key]! } },
              })),
          },
        },
      }),
    ),
  );

  const ownerRole = roles.find((r) => r.key === "owner")!;

  // 3. Assign the creator as an active Owner member
  await prisma.tenantMember.create({
    data: {
      tenantId,
      userId,
      roleId: ownerRole.id,
      status: "ACTIVE",
      joinedAt: new Date(),
      invitedAt: new Date(),
    },
  });
}

export class TenantService {
  // ── Tenant ────────────────────────────────────────────────────────────────

  static async get() {
    const tenants = await prisma.tenant.findMany();
    return HttpResponse.ok("Tenants retrieved successfully", tenants);
  }

  static async getById(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) return HttpResponse.notFound("Tenant not found");
    return HttpResponse.ok("Tenant retrieved successfully", tenant);
  }

  static async create(
    userId: string,
    name: string,
    email: string,
    industry: string,
    phone: string,
    websiteURL: string,
  ) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const existingTenant = await prisma.tenant.findUnique({ where: { slug } });
    if (existingTenant) {
      return HttpResponse.conflict("Tenant with this name already exists");
    }

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const tenant = await prisma.tenant.create({
      data: { name, slug, email, industry, phone, timezone: tz, isActive: true, websiteURL, workingHours: {} },
    });

    // Seed roles, permissions, and assign owner
    await seedTenantDefaults(tenant.id, userId);

    return HttpResponse.created("Tenant created successfully", tenant);
  }

  static async update(
    tenantId: string,
    data: Partial<{
      name: string; email: string; industry: string; phone: string;
      website: string; address: string; timezone: string; workingHours: object;
    }>,
  ) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) return HttpResponse.notFound("Tenant not found");

    const updated = await prisma.tenant.update({ where: { id: tenantId }, data });
    return HttpResponse.ok("Tenant updated successfully", updated);
  }

  static async deactivate(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) return HttpResponse.notFound("Tenant not found");

    const updated = await prisma.tenant.update({ where: { id: tenantId }, data: { isActive: false } });
    return HttpResponse.ok("Tenant deactivated successfully", updated);
  }

  static async activate(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) return HttpResponse.notFound("Tenant not found");
    if (tenant.isActive) return HttpResponse.conflict("Tenant is already active");

    const updated = await prisma.tenant.update({ where: { id: tenantId }, data: { isActive: true } });
    return HttpResponse.ok("Tenant activated successfully", updated);
  }

  // ── Members ───────────────────────────────────────────────────────────────

  static async getMembers(tenantId: string) {
    const members = await prisma.tenantMember.findMany({
      where: { tenantId },
      include: {
        user: { select: { id: true, email: true, fullName: true, avatarURL: true } },
        role: true,
      },
    });
    return HttpResponse.ok("Members retrieved successfully", members);
  }

  static async inviteMember(
    tenantId: string,
    invitedByMemberId: string,
    invitedEmail: string,
    roleId?: string,
    jobTitle?: string,
    department?: string,
  ) {
    // 1. Validate role belongs to this tenant (if provided)
    let role = null;
    if (roleId) {
      role = await prisma.role.findFirst({ where: { id: roleId, tenantId } });
      if (!role) return HttpResponse.notFound("Role not found");
    }

    // 2. Get inviter info
    const inviter = await prisma.tenantMember.findFirst({
      where: { id: invitedByMemberId, tenantId },
      include: { user: { select: { fullName: true } } },
    });

    // 3. Get tenant info
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });

    // 4. Check not already invited (via Invite record)
    const existingInvite = await prisma.invite.findFirst({
      where: { tenantId, invitedEmail, accepted: false },
    });
    if (existingInvite) return HttpResponse.conflict("This email has already been invited");

    // Also check if user is already a member
    const existingMember = await prisma.tenantMember.findFirst({
      where: { tenantId, invitedEmail },
    });
    if (existingMember) return HttpResponse.conflict("Member already exists in this workspace");

    // 5. Generate invite token and create Invite record
    const rawToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    const invite = await prisma.invite.create({
      data: {
        tenantId,
        invitedEmail,
        roleId: roleId ?? null,
        jobTitle: jobTitle ?? null,
        department: department ?? null,
        token: rawToken,
        accepted: false,
        expiresAt,
      },
    });

    // 6. Send invite email
    const inviteUrl = `${env.APP_URL}/accept-invite?token=${rawToken}`;
    const inviterName = inviter?.user?.fullName ?? "A team member";
    const tenantName = tenant?.name ?? "your workspace";
    const roleName = role?.name ?? "Member";

    console.log(`\n🔗 [INVITE] ${invitedEmail} → ${inviteUrl}\n`);

    await sendMemberInviteEmail(invitedEmail, inviterName, tenantName, roleName, inviteUrl);

    return HttpResponse.created("Member invited successfully", invite);
  }

  static async acceptInvite(token: string, fullName: string, password: string) {
    // 1. Validate token
    const invite = await prisma.invite.findUnique({ where: { token } });

    if (!invite) return HttpResponse.badRequest("Invalid invite token");
    if (invite.accepted) return HttpResponse.badRequest("Invite has already been accepted");
    if (invite.expiresAt < new Date()) return HttpResponse.badRequest("Invite token has expired");

    const { tenantId, invitedEmail, roleId } = invite;

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: invitedEmail } });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.$transaction(async (tx) => {
      let resolvedUser;

      if (existingUser) {
        resolvedUser = existingUser;
      } else {
        resolvedUser = await tx.user.create({
          data: {
            email: invitedEmail,
            fullName,
            password: passwordHash,
            emailVerified: true,
            emailVerifiedAt: new Date(), // auto-verified via invite
          },
        });
      }

      // Create TenantMember record
      await tx.tenantMember.create({
        data: {
          tenantId,
          userId: resolvedUser.id,
          roleId: roleId ?? null,
          invitedEmail,
          status: "ACTIVE",
          joinedAt: new Date(),
          invitedAt: invite.createdAt,
        },
      });

      // Mark invite as accepted
      await tx.invite.update({
        where: { id: invite.id },
        data: { accepted: true },
      });

      return resolvedUser;
    });

    // Issue tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    return HttpResponse.ok("Invite accepted successfully", {
      user: { id: user.id, email: user.email, fullName: user.fullName },
      accessToken,
      refreshToken,
    });
  }

  static async updateMember(
    tenantId: string,
    memberId: string,
    data: Partial<{
      roleId: string;
      status: "INVITED" | "ACTIVE" | "SUSPENDED" | "LEFT";
      jobTitle: string;
      department: string;
      isAvailable: boolean;
      workingHours: object;
    }>,
  ) {
    const member = await prisma.tenantMember.findFirst({ where: { id: memberId, tenantId } });
    if (!member) return HttpResponse.notFound("Member not found");

    if (data.roleId) {
      const role = await prisma.role.findFirst({ where: { id: data.roleId, tenantId } });
      if (!role) return HttpResponse.notFound("Role not found");
    }

    const updated = await prisma.tenantMember.update({ where: { id: memberId }, data });
    return HttpResponse.ok("Member updated successfully", updated);
  }

  static async removeMember(tenantId: string, memberId: string) {
    const member = await prisma.tenantMember.findFirst({ where: { id: memberId, tenantId } });
    if (!member) return HttpResponse.notFound("Member not found");

    await prisma.tenantMember.update({
      where: { id: memberId },
      data: { status: "LEFT", leftAt: new Date() },
    });
    return HttpResponse.ok("Member removed successfully");
  }

  // ── Roles ─────────────────────────────────────────────────────────────────

  static async getRoles(tenantId: string) {
    const roles = await prisma.role.findMany({
      where: { tenantId },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
    return HttpResponse.ok("Roles retrieved successfully", roles);
  }

  static async createRole(
    tenantId: string,
    key: string,
    name: string,
    description: string,
    permissionIds: string[],
  ) {
    const existingRole = await prisma.role.findFirst({ where: { tenantId, key } });
    if (existingRole) return HttpResponse.conflict("Role with this key already exists");

    const role = await prisma.role.create({
      data: {
        tenantId,
        key,
        name,
        description,
        isSystemRole: false,
        permissions: {
          create: permissionIds.map((permissionId) => ({ permissionId })),
        },
      },
      include: { permissions: { include: { permission: true } } },
    });
    return HttpResponse.created("Role created successfully", role);
  }

  static async updateRole(
    tenantId: string,
    roleId: string,
    data: Partial<{ name: string; description: string }>,
    permissionIds?: string[],
  ) {
    const role = await prisma.role.findFirst({ where: { id: roleId, tenantId } });
    if (!role) return HttpResponse.notFound("Role not found");
    if (role.isSystemRole) return HttpResponse.forbidden("System roles cannot be modified");

    const updated = await prisma.role.update({
      where: { id: roleId },
      data: {
        ...data,
        ...(permissionIds && {
          permissions: {
            deleteMany: {},
            create: permissionIds.map((permissionId) => ({ permissionId })),
          },
        }),
      },
      include: { permissions: { include: { permission: true } } },
    });
    return HttpResponse.ok("Role updated successfully", updated);
  }

  static async deleteRole(tenantId: string, roleId: string) {
    const role = await prisma.role.findFirst({ where: { id: roleId, tenantId } });
    if (!role) return HttpResponse.notFound("Role not found");
    if (role.isSystemRole) return HttpResponse.forbidden("System roles cannot be deleted");

    const membersWithRole = await prisma.tenantMember.count({ where: { roleId, tenantId } });
    if (membersWithRole > 0) {
      return HttpResponse.conflict("Cannot delete a role that is assigned to members");
    }

    await prisma.role.delete({ where: { id: roleId } });
    return HttpResponse.ok("Role deleted successfully");
  }

  // ── Permissions ───────────────────────────────────────────────────────────

  static async getPermissions(_tenantId: string) {
    // Permissions are global, not per-tenant
    const permissions = await prisma.permission.findMany();
    return HttpResponse.ok("Permissions retrieved successfully", permissions);
  }

  static async overrideMemberPermission(
    tenantId: string,
    memberId: string,
    permissionId: string,
    type: "GRANT" | "REVOKE",
  ) {
    const member = await prisma.tenantMember.findFirst({ where: { id: memberId, tenantId } });
    if (!member) return HttpResponse.notFound("Member not found");

    const permission = await prisma.permission.findUnique({ where: { id: permissionId } });
    if (!permission) return HttpResponse.notFound("Permission not found");

    const override = await prisma.memberPermission.upsert({
      where: { memberId_permissionId: { memberId, permissionId } },
      update: { type },
      create: { memberId, permissionId, type },
    });
    return HttpResponse.ok("Permission override applied successfully", override);
  }

  static async removeMemberPermissionOverride(
    tenantId: string,
    memberId: string,
    permissionId: string,
  ) {
    const member = await prisma.tenantMember.findFirst({ where: { id: memberId, tenantId } });
    if (!member) return HttpResponse.notFound("Member not found");

    await prisma.memberPermission.delete({
      where: { memberId_permissionId: { memberId, permissionId } },
    });
    return HttpResponse.ok("Permission override removed successfully");
  }
}
