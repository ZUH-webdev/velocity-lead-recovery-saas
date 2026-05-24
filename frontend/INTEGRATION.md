# Frontend-Backend Integration Checklist

## Backend Requirements

The Velocity V2 dashboard expects the Node.js backend to provide these endpoints:

### ✅ Authentication
- `POST /api/auth/login` — User login
- `POST /api/auth/logout` — User logout
- `GET /api/auth/me` — Current user info

### ✅ Leads API
```
GET /api/leads
Response:
{
  "success": true,
  "data": [
    {
      "id": "lead-1",
      "name": "John Smith",
      "phoneNumber": "+1234567890",
      "leadScore": 85,
      "conversationState": "Booking",
      "pattern": "High Intent",
      "lastInteraction": "2026-05-06T10:30:00Z",
      "appointmentScheduled": true,
      "source": "Missed Call"
    }
  ]
}
```

### ✅ Calendar API
```
GET /api/calendar/status
Response:
{
  "isConnected": true,
  "lastSync": "2026-05-06T10:00:00Z",
  "timezone": "America/Los_Angeles",
  "businessName": "Elite Dental Spa",
  "upcomingAppointments": 23,
  "syncStatus": "healthy"
}

POST /api/calendar/sync
Response: { "success": true, "lastSync": "..." }

PATCH /api/calendar/timezone
Request: { "timezone": "America/New_York" }
```

### ✅ SMS/Conversation API
```
GET /api/leads/:id/conversation
Response:
{
  "data": [
    {
      "id": "msg-1",
      "sender": "Velocity",
      "message": "Hi! I noticed you missed your appointment...",
      "timestamp": "2026-05-06T10:30:00Z"
    }
  ]
}

POST /api/leads/:id/escalate
Response: { "success": true, "escalatedTo": "support@clinic.com" }
```

---

## Frontend Configuration

### Environment Variables (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### API Client Setup (src/utils/api.js)
```javascript
// Already configured for:
// - Automatic authorization headers
// - Error handling
// - Request/response logging
// - Timeout management (10s)
```

---

## Running Both Services

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3001
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## Testing the Integration

### 1. Health Check
```bash
curl http://localhost:3001/api/health
# Expected: { "status": "ok" }
```

### 2. Fetch Leads
```bash
curl http://localhost:3001/api/leads
# Should return array of leads
```

### 3. Check Calendar Status
```bash
curl http://localhost:3001/api/calendar/status
# Should return calendar sync info
```

### 4. Open Frontend
```
http://localhost:3000
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Add CORS headers in backend middleware |
| API 404 errors | Verify backend routes match frontend API calls |
| Timeout errors | Increase timeout in `src/utils/api.js` |
| Mock data showing | Check NEXT_PUBLIC_API_URL is correctly set in .env.local |

---

## Mock Data vs Real API

### Using Mock Data (Development)
```javascript
// In Dashboard.jsx
import { generateMockLeads } from '../utils/mockData';
const leads = generateMockLeads(12);
```

### Using Real API (Production)
```javascript
// In Dashboard.jsx
import { useAsync } from '../hooks/useAsync';
import { leadsAPI } from '../utils/api';

const { data: leads, status } = useAsync(() => leadsAPI.getAll());
```

---

## Next Steps

1. **Update backend** to match API response format above
2. **Test endpoints** with curl or Postman
3. **Configure .env** in frontend
4. **Switch from mock data** to real API calls
5. **Deploy both services** to production

