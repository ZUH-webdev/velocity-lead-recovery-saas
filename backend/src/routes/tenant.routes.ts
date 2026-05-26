import { Router } from "express";
import { TenantController } from "../controllers/tenant.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { resolveTenant } from "../middleware/tenant.middleware";

const router = Router();

// ── Public (no auth) ──────────────────────────────────────────────────────
router.post("/accept-invite", TenantController.acceptInvite);

// ── Platform Admin Only ───────────────────────────────────────────────────
router.get("/", authenticateToken, TenantController.get);
router.post("/", authenticateToken, TenantController.create);

// ── Tenant Scoped ─────────────────────────────────────────────────────────
router.use(authenticateToken, resolveTenant);

router.put("/", TenantController.update);

// Members
router.get("/members", TenantController.getMembers);
router.post("/members/invite", TenantController.inviteMember);
router.put("/members/:memberId", TenantController.updateMember);
router.delete("/members/:memberId", TenantController.removeMember);

// Roles
router.get("/roles", TenantController.getRoles);
router.post("/roles", TenantController.createRole);
router.put("/roles/:roleId", TenantController.updateRole);
router.delete("/roles/:roleId", TenantController.deleteRole);

// Permissions
router.get("/permissions", TenantController.getPermissions);
router.post("/members/:memberId/permissions", TenantController.overrideMemberPermission);
router.delete("/members/:memberId/permissions/:permissionId", TenantController.removeMemberPermissionOverride);

// ── Wildcard LAST ─────────────────────────────────────────────────────────
router.get("/:tenantId", authenticateToken, TenantController.getById);
router.patch("/:tenantId/activate", authenticateToken, TenantController.activate);
router.patch("/:tenantId/deactivate", authenticateToken, TenantController.deactivate);

export default router;