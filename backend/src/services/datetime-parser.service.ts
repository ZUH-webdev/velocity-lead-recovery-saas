import * as chrono from "chrono-node";

export interface ParsedAppointmentTime {
  datetime: Date | null;
  confidence: "high" | "low";
  ambiguous: boolean;
}

const AMBIGUOUS: ParsedAppointmentTime = { datetime: null, confidence: "low", ambiguous: true };

// chrono-node's ParsingReference.timezone does NOT accept IANA names like
// "America/Chicago" — only fixed abbreviations it recognizes internally, or a
// numeric UTC-offset-in-minutes. Tenant.timezone is stored as IANA, so we
// convert IANA -> offset-at-this-instant ourselves (this correctly accounts
// for DST, since the offset is computed relative to `at`, not a fixed value).
function getTimezoneOffsetMinutes(timeZone: string, at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .formatToParts(at)
    .reduce<Record<string, string>>((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {});

  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return Math.round((asUTC - at.getTime()) / 60_000);
}

// Parses a natural-language time expression relative to the tenant's
// timezone and a reference "now". Deliberately conservative: anything
// without both an explicit day AND an explicit hour (e.g. "afternoon",
// "sometime next week") comes back ambiguous rather than guessing —
// chrono fills unstated components with defaults (like 9am, or "today"),
// and silently trusting those defaults is exactly the kind of guess this
// function exists to avoid. A parsed time in the past is also ambiguous —
// the conversation should ask again, not book something that already happened.
export function parseAppointmentTime(
  text: string,
  tenantTimezone: string,
  referenceDate: Date,
): ParsedAppointmentTime {
  try {
    const timezoneOffset = getTimezoneOffsetMinutes(tenantTimezone, referenceDate);
    const results = chrono.parse(text, { instant: referenceDate, timezone: timezoneOffset }, { forwardDate: true });
    const firstResult = results[0];
    if (!firstResult) return AMBIGUOUS;

    const { start } = firstResult;
    const hasDay = start.isCertain("day") || start.isCertain("weekday");
    const hasHour = start.isCertain("hour");
    if (!hasDay || !hasHour) return AMBIGUOUS;

    const datetime = start.date();
    if (datetime.getTime() < referenceDate.getTime()) return AMBIGUOUS;

    return { datetime, confidence: "high", ambiguous: false };
  } catch (err) {
    console.error("[DatetimeParser] parse failed:", err);
    return AMBIGUOUS;
  }
}

// Business-hours enforcement is intentionally a separate function — the
// signature the task specified for parseAppointmentTime only carries
// tenantTimezone (a string), not the tenant's business-hours row, so there's
// nowhere inside it to check against them. Callers should run this
// immediately after a non-ambiguous parse and treat a `false` the same way
// as an ambiguous parse (ask again, don't book).
export function isWithinBusinessHours(
  datetime: Date,
  tenantTimezone: string,
  businessHours: { start: number; end: number },
): boolean {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: tenantTimezone, hour: "2-digit", hourCycle: "h23" }).format(
      datetime,
    ),
  );
  return hour >= businessHours.start && hour < businessHours.end;
}

export function formatInTenantTimezone(datetime: Date, tenantTimezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tenantTimezone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(datetime);
}
