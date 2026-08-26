import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { env } from "./env";
import { GoogleAuthService } from "../services/google-auth.service";
import { verifyCalendarLinkState } from "../utils/googleCalendarState";

// Calendar strategy reuses the same OAuth client, pointed at a separate callback path.
const CALENDAR_CALLBACK_URL = env.GOOGLE_CALLBACK_URL.replace(
  "/google/callback",
  "/google/calendar/callback",
);

export function configureGoogleOAuth() {
  // ── Sign-in strategy ────────────────────────────────────────────────────
  // Scoped to profile/email only — this is "Sign in with Google", not calendar
  // access, so it must not prompt every user for calendar permission on login.
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile: Profile, done) => {
        try {
          const user = await GoogleAuthService.findOrCreateUser(profile);
          done(null, user);
        } catch (err) {
          done(err as Error, undefined);
        }
      },
    ),
  );

  // ── Calendar-connect strategy ───────────────────────────────────────────
  // Separate named strategy so connecting a calendar from Settings never
  // creates/switches the signed-in app session — it links tokens onto the
  // user identified by the signed `state` param, not the Google profile.
  // `passport-google-oauth20`'s shipped types don't model `passReqToCallback`
  // or the 5-arg (req, accessToken, refreshToken, params, profile, done) verify
  // signature, even though passport-oauth2 supports both at runtime — cast
  // through `any` at the construction boundary only.
  const CalendarGoogleStrategy: any = GoogleStrategy;

  type CalendarVerify = (
    req: { query: Record<string, unknown> },
    accessToken: string,
    refreshToken: string | undefined,
    params: { expires_in?: number; scope?: string; token_type?: string },
    profile: Profile,
    done: (err: Error | null, user?: unknown) => void,
  ) => void;

  const calendarVerify: CalendarVerify = async (req, accessToken, refreshToken, params, profile, done) => {
    try {
      const state = req.query.state as string | undefined;
      const userId = verifyCalendarLinkState(state);

      if (!refreshToken) {
        // Google only returns a refresh token when the user is prompted for
        // consent. We force prompt=consent on the auth request, but if this
        // ever fires without one, surface it instead of silently storing a
        // connection that can't be refreshed later.
        done(new Error("Google did not return a refresh token"));
        return;
      }

      await GoogleAuthService.linkCalendarTokens(userId, {
        accessToken,
        refreshToken,
        scope: params.scope ?? undefined,
        tokenType: params.token_type ?? undefined,
        expiresInSeconds: params.expires_in ?? undefined,
        providerAccountId: profile.id,
        providerEmail: profile.emails?.[0]?.value ?? undefined,
      });

      done(null, { id: userId });
    } catch (err) {
      done(err as Error);
    }
  };

  const calendarStrategyInstance = new CalendarGoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: CALENDAR_CALLBACK_URL,
      passReqToCallback: true,
    },
    calendarVerify,
  );

  // `passport.use(name, strategy)` fails to typecheck against this @types/passport
  // version's overloads (a shipped-types issue, not a real API restriction) —
  // set the strategy's own `name` and use the documented single-arg form instead.
  calendarStrategyInstance.name = "google-calendar";
  passport.use(calendarStrategyInstance);
}
