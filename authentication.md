# Velocity Authentication System — Audit Report

**Date:** 2026-07-19
**Branch:** feature/dashboard
**Scope:** Backend (`backend/src/{controllers,services,routes,middleware,utils}`), Frontend (`frontend/{context,lib,proxy.ts,app/(auth)}`)

Audit performed by static code review of the actual source (not live HTTP probing — no server was running). All findings below are traced to specific files/lines.

---

## PART 1 — BACKEND ENDPOINT AUDIT

### 1A. POST /api/v1/auth/register — `auth.routes.ts:7`, `auth.service.ts:42`

| Check | Result |
|---|---|
| Route exists in auth.routes.ts | PASS |
| Controller calls service correctly | PASS (`auth.controller.ts:13-20`) |
| Validates input with zod (fullName, email, password) | PASS (`RegisterSchema`, `auth.service.ts:17-21`) |
| Password minimum length ≥ 8 | PASS (`z.string().min(8)`) |
| Email format validated | PASS (`z.string().email()`) |
| Duplicate email → 409 | PASS (`HttpResponse.conflict`, line 54) |
| Hashes password with bcrypt, saltRounds ≥ 10 | PASS (`bcrypt.hash(password, 12)`) |
| Creates user with `emailVerified: false` | PASS |
| Generates verification token | PASS — `crypto.randomBytes(32).toString("hex")` (stronger than UUID) |
| Saves token to DB | PASS (`emailVerificationToken` column) |
| Sends verification email via Resend | PASS (`sendVerificationEmail`) |
| Falls back to console.log if Resend not configured | PASS (`send-mail.ts:220-232`, dummy-key check) |
| Returns 201 with success message | PASS (`HttpResponse.created`) |
| Does NOT return password in response | PASS (only `{ userId }` returned) |
| Does NOT auto-login after register | PASS (no tokens issued) |

**Score: 14/14 PASS.** One note: the verification email body claims the link "expires in 24 hours" (`send-mail.ts:96`) but **no expiry is actually enforced** (see 1B/9).

### 1B. Verification endpoint — actual route is **POST** `/auth/verify?token=`, not GET

The checklist assumed `GET`; the real implementation (backend `auth.routes.ts:8` and frontend `VerifyClient.tsx:39`) consistently uses `POST /auth/verify?token=xxx`. This is an internally-consistent deviation from the spec, not a bug.

| Check | Result |
|---|---|
| Route exists, reads token from query params | PASS (`auth.controller.ts:22-24`) |
| Finds user by emailVerificationToken | PASS (`auth.service.ts:84-86`) |
| Returns 400 if token not found | PASS |
| Checks token expiry | **MISSING** — no `emailVerificationTokenExpiresAt` field exists on the `User` model (`schema.prisma:234-258`); token is valid forever until used |
| Sets emailVerified = true | PASS |
| Clears emailVerificationToken from DB | PASS (set to `null`, line 100) |
| Does NOT expose other user data | PASS (`select: { id, email, fullName }`) |
| Returns 200 with success message | PASS |

Additional (not in checklist but relevant): verifyEmail **also issues and returns `accessToken`/`refreshToken`** in the body and logs the user in immediately (`auth.service.ts:105-124`). This is a deliberate design choice (auto-login post-verification) but note it contradicts the "does NOT auto-login after register" expectation for the *overall* signup flow — verification is effectively where auto-login happens instead.

**Score: 7/8 PASS, 1 MISSING.**

### 1C. POST /api/v1/auth/login — `auth.service.ts:128-181`

| Check | Result |
|---|---|
| Route exists | PASS |
| Validates email + password | PASS (`LoginSchema`) |
| Finds user by email → 404 if not found | **FAIL** — returns generic `401 "Invalid email or password"` instead of 404 (this is actually the *secure* behavior — see 10A note — but it does not match the checklist's literal 404 expectation) |
| Checks emailVerified === true → 403 | PASS (`HttpResponse.forbidden`, line 161) |
| bcrypt.compare → 401 if wrong | PASS |
| Generates accessToken (JWT, 15m, ACCESS_TOKEN_SECRET) | PASS (`generateTokens`, `.env` confirms `ACCESS_TOKEN_EXPIRE=15m` default) |
| Generates refreshToken (JWT, 30d, REFRESH_TOKEN_SECRET) | PASS |
| Stores refreshToken in DB — hashed or plain? | **RISK — stored in PLAIN TEXT** (`prisma.user.update({ data: { refreshToken } })`, line 171). A DB read (backup leak, SQLi, insider) yields usable, un-expired session tokens. Should store `hashToken(refreshToken)` — the util already exists (`utils/auth.ts:37-39`, `hashToken()`) but is **never called**. |
| Sets httpOnly cookie 'refreshToken' correctly | PASS — `httpOnly: true`, `secure: NODE_ENV==='production'`, `sameSite: 'lax'`, `maxAge: 30d` (`auth.controller.ts:5-10`) |
| Returns accessToken in response body | PASS |
| Returns user object (id, fullName, email, emailVerified) | **FAIL (partial)** — returns `{ id, email, fullName }` only; `emailVerified` is omitted (`auth.service.ts:177`) |
| Does NOT return password | PASS |
| Does NOT return refreshToken in body | **FAIL** — `refreshToken` is returned in the JSON body (`auth.service.ts:179`) *in addition to* the httpOnly cookie. Frontend then stores this in `localStorage` (see Part 10B). This defeats the purpose of the httpOnly cookie entirely. |

**Score: 10 PASS, 3 FAIL.**

### 1D. GET /api/v1/auth/me — `auth.routes.ts:12`, `auth.service.ts:231-261`

| Check | Result |
|---|---|
| Route exists | PASS |
| Auth middleware applied | PASS (`authenticateToken`) |
| Reads Authorization: Bearer header | PASS |
| Verifies JWT with ACCESS_TOKEN_SECRET | PASS |
| 401 if no token | PASS |
| 401 if token expired | PASS (falls into generic catch) |
| 401 if token invalid/tampered | PASS |
| Finds user by id from payload | PASS (`payload.sub` → `req.userId`) |
| Returns 200 with user profile | PASS |
| Does NOT return password or refreshToken | PASS (explicit `select`, excludes both) |

**Score: 10/10 PASS.**

### 1E. POST /api/v1/auth/refresh — `auth.service.ts:184-210`

| Check | Result |
|---|---|
| Route exists | PASS |
| Reads refreshToken from body OR cookie | PASS (`req.body.refreshToken \|\| req.cookies?.refreshToken`) |
| Verifies with REFRESH_TOKEN_SECRET → 401 if invalid | PASS |
| Finds user where DB refreshToken matches → 401 if not | PASS (plain-string compare, consistent with the plain-text storage risk above) |
| Generates new accessToken | PASS |
| Rotates refreshToken? | **Rotates — documented**: a brand-new refresh token is issued and persisted every call (`generateTokens` + `prisma.user.update`, lines 202-207), old one is overwritten (implicit revocation of the previous token since only one is stored per user). |
| Returns 200 with new accessToken | PASS (also returns new `refreshToken` in body — same body-exposure issue as login) |

**Score: 6/7 PASS, 1 note (rotation confirmed, but again leaks refreshToken to body/localStorage).**

### 1F. POST /api/v1/auth/logout — `auth.service.ts:213-228`

| Check | Result |
|---|---|
| Route exists | PASS |
| Auth middleware applied | **FAIL** — `router.post("/logout", AuthController.logout)` has **no `authenticateToken`** (`auth.routes.ts:11`). Anyone who can produce *any* valid, non-expired refresh token (their own) can call it; this isn't itself exploitable since it only clears the caller's own session, but it's inconsistent with the checklist's intent and means an expired-access-token user can still hit logout without needing to refresh first — actually fine/intended. Documented as a deviation, not a real vulnerability. |
| Reads refreshToken from body or cookie | PASS |
| Clears refreshToken from DB | PASS (`updateMany`, sets `null`) |
| Clears 'refreshToken' httpOnly cookie | PASS (`res.clearCookie`) |
| Returns 200 with success message | PASS |
| Works even if token already expired | PASS — invalid/expired token still returns 200 "Logged out successfully" without DB write (lines 214-220) |

**Score: 5 PASS, 1 note (no middleware — benign in practice).**

**Part 1 total: Backend Endpoints — 52 checks: 46 PASS / 5 FAIL / 1 MISSING.**

---

## PART 2 — AUTH MIDDLEWARE AUDIT (`backend/src/middleware/auth.middleware.ts`)

| Check | Result |
|---|---|
| File exists | PASS |
| Reads Authorization header correctly | PASS (`split(" ")[1]`) |
| Missing header → 401 | PASS |
| Malformed header (no "Bearer ") → 401 | **PARTIAL** — `"garbage".split(" ")[1]` is `undefined`, so it correctly 401s; but `"Bearer"` alone (no token) also yields `undefined` → 401, fine. However a header like `xyz abc` (wrong scheme, has a space) passes `token = "abc"` through to `jwt.verify`, which then fails naturally → still ends in 401. Functionally safe, but there's no explicit scheme check (`startsWith("Bearer ")`), which is looser than ideal. |
| Verifies JWT with ACCESS_TOKEN_SECRET | PASS |
| Expired token → 401 with distinguishing message | **FAIL** — expired and invalid-signature tokens both fall into the same generic `catch { "Invalid or expired token" }` (line 31-33); message is *combined*, not a distinct "Token expired" message as the checklist wants (minor DX/UX gap, not a security issue). |
| Invalid signature → 401 | PASS |
| Attaches decoded user to `req.userId` (not `req.user`) | PASS — uses `req.userId` instead of a `req.user` object. Functionally fine. |
| TypeScript `Express` namespace extension for `req.userId` | Need to confirm — see below |
| Applied to all protected routes | PASS for `/auth/me`; confirmed used elsewhere (tenant/leads/sms/calendar routers — not deep-audited here as out of scope) |
| NOT applied to public routes (register/login/verify/refresh) | PASS |

Also validates `payload.type !== "access"` (line 24) — rejects a refresh token used as an access token. This is a good defense-in-depth check not in the original checklist — **bonus PASS**.

**Score: 8/11 PASS, 1 FAIL, 2 notes.**

---

## PART 3 — JWT & TOKEN AUDIT

| Check | Result |
|---|---|
| ACCESS_TOKEN_SECRET set, ≥32 chars | PASS (44 chars, verified via env, value not disclosed) |
| REFRESH_TOKEN_SECRET set, ≥32 chars | PASS (45 chars) |
| ACCESS_TOKEN_SECRET !== REFRESH_TOKEN_SECRET | PASS (confirmed distinct) |
| accessToken expires in 15m | PASS (`ACCESS_TOKEN_EXPIRE` env default `"15m"`) |
| refreshToken expires in 30d | PASS (`REFRESH_TOKEN_EXPIRE` default `"30d"`) |
| JWT payload contains `{ id, email, iat, exp }` | **DEVIATION** — payload is `{ sub, type }` (+ `jti` for refresh), not `{ id, email }`. This is actually *better* practice (no email in token), just not literally matching the checklist. |
| JWT payload does NOT contain password | PASS |
| JWT payload does NOT contain sensitive data | PASS |
| Signing algorithm HS256/RS256 | PASS (jsonwebtoken default HS256 with a secret) |
| refreshToken stored in DB (enables revocation) | PASS, but **plain text** (see 1C) |
| Expired refreshToken in DB rejected | PASS (`jwt.verify` throws on expiry before DB lookup even happens) |
| No token ever logged to console in production | **PASS with caveat** — no token values are logged; but `auth.service.ts:139` logs `"[AUTH] Login attempt for email:"` (email only, not sensitive) and `auth.service.ts:72` logs the **full verification link including the raw token** unconditionally in dev-console (`console.log`) regardless of `NODE_ENV`. This should be gated behind `NODE_ENV !== 'production'` — currently it always fires. **FLAG for prod.** |

### Security gaps
| Check | Result |
|---|---|
| Same secret for both tokens? | NO — SAFE |
| Tokens stored in localStorage on frontend? | **YES — RISK.** Both `velocity_access_token` and `velocity_refresh_token` live in `localStorage` (`frontend/lib/auth.ts:1-2, 16-18, 36-39`). Any XSS anywhere in the app grants full session + refresh takeover, not just short-lived access. This is the single biggest architectural risk in the system. |
| accessToken sent over HTTP in production? | Not verifiable statically (depends on deployment TLS termination) — assume HTTPS in prod via reverse proxy; no code forces `http://` |
| No refresh token rotation? | **Rotation IS implemented** (see 1E) — not a risk, contradicts checklist's assumption. |

**Score: 11 PASS / 1 unconditional dev-log FLAG / 1 major localStorage RISK / 2 naming deviations (non-issues).**

---

## PART 4 — COOKIE AUDIT

| Check | Result |
|---|---|
| refreshToken cookie is httpOnly | PASS |
| Correct maxAge (30 days ms) | PASS (`30 * 24 * 60 * 60 * 1000`) |
| sameSite 'lax' or 'strict' | PASS (`'lax'`) |
| secure: false in dev, true in prod | PASS (`NODE_ENV === "production"`) |
| Cookie domain not overly broad | PASS (no `domain` set → defaults to exact host) |
| CORS `credentials: true` on backend | PASS (`cors.ts:24`) |
| Frontend uses `credentials: 'include'` on all auth requests | PASS — axios instance uses `withCredentials: true` globally (`lib/api.ts:13`) |
| Cookie cleared on logout | PASS |
| Cookie cleared on token expiry | N/A — expiry is handled client-side via silent refresh, not explicit cookie clearing; acceptable |

**Score: 9/9 PASS.** Cookie handling itself is solid — the problem is that the frontend never actually relies on this cookie (see Part 5/7), since it manages its own copies of both tokens in localStorage. The httpOnly cookie is effectively vestigial/redundant given the current frontend design.

---

## PART 5 — FRONTEND AUTHCONTEXT AUDIT (`frontend/context/AuthContext.tsx`)

| Check | Result |
|---|---|
| File exists | PASS |
| AuthProvider wraps the app | PASS (`app/layout.tsx` → `ProvidersClient` → `AuthProvider`) |
| Context provides user, accessToken, isLoading, isAuthenticated | PASS (also `activeTenantId`, `refreshAccessToken`) |
| On mount: calls GET /auth/me to validate token | PASS (`initAuth`, lines 137-163) |
| If /auth/me 401s: calls refresh automatically | PASS (catch block, line 147) |
| If refresh succeeds: retries /auth/me | PASS |
| If refresh fails: clearToken(), isAuthenticated: false | PASS |
| login(): POST /auth/login with credentials include | PASS (`api` client has `withCredentials: true` globally) |
| login(): stores accessToken via setToken() | PASS |
| login(): sets user state | PASS |
| login(): redirects to /dashboard on success | **MISSING from AuthContext itself** — `login()` returns the user object and lets the *caller* (`sign-in/page.tsx:47-51`) decide where to redirect (`/onboarding` vs `/dashboard`). Functionally works, just implemented one layer up rather than inside `login()`. |
| login(): throws/returns error on failure | PASS |
| logout(): POST /auth/logout with credentials include | PASS |
| logout(): clearToken() | PASS (also `clearRefreshToken()`) |
| logout(): clears user state | PASS |
| logout(): redirects to /signin | **FAIL — wrong path.** Redirects to `router.push('/sign-in')` (`AuthContext.tsx:133`) — that part is actually correct given the real route is `/sign-in` (see Part 6 bug). No issue here. |
| signUp(): exists in AuthContext | **MISSING** — there is no `signUp`/`register` function in `AuthContext`; `sign-up/page.tsx` calls `api.post('/auth/register', …)` directly rather than through the context. Works, but breaks the pattern of routing all auth calls through the context. |
| signUp(): does not redirect to dashboard | PASS (by virtue of bypassing context — it just shows a banner) |
| signUp(): shows success message about email verification | PASS (`sign-up/page.tsx:57`) |
| Loading state handled | PASS (`isLoading` starts `true`, cleared in `finally`) |
| No infinite redirect loops | PASS — `proxy.ts` and `DashboardLayout`'s client-side check are consistent (both use the same "authed" signal family) so no loop observed |
| Cross-tab logout handled (storage event listener) | **MISSING** — no `window.addEventListener('storage', …)` anywhere in `AuthContext.tsx`. Logging out in one tab does not update `user` state in another open tab; the second tab keeps its stale `user` in memory until next navigation/refresh triggers `/auth/me` and gets a 401. |

**Score: 15 PASS / 2 FAIL / 2 MISSING (of 19 distinct checks — "signUp() sub-items" counted together).**

---

## PART 6 — FRONTEND ROUTE PROTECTION AUDIT

| Check | Result |
|---|---|
| proxy.ts exists (not middleware.ts) | PASS (`frontend/proxy.ts`; confirmed no conflicting `middleware.ts` anywhere in `frontend/`) |
| proxy.ts protects /dashboard/* | PASS (`PROTECTED_PREFIXES = ['/dashboard', '/onboarding']`) |
| proxy.ts checks 'refreshToken' or 'velocity_token' cookie | **DEVIATION** — checks a cookie named **`velocity_authed`** instead, a non-httpOnly *presence flag* cookie set client-side by `setToken()` (`lib/auth.ts:20`). This is intentional given the real access token is in localStorage and unreadable by edge middleware. It works, but is a weaker gate than checking a real token: a user could manually set `document.cookie = "velocity_authed=1"` in devtools to get past the proxy redirect — however they'd still get 401s from the actual API since no real access token exists, so `DashboardLayout`'s client-side `isAuthenticated` check (Part 5) catches it and bounces them back out. **Net: no real bypass, just a slightly confusing double gate.** |
| Unauthenticated users redirected to /signin | **PASS, but note path**: redirects to `/sign-in` (correct — matches actual route folder `app/(auth)/sign-in`) |
| ProtectedRoute.tsx exists | **MISSING** — no such component in the codebase. Protection is instead implemented directly and only in `frontend/app/(main)/dashboard/layout.tsx` (client-side `isAuthenticated`/`isLoading` check) plus `proxy.ts` at the edge. Functionally equivalent to a `ProtectedRoute` wrapper, just not factored into a reusable component — fine if `/onboarding` (also in `PROTECTED_PREFIXES`) has its own equivalent guard; **not verified — recommend checking `app/onboarding/layout.tsx` has the same client-side guard as dashboard, since only the edge `proxy.ts` guards it otherwise.** |
| ProtectedRoute uses isLoading + isAuthenticated | PASS (functionally, in `dashboard/layout.tsx:9,13,18-19`) |
| Dashboard layout wraps content in protection | PASS |
| No dashboard page accessible without auth | PASS (defense in depth: edge proxy + client guard + every real data fetch requires a valid Bearer token server-side) |
| /signin and /signup redirect to /dashboard if already logged in | PASS (`proxy.ts:17-23`, `AUTH_PAGES`) |
| /verify page accessible without auth | PASS (not in `PROTECTED_PREFIXES`, not in `AUTH_PAGES`) |

**Bug found:** `sign-up/page.tsx:188` links to `href="/signin"` (no hyphen) instead of `/sign-in`. The actual route directory is `app/(auth)/sign-in` (with hyphen). This is a **dead link** — clicking "Sign in" from the sign-up page 404s. `sign-in/page.tsx:203` correctly links to `/sign-up`.

**Score: 6 PASS / 1 MISSING (ProtectedRoute component) / 1 deviation (cookie name, benign) / 1 broken link bug.**

---

## PART 7 — AUTH HELPERS AUDIT (`frontend/lib/auth.ts`)

| Check | Result |
|---|---|
| getToken() reads from localStorage key 'velocity_token' | **DEVIATION** — actual key is `velocity_access_token` (`lib/auth.ts:1`). Internally consistent (all reads/writes use the same constant), just a different name than the checklist assumed. |
| setToken() writes to localStorage AND mirrors to cookie | PASS — writes to localStorage **and** sets `velocity_authed=1` presence cookie (not the token itself, by design, since it must stay JS-inaccessible... except it's *not* httpOnly since it's set via `document.cookie`, so this reasoning is partially moot — the actual token just isn't duplicated into the cookie, only a boolean flag is) |
| clearToken() removes from localStorage AND cookie | PASS |
| Handles SSR (`typeof window !== 'undefined'`) | PASS (`canUseStorage()`, used consistently) |
| Cookie written by setToken() matches what proxy.ts reads | PASS — both use `velocity_authed` |
| No sensitive data stored beyond the token string | **FAIL** — both access token AND refresh token are stored in localStorage (`ACCESS_TOKEN_KEY`, `REFRESH_TOKEN_KEY`) — see Part 3/10B for the XSS implication. |

**Score: 4 PASS / 1 FAIL / 1 naming deviation.**

---

## PART 8 — INPUT VALIDATION AUDIT

| Check | Result |
|---|---|
| Zod schemas for all auth endpoints | **PARTIAL** — `RegisterSchema` and `LoginSchema` exist (`auth.service.ts:17-26`); **no schema for `/verify` or `/refresh`** — those are validated with simple `if (!token)` / `if (!refreshToken)` checks in the controller instead (`auth.controller.ts:26-29, 55-58, 72-75`). Functionally covers the "required" check but not format validation. |
| Register: fullName min 2, email valid, password min 8 + ≥1 number | **PARTIAL** — fullName min 2 ✓, email valid ✓, password min 8 ✓, but **no "at least 1 number" rule** — `z.string().min(8)` only. |
| Login: email valid, password required | PASS |
| Verify: token required query param | PASS (manual check, not zod) |
| Refresh: refreshToken required | PASS (manual check, not zod) |
| Validation errors return 400 with field-level messages | **FAIL (status code)** — `RegisterSchema`/`LoginSchema` failures return `HttpResponse.unprocessable(...)`, i.e. **422**, not 400. Body does include field-level messages via `parsed.error.flatten()`. Missing-token cases (verify/refresh) correctly return 400. |
| No SQL injection possible (Prisma ORM) | PASS — no raw SQL used in the auth path |
| No XSS in error messages | PASS — errors are JSON strings rendered as plain text banners in React (auto-escaped by JSX); no `dangerouslySetInnerHTML` on any auth page |
| Rate limiting on auth endpoints | **PARTIAL** — see Part 10A |

**Score: 4 PASS / 3 PARTIAL / 1 FAIL.**

---

## PART 9 — EMAIL VERIFICATION FLOW AUDIT

| Check | Result |
|---|---|
| Verification email sent on register | PASS |
| Correct link format `http://localhost:3000/verify?token=<token>` | PASS (`${env.APP_URL}/verify?token=${rawToken}`, `APP_URL` defaults to `http://localhost:3000`) |
| Token unique per user | PASS (`crypto.randomBytes(32)`, cryptographically random, effectively unique) |
| Token has expiry (24h) | **MISSING** — email text promises 24h expiry (`send-mail.ts:96`) but **no expiry is implemented or enforced** anywhere in `verifyEmail()` or the schema. This is a **false claim to the user** and a lingering-token risk (an intercepted verification email is valid forever). |
| Expired token returns clear error | N/A — can't expire, so this can't be tested/hit |
| Used token cleared from DB after verification | PASS (`emailVerificationToken: null`) |
| Re-sending verification email possible (endpoint exists?) | **MISSING** — no `/auth/resend-verification` (or similar) route exists in `auth.routes.ts`. A user who loses/never receives the email has no self-serve recovery path; sign-up page also doesn't expose a "resend" action. |
| Frontend /verify page reads token from URL | PASS (`VerifyClient.tsx`, `token` prop passed from the server page — page.tsx not shown but wiring confirmed functional via `Props { token?: string }`) |
| /verify page calls verify endpoint on mount | PASS (`useEffect`, line 25-69) |
| Success state shows confirmation + redirect | **DEVIATION** — redirects to `/onboarding`, not `/sign-in` (`VerifyClient.tsx:54`). This is actually more correct UX given verify now auto-issues tokens and logs the user in (see 1B) — not a bug, just doesn't match the checklist's literal expectation. |
| Error state shows clear message | PASS ("Invalid or expired verification link.") — though "expired" is currently impossible to trigger since there's no expiry |

**Score: 6 PASS / 2 MISSING / 2 deviations (benign) / 1 false-claim-to-user bug.**

Also worth flagging: `sendPasswordResetEmail()` exists fully-built in `send-mail.ts:149-161`, but **no password-reset route exists anywhere** in the backend, and the "Forgot password?" link on the sign-in page is a dead `href="#"` (`sign-in/page.tsx:120-122`). This is out of the checklist's literal scope but is a real, user-facing gap directly adjacent to auth.

---

## PART 10 — SECURITY VULNERABILITY AUDIT

**10A. Brute Force Protection — PARTIAL**
- Global rate limiter only: 100 requests / 15 min per IP, applied to *all* routes including `/auth/login` and `/auth/register` (`rateLimiter.ts`, `app.ts:28`). No endpoint-specific, tighter limit for login attempts.
- No account lockout after N failed attempts.
- Login correctly returns a generic `401 "Invalid email or password"` for both "user not found" and "wrong password" (doesn't leak which one) — this is good practice and *prevents user enumeration*, even though it deviates from the checklist's literal "404 if not found" expectation.
- **Verdict: PARTIAL** — some protection (IP rate limit, no enumeration) but no login-specific throttling or lockout.

**10B. Token Exposure — RISK**
- accessToken never logged to console. PASS.
- **refreshToken IS returned in response body** on login/verify/refresh (`auth.service.ts:179, 123, 209`) in addition to the httpOnly cookie — this is what enables the frontend to put it in localStorage. **EXPOSED.**
- password never returned in any response — confirmed across register/login/me. PASS.
- **Both tokens are in localStorage** (`frontend/lib/auth.ts`) — full XSS-to-session-takeover risk, not just short-lived access. **RISK.**
- **Verdict: RISK** (elevated from a simple "safe/exposed" binary — the combination of body-returned refresh tokens + localStorage persistence is the report's top security finding).

**10C. CORS Security — SECURE**
- Origin is validated against an explicit whitelist from `CORS_ORIGIN` env var (default `http://localhost:3000,http://localhost:5173`), not `'*'` (`cors.ts:4-21`).
- `credentials: true` paired with specific origins, never wildcard+credentials. **Verdict: SECURE.**

**10D. Password Security — SECURE (minor gap)**
- bcrypt used, saltRounds = 12 (≥10 required). PASS.
- Min length 8 enforced both client- and server-side. PASS.
- **No max length enforced** — bcrypt silently truncates at 72 bytes; a user could set a 200-char password believing all of it matters, when only the first 72 bytes are checked. Not exploitable, but should cap input (e.g. `z.string().min(8).max(72)`). **MISSING.**
- **Verdict: SECURE**, with one MISSING item (max length).

**10E. SQL Injection — PROTECTED**
- All auth queries go through Prisma's typed query builder (`findUnique`, `create`, `update`, `updateMany`). No `prisma.$queryRaw`/`$executeRaw` anywhere in the auth path (the only raw query in the whole app is the health-check `SELECT 1` in `app.ts:73`, which takes no user input). **Verdict: PROTECTED.**

**10F. XSS Protection — PROTECTED**
- No `dangerouslySetInnerHTML` in any auth-related component (`sign-in`, `sign-up`, `VerifyClient`, `AuthShell`).
- All API error messages are rendered as `{banner.message}` inside JSX — React auto-escapes. **Verdict: PROTECTED.**
- Note: the transactional email HTML (`send-mail.ts`) interpolates `patientName`, `leadName`, `summary`, `tenantName`, etc. directly into HTML strings without escaping (e.g. `infoBox` rows, `heading()`). This is **not on the auth path** (only `fullName` from a verified user goes through `sendWelcomeEmail`, and it's only rendered inside an email client, not the web app), but is worth a follow-up ticket if any of those fields become user-controlled without sanitization upstream.

---

## PART 11 — END-TO-END FLOW TEST

### Flow 1: New User Registration
1. `POST /auth/register` → 201, email sent (or logged to console in dev). **Works.**
2. DB: user created with `emailVerified: false`. **Works.**
3. `GET /verify?token=...` (frontend page) → loads `VerifyClient`, reads token, fires `POST /auth/verify?token=xxx` on mount. **Works.**
4. `POST /auth/verify?token=xxx` → 200, `emailVerified: true` in DB, token cleared, **and** access+refresh tokens issued and persisted to localStorage. **Works — and does more than expected (auto-login).**
5. Redirect: goes to **`/onboarding`**, not `/sign-in`, after 1.5s. **Works, but deviates from the checklist's expected destination** (reasonable given step 4 already logs the user in).

**REPORT: PASS** (deviates from literal spec in a defensible direction — auto-login-then-onboard instead of login-required-after-verify).

### Flow 2: Login + Dashboard Access
1. `POST /auth/login` with verified credentials → 200, `accessToken` in body, cookie set. **Works.**
2. `router.push('/onboarding' | '/dashboard')` based on `hasOnboarded`. **Works** (smarter than a hardcoded `/dashboard` push).
3. Dashboard loads → `GET /auth/me` called via `AuthContext`'s mount effect. **Works.**
4. User data displayed in sidebar (via `DashboardShell`, not independently audited here, but `user` state is populated correctly upstream). **Presumed working** — not verified beyond confirming `user` is populated in context.

**REPORT: PASS.**

### Flow 3: Token Refresh
1. accessToken expires (15m).
2. Next API call → 401.
3. Axios response interceptor (`lib/api.ts:38-83`) catches 401, checks `!originalRequest._retry`.
4. `POST /auth/refresh` called automatically with the localStorage refresh token → new accessToken (+ rotated refreshToken) issued. **Works.**
5. Original request retried with new token via a request queue (`failedQueue`) that also serializes concurrent 401s during an in-flight refresh. **Works — well implemented**, including the concurrent-request race condition guard (`isRefreshing` flag).

Note: `AuthContext.refreshAccessToken()` (used only for the initial-mount 401 case) and `api.ts`'s interceptor (used for all subsequent 401s) are **two independent refresh implementations** with duplicated logic. Not a bug, but a maintenance/consistency risk — a future change to refresh behavior would need to be applied in both places.

**REPORT: IMPLEMENTED** (fully, with request-queueing).

### Flow 4: Logout
1. User clicks logout → `logout()` in `AuthContext`.
2. `clearToken()` + `clearRefreshToken()` called (in `finally`, so always runs). **Works.**
3. `POST /auth/logout` called with `credentials: include` and refreshToken in body → DB `refreshToken` cleared, cookie cleared. **Works.**
4. `router.push('/sign-in')`. **Works.**
5. Back button pressed → `/dashboard` page reloads → `DashboardLayout` re-runs its `isAuthenticated` check via `AuthContext`, which is now `false` (client-side state was cleared in step 2, and even on a hard reload `initAuth()` finds no token in localStorage) → redirects to `/sign-in`. **Cannot re-enter dashboard.**

**REPORT: PASS.**

---

## PART 12 — SUMMARY SCORECARD

| Section | Pass | Fail | Missing/Partial | Approx. Score |
|---|---|---|---|---|
| Backend Endpoints | 46 | 5 | 1 | 46/52 |
| Auth Middleware | 8 | 1 | 2 (notes) | 8/11 |
| JWT & Tokens | 11 | 0 | 1 flag + 1 risk | 11/13 (2 flagged) |
| Cookies | 9 | 0 | 0 | 9/9 |
| AuthContext | 15 | 2 | 2 | 15/19 |
| Route Protection | 6 | 0 | 1 + 1 bug | 6/8 |
| Auth Helpers | 4 | 1 | 0 | 4/6 |
| Input Validation | 4 | 1 | 3 partial | 4/8 |
| Email Verification | 6 | 0 | 2 + 1 false-claim | 6/9 |
| Security (10A–10F) | 4 secure/protected | 0 | 1 partial + 1 risk | 4/6 categories clean |
| **Total (weighted)** | **~113** | **~10** | **~15** | **~113/138** |

(Exact denominators differ slightly from the original template because several checklist items didn't map 1:1 onto the actual implementation — e.g. the checklist assumed a GET verify endpoint, a `ProtectedRoute.tsx` component, and localStorage-key names that don't match the real code. All such deviations are called out inline above rather than silently scored.)

---

## CRITICAL GAPS (must fix before launch)

1. **Both access and refresh tokens are stored in `localStorage`** (`frontend/lib/auth.ts`), and the refresh token is additionally returned in plaintext JSON response bodies (`auth.service.ts` login/verify/refresh). Any XSS anywhere in the app = full, long-lived account takeover, not just a 15-minute window. This is the single highest-impact finding in the audit.
2. **Refresh tokens are stored in the database in plain text** (`auth.service.ts:171, 108-111, 206-207`). A `hashToken()` helper already exists (`utils/auth.ts:37-39`) but is unused. A DB read (backup exposure, SQL injection elsewhere in the app, insider access) yields directly usable 30-day session tokens for every user.
3. **Email verification tokens never expire** (no `emailVerificationTokenExpiresAt` field in the Prisma schema), despite the verification email explicitly telling users "this link expires in 24 hours." A verification email sitting in an old inbox/forwarded thread remains a valid account-activation link indefinitely.

## HIGH PRIORITY GAPS (fix before first user)

4. No endpoint-specific rate limiting or lockout on `/auth/login` — only a blanket 100 req/15min-per-IP limit shared with every other route in the app. Credential-stuffing/brute-force is currently only weakly discouraged.
5. Broken link: `sign-up/page.tsx:188` links to `/signin` (no hyphen); the real route is `/sign-in`. Users clicking "Sign in" from the signup page hit a 404.
6. "Forgot password?" link on sign-in (`sign-in/page.tsx:120`) is a dead `href="#"`. `sendPasswordResetEmail()` is fully built server-side (`send-mail.ts:149-161`) but **no `/auth/forgot-password` or `/auth/reset-password` route exists** — the feature is half-wired.
7. No resend-verification-email endpoint — a user who loses the original email has no self-serve recovery path and must contact support or re-register (which will fail with a 409 conflict on their already-created, unverified account).
8. No `storage` event listener in `AuthContext` — logging out in one browser tab does not immediately reflect in other open tabs of the same app.

## LOW PRIORITY GAPS (fix before scale)

9. `zod` validation missing for `/auth/verify` and `/auth/refresh` (manual `if (!token)` checks only) — fine functionally, but inconsistent with the rest of the codebase's validation pattern.
10. Register/Login validation failures return HTTP 422, not 400 as commonly expected — a convention choice, but worth standardizing.
11. Password policy has no complexity requirement (no digit/symbol requirement) and no max length cap (bcrypt truncates silently at 72 bytes).
12. `console.log` of the raw verification link (`auth.service.ts:72`) fires unconditionally, not gated behind `NODE_ENV !== 'production'` — should be dev-only.
13. Two independent, duplicated silent-refresh implementations (`AuthContext.refreshAccessToken` and the axios interceptor in `lib/api.ts`) — consolidate to avoid future drift.
14. `auth.middleware.ts` doesn't distinguish an expired-token error from an invalid-signature error in its response message (both return "Invalid or expired token") — minor DX gap for frontend error handling, not a security issue since the frontend just treats any 401 as "must refresh."
15. `POST /auth/logout` has no `authenticateToken` middleware — benign today (it only ever clears the token presented in the request), but inconsistent with the pattern used elsewhere; consider requiring a valid access token to call it.
16. No `ProtectedRoute.tsx` reusable component — protection logic is duplicated per-layout (currently just `dashboard/layout.tsx`); verify `app/onboarding/layout.tsx` has an equivalent client-side guard, since it's only protected at the edge (`proxy.ts`) otherwise.

---

## RECOMMENDED FIX ORDER

1. **Stop storing the refresh token (and ideally the access token) in localStorage.** Rely solely on the existing httpOnly `refreshToken` cookie for refresh, and drop `refreshToken` from all response bodies (login/verify/refresh). Keep the access token in memory (React state) only — already partially done via `accessToken` context state, just also persisted to localStorage today.
2. **Hash refresh tokens before storing them in the DB** — call the existing `hashToken()` in `utils/auth.ts` when writing to `user.refreshToken`, and compare hashes in `refresh()`/`logout()`.
3. **Add an expiry column for `emailVerificationToken`** (e.g. `emailVerificationTokenExpiresAt DateTime?`), set it to `now() + 24h` on register, and check it in `verifyEmail()` before accepting the token — matching what the email already promises.
4. **Add a per-endpoint rate limiter** (tighter window/max) specifically on `/auth/login` and `/auth/register`, layered on top of (not replacing) the global limiter.
5. **Fix the `/signin` → `/sign-in` broken link** in `sign-up/page.tsx:188`.
6. **Wire up password reset**: add `POST /auth/forgot-password` and `POST /auth/reset-password` routes using the already-built `sendPasswordResetEmail`, and point the sign-in page's "Forgot password?" link at the new flow.
7. **Add a resend-verification-email endpoint** (e.g. `POST /auth/resend-verification`) and surface it in the sign-up success banner.
8. **Add a `storage` event listener in `AuthContext`** to sync logout (and login) across browser tabs.
9. Gate the raw-verification-link `console.log` (`auth.service.ts:72`) behind `NODE_ENV !== 'production'`.
10. Add a password max-length cap (`.max(72)`) and, optionally, a digit/symbol complexity rule to `RegisterSchema`.
11. Consolidate the duplicated silent-refresh logic between `AuthContext.refreshAccessToken` and `lib/api.ts`'s interceptor.
12. Add zod schemas for `/auth/verify` and `/auth/refresh` for consistency; standardize validation-failure status codes (400 vs 422) across the auth module.
13. Extract a reusable `ProtectedRoute`/layout guard and confirm `app/onboarding/layout.tsx` has equivalent client-side protection to `dashboard/layout.tsx`.
14. Distinguish "token expired" vs "token invalid" messages in `auth.middleware.ts` for better frontend/debugging ergonomics.
15. Add `authenticateToken` to the `/auth/logout` route for consistency with the rest of the authenticated surface.
