## Google Calendar Integration Guide

This guide explains how to integrate Google Calendar OAuth2 for real-time availability checking with your Velocity SMS booking system.

---

## 1. Setup Overview

The integration uses Google Calendar's OAuth2 and freebusy.query API to:
- Authenticate businesses via OAuth
- Store refresh tokens securely in MongoDB (Business model)
- Query real-time availability for 30-minute slots between 9 AM - 5 PM
- Handle timezone conversions for local service businesses

---

## 2. Google Cloud Setup

### 2.1 Create OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google Calendar API**:
   - Search for "Google Calendar API"
   - Click **Enable**
4. Create OAuth2 credentials:
   - Go to **Credentials** → **Create Credentials** → **OAuth client ID**
   - Choose **Web application**
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback` (development)
     - `https://yourdomain.com/api/auth/google/callback` (production)
   - Copy **Client ID** and **Client Secret**

### 2.2 Environment Variables

Add to `.env`:

```env
GOOGLE_CLIENT_ID=666097570916-jnccj025qgr7um0n4bfe4adoc11s9tda.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret_from_google_console
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

---

## 3. API Routes for Calendar Setup

Create `backend/src/routes/calendar.routes.js`:

```javascript
/**
 * Calendar Integration Routes
 * Handles OAuth flow for connecting Google Calendar
 */
const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const CalendarService = require('../services/CalendarService');
const auth = require('../middleware/auth.middleware');

/**
 * GET /api/calendar/auth-url
 * Get Google OAuth authorization URL for business
 * User visits this in browser to authorize
 */
router.get('/auth-url', auth, async (req, res) => {
  try {
    const authUrl = CalendarService.getAuthorizationUrl();
    
    res.json({
      success: true,
      authUrl,
      message: 'Visit this URL to authorize Google Calendar access'
    });
  } catch (error) {
    console.error('Error getting auth URL:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/calendar/callback
 * OAuth callback - exchange code for refresh token
 * Google redirects here after user approves
 */
router.get('/callback', auth, async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Authorization code missing' 
      });
    }

    // Exchange code for refresh token
    const refreshToken = await CalendarService.getRefreshTokenFromCode(code);

    // Get business from authenticated user
    const business = await Business.findById(req.user.businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Store refresh token in business document
    business.integrations = business.integrations || {};
    business.integrations.googleCalendar = {
      refreshToken,
      calendarId: 'primary', // Use primary calendar by default
      connectedAt: new Date(),
      connectedBy: req.user.userId
    };

    await business.save();

    res.json({
      success: true,
      message: 'Google Calendar connected successfully',
      business: {
        id: business._id,
        name: business.name,
        calendarConnected: true
      }
    });
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/calendar/availability
 * Get available time slots for a given date
 * 
 * Query params:
 *   - date (required): YYYY-MM-DD format
 * 
 * Returns: Array of formatted time slots (e.g., ["10:00 AM", "2:30 PM"])
 */
router.get('/availability', auth, async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Date parameter required (YYYY-MM-DD)' 
      });
    }

    const business = await Business.findById(req.user.businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    if (!business.integrations?.googleCalendar?.refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Google Calendar not connected. Use /api/calendar/auth-url first'
      });
    }

    // Get available slots from calendar
    const slots = await CalendarService.getAvailableSlots(business, date);

    res.json({
      success: true,
      date,
      timezone: business.settings?.timezone || 'UTC',
      availableSlots: slots,
      count: slots.length
    });
  } catch (error) {
    console.error('Error getting availability:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/calendar/disconnect
 * Disconnect Google Calendar from business
 */
router.delete('/disconnect', auth, async (req, res) => {
  try {
    const business = await Business.findById(req.user.businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Clear calendar integration
    if (business.integrations?.googleCalendar) {
      business.integrations.googleCalendar = null;
      await business.save();
    }

    res.json({
      success: true,
      message: 'Google Calendar disconnected'
    });
  } catch (error) {
    console.error('Error disconnecting calendar:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
```

---

## 4. Integration with SMSService

The CalendarService is automatically integrated into SMSService when handling the **BOOKING** state:

### How It Works

1. **User reaches booking state** in SMS conversation
2. **SMSService calls `_handleBooking()`** with businessId
3. **Business document is fetched** to get calendar settings
4. **CalendarService queries Google Calendar API** for tomorrow's availability
5. **Real-time slots are returned** or fallback to defaults if:
   - Calendar not connected
   - API error occurs
   - No refresh token found

### Code Flow

```javascript
// In SMSService.js _handleBooking():

// 1. Fetch business and its calendar settings
const business = await Business.findById(businessId);

// 2. Check if calendar is configured
if (business.integrations?.googleCalendar?.refreshToken) {
  // 3. Get real availability
  const realSlots = await CalendarService.getAvailableSlots(business, tomorrowDate);
  
  // 4. Format and return
  availableSlots = realSlots.map(time => ({
    slot: `tomorrow at ${time}`,
    time: time
  }));
}

// 5. Fallback to defaults if anything fails
else {
  availableSlots = this._getDefaultSlots();
}
```

### Example SMS Conversation with Calendar Integration

```
Lead: Hi
Velocity: Hi — Velocity from [Clinic Name]. I saw a missed call — is now a good time? What's your name?

Lead: John
Velocity: What's the reason for your visit?

Lead: Regular checkup
Velocity: Are you a new or returning patient?

Lead: Returning
Velocity: Mornings or afternoons better?

Lead: Afternoons
Velocity: Would tomorrow (May 6, 2025) at 3:00 PM or tomorrow (May 6, 2025) at 4:30 PM work better for you?
          [These times come from Google Calendar real-time availability!]

Lead: First one
Velocity: Great — you're set for Tuesday, May 6, 2025 at 3:00 PM. See you at [Clinic Name]. 
          We'll text a reminder 24 hours before.
```

---

## 5. Timezone Handling

The system handles timezones in three ways:

### 5.1 Business Timezone Setting

Store in Business model under `settings.timezone`:

```javascript
// Example: Creating a business with timezone
const business = new Business({
  name: "Dr. Smith's Clinic",
  settings: {
    timezone: "America/New_York",  // Use IANA timezone format
    locale: "en"
  }
});
```

### 5.2 CalendarService Timezone Conversion

Converts all times to business's local timezone:

```javascript
// CalendarService automatically:
// 1. Takes UTC times from Google Calendar API
// 2. Converts to business's timezone
// 3. Finds 9 AM - 5 PM in that timezone
// 4. Returns formatted times (e.g., "10:00 AM")
```

### 5.3 Supported Timezones

Use standard IANA timezone identifiers:

```
America/New_York      - EST/EDT
America/Chicago       - CST/CDT
America/Denver        - MST/MDT
America/Los_Angeles   - PST/PDT
Europe/London         - GMT/BST
Europe/Paris          - CET/CEST
Asia/Tokyo            - JST
Australia/Sydney      - AEST/AEDT
UTC                   - Coordinated Universal Time
```

[Full list of IANA timezones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

---

## 6. Error Handling & Fallbacks

The system has graceful error handling:

```javascript
// Scenario 1: Calendar not connected
→ Falls back to hardcoded slots (tomorrow 2:00 PM, Wednesday 10:00 AM)

// Scenario 2: Calendar API error (network issue, etc.)
→ Logs error, uses default slots

// Scenario 3: No refresh token
→ Uses default slots

// Scenario 4: Invalid timezone
→ Defaults to UTC

// Scenario 5: No available slots in business hours
→ Returns empty array (SMSService handles gracefully)
```

---

## 7. Testing the Integration

### 7.1 Test OAuth Flow

```bash
# 1. Get auth URL
curl -H "Authorization: Bearer <your_jwt_token>" \
  http://localhost:3001/api/calendar/auth-url

# 2. Visit the returned URL in browser
# 3. Approve access
# 4. Google redirects to callback with code
# 5. Check business document - should have refreshToken stored
```

### 7.2 Test Availability Lookup

```bash
# After calendar is connected:
curl -H "Authorization: Bearer <your_jwt_token>" \
  "http://localhost:3001/api/calendar/availability?date=2025-05-06"

# Response:
{
  "success": true,
  "date": "2025-05-06",
  "timezone": "America/New_York",
  "availableSlots": ["10:00 AM", "2:30 PM"],
  "count": 2
}
```

### 7.3 Test SMS Conversation

Send SMS to Velocity:
```
User: Hi
User: John
User: Regular checkup
User: Returning
User: Afternoons
```

Should receive availability from actual calendar.

---

## 8. Security Considerations

### 8.1 Refresh Token Storage

- ✅ Stored encrypted in MongoDB (recommended: add field-level encryption)
- ❌ Never log refresh tokens
- ✅ Marked as sensitive field in Business model

### 8.2 OAuth2 Best Practices

- ✅ Use PKCE for web flows (already handled by googleapis library)
- ✅ State parameter validation (implement in production)
- ✅ Scope limiting: only request `calendar` scope
- ✅ Offline access required for refresh tokens

### 8.3 Adding Encryption (Recommended)

For production, encrypt refresh tokens:

```bash
npm install crypto
```

```javascript
// In utils/encryption.js
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32-byte hex string

function encryptToken(token) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

function decryptToken(encryptedToken) {
  const [iv, encrypted] = encryptedToken.split(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encryptToken, decryptToken };
```

Then use in Business schema:

```javascript
integrations: {
  googleCalendar: {
    refreshToken: {
      type: String,
      set: (value) => encryptToken(value),
      get: (value) => decryptToken(value)
    }
  }
}
```

---

## 9. Production Deployment Checklist

- [ ] Set `GOOGLE_CLIENT_SECRET` in production environment
- [ ] Update `GOOGLE_REDIRECT_URI` to production domain
- [ ] Implement refresh token encryption
- [ ] Add logging/monitoring for calendar API failures
- [ ] Test with multiple timezones
- [ ] Add rate limiting to `/api/calendar/availability` endpoint
- [ ] Set up error alerting for repeated calendar failures
- [ ] Document OAuth scopes for compliance/privacy policy
- [ ] Add user-facing error messages for calendar failures

---

## 10. Troubleshooting

### Issue: "No Google Calendar refresh token found"

**Cause:** Calendar not connected

**Solution:** 
1. Go to `/api/calendar/auth-url`
2. User must approve access
3. Refresh token saved to Business document

### Issue: "Invalid timezone"

**Cause:** Incorrect IANA timezone identifier

**Solution:**
- Check `business.settings.timezone` format
- Use standard IANA identifiers (e.g., `America/New_York`, not `EST`)

### Issue: "No available slots returned"

**Cause:** Calendar is fully booked between 9 AM - 5 PM

**Solution:**
- Check calendar directly in Google Calendar
- Expand business hours in CalendarService (change 9/17 hardcoded values)
- Adjust slot duration from 30 minutes

### Issue: OAuth redirect not working

**Cause:** Redirect URI mismatch

**Solution:**
1. Check `GOOGLE_REDIRECT_URI` in `.env` matches Google Console
2. Ensure trailing slashes match exactly
3. For localhost, ensure port matches (3000 vs 3001)

---

## 11. Next Steps

- [ ] Add support for multiple calendars per business
- [ ] Implement buffer time between appointments (30 min gaps)
- [ ] Add support for business hours configuration
- [ ] Implement appointment blocking (mark booked slots as unavailable)
- [ ] Add SMS confirmation with Google Calendar event creation
- [ ] Create admin dashboard to manage calendar settings

