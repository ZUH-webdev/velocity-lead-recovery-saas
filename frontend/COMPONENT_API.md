# Component API Reference

## Core Components

### DashboardLayout

**Location:** `src/components/DashboardLayout.jsx`

**Purpose:** Main container component managing all dashboard state and rendering

**Props:** None (self-contained, manages internal state)

**Internal State:**
```javascript
- leads: Lead[]
- metrics: RecoveryMetrics
- selectedLead: Lead | null
- showConversation: boolean
- conversation: Message[]
- calendarStatus: CalendarStatus
- sidebarOpen: boolean
- searchTerm: string
- filterState: string
```

**Example Usage:**
```jsx
import DashboardLayout from './components/DashboardLayout';

function App() {
  return <DashboardLayout />;
}
```

---

### Dashboard

**Location:** `src/components/Dashboard.jsx`

**Purpose:** Main dashboard view displaying recovery funnel, leads feed, and calendar status

**Props:**
```javascript
{
  metrics: {
    totalMissedCalls: number,
    leadsQualified: number,
    appointmentsBooked: number,
    totalRecoveryValue: string,
    weeklyConversionRate: number,
    averageLeadScore: number,
    funnelData: Array<{stage, value, fill}>,
  },
  leads: Lead[],
  selectedLead: Lead | null,
  onLeadClick: (lead: Lead) => void,
  calendarStatus: CalendarStatus,
  onSync: () => Promise<void>,
  searchTerm: string,
  onSearchChange: (term: string) => void,
  filterState: string,
  onFilterChange: (state: string) => void,
}
```

**Example Usage:**
```jsx
<Dashboard
  metrics={metrics}
  leads={leads}
  selectedLead={selectedLead}
  onLeadClick={handleLeadClick}
  calendarStatus={calendarStatus}
  onSync={handleSync}
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  filterState={filterState}
  onFilterChange={setFilterState}
/>
```

---

### LeadCard

**Location:** `src/components/LeadCard.jsx`

**Purpose:** Displays individual lead information with scoring and state

**Props:**
```javascript
{
  lead: {
    id: string,
    name: string,
    phoneNumber: string,
    leadScore: number,           // 0-100
    conversationState: string,   // 'Greeting'|'Qualification'|'Booking'|'Confirmed'
    pattern: string,             // 'High Intent'|'Medium Intent'|'Follow-up Needed'|'Cancelled'
    lastInteraction: ISO8601,
    appointmentScheduled: boolean,
    source: string,              // 'Missed Call'|'Web Form'
  },
  onClick: (lead: Lead) => void,
  isSelected: boolean,
}
```

**Features:**
- Color-coded lead score (green/blue/yellow/red)
- Conversation state badge
- Hover animation with scale effect
- Appointment status indicator
- Interactive click to view conversation

**Example Usage:**
```jsx
<LeadCard
  lead={lead}
  onClick={() => handleLeadClick(lead)}
  isSelected={selectedLead?.id === lead.id}
/>
```

---

### RecoveryFunnel

**Location:** `src/components/RecoveryFunnel.jsx`

**Purpose:** Displays analytics dashboard with recovery metrics and funnel visualization

**Props:**
```javascript
{
  metrics: {
    totalMissedCalls: number,
    leadsQualified: number,
    appointmentsBooked: number,
    totalRecoveryValue: string,
    weeklyConversionRate: number,
    averageLeadScore: number,
    funnelData: Array<{
      stage: string,
      value: number,
      fill: hexColor,
    }>,
  },
}
```

**Sub-components:**
- `MetricCard` — KPI display with icon and trend
- Bar Chart (Recharts) — Funnel visualization
- Pie Chart (Recharts) — Stage breakdown
- Insight Card — Contextual insights

**Example Usage:**
```jsx
<RecoveryFunnel metrics={metrics} />
```

---

### AIConversationMirror

**Location:** `src/components/AIConversationMirror.jsx`

**Purpose:** Side drawer displaying live SMS conversation between AI and patient

**Props:**
```javascript
{
  isOpen: boolean,
  onClose: () => void,
  lead: {
    id: string,
    name: string,
    phoneNumber: string,
    leadScore: number,
    conversationState: string,
    appointmentScheduled: boolean,
  },
  conversation: Array<{
    id: string,
    sender: string,  // 'Velocity' or 'Patient'
    message: string,
    timestamp: ISO8601,
  }>,
}
```

**Features:**
- Slides in from right edge
- Message threads with sender differentiation
- Lead info header
- "Escalate to Human" button (red)
- "Send Message" button (indigo)
- Appointment confirmation badge

**Example Usage:**
```jsx
<AIConversationMirror
  isOpen={showConversation}
  onClose={() => setShowConversation(false)}
  lead={selectedLead}
  conversation={conversation}
/>
```

---

### CalendarSyncStatus

**Location:** `src/components/CalendarSyncStatus.jsx`

**Purpose:** Displays Google Calendar integration status and provides sync controls

**Props:**
```javascript
{
  status: {
    isConnected: boolean,
    lastSync: ISO8601,
    timezone: string,           // 'America/Los_Angeles'
    businessName: string,
    upcomingAppointments: number,
    syncStatus: string,         // 'healthy'|'error'|'syncing'
  },
  onSync: () => Promise<void>,
  onSettings: () => void,
}
```

**Features:**
- Connection status indicator
- Last sync time
- Timezone display
- Business name display
- Upcoming appointments count
- Sync Now button with loading state
- Settings button

**Example Usage:**
```jsx
<CalendarSyncStatus
  status={calendarStatus}
  onSync={handleSync}
  onSettings={handleSettings}
/>
```

---

## Hooks

### useAsync

**Location:** `src/hooks/useAsync.js`

**Purpose:** Manage async data fetching with loading, success, and error states

**Signature:**
```javascript
const { execute, status, data, error } = useAsync(asyncFunction, immediate)
```

**Parameters:**
- `asyncFunction: () => Promise<any>` — Async function to call
- `immediate: boolean` — Whether to call on mount (default: true)

**Returns:**
```javascript
{
  execute: () => Promise<any>,
  status: 'idle'|'pending'|'success'|'error',
  data: any | null,
  error: Error | null,
}
```

**Example Usage:**
```jsx
import { useAsync } from '../hooks/useAsync';
import { leadsAPI } from '../utils/api';

const { data: leads, status, error } = useAsync(() => leadsAPI.getAll());

return (
  <>
    {status === 'pending' && <Spinner />}
    {status === 'success' && <LeadsList leads={data} />}
    {status === 'error' && <ErrorMessage message={error.message} />}
  </>
);
```

---

### useLocalStorage

**Location:** `src/hooks/useAsync.js`

**Purpose:** Persist state to localStorage with React-like interface

**Signature:**
```javascript
const [value, setValue] = useLocalStorage(key, initialValue)
```

**Parameters:**
- `key: string` — localStorage key
- `initialValue: any` — Default value if key doesn't exist

**Example Usage:**
```jsx
const [userPreferences, setUserPreferences] = useLocalStorage('userPrefs', {});

const handleToggleSidebar = () => {
  setUserPreferences({ ...userPreferences, sidebarOpen: !sidebarOpen });
};
```

---

## Utilities

### API Client (src/utils/api.js)

**Exports:**
```javascript
export const leadsAPI = {
  getAll: () => api.get('/leads'),
  getById: (id) => api.get(`/leads/${id}`),
  updateScore: (id, score) => api.patch(`/leads/${id}/score`, { score }),
  escalateToHuman: (id) => api.post(`/leads/${id}/escalate`),
};

export const calendarAPI = {
  getStatus: () => api.get('/calendar/status'),
  getSlots: (date) => api.get('/calendar/slots', { params: { date } }),
  syncCalendar: () => api.post('/calendar/sync'),
  updateTimezone: (timezone) => api.patch('/calendar/timezone', { timezone }),
};

export const systemAPI = {
  health: () => api.get('/health'),
};
```

**Configuration:**
- Base URL: `VITE_API_URL` env variable
- Timeout: 10 seconds
- Headers: Automatic content-type
- Error handling: Centralized logging

---

### Mock Data (src/utils/mockData.js)

**Functions:**

#### generateMockLeads(count)
```javascript
generateMockLeads(12)
// Returns: Lead[]
```

#### generateMockRecoveryMetrics()
```javascript
generateMockRecoveryMetrics()
// Returns: RecoveryMetrics
```

#### generateMockConversation()
```javascript
generateMockConversation()
// Returns: Message[]
```

#### generateMockCalendarStatus()
```javascript
generateMockCalendarStatus()
// Returns: CalendarStatus
```

---

## Type Definitions

### Lead
```typescript
interface Lead {
  id: string;
  name: string;
  phoneNumber: string;
  leadScore: number;              // 0-100
  conversationState: string;      // 'Greeting'|'Qualification'|'Booking'|'Confirmed'
  pattern: string;
  lastInteraction: string;        // ISO8601
  appointmentScheduled: boolean;
  source: string;                 // 'Missed Call'|'Web Form'
}
```

### RecoveryMetrics
```typescript
interface RecoveryMetrics {
  totalMissedCalls: number;
  leadsQualified: number;
  appointmentsBooked: number;
  totalRecoveryValue: string;
  weeklyConversionRate: number;
  averageLeadScore: number;
  funnelData: FunnelStage[];
}

interface FunnelStage {
  stage: string;
  value: number;
  fill: string;  // Hex color
}
```

### CalendarStatus
```typescript
interface CalendarStatus {
  isConnected: boolean;
  lastSync: string;               // ISO8601
  timezone: string;
  businessName: string;
  upcomingAppointments: number;
  syncStatus: string;             // 'healthy'|'error'|'syncing'
}
```

### Message
```typescript
interface Message {
  id: string;
  sender: string;                 // 'Velocity'|'Patient'
  message: string;
  timestamp: string;              // ISO8601
}
```

---

**Version:** 1.0.0  
**Last Updated:** May 6, 2026
