# ⚡ Velocity Engine

Velocity is an AI-powered appointment booking and lead recovery SaaS platform designed for high-intent local businesses such as dental clinics, med spas, and real estate agencies.

When a clinic misses an incoming call or a potential customer submits a website form, Velocity automatically launches an outbound SMS conversation workflow. The system qualifies leads, answers questions, and books appointments directly into connected calendars — all without human intervention.

---

## 🚀 Key Features

- 🤖 AI-powered lead qualification
- 📩 Automated SMS follow-up sequences
- 📅 Real-time appointment booking
- 📞 Missed-call lead recovery
- 🔄 Calendar synchronization
- 🧠 Conversational memory with vector search
- ⚡ High-speed webhook processing
- 🔐 Secure JWT authentication
- 📊 Lead scoring and tracking
- ⏰ Automated appointment reminders

---

# 🏗️ Architecture Overview

Velocity follows a decoupled architecture consisting of separate frontend and backend applications for independent deployment, scalability, and maintainability.

```text
Frontend (Next.js)
        │
        ▼
 REST API Layer
        │
        ▼
Backend (Node.js + Express)
        │
 ┌──────┼─────────────┐
 ▼      ▼             ▼
Redis PostgreSQL   Twilio
        │
        ▼
     pgvector
```

---

# 🎨 Frontend Stack

### Framework
- Next.js 16 (App Router)
- Turbopack

### Styling
- Tailwind CSS

### UI & Animations
- Framer Motion

### Frontend Responsibilities
- Landing pages
- Dashboard interfaces
- Lead management views
- Appointment management
- Analytics visualization
- Authentication flows

---

# ⚙️ Backend Stack

### Runtime
- Node.js
- Express.js

### Database
- PostgreSQL

### Vector Search
- pgvector

### Cache & Queue Layer
- Redis

### Authentication
- JWT (JSON Web Tokens)

### Backend Responsibilities
- Lead processing
- SMS automation
- AI conversation management
- Calendar integrations
- Webhook handling
- Appointment scheduling
- Reminder scheduling
- Analytics generation

---

# 🔌 Infrastructure Integrations

## Twilio
- Two-way SMS communication
- Inbound webhook processing
- Missed-call recovery workflows

## AI Voice Agent
- Automated voice interactions
- Fallback support handling
- Lead qualification assistance

## Calendar Integrations
- Google Calendar
- Calendly

Provides:
- Real-time availability lookup
- Appointment creation
- Schedule synchronization

---

# 🔄 Lead Recovery Workflow

```text
[Inbound Call Missed / Form Submitted]
                    │
                    ▼
         [Velocity Webhook Trigger]
                    │
                    ▼
      [Automated SMS Conversation]
                    │
                    ▼
      [AI Lead Qualification Engine]
                    │
                    ▼
      [Calendar Availability Check]
                    │
                    ▼
       [Appointment Successfully Booked]
                    │
                    ▼
       [Lead Score Automatically Updated]
                    │
                    ▼
      [Automated Reminder Scheduling]
                    │
                    ▼
      [24h & 2h Reminder Notifications]
```

---

# 🧠 AI Qualification Engine

The AI workflow is responsible for:

- Identifying customer intent
- Answering common questions
- Collecting lead information
- Determining lead quality
- Scheduling appointments
- Maintaining conversational context
- Escalating when necessary

---

# 📊 Lead Scoring System

Velocity automatically assigns lead scores based on engagement and booking actions.

| Action | Score |
|----------|--------|
| SMS Response | +5 |
| Qualified Lead | +10 |
| Appointment Booked | +20 |
| Appointment Confirmed | +30 |

---

# 🗄️ Database Components

### PostgreSQL

Stores:

- Users
- Businesses
- Leads
- Conversations
- Appointments
- Analytics
- Reminder logs

### pgvector

Used for:

- Semantic search
- Conversational memory
- Context retrieval
- AI response enhancement

### Redis

Used for:

- Caching
- Rate limiting
- Queue processing
- Webhook buffering
- Session optimization

---

# 🔐 Security

Velocity follows modern security practices:

- JWT Authentication
- Protected API routes
- Environment-based secrets
- Rate limiting
- Secure webhook validation
- Input sanitization
- Database query protection

---

# 💻 Local Development Setup

## Prerequisites

Install the following before running the project:

- Node.js (v18+)
- PostgreSQL
- pgvector Extension
- Redis

---

# ⚙️ Environment Variables

Create a `.env` file inside the backend project:

```env
PORT=5000

DATABASE_URL=postgresql://user:password@localhost:5432/velocity_db

REDIS_URL=redis://localhost:6379

JWT_SECRET=your_ultra_secure_jwt_string

TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

---

# 🚀 Backend Setup

```bash
cd backend

npm install

npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

# 🎨 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```
```

---

# 📁 Project Structure

```text
velocity-lead-recovery-saas/
│
├── backend/
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── jobs/
│   │   ├── config/
│   │   └── server.ts
│   │
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   ├── prisma.config.ts
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/
│   │
│   ├── app/
│   │   ├── compliance/
│   │   ├── dashboard/
│   │   ├── privacy/
│   │   ├── providers/
│   │   ├── sign-in/
│   │   ├── signup/
│   │   ├── status/
│   │   ├── terms/
│   │   ├── verify/
│   │   ├── components/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── public/
│   ├── src/
│   ├── dist/
│   │
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── COMPONENT_API.md
│   ├── BUILD_SUMMARY.md
│   └── README.md
│
├── AUTH_EMAIL_VERIFICATION_CONTEXT_REPORT.md
├── ELITE_REDESIGN_COMPLETION.md
├── Implementation.txt
├── Nextjs-shift.md
├── CompleteDocumentation.txt
├── summary.txt
│
└── README.md
```
```

---

# 👥 Engineering Team

### Zain Ul Hassan
**Frontend Engineer & Lead UI/UX Architect**

Responsible for:

- Frontend architecture
- User experience
- Design systems
- Component engineering
- Dashboard development

### Muhammad Zain
**Backend Engineer & Lead System Architect**

Responsible for:

- API architecture
- Database design
- AI workflow implementation
- Infrastructure integrations
- System scalability

---

# 📈 Future Roadmap

- Multi-location business support
- WhatsApp automation
- AI voice booking expansion
- Advanced analytics dashboard
- CRM integrations
- White-label deployments
- Multi-tenant architecture
- AI appointment optimization

---

# 📄 License

This project is proprietary software.

All rights reserved © 2026 Velocity Engine.

Unauthorized copying, modification, distribution, or commercial usage is prohibited without explicit permission.


