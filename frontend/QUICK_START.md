# Quick Setup Guide - Velocity V2 Frontend

## ⚡ 60-Second Setup

### 1. **Install Dependencies**
```bash
cd frontend
npm install
```

### 2. **Configure Environment**
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Velocity V2
```

### 3. **Start Development Server**
```bash
npm run dev
```

Dashboard available at: **http://localhost:3000**

---

## 📦 What's Included

```
frontend/
├── src/
│   ├── components/           # React components
│   │   ├── DashboardLayout.jsx       # Main layout
│   │   ├── Dashboard.jsx              # Dashboard view
│   │   ├── LeadCard.jsx               # Lead card component
│   │   ├── RecoveryFunnel.jsx         # Analytics & funnel
│   │   ├── AIConversationMirror.jsx   # Conversation panel
│   │   └── CalendarSyncStatus.jsx     # Calendar integration
│   ├── hooks/                # Custom React hooks
│   │   └── useAsync.js                # API data fetching
│   ├── utils/                # Utility functions
│   │   ├── api.js                     # API client
│   │   └── mockData.js                # Mock data generator
│   ├── App.jsx               # Root component
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
├── postcss.config.js         # PostCSS config
└── package.json              # Dependencies

```

---

## 🎯 Key Components Breakdown

### **DashboardLayout.jsx**
- Main container with sidebar navigation
- Manages lead selection and conversation state
- Props: None (self-contained)

### **Dashboard.jsx**
- Displays recovery funnel, lead feed, calendar status
- Props:
  - `metrics` — Recovery funnel data
  - `leads` — Array of lead objects
  - `selectedLead` — Currently selected lead
  - `onLeadClick` — Click handler for lead card
  - `calendarStatus` — Google Calendar status
  - `searchTerm` / `onSearchChange` — Search functionality
  - `filterState` / `onFilterChange` — Lead filtering

### **LeadCard.jsx**
- Individual lead display card
- Props:
  - `lead` — Lead object with: id, name, phoneNumber, leadScore, conversationState, pattern, lastInteraction, appointmentScheduled, source
  - `onClick` — Click handler
  - `isSelected` — Visual selection state

### **RecoveryFunnel.jsx**
- Analytics dashboard with funnel visualization
- Props:
  - `metrics` — Object with funnelData, totalMissedCalls, leadsQualified, appointmentsBooked, etc.

### **AIConversationMirror.jsx**
- Right-side drawer for SMS conversations
- Props:
  - `isOpen` — Show/hide state
  - `onClose` — Close handler
  - `lead` — Selected lead data
  - `conversation` — Array of message objects

### **CalendarSyncStatus.jsx**
- Google Calendar integration status
- Props:
  - `status` — Status object with isConnected, lastSync, timezone, etc.
  - `onSync` — Sync button handler
  - `onSettings` — Settings button handler

---

## 🔌 API Integration

### Mock Data (Development)

By default, the dashboard uses mock data. No backend required to see the UI in action.

```javascript
import { generateMockLeads, generateMockRecoveryMetrics } from '../utils/mockData';

const leads = generateMockLeads(12); // 12 sample leads
const metrics = generateMockRecoveryMetrics(); // Sample metrics
```

### Real Backend API (Production)

To connect to the real Node.js backend:

1. **Edit `src/utils/api.js`**:
   ```javascript
   // Change from mock data to API calls
   import { leadsAPI, calendarAPI } from '../utils/api';
   
   const { data: leads } = useAsync(() => leadsAPI.getAll());
   ```

2. **API Endpoints** (Node.js backend):
   - `GET /api/leads` → Returns array of leads
   - `GET /api/calendar/status` → Calendar sync status
   - `POST /api/calendar/sync` → Trigger calendar sync
   - `POST /api/leads/:id/escalate` → Escalate to human

---

## 🎨 Customization Examples

### Change Primary Color from Indigo to Purple

**File:** `tailwind.config.js`
```javascript
// Add or modify
colors: {
  primary: {
    500: '#a855f7', // purple
    600: '#9333ea',
  },
},
```

**Then update components:**
```jsx
// Before
className="bg-indigo-600/40"

// After
className="bg-purple-600/40"
```

### Add New Metric Card

**File:** `src/components/RecoveryFunnel.jsx`
```jsx
const MetricCard = ({ icon: Icon, label, value, color = 'indigo' }) => (
  // ... existing code ...
);

// In component, add new card
<MetricCard
  icon={Clock}
  label="Avg Response Time"
  value={metrics.avgResponseTime}
  color="green"
/>
```

### Modify Lead Card Layout

**File:** `src/components/LeadCard.jsx`
```jsx
// Add new field display
<div className="text-sm text-slate-300">
  Company: {lead.company}
</div>

// Change hover animation
whileHover={{ scale: 1.05, y: -8 }}
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to AWS S3 + CloudFront

```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

---

## ✅ Pre-Launch Checklist

- [ ] Backend API is running (`npm run dev` in `/backend`)
- [ ] Frontend is running (`npm run dev` in `/frontend`)
- [ ] All lead cards render without errors
- [ ] Conversation mirror opens/closes smoothly
- [ ] Calendar sync status displays correctly
- [ ] Search and filter functionality works
- [ ] Responsive layout tested on mobile
- [ ] No console errors in browser DevTools

---

## 🔧 Troubleshooting

### Issue: "Cannot find module 'lucide-react'"
```bash
npm install lucide-react
```

### Issue: "Vite hot reload not working"
- Restart dev server: `npm run dev`
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: "API calls failing"
- Check backend is running: `curl http://localhost:3001/api/health`
- Verify VITE_API_URL in `.env` matches backend URL
- Check CORS configuration in backend

### Issue: "Animations feel choppy"
- Reduce `staggerChildren` delay in component
- Check browser performance in DevTools (F12 → Performance tab)

---

## 📞 Support

For issues or questions:
1. Check [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for detailed documentation
2. Review [README.md](./README.md) for architecture overview
3. Check component comments in source files

---

**Created:** May 6, 2026  
**For:** Velocity V2 Frontend Dashboard
