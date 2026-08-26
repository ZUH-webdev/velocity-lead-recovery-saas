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

// ── Google Calendar connect (from Settings, requires an existing app session) ──
router.get("/google/calendar/init", authenticateToken, AuthController.googleCalendarInit);

router.get("/google/calendar", (req, res, next) => {
  // `accessType`/`prompt` are real passport-google-oauth20 options (forwarded
  // to Google's authorization URL) that the shipped AuthenticateOptions type
  // doesn't declare — cast to bypass that gap.
  passport.authenticate("google-calendar", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
    accessType: "offline",
    prompt: "consent",
    session: false,
    state: req.query.state as string,
  } as unknown as Parameters<typeof passport.authenticate>[1])(req, res, next);
});

router.get("/google/calendar/callback", (req, res, next) => {
  passport.authenticate(
    "google-calendar",
    { session: false },
    (err: Error | null, user: Express.User | false) => {
      if (err || !user) {
        AuthController.googleCalendarCallbackError(res, err ? "server_error" : "google_failed");
        return;
      }
      AuthController.googleCalendarCallback(req, res);
    },
  )(req, res, next);
});

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
