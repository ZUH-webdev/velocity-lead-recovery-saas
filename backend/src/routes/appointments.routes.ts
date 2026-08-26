import { Router } from "express";
import { AppointmentsController } from "../controllers/appointments.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { resolveTenant } from "../middleware/tenant.middleware";

const router = Router();

router.use(authenticateToken, resolveTenant);

router.get("/", AppointmentsController.list);
router.post("/", AppointmentsController.create);
router.patch("/:id/reschedule", AppointmentsController.reschedule);
router.patch("/:id/cancel", AppointmentsController.cancel);

export default router;
