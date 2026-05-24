# Quick Setup Guide - Velocity V2 Frontend

## 60-Second Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` if needed:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Start Development Server
```bash
npm run dev
```

Dashboard available at http://localhost:3000.

---

## What's Included

```
frontend/
├── app/                  # Next.js App Router pages and layout
├── src/                  # Shared components, hooks, and utilities
├── public/               # Static assets
├── tailwind.config.js    # Tailwind CSS config
├── postcss.config.js     # PostCSS config
└── package.json          # Dependencies
```

---

## Key Components

### DashboardLayout
- Main container with sidebar navigation
- Manages lead selection and conversation state

### Dashboard
- Displays recovery funnel, lead feed, and calendar status

### LeadCard
- Individual lead display card

### RecoveryFunnel
- Analytics dashboard with funnel visualization

### AIConversationMirror
- Right-side drawer for SMS conversations

### CalendarSyncStatus
- Google Calendar integration status and sync controls

---

## API Integration

### Mock Data (Development)

By default, the dashboard uses mock data. No backend required to see the UI in action.

### Real Backend API (Production)

To connect to the real Node.js backend, update the API client under `src/lib/apiClient.ts` and set `NEXT_PUBLIC_API_URL` in `.env.local`.

---

## Build and Deploy

```bash
npm run build
npm run start
```

---

## Troubleshooting

### Issue: Next.js hot reload not working
- Restart dev server: `npm run dev`
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: API calls failing
- Check backend is running: `curl http://localhost:3001/api/health`
- Verify `NEXT_PUBLIC_API_URL` in `.env.local` matches backend URL
- Check CORS configuration in backend

---

Created: May 6, 2026
For: Velocity V2 Frontend Dashboard
