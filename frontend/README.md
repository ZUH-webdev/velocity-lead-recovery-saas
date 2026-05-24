# Velocity V2 Frontend

Elite SaaS dashboard for lead recovery and automated appointment booking.

## Quick Start

Start the backend and frontend for local development (two terminals):

1) Start backend (default port 3001)

```bash
cd backend
npm install
npm run dev
```

2) Start frontend (Next.js uses port `3000` by default)

```bash
cd frontend
npm install
npm run dev
```

Open the dashboard at http://localhost:3000.

## Build for Production

```bash
npm run build
npm run start
```

## Architecture

### Components

- **DashboardLayout**: Main layout with sidebar and navigation
- **Dashboard**: Core dashboard view with recovery funnel, leads feed, and calendar status
- **LeadCard**: Reusable component for displaying individual leads with score and state
- **RecoveryFunnel**: Analytics section showing conversion metrics and funnel visualization
- **AIConversationMirror**: Side panel for viewing live SMS conversations
- **CalendarSyncStatus**: Google Calendar integration status and sync controls

### Features

- **Real-time Lead Feed**: Display active leads with AI-calculated lead scores (0-100)
- **Recovery Funnel Analytics**: Visual representation of missed calls → qualified leads → booked appointments
- **Live SMS Transcripts**: Mirror AI conversations with patients
- **Calendar Integration**: Google Calendar sync status and timezone management
- **Elite UI/UX**:
  - Glassmorphism effects with backdrop blur
  - Smooth Framer Motion animations
  - Responsive, mobile-first design
  - Electric indigo accent colors
  - Dark obsidian theme

### API Integration

The frontend is configured to connect to the backend API at `http://localhost:3001/api`. 

Key endpoints:
- `GET /api/leads` - Fetch all leads
- `GET /api/calendar/status` - Get calendar sync status
- `POST /api/calendar/sync` - Trigger calendar sync
- `POST /api/leads/:id/escalate` - Escalate to human agent

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Theme**: Dark obsidian theme with electric indigo accents
- **Responsive**: Mobile-first, optimized for desktop

### State Management

Currently using React local state. Can be upgraded to Redux, Zustand, or Recoil for more complex state management.

### Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Environment Variables

Create a `.env.local` file in `frontend/` (optional, Next.js falls back to the default):

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
```

### Quick API test (optional)

From the `frontend/` directory you can run the included Node test that simulates a frontend-originated API call:

```bash
# install if needed
npm install axios

# run the test (uses NEXT_PUBLIC_API_URL or defaults to http://localhost:3001/api)
node test-api.js
```

This should print `TEST_FROM_FRONTEND_SUCCESS` with the backend `/api/health` response when both servers are running.
