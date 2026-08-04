import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rateLimiter";
import { env } from "../config/env";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false }),
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false },
    (err: Error | null, user: Express.User | false) => {
      if (err || !user) {
        const reason = err ? "server_error" : "google_failed";
        res.redirect(`${env.APP_URL}/sign-in?error=${reason}`);
        return;
      }
      req.user = user;
      next();
    },
  )(req, res, next);
}, AuthController.googleCallback);

router.post("/register", authLimiter, AuthController.register);
router.post("/verify", AuthController.verifyEmail);
router.post("/resend-verification", authLimiter, AuthController.resendVerification);
router.post("/login", authLimiter, AuthController.login);
router.post("/forgot-password", authLimiter, AuthController.forgotPassword);
router.post("/reset-password", authLimiter, AuthController.resetPassword);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.get("/me", authenticateToken, AuthController.me);
router.patch("/me", authenticateToken, AuthController.updateProfile);

export default router;
