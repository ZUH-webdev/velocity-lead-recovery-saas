import jwt from "jsonwebtoken";
import { env } from "../config/env";

const STATE_TYPE = "google_calendar_link";
const STATE_EXPIRE = "10m";

interface CalendarLinkStatePayload {
  sub: string;
  type: typeof STATE_TYPE;
}

// Carries the initiating user's id through the OAuth redirect round-trip via
// the `state` param, signed so it can't be tampered with to link tokens onto
// a different account.
export function signCalendarLinkState(userId: string): string {
  return jwt.sign({ sub: userId, type: STATE_TYPE } satisfies CalendarLinkStatePayload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: STATE_EXPIRE,
  });
}

export function verifyCalendarLinkState(state: string | undefined): string {
  if (!state) throw new Error("Missing OAuth state param");
  const payload = jwt.verify(state, env.ACCESS_TOKEN_SECRET) as CalendarLinkStatePayload;
  if (payload.type !== STATE_TYPE || !payload.sub) {
    throw new Error("Invalid OAuth state param");
  }
  return payload.sub;
}
