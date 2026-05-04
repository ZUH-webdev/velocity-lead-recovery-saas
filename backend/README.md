# LeadBooster - Backend (Week 1-2 Foundation)

This repository contains the Week 1-2 backend foundation for Velocity: Node.js + Express + MongoDB + Redis + JWT.

Quick start

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run locally (requires MongoDB and Redis):

```bash
# start app
npm run dev
```

Or with Docker Compose:

```bash
docker-compose up --build
```

API Endpoints (examples)

- POST /api/auth/signup
  - body: { "email": "user@example.com", "password": "secret12", "businessName": "MyBiz" }
  - success: { success: true, data: { user, token, refreshToken } }

- POST /api/auth/login
  - body: { "email": "user@example.com", "password": "secret12" }

- POST /api/auth/refresh
  - body: { "refreshToken": "..." }

- POST /api/leads (public)
  - body: { businessId, firstName, lastName, email, phone, source }

Curl examples

Signup:

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@acme.com","password":"secret12","businessName":"Acme"}'
```

Create lead (public):

```bash
curl -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -d '{"businessId":"<BUSINESS_ID>","firstName":"John","lastName":"Doe","email":"john@example.com"}'
```

Notes

- All sensitive values must be set in environment variables.
- JWT tokens expire in 7 days; refresh tokens are stored in Redis.
- Error responses follow: { error: "message", code: "ERROR_CODE" }