# 🚀 Velocity Quick Reference Guide

**Status:** ✅ Backend Alpha + SMS System Ready  
**Last Updated:** May 4, 2026

---

## 📊 What's Done

### ✅ Authentication System
- User signup/login with password hashing
- JWT access tokens (15 min expiry)
- Refresh tokens stored in Redis (7 day expiry)
- Token verification middleware
- Logout functionality

### ✅ Lead Management
- Create leads (public - no auth required)
- List leads with filtering & pagination
- Get single lead details
- Update lead status/notes
- Lead scoring system

### ✅ Business Management
- Get business info
- Update business settings (timezone, locale)
- Add services to business

### ✅ SMS System (NEW)
- Velocity AI assistant persona
- Conversation state machine (greeting → qualification → booking → confirmed)
- Emergency detection & escalation
- Time slot management
- Full message templates
- Tested & verified working

---

## 🔗 API Endpoints Quick Reference

### Base URL
```
http://localhost:3000/api
```

### Authentication

```bash
# SIGNUP
POST /auth/signup
Content-Type: application/json

{
  "email": "user@clinic.com",
  "password": "SecurePass123",
  "businessName": "My Dental Clinic"
}

Response (201):
{
  "success": true,
  "data": {
    "user": { "_id": "...", "email": "...", "role": "admin" },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}

---

# LOGIN
POST /auth/login
Content-Type: application/json

{
  "email": "user@clinic.com",
  "password": "SecurePass123"
}

Response (200):
Same as signup

---

# REFRESH TOKEN
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response (200):
{
  "success": true,
  "data": {
    "token": "eyJhbGc..."
  }
}

---

# LOGOUT
POST /auth/logout
Authorization: Bearer eyJhbGc...

Response (200):
{
  "success": true,
  "data": { "message": "Logged out" }
}

---

# VERIFY TOKEN
POST /auth/verify
Authorization: Bearer eyJhbGc...

Response (200):
{
  "success": true,
  "data": {
    "userId": "63f7d8e9...",
    "businessId": "63f7d8e9...",
    "iat": 1714815000,
    "exp": 1714815900
  }
}
```

### Leads

```bash
# CREATE LEAD (public)
POST /leads
Content-Type: application/json

{
  "businessId": "63f7d8e9...",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1-555-1234",
  "source": "website_form"
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "63f7d9a0...",
    "businessId": "63f7d8e9...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1-555-1234",
    "status": "new",
    "score": 65,
    "scoreHistory": [
      { "score": 65, "reason": "initial", "createdAt": "2026-05-04T..." }
    ],
    "notes": [],
    "createdAt": "2026-05-04T...",
    "updatedAt": "2026-05-04T..."
  }
}

---

# LIST LEADS (protected)
GET /leads/:businessId?page=1&limit=20&status=new&minScore=50
Authorization: Bearer eyJhbGc...

Query Params:
- page: Page number (default: 1)
- limit: Results per page (default: 20)
- status: 'new' | 'contacted' | 'qualified' | 'lost' | 'booked'
- minScore: Minimum lead score (0-100)

Response (200):
{
  "success": true,
  "data": [
    { ... }, { ... }, { ... }
  ],
  "total": 245,
  "pages": 13,
  "currentPage": 1
}

---

# GET SINGLE LEAD (protected)
GET /leads/:businessId/:leadId
Authorization: Bearer eyJhbGc...

Response (200):
{
  "success": true,
  "data": { ... }
}

---

# UPDATE LEAD (protected)
PUT /leads/:businessId/:leadId
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "status": "qualified",
  "notes": [{ "body": "Customer interested in cleaning", "createdAt": "2026-05-04T..." }]
}

Response (200):
{
  "success": true,
  "data": { ... updated lead ... }
}
```

### Business

```bash
# GET BUSINESS (protected)
GET /business/:id
Authorization: Bearer eyJhbGc...

Response (200):
{
  "success": true,
  "data": {
    "_id": "63f7d8e9...",
    "name": "My Dental Clinic",
    "industry": "Dentistry",
    "website": "https://clinic.com",
    "phone": "+1-555-0000",
    "address": "123 Main St, NYC",
    "services": [
      { "name": "Cleaning", "durationMinutes": 30, "priceCents": 10000 }
    ],
    "settings": { "timezone": "America/New_York", "locale": "en" },
    "chatbot": { "enabled": false, "config": {} },
    "integrations": {},
    "createdAt": "2026-05-04T...",
    "updatedAt": "2026-05-04T..."
  }
}

---

# UPDATE BUSINESS SETTINGS (protected)
PUT /business/:id/settings
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "timezone": "America/New_York",
  "locale": "en"
}

Response (200):
{
  "success": true,
  "data": { ... updated business ... }
}

---

# ADD SERVICE (protected)
POST /business/:id/services
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "name": "Root Canal",
  "durationMinutes": 60,
  "priceCents": 50000
}

Response (200):
{
  "success": true,
  "data": [
    { ... existing services ... },
    { "name": "Root Canal", "durationMinutes": 60, "priceCents": 50000 }
  ]
}
```

### SMS (NEW - Velocity)

```bash
# START CONVERSATION (missed call / form)
POST /sms/start
Content-Type: application/json

{
  "phoneNumber": "+1-555-123-4567",
  "businessId": "63f7d8e9...",
  "initiationMethod": "missed_call",
  "leadName": "John" (optional)
}

Response (200):
{
  "success": true,
  "data": {
    "conversationId": "63f7d9a0...",
    "message": "Hi — Velocity from [Clinic Name]. I saw a missed call — is now a good time? What's your name?",
    "state": "greeting"
  }
}

---

# RECEIVE MESSAGE FROM LEAD
POST /sms/incoming
Content-Type: application/json

{
  "phoneNumber": "+1-555-123-4567",
  "messageText": "Hi I'm Sarah",
  "businessId": "63f7d8e9...",
  "initiationMethod": "manual" (optional)
}

Response (200):
{
  "success": true,
  "data": {
    "response": "What's the reason for your visit?",
    "state": "qualification",
    "conversationId": "63f7d9a0..."
  }
}

---

# GET CONVERSATION HISTORY
GET /sms/conversation/:phoneNumber?businessId=63f7d8e9...

Response (200):
{
  "success": true,
  "data": {
    "_id": "63f7d9a0...",
    "leadPhoneNumber": "+1-555-123-4567",
    "leadName": "Sarah",
    "businessId": "63f7d8e9...",
    "state": "booking",
    "visitReason": "Dental cleaning",
    "isNewPatient": true,
    "timePreference": "morning",
    "messages": [
      {
        "sender": "velocity",
        "text": "Hi — Velocity from [Clinic Name]...",
        "timestamp": "2026-05-04T10:00:00Z"
      },
      {
        "sender": "lead",
        "text": "Hi I'm Sarah",
        "timestamp": "2026-05-04T10:01:00Z"
      },
      { ... more messages ... }
    ],
    "isEmergency": false,
    "isEscalated": false,
    "appointmentDate": null,
    "appointmentTime": null,
    "createdAt": "2026-05-04T10:00:00Z",
    "updatedAt": "2026-05-04T10:05:00Z"
  }
}

---

# CLOSE CONVERSATION
POST /sms/close
Content-Type: application/json

{
  "phoneNumber": "+1-555-123-4567",
  "businessId": "63f7d8e9...",
  "reason": "no_show"
}

Response (200):
{
  "success": true,
  "data": { ... updated conversation ... }
}

---

# ESCALATE TO HUMAN
POST /sms/escalate
Content-Type: application/json

{
  "phoneNumber": "+1-555-123-4567",
  "businessId": "63f7d8e9...",
  "teamMemberId": "63f7d8e9...",
  "reason": "Customer has insurance questions"
}

Response (200):
{
  "success": true,
  "data": {
    "isEscalated": true,
    "escalationReason": "Customer has insurance questions",
    "escalatedToTeamMemberId": "63f7d8e9...",
    "state": "escalated",
    ... rest of conversation ...
  }
}
```

---

## 📝 Usage Examples

### Complete SMS Workflow

```bash
# 1. Customer misses a call
# Velocity detects this and starts a conversation

curl -X POST http://localhost:3000/api/sms/start \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1-555-123-4567",
    "businessId": "63f7d8e9...",
    "initiationMethod": "missed_call"
  }'

# Response: Velocity sends opening message
# "Hi — Velocity from My Clinic. I saw a missed call — is now a good time? What's your name?"

---

# 2. Lead replies

curl -X POST http://localhost:3000/api/sms/incoming \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1-555-123-4567",
    "messageText": "Hi, I'm Sarah",
    "businessId": "63f7d8e9..."
  }'

# Response: Velocity replies
# "What's the reason for your visit?"

---

# 3. Lead provides reason

curl -X POST http://localhost:3000/api/sms/incoming \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1-555-123-4567",
    "messageText": "I need a cleaning",
    "businessId": "63f7d8e9..."
  }'

# Response:
# "Are you a new or returning patient?"

---

# 4. Lead indicates new patient

curl -X POST http://localhost:3000/api/sms/incoming \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1-555-123-4567",
    "messageText": "I'm new",
    "businessId": "63f7d8e9..."
  }'

# Response:
# "Mornings or afternoons better?"

---

# 5. Lead chooses morning

curl -X POST http://localhost:3000/api/sms/incoming \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1-555-123-4567",
    "messageText": "Mornings",
    "businessId": "63f7d8e9..."
  }'

# Response:
# "Would tomorrow at 2:00 PM or Wednesday at 10:00 AM work better for you?"

---

# 6. Lead confirms booking

curl -X POST http://localhost:3000/api/sms/incoming \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1-555-123-4567",
    "messageText": "Wednesday at 10",
    "businessId": "63f7d8e9..."
  }'

# Response:
# "Great — you're set for Wednesday, May 5 at 10:00 AM. See you at My Clinic. We'll text a reminder 24 hours before."

---

# 7. Retrieve full conversation history

curl -X GET "http://localhost:3000/api/sms/conversation/+1-555-123-4567?businessId=63f7d8e9..."

# Response: Complete conversation with all messages and details
```

### Complete Lead Creation Workflow

```bash
# 1. User signs up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@clinic.com",
    "password": "SecurePass123",
    "businessName": "My Dental Clinic"
  }'

# Response:
{
  "data": {
    "user": { "_id": "USER_ID", "email": "owner@clinic.com" },
    "token": "ACCESS_TOKEN",
    "refreshToken": "REFRESH_TOKEN"
  }
}

---

# 2. Lead fills out form on website (public, no auth)
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "businessId": "BUSINESS_ID",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1-555-1234",
    "source": "website_form"
  }'

# Response: Lead created with initial score 65

---

# 3. Owner logs in to view leads
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@clinic.com",
    "password": "SecurePass123"
  }'

# Response: Access token provided

---

# 4. Owner retrieves leads list
curl -X GET "http://localhost:3000/api/leads/BUSINESS_ID?status=new&minScore=50" \
  -H "Authorization: Bearer ACCESS_TOKEN"

# Response: List of qualified leads

---

# 5. Owner updates lead status after contact
curl -X PUT "http://localhost:3000/api/leads/BUSINESS_ID/LEAD_ID" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "qualified",
    "notes": [
      { "body": "Customer confirmed appointment for May 8 at 2 PM" }
    ]
  }'

# Response: Lead updated
```

---

## 🔒 Security Headers & Validation

Every response includes:
- ✅ Helmet security headers (XSS, clickjacking, MIME type protection)
- ✅ CORS validation (configurable origins)
- ✅ Rate limiting (100 requests per 15 minutes per IP)
- ✅ Input validation (email, phone format)
- ✅ JWT signature verification
- ✅ Authorization checks (user.businessId matching)

---

## 🚨 Error Handling

All errors return:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `BAD_REQUEST` — Invalid input
- `UNAUTHORIZED` — Missing/invalid token
- `FORBIDDEN` — Access denied
- `NOT_FOUND` — Resource not found
- `INVALID_EMAIL` — Email format error
- `INVALID_PHONE` — Phone format error

---

## 🧪 Testing

### Run SMS Service Test
```bash
cd backend
node src/services/SMSService.test.js
```

Expected: Full conversation flow (greeting → qualification → booking → confirmed) ✅

### Start Development Server
```bash
npm run dev
```

Expected: Server running on port 3000, connected to MongoDB & Redis

---

## 📚 Documentation Files

- **This file:** Quick reference for all APIs
- `PROJECT_SUMMARY_AND_WORKFLOW.md` — Detailed project overview
- `ARCHITECTURE_DIAGRAMS.md` — System architecture & data flows
- `SMS_INTEGRATION_GUIDE.md` — SMS provider integration (Twilio, etc.)
- `SMS_QUICKSTART.md` — SMS system quick start

---

## 🔮 Next Steps

1. **Integrate Twilio** (real SMS) — [SMS_INTEGRATION_GUIDE.md](backend/src/services/SMS_INTEGRATION_GUIDE.md)
2. **Add calendar API** (Google Calendar, Calendly)
3. **Build React dashboard** (view leads, analytics)
4. **Implement reminders** (24h + 2h before appointment)
5. **Add lead recovery** (reactivation campaigns)

---

**Version:** 0.1.0-alpha  
**Last Updated:** May 4, 2026  
**Status:** Ready for SMS provider integration ✅
