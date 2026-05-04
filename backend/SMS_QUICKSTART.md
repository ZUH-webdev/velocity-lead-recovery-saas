# SMS System Quick Start

## What Was Integrated

✅ **Models**
- `SMSConversation.js` — Stores conversation history and qualification state

✅ **Services**
- `SMSService.js` — Velocity conversation logic (greeting → qualification → booking → confirmed)
- `smsTemplates.js` — All message templates and time slot management

✅ **Routes**
- `sms.routes.js` — REST API for SMS operations
- Updated `app.js` to register SMS routes at `/api/sms`

## Test It Locally

```bash
# Run the SMS service test (no database needed)
cd backend
node src/services/SMSService.test.js
```

Expected output: Full conversation flow (greeting → qualification → booking → confirmed) ✅

## Try the API

### Start a Conversation
```bash
curl -X POST http://localhost:3000/api/sms/start \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1-555-TEST-123",
    "businessId": "your-clinic-id",
    "initiationMethod": "missed_call"
  }'
```

### Send a Message
```bash
curl -X POST http://localhost:3000/api/sms/incoming \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1-555-TEST-123",
    "messageText": "Hi I am Sarah",
    "businessId": "your-clinic-id"
  }'
```

## Conversation Stages

**1. Greeting**
- Velocity: "Hi — Velocity from [Clinic]. I saw a missed call — is now a good time? What's your name?"
- Captures: Lead name

**2. Qualification**
- Ask: Reason for visit
- Ask: New or returning patient
- Ask: Morning or afternoon preference
- Detects: Emergency keywords (911, emergency, ER) → immediate escalation

**3. Booking**
- Offer: Two specific time slots
- Capture: Chosen appointment date/time
- Allow: Custom time if slots don't work

**4. Confirmed**
- Send: Appointment confirmation
- Conversation ends

## Next Steps

1. **Connect Real SMS** — Update `SMS_INTEGRATION_GUIDE.md` for Twilio setup
2. **Link to Calendar API** — Replace hardcoded time slots in `smsTemplates.js`
3. **Add Reminders** — Send 24-hour reminder before appointment
4. **Business Customization** — Update clinic name and phone in messages
5. **Database Integration** — Ensure MongoDB connection is working

## File Locations
- Models: `backend/src/models/SMSConversation.js`
- Services: `backend/src/services/SMSService.js` + `smsTemplates.js`
- Routes: `backend/src/routes/sms.routes.js`
- Integration Guide: `backend/src/services/SMS_INTEGRATION_GUIDE.md`
- Test: `backend/src/services/SMSService.test.js`

---

**Status:** Ready to integrate with Twilio or other SMS provider
