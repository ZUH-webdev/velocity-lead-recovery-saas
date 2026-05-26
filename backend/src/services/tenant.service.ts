import { prisma } from "../config/prisma";
import { HttpResponse } from "../utils/httpResponse";
import { sendMemberInviteEmail } from "../utils/send-mail";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { env } from "../config/env";
import { hashToken } from "../utils/auth";

// ── Default permissions seeded for every new tenant ───────────────────────

const DEFAULT_PERMISSIONS = [
  { key: "leads:read", description: "View leads" },
  { key: "leads:write", description: "Create and update leads" },
  { key: "leads:delete", description: "Delete leads" },
  { key: "conversations:read", description: "View conversations" },
  { key: "conversations:write", description: "Manage conversations" },
  { key: "appointments:read", description: "View appointments" },
  { key: "appointments:write", description: "Create and update appointments" },
  { key: "members:read", description: "View team members" },
  { key: "members:write", description: "Invite and update members" },
  { key: "members:delete", description: "Remove members" },
  { key: "roles:read", description: "View roles" },
  { key: "roles:write", description: "Create and update roles" },
  { key: "roles:delete", description: "Delete roles" },
  { key: "knowledge:read", description: "View knowledge base" },
  { key: "knowledge:write", description: "Upload knowledge documents" },
  { key: "knowledge:delete", description: "Delete knowledge documents" },
  { key: "agent:read", description: "View AI agent settings" },
  { key: "agent:write", description: "Update AI agent settings" },
  { key: "settings:read", description: "View tenant settings" },
  { key: "settings:write", description: "Update tenant settings" },
  { key: "billing:read", description: "View billing and invoices" },
  { key: "billing:write", description: "Manage billing and subscriptions" },
];

// Keys assigned to each system role
const ROLE_PERMISSION_MAP: Record<string, string[]> = {
  owner: DEFAULT_PERMISSIONS.map((p) => p.key), // all
  admin: [
    "leads:read",
    "leads:write",
    "leads:delete",
    "conversations:read",
    "conversations:write",
    "appointments:read",
    "appointments:write",
    "members:read",
    "members:write",
    "members:delete",
    "roles:read",
    "roles:write",
    "roles:delete",
    "knowledge:read",
    "knowledge:write",
    "knowledge:delete",
    "agent:read",
    "agent:write",
    "settings:read",
    "settings:write",
    "billing:read", // no billing:write
  ],
  receptionist: [
    "leads:read",
    "leads:write",
    "conversations:read",
    "conversations:write",
    "appointments:read",
    "appointments:write",
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
  {
    key: "owner",
    name: "Owner",
    description: "Full access to everything including billing",
  },
  {
    key: "admin",
    name: "Admin",
    description: "Manage staff, leads, and settings",
  },
  {
    key: "receptionist",
    name: "Receptionist",
    description: "View and manage leads and conversations",
  },
  { key: "viewer", name: "Viewer", description: "Read-only dashboard access" },
];

async function seedTenantDefaults(tenantId: string, userId: string) {
  // 1. Create all permissions
  const permissions = await Promise.all(
    DEFAULT_PERMISSIONS.map((p) =>
      prisma.permission.create({
        data: { tenantId, key: p.key, description: p.description },
      }),
    ),
  );

  const permissionMap = Object.fromEntries(
    permissions.map((p) => [p.key, p.id]),
  );

  // 2. Create system roles with their permission links
  const roles = await Promise.all(
    SYSTEM_ROLES.map((r) =>
      prisma.roleDefinition.create({
        data: {
          tenantId,
          key: r.key,
          name: r.name,
          description: r.description,
          isSystemRole: true,
          permissionLinks: {
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
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) return HttpResponse.notFound("Tenant not found");

    return HttpResponse.ok("Tenant retrieved successfully", tenant);
  }

  static async create(
    userId: string, // ← creator gets Owner role
    name: string,
    email: string,
    industry: string,
    phone: string,
    websiteURL: string,
  ) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const existingTenant = await prisma.tenant.findUnique({
      where: { slug },
    });

    if (existingTenant) {
      return HttpResponse.conflict("Tenant with this name already exists");
    }

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const tenant = await prisma.$transaction(async (tx) => {
      const newTenant = await tx.tenant.create({
        data: {
          name,
          slug,
          email,
          industry,
          phone,
          timezone: tz,
          isActive: true,
          websiteURL,
          workingHours: {},
        },
      });

      return newTenant;
    });

    // Seed roles, permissions, and assign owner — outside transaction
    // so failures here don't roll back tenant creation silently
    await seedTenantDefaults(tenant.id, userId);

    return HttpResponse.created("Tenant created successfully", tenant);
  }

  static async update(
    tenantId: string,
    data: Partial<{
      name: string;
      email: string;
      industry: string;
      phone: string;
      website: string;
      address: string;
      timezone: string;
      workingHours: object;
    }>,
  ) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) return HttpResponse.notFound("Tenant not found");

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data,
    });

    return HttpResponse.ok("Tenant updated successfully", updated);
  }

  static async deactivate(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) return HttpResponse.notFound("Tenant not found");

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: { isActive: false },
    });

    return HttpResponse.ok("Tenant deactivated successfully", updated);
  }

  static async activate(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) return HttpResponse.notFound("Tenant not found");
  if (tenant.isActive) return HttpResponse.conflict("Tenant is already active");

  const updated = await prisma.tenant.update({
    where: { id: tenantId },
    data: { isActive: true },
  });

  return HttpResponse.ok("Tenant activated successfully", updated);
}

// ── Members ───────────────────────────────────────────────────────────────

  static async getMembers(tenantId: string) {
    const members = await prisma.tenantMember.findMany({
      where: { tenantId },
      include: {
        user: {
          select: { id: true, email: true, fullName: true, avatarURL: true },
        },
        role: true,
      },
    });

    return HttpResponse.ok("Members retrieved successfully", members);
  }

  static async inviteMember(
    tenantId: string,
    invitedByMemberId: string,       // ← who is inviting
    invitedEmail: string,
    roleId: string,
    jobTitle?: string,
    department?: string,
  ) {
    // 1. Validate role belongs to this tenant
    const role = await prisma.roleDefinition.findFirst({
      where: { id: roleId, tenantId },
    });
    if (!role) return HttpResponse.notFound("Role not found");

    // 2. Get inviter info for the email
    const inviter = await prisma.tenantMember.findFirst({
      where: { id: invitedByMemberId, tenantId },
      include: { user: { select: { fullName: true } } },
    });

    // 3. Get tenant info for the email
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });

    // 4. Check not already invited
    const existingMember = await prisma.tenantMember.findFirst({
      where: { tenantId, invitedEmail },
    });
    if (existingMember) return HttpResponse.conflict("Member already invited");

    // 5. Generate invite token
    const rawToken   = crypto.randomBytes(32).toString("hex");
    const tokenHash  = hashToken(rawToken);
    const expiresAt  = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    // 6. Create member record + verification token in one transaction
    const member = await prisma.$transaction(async (tx) => {
      const newMember = await tx.tenantMember.create({
        data: {
          tenantId,
          roleId,
          invitedEmail,
          jobTitle:   jobTitle   ?? null,
          department: department ?? null,
          status:     "INVITED",
          invitedAt:  new Date(),
          userId:     null,
        },
      });

      await tx.authVerificationToken.create({
        data: {
          email:     invitedEmail,
          tokenHash,
          purpose:   "MEMBER_INVITE",
          expiresAt,
          metadata:  {
            tenantId,
            memberId:  newMember.id,
            roleId,
          },
        },
      });

      return newMember;
    });

    // 7. Send invite email
    const inviteUrl     = `${env.APP_URL}/accept-invite?token=${rawToken}`;
    const inviterName   = inviter?.user?.fullName ?? "A team member";
    const tenantName    = tenant?.name ?? "your workspace";
    const roleName      = role.name;

    await sendMemberInviteEmail(
      invitedEmail,
      inviterName,
      tenantName,
      roleName,
      inviteUrl,
    );

    return HttpResponse.created("Member invited successfully", member);
  }

  static async acceptInvite(
    token: string,
    fullName: string,
    password: string,
  ) {
    const tokenHash = hashToken(token);

    // 1. Validate token
    const record = await prisma.authVerificationToken.findFirst({
      where: { tokenHash },
    });

    if (!record || record.purpose !== "MEMBER_INVITE") {
      return HttpResponse.badRequest("Invalid invite token");
    }
    if (record.consumedAt) {
      return HttpResponse.badRequest("Invite has already been accepted");
    }
    if (record.expiresAt < new Date()) {
      return HttpResponse.badRequest("Invite token has expired");
    }

    const { tenantId, memberId } = record.metadata as {
      tenantId: string;
      memberId: string;
    };

    // 2. Check member record still exists and is still INVITED
    const member = await prisma.tenantMember.findFirst({
      where: { id: memberId, tenantId, status: "INVITED" },
    });
    if (!member) return HttpResponse.badRequest("Invite is no longer valid");

    // 3. Check if user already exists (was already registered)
    const existingUser = await prisma.user.findUnique({
      where: { email: record.email },
    });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.$transaction(async (tx) => {
      let resolvedUser;

      if (existingUser) {
        // User already has an account — just link them
        resolvedUser = existingUser;
      } else {
        // Create new user
        resolvedUser = await tx.user.create({
          data: {
            email:           record.email,
            fullName,
            emailVerifiedAt: new Date(), // auto-verified via invite
          },
        });

        await tx.authAccount.create({
          data: {
            userId:            resolvedUser.id,
            provider:          "credentials",
            providerAccountId: resolvedUser.id,
            profile:           { passwordHash },
          },
        });
      }

      // Activate the member record
      await tx.tenantMember.update({
        where: { id: memberId },
        data: {
          userId:   resolvedUser.id,
          status:   "ACTIVE",
          joinedAt: new Date(),
        },
      });

      // Consume the token
      await tx.authVerificationToken.update({
        where: { id: record.id },
        data:  { consumedAt: new Date() },
      });

      return resolvedUser;
    });

    return HttpResponse.ok("Invite accepted successfully", {
      user: {
        id:       user.id,
        email:    user.email,
        fullName: user.fullName,
      },
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
    const member = await prisma.tenantMember.findFirst({
      where: { id: memberId, tenantId },
    });

    if (!member) return HttpResponse.notFound("Member not found");

    if (data.roleId) {
      const role = await prisma.roleDefinition.findFirst({
        where: { id: data.roleId, tenantId },
      });
      if (!role) return HttpResponse.notFound("Role not found");
    }

    const updated = await prisma.tenantMember.update({
      where: { id: memberId },
      data,
    });

    return HttpResponse.ok("Member updated successfully", updated);
  }

  static async removeMember(tenantId: string, memberId: string) {
    const member = await prisma.tenantMember.findFirst({
      where: { id: memberId, tenantId },
    });

    if (!member) return HttpResponse.notFound("Member not found");

    await prisma.tenantMember.update({
      where: { id: memberId },
      data:  { status: "LEFT", leftAt: new Date() },
    });

    return HttpResponse.ok("Member removed successfully");
  }


  // ── Roles ─────────────────────────────────────────────────────────────────

  static async getRoles(tenantId: string) {
    const roles = await prisma.roleDefinition.findMany({
      where: { tenantId },
      include: {
        permissionLinks: {
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
    const existingRole = await prisma.roleDefinition.findFirst({
      where: { tenantId, key },
    });

    if (existingRole)
      return HttpResponse.conflict("Role with this key already exists");

    const role = await prisma.roleDefinition.create({
      data: {
        tenantId,
        key,
        name,
        description,
        isSystemRole: false,
        permissionLinks: {
          create: permissionIds.map((permissionId) => ({ permissionId })),
        },
      },
      include: {
        permissionLinks: { include: { permission: true } },
      },
    });

    return HttpResponse.created("Role created successfully", role);
  }

  static async updateRole(
    tenantId: string,
    roleId: string,
    data: Partial<{ name: string; description: string }>,
    permissionIds?: string[],
  ) {
    const role = await prisma.roleDefinition.findFirst({
      where: { id: roleId, tenantId },
    });

    if (!role) return HttpResponse.notFound("Role not found");
    if (role.isSystemRole)
      return HttpResponse.forbidden("System roles cannot be modified");

    const updated = await prisma.roleDefinition.update({
      where: { id: roleId },
      data: {
        ...data,
        ...(permissionIds && {
          permissionLinks: {
            deleteMany: {},
            create: permissionIds.map((permissionId) => ({ permissionId })),
          },
        }),
      },
      include: {
        permissionLinks: { include: { permission: true } },
      },
    });

    return HttpResponse.ok("Role updated successfully", updated);
  }

  static async deleteRole(tenantId: string, roleId: string) {
    const role = await prisma.roleDefinition.findFirst({
      where: { id: roleId, tenantId },
    });

    if (!role) return HttpResponse.notFound("Role not found");
    if (role.isSystemRole)
      return HttpResponse.forbidden("System roles cannot be deleted");

    const membersWithRole = await prisma.tenantMember.count({
      where: { roleId, tenantId },
    });

    if (membersWithRole > 0) {
      return HttpResponse.conflict(
        "Cannot delete a role that is assigned to members",
      );
    }

    await prisma.roleDefinition.delete({ where: { id: roleId } });
    return HttpResponse.ok("Role deleted successfully");
  }

  // ── Permissions ───────────────────────────────────────────────────────────

  static async getPermissions(tenantId: string) {
    const permissions = await prisma.permission.findMany({
      where: { tenantId },
    });

    return HttpResponse.ok("Permissions retrieved successfully", permissions);
  }

  static async overrideMemberPermission(
    tenantId: string,
    memberId: string,
    permissionId: string,
    type: "GRANT" | "REVOKE",
  ) {
    const member = await prisma.tenantMember.findFirst({
      where: { id: memberId, tenantId },
    });

    if (!member) return HttpResponse.notFound("Member not found");

    const permission = await prisma.permission.findFirst({
      where: { id: permissionId, tenantId },
    });

    if (!permission) return HttpResponse.notFound("Permission not found");

    const override = await prisma.memberPermissionOverride.upsert({
      where: { memberId_permissionId: { memberId, permissionId } },
      update: { type },
      create: { memberId, permissionId, type },
    });

    return HttpResponse.ok(
      "Permission override applied successfully",
      override,
    );
  }

  static async removeMemberPermissionOverride(
    tenantId: string,
    memberId: string,
    permissionId: string,
  ) {
    const member = await prisma.tenantMember.findFirst({
      where: { id: memberId, tenantId },
    });

    if (!member) return HttpResponse.notFound("Member not found");

    await prisma.memberPermissionOverride.delete({
      where: { memberId_permissionId: { memberId, permissionId } },
    });

    return HttpResponse.ok("Permission override removed successfully");
  }
}
