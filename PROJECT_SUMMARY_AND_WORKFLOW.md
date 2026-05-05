# 📊 Velocity Lead Recovery SaaS - Project Summary & Workflow

**Last Updated:** May 4, 2026  
**Version:** 0.1.0  
**Status:** Backend foundation + SMS system integration complete

---

## 🎯 Project Overview

**Velocity** is an AI-powered appointment booking and lead recovery SaaS platform for local businesses (dentists, med spas, real estate agents). It automatically qualifies leads via SMS, books appointments, sends reminders, and recovers abandoned leads.

### Core Value Proposition
- **24/7 Lead Capture** — AI chatbot never sleeps
- **Instant Booking** — Conversational appointment scheduling (30 seconds)
- **Higher Show Rates** — Automated reminders reduce no-shows by 20-30%
- **Lead Recovery** — Smart reactivation sequences for abandoned leads
- **Dashboard Analytics** — Real-time conversion funnel and revenue tracking

---

## 📁 Project Structure

```
velocity-lead-recovery-saas/
├── backend/                          # Node.js + Express backend
│   ├── src/
│   │   ├── server.js                # Entry point, DB/Redis connection
│   │   ├── app.js                   # Express setup & routes
│   │   ├── config/
│   │   │   ├── database.js          # MongoDB connection + retry logic
│   │   │   ├── redis.js             # Redis client
│   │   │   └── environment.js       # ENV variable wrapper
│   │   ├── models/
│   │   │   ├── User.js              # User schema + auth
│   │   │   ├── Business.js          # Business info & settings
│   │   │   ├── Lead.js              # Lead data & scoring
│   │   │   └── SMSConversation.js   # SMS chat history & state ✨ NEW
│   │   ├── services/
│   │   │   ├── AuthService.js       # JWT + refresh token logic
│   │   │   ├── SMSService.js        # Velocity AI conversation engine ✨ NEW
│   │   │   └── smsTemplates.js      # SMS message templates ✨ NEW
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # /api/auth (signup, login, logout)
│   │   │   ├── business.routes.js   # /api/business (settings, services)
│   │   │   ├── leads.routes.js      # /api/leads (CRUD + scoring)
│   │   │   └── sms.routes.js        # /api/sms (SMS conversation) ✨ NEW
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js   # JWT verification
│   │   │   ├── errorHandler.js      # Global error handler
│   │   │   ├── cors.js              # CORS config
│   │   │   └── rateLimiter.js       # Rate limiting
│   │   └── utils/
│   │       └── validators.js        # Email, phone validation
│   ├── package.json
│   ├── .env                         # Dev environment config
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
├── SMS_QUICKSTART.md                # SMS integration quickstart ✨ NEW
└── CompleteDocumentation.txt        # Full system docs
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Cache:** Redis (ioredis)
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Utilities:** morgan (logging), helmet (security), express-rate-limit

### Deployment
- **Docker:** Docker + Docker Compose for local/production
- **Env Mgmt:** dotenv

---

## 📋 Data Models

### User
```javascript
{
  email: String (unique, required),
  password: String (hashed with bcryptjs),
  businessId: ObjectId (ref: Business),
  role: 'admin' | 'manager' | 'agent',
  subscriptionTier: 'free' | 'starter' | 'pro',
  createdAt: Date,
  updatedAt: Date
}
```

### Business
```javascript
{
  name: String (required),
  industry: String,
  website: String,
  phone: String,
  address: String,
  services: [{
    name: String,
    durationMinutes: Number,
    priceCents: Number
  }],
  settings: {
    timezone: String (default: 'UTC'),
    locale: String (default: 'en')
  },
  chatbot: {
    enabled: Boolean,
    config: Mixed
  },
  integrations: Mixed,
  createdAt: Date,
  updatedAt: Date
}
```

### Lead
```javascript
{
  businessId: ObjectId (ref: Business, required),
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  source: String (default: 'widget'),
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'booked',
  score: Number (0-100, default: 0),
  scoreHistory: [{
    score: Number,
    reason: String,
    createdAt: Date
  }],
  notes: [{ body: String, createdAt: Date }],
  appointmentId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### SMSConversation ✨ NEW
```javascript
{
  leadPhoneNumber: String (unique, required),
  leadName: String,
  businessId: ObjectId (ref: Business),
  
  // Conversation state machine
  state: 'greeting' | 'qualification' | 'booking' | 'confirmed' | 'escalated' | 'closed',
  
  // Qualification data
  visitReason: String,
  isNewPatient: Boolean,
  urgency: 'routine' | 'urgent' | 'emergency',
  hasInsurance: Boolean,
  timePreference: 'morning' | 'afternoon' | 'any',
  
  // Booking data
  appointmentDate: Date,
  appointmentTime: String,
  
  // Conversation history
  messages: [{
    sender: 'lead' | 'velocity',
    text: String,
    timestamp: Date
  }],
  
  // Metadata
  isEmergency: Boolean,
  isEscalated: Boolean,
  escalationReason: String,
  escalatedToTeamMemberId: ObjectId,
  initiationMethod: 'missed_call' | 'form_submit' | 'manual',
  lastMessageAt: Date,
  closedAt: Date,
  closedReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/signup` | ❌ | Register new user |
| POST | `/login` | ❌ | Login (returns JWT + refresh token) |
| POST | `/logout` | ✅ | Logout & invalidate refresh token |
| POST | `/refresh` | ❌ | Get new access token |
| POST | `/verify` | ❌ | Verify token validity |

**Example:** 
```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@clinic.com","password":"pass123","businessName":"My Clinic"}'

# Response
{
  "success": true,
  "data": {
    "user": { "_id": "...", "email": "user@clinic.com", "role": "admin", ... },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Business Routes (`/api/business`)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/:id` | ✅ | Get business info |
| PUT | `/:id/settings` | ✅ | Update settings (timezone, locale) |
| POST | `/:id/services` | ✅ | Add service to business |

### Leads Routes (`/api/leads`)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/` | ❌ | Create lead (widget embed) |
| GET | `/:businessId` | ✅ | List leads (paginated, filterable) |
| GET | `/:businessId/:leadId` | ✅ | Get single lead details |
| PUT | `/:businessId/:leadId` | ✅ | Update lead (status, notes, etc.) |

**Example:**
```bash
# Create lead (from widget)
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "businessId": "63f7d8e9...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1-555-1234",
    "source": "website_form"
  }'

# Response
{
  "success": true,
  "data": {
    "_id": "63f7d9a0...",
    "firstName": "John",
    "status": "new",
    "score": 65,
    "scoreHistory": [{ "score": 65, "reason": "initial", "createdAt": "2026-05-04T..." }],
    ...
  }
}
```

### SMS Routes (`/api/sms`) ✨ NEW
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/start` | ❌ | Start new SMS conversation (missed call/form) |
| POST | `/incoming` | ❌ | Receive lead SMS message |
| GET | `/conversation/:phoneNumber` | ❌ | Get conversation history |
| POST | `/close` | ❌ | Close conversation |
| POST | `/escalate` | ❌ | Escalate to human agent |

**Example Workflow:**
```bash
# 1. Start conversation (missed call detected)
curl -X POST http://localhost:3000/api/sms/start \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1-555-123-4567",
    "businessId": "63f7d8e9...",
    "initiationMethod": "missed_call"
  }'
# Response: Velocity sends opening message

# 2. Receive lead message
curl -X POST http://localhost:3000/api/sms/incoming \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1-555-123-4567",
    "messageText": "Hi I am Sarah",
    "businessId": "63f7d8e9..."
  }'
# Response: Velocity replies with qualification question

# 3. Get full conversation
curl -X GET "http://localhost:3000/api/sms/conversation/+1-555-123-4567?businessId=63f7d8e9..."
```

---

## 🤖 Velocity SMS Assistant - Conversation Flow

### State Machine

```
┌─────────┐
│ GREETING│ ← Lead initiates or Velocity opens
└────┬────┘
     │ Capture name
     ↓
┌──────────────┐
│QUALIFICATION│ ← Ask reason, patient status, time pref
└────┬─────────┘
     │ All data captured
     ↓
┌─────────┐
│ BOOKING │ ← Offer two appointment slots
└────┬────┘
     │ Lead selects time
     ↓
┌───────────┐
│ CONFIRMED │ ← Send confirmation
└───────────┘

Note: Can escalate to ESCALATED or CLOSED at any point
Emergency keywords → ESCALATED immediately
```

### Example Conversation

```
Velocity: "Hi — Velocity from [Clinic Name]. I saw a missed call — is now a good time? What's your name?"

Lead: "Hi, I'm Sarah"

Velocity: "What's the reason for your visit?"

Lead: "I need a dental cleaning"

Velocity: "Are you a new or returning patient?"

Lead: "New patient"

Velocity: "Mornings or afternoons better?"

Lead: "Mornings"

Velocity: "Would tomorrow at 2:00 PM or Wednesday at 10:00 AM work better for you?"

Lead: "Wednesday at 10 works"

Velocity: "Great — you're set for Wednesday, May 5 at 10:00 AM. See you at [Clinic Name]. We'll text a reminder 24 hours before."
```

### Qualification Questions (asked in order)
1. **Reason for visit** — Understanding service needed
2. **Patient status** — New vs. returning
3. **Time preference** — Morning/afternoon/flexible
4. **Emergency detection** — If emergency keywords detected → immediate escalation

### Booking
- **Offer two slots** — Default: tomorrow + Wednesday, customizable via calendar API
- **Accept custom time** — If neither slot works, lead can specify any date/time
- **Confirmation** — Appointment saved, reminder scheduled

### Emergency Handling
If lead mentions: "emergency", "911", "ER", "hospital"
→ Respond: "If this is an emergency please call 911 or go to the nearest ER right away..."
→ Mark as emergency, escalate to human

---

## 🔄 Request Lifecycle

### Incoming SMS Request → Velocity Response

```
1. Lead texts business number
   ↓
2. SMS provider (Twilio) webhooks POST /api/sms/incoming
   {
     "phoneNumber": "+1-555-123-4567",
     "messageText": "Hi I'm interested",
     "businessId": "..."
   }
   ↓
3. SMSService.processIncomingMessage()
   - Lookup existing conversation by (phoneNumber, businessId)
   - If new: create SMSConversation, state='greeting'
   - Add lead message to messages[]
   ↓
4. Generate response based on current state
   - greeting → capture name, move to 'qualification'
   - qualification → ask next qualifying question
   - booking → offer appointment slots
   - confirmed → no response (conversation closed)
   ↓
5. Add Velocity's response to messages[]
   ↓
6. Save conversation to MongoDB
   ↓
7. Return response to SMS provider
   - SMS provider sends Velocity's text to lead phone
   ↓
8. API returns to requester:
   {
     "success": true,
     "data": {
       "response": "What's the reason for your visit?",
       "state": "qualification",
       "conversationId": "63f7d9a0..."
     }
   }
```

### Authenticated Request (e.g., Get Leads)

```
1. Client sends GET /api/leads/:businessId
   Headers: { "Authorization": "Bearer eyJhbGc..." }
   ↓
2. authMiddleware verifies JWT
   - Extract token from "Bearer ..." header
   - Verify signature against JWT_SECRET
   - Attach req.user = { id: userId, businessId }
   - Load user from DB → req.currentUser
   ↓
3. Route handler checks authorization
   - Verify req.user.businessId matches :businessId param
   - If no match → 403 Forbidden
   ↓
4. Query MongoDB: Lead.find({ businessId, status, score })
   - Apply pagination (skip, limit)
   - Sort by score desc, createdAt desc
   ↓
5. Return leads array + pagination metadata
   {
     "success": true,
     "data": [ ... ],
     "total": 150,
     "pages": 8,
     "currentPage": 1
   }
```

---

## 🚀 Current Implementation Status

### ✅ Completed Features

#### Backend Foundation
- [x] Node.js + Express setup
- [x] MongoDB connection with retry logic
- [x] Redis client (for refresh tokens)
- [x] Helmet security middleware
- [x] CORS configuration
- [x] Rate limiting
- [x] Global error handler

#### Authentication
- [x] User signup with email validation
- [x] User login with password hashing (bcryptjs)
- [x] JWT access token generation (15 min expiry)
- [x] Refresh token storage in Redis
- [x] Token refresh endpoint
- [x] JWT verification middleware
- [x] Logout (invalidates refresh token)

#### Data Models
- [x] User (with password hashing, email validation)
- [x] Business (with services, settings, integrations)
- [x] Lead (with scoring, status tracking, notes)
- [x] SMSConversation (conversation history, state machine) ✨ NEW

#### Lead Management
- [x] Create lead from widget (no auth)
- [x] List leads with filtering (status, score) + pagination
- [x] Get single lead details
- [x] Update lead (status, notes)
- [x] Lead scoring (computed at creation, tracked in history)

#### SMS System ✨ NEW
- [x] SMSConversation model (state machine + message history)
- [x] SMS Service (conversation logic, response generation)
- [x] SMS Templates (all messages for Velocity)
- [x] State machine: greeting → qualification → booking → confirmed
- [x] Emergency detection & escalation
- [x] Time slot management (hardcoded for now)
- [x] SMS API routes: /api/sms/start, /incoming, /conversation, /close, /escalate
- [x] Full conversation test (verified working)

#### DevOps
- [x] .env configuration template
- [x] Docker support (Dockerfile + docker-compose.yml)
- [x] Local development setup (nodemon)

### 🚧 In Progress / Planned Features

#### Short-term (Next Sprint)
- [ ] Twilio integration (real SMS sending/receiving)
- [ ] Calendar API integration (replace hardcoded time slots)
- [ ] 24-hour appointment reminders (SMS)
- [ ] Lead scoring algorithm refinement
- [ ] Business onboarding flow (create clinic, configure)

#### Medium-term (Q2 2026)
- [ ] Lead recovery campaigns (AI reactivation sequences)
- [ ] Analytics dashboard (React frontend)
- [ ] Email integration (appointment confirmations, reminders)
- [ ] SMS campaign builder (marketing messages)
- [ ] Appointment history & no-show tracking

#### Long-term (Q3+ 2026)
- [ ] Multi-channel support (WhatsApp, Facebook Messenger, email)
- [ ] AI chatbot customization per business
- [ ] Advanced lead scoring (behavioral, intent-based)
- [ ] Webhook/API for 3rd-party integrations
- [ ] Enterprise features (team management, reporting)

---

## 💻 Development Workflow

### Local Setup

```bash
# 1. Start MongoDB and Redis
docker-compose up -d

# 2. Install backend dependencies
cd backend
npm install

# 3. Create .env file
cp .env.example .env
# Edit .env with your local values

# 4. Start development server (with nodemon)
npm run dev

# Expected output:
# MongoDB connected
# Redis connected
# LeadBooster server running on port 3000
```

### Testing SMS System

```bash
# Test conversation flow (no DB needed)
node src/services/SMSService.test.js

# Test API endpoint
curl -X POST http://localhost:3000/api/sms/start \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+1-555-TEST", "businessId": "test-clinic", "initiationMethod": "missed_call"}'
```

### Environment Variables

```
# Database
MONGODB_URI=mongodb://localhost:27017/velocity-lead-recovery
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=15m
REFRESH_TOKEN_EXPIRE_DAYS=7

# Server
PORT=3000
NODE_ENV=development

# Business
CLINIC_NAME=Your Clinic Name
CLINIC_PHONE=+1-555-0000
```

---

## 📊 Workflow Summary

### Lead Lifecycle (SMS + Booking)

```
LEAD GENERATION
├── Missed call detected
├── Form submission on website
└── WhatsApp inquiry

↓

SMS CONVERSATION (Velocity)
├── Greeting: Capture name
├── Qualification: Reason, status, time pref
├── Emergency Detection: Route if critical
└── Booking: Offer slots → Confirm appointment

↓

DATABASE STORAGE
├── Create/Update Lead record
├── Create SMSConversation record
├── Store appointment details
└── Track lead score

↓

FOLLOW-UP
├── 24-hour reminder SMS
├── 2-hour reminder SMS
├── No-show tracking
└── Lead recovery campaigns (if abandoned)

↓

ANALYTICS
├── Conversion rate (new → booked)
├── Response time
├── No-show rate
└── Revenue impact
```

### Technical Workflow (Request → Response)

```
CLIENT REQUEST
↓
EXPRESS MIDDLEWARE
├── Helmet (security headers)
├── Morgan (logging)
├── CORS (cross-origin)
├── Rate Limiter
└── JSON Parser

↓
ROUTE HANDLER
├── Auth Middleware (verify JWT if needed)
├── Input Validation
└── Authorization Check

↓
SERVICE LAYER
├── Business Logic (SMS processing, lead scoring)
├── State Machine (SMS conversation)
└── Database Operations

↓
MODEL LAYER
├── Mongoose Query (MongoDB)
├── Validation
└── Data Transformation

↓
RESPONSE
{
  "success": true/false,
  "data": {...},
  "error": "...", (if applicable)
  "code": "...", (error code if applicable)
}
```

---

## 🔐 Security Considerations

### Implemented
- ✅ Password hashing (bcryptjs, 10 salt rounds)
- ✅ JWT token signing (secret key required)
- ✅ Rate limiting (prevent brute force)
- ✅ CORS whitelist
- ✅ Helmet security headers
- ✅ Request validation (email, phone format)
- ✅ Authorization checks (user.businessId matching)

### TODO (Security Hardening)
- [ ] Refresh token rotation (prevent reuse)
- [ ] Input sanitization (XSS prevention)
- [ ] SQL injection protection (Mongoose handles this)
- [ ] HTTPS enforcement
- [ ] API key validation for SMS endpoints
- [ ] Audit logging (all modifications)
- [ ] Encryption at rest (sensitive data)
- [ ] Rate limiting per user/business

---

## 📈 Scaling & Performance

### Current Approach
- Single MongoDB instance
- Single Redis instance
- In-memory rate limiter
- No load balancer

### Production Readiness (Next Phase)
- [ ] MongoDB replica set
- [ ] Redis cluster
- [ ] Horizontal scaling (Docker Swarm / K8s)
- [ ] Load balancer (Nginx / HAProxy)
- [ ] CDN for static assets
- [ ] Database indexing optimization
- [ ] Query performance monitoring

---

## 🎯 Key Files & Their Purpose

| File | Purpose |
|------|---------|
| `server.js` | Entry point, database/Redis connection |
| `app.js` | Express setup, route registration, middleware |
| `AuthService.js` | JWT generation, refresh token, signup/login logic |
| `SMSService.js` | **Velocity conversation state machine** |
| `smsTemplates.js` | **All SMS message templates** |
| `models/SMSConversation.js` | **SMS conversation schema** |
| `routes/sms.routes.js` | **SMS API endpoints** |
| `config/database.js` | MongoDB connection with retry |
| `middleware/auth.middleware.js` | JWT verification |
| `.env` | Local development configuration |

---

## 📞 Next Steps (Recommended)

### Immediate (This Week)
1. [ ] Start Docker containers locally (MongoDB + Redis)
2. [ ] Run `npm run dev` and verify server connection
3. [ ] Test SMS endpoints with curl or Postman
4. [ ] Review and customize message templates
5. [ ] Set up Twilio account for real SMS

### Short-term (Next 2 Weeks)
1. [ ] Integrate Twilio for real SMS sending/receiving
2. [ ] Add calendar API integration (Google Calendar / Calendly)
3. [ ] Build React dashboard to view leads & conversations
4. [ ] Implement appointment reminders (24h, 2h before)
5. [ ] Add business onboarding flow

### Medium-term (Month 2-3)
1. [ ] Lead recovery campaign automation
2. [ ] Advanced analytics dashboard
3. [ ] Multi-channel support (WhatsApp, email)
4. [ ] Team collaboration features
5. [ ] Testing & CI/CD pipeline

---

## 📖 Documentation References

- **SMS Integration Guide:** [SMS_INTEGRATION_GUIDE.md](backend/src/services/SMS_INTEGRATION_GUIDE.md)
- **SMS Quick Start:** [SMS_QUICKSTART.md](backend/SMS_QUICKSTART.md)
- **Complete Docs:** [CompleteDocumentation.txt](CompleteDocumentation.txt)
- **Implementation Plan:** [Implementation.txt](Implementation.txt)

---

## 👥 Team & Ownership

- **Project:** Velocity Lead Recovery SaaS
- **Current Phase:** Backend foundation + SMS system
- **Tech Lead:** System design, architecture
- **Status:** Alpha, ready for SMS provider integration

---

**Generated:** May 4, 2026  
**Next Review:** May 11, 2026
