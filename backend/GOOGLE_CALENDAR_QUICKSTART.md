# Google Calendar Integration - Quick Setup & Testing

## Prerequisites

✅ Already installed:
- `googleapis` npm package
- Google OAuth2 credentials

## Step 1: Environment Variables

Verify your `.env` file has:

```env
GOOGLE_CLIENT_ID=666097570916-jnccj025qgr7um0n4bfe4adoc11s9tda.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret_from_google_console
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

## Step 2: Update Business Model

✅ Already done - Business model now supports:
```javascript
integrations: {
  googleCalendar: {
    refreshToken: String,
    calendarId: String,
    connectedAt: Date,
    connectedBy: String
  }
}
```

## Step 3: Restart Backend Server

```bash
cd backend
npm start
```

Should see no errors in console.

## Step 4: Test Calendar Routes

### Test 4.1: Get Auth URL

```bash
# Get authorization URL to connect calendar
curl -X GET http://localhost:3001/api/calendar/auth-url \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "success": true,
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "message": "Visit this URL to authorize Google Calendar access"
}
```

### Test 4.2: Authorize in Browser

1. Copy the `authUrl` from above
2. Open in browser
3. Sign in with Google account that owns the calendar
4. Approve access to calendar
5. Google redirects to callback URL
6. Should see success message

### Test 4.3: Check Connection Status

```bash
curl -X GET http://localhost:3001/api/calendar/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (if connected):
```json
{
  "success": true,
  "connected": true,
  "business": {
    "id": "...",
    "name": "Your Business Name",
    "timezone": "America/New_York"
  },
  "calendar": {
    "calendarId": "primary",
    "connectedAt": "2025-05-05T10:30:00.000Z",
    "connectedBy": "userId123"
  }
}
```

### Test 4.4: Get Available Slots

```bash
# Get available slots for a specific date
curl -X GET "http://localhost:3001/api/calendar/availability?date=2025-05-06" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "success": true,
  "date": "2025-05-06",
  "timezone": "America/New_York",
  "availableSlots": [
    "10:00 AM",
    "10:30 AM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "4:00 PM"
  ],
  "count": 6
}
```

## Step 5: Test SMS Booking Flow

Send SMS messages to trigger the SMS bot:

```
User: Hi
→ Velocity: Hi — Velocity from [Business Name]. I saw a missed call — is now a good time? What's your name?

User: John Smith
→ Velocity: What's the reason for your visit?

User: Regular checkup
→ Velocity: Are you a new or returning patient?

User: Returning
→ Velocity: Mornings or afternoons better?

User: Afternoons
→ Velocity: Would tomorrow (May 6) at 3:00 PM or tomorrow (May 6) at 4:30 PM work better for you?
           [These times come from real Google Calendar availability!]

User: First one
→ Velocity: Great — you're set for Tuesday, May 6 at 3:00 PM. See you at [Business Name]. 
           We'll text a reminder 24 hours before.
```

## Step 6: Update Business Timezone (Optional)

Set timezone for more accurate slot times:

```bash
curl -X PUT http://localhost:3001/api/calendar/settings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "timezone": "America/Los_Angeles"
  }'
```

## Step 7: Disconnect Calendar (if needed)

```bash
curl -X DELETE http://localhost:3001/api/calendar/disconnect \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Files Created/Modified

### Created:
- ✅ `src/services/CalendarService.js` - Google Calendar API integration
- ✅ `src/routes/calendar.routes.js` - OAuth and availability endpoints
- ✅ `src/services/GOOGLE_CALENDAR_INTEGRATION_GUIDE.md` - Full documentation

### Modified:
- ✅ `src/models/Business.js` - Added calendar integration fields
- ✅ `src/services/SMSService.js` - Integrated CalendarService for BOOKING state
- ✅ `src/app.js` - Registered calendar routes

---

## How It Works in SMS Conversations

When a user reaches the **BOOKING** state:

1. **SMSService.\_handleBooking()** is called
2. Fetches Business document with calendar settings
3. Checks if calendar is connected (has refreshToken)
4. **CalendarService.getAvailableSlots()** queries Google Calendar for tomorrow
5. Returns first 2 available 30-minute slots between 9 AM - 5 PM
6. Handles timezone conversion automatically
7. Falls back to hardcoded slots if:
   - Calendar not connected
   - API error occurs
   - No slots available

---

## Timezone Examples

Set business timezone in admin panel or via API:

```javascript
// America/New_York (EST/EDT)
Available slots shown in Eastern time

// America/Los_Angeles (PST/PDT)
Available slots shown in Pacific time

// Europe/London (GMT/BST)
Available slots shown in London time

// Asia/Tokyo (JST)
Available slots shown in Japan time
```

---

## Troubleshooting

### "No Google Calendar refresh token found"
- Go to `/api/calendar/auth-url`
- Complete OAuth authorization flow
- Refresh token should be stored in Business document

### "Invalid date format"
- Use YYYY-MM-DD format only (e.g., 2025-05-06)
- Must be a future date

### "No available slots returned"
- Calendar is fully booked between 9 AM - 5 PM
- Check calendar directly in Google Calendar UI
- Or expand business hours (edit CalendarService.js line with startHour/endHour)

### "401 Unauthorized"
- JWT token missing or invalid
- Include Authorization header with valid token

### OAuth redirect not working
- Verify GOOGLE_REDIRECT_URI in .env matches Google Console
- For localhost, ensure port matches (3000 vs 3001)
- Check trailing slashes match exactly

---

## Next Steps

1. ✅ Test the 4 calendar endpoints above
2. ✅ Send test SMS to trigger booking flow
3. ✅ Verify real calendar slots appear in conversation
4. 🔜 Add business hours configuration
5. 🔜 Implement appointment blocking
6. 🔜 Create admin dashboard for calendar management

---

## Support Files

- Full integration guide: `src/services/GOOGLE_CALENDAR_INTEGRATION_GUIDE.md`
- CalendarService code: `src/services/CalendarService.js`
- Calendar routes: `src/routes/calendar.routes.js`
- Modified SMSService: `src/services/SMSService.js`
