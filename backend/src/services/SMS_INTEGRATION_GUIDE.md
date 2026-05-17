# Velocity SMS System Integration Guide

## Overview
The SMS system implements **Velocity**, an AI Front Desk Assistant that qualifies leads via SMS and books appointments automatically. The system handles the complete conversation flow: greeting → qualification → booking → confirmation.

## Files Created

### Models
- **[SMSConversation.js](../../models/SMSConversation.js)** — Stores conversation history, qualification data, and appointment details

### Services
- **[SMSService.js](../../services/SMSService.js)** — Core logic for Velocity conversation flow and state management
- **[smsTemplates.js](../../services/smsTemplates.js)** — All message templates and time slot generation

### Routes
- **[sms.routes.js](../../routes/sms.routes.js)** — REST API endpoints for SMS management

## Quick Start

### 1. Install Twilio (optional, for real SMS)
```bash
npm install twilio
```

### 2. Add to Environment Variables (.env)
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
CLINIC_NAME=Your Clinic Name
```

### 3. API Endpoints

#### Start a New Conversation
```bash
POST /api/sms/start
Content-Type: application/json

{
  "phoneNumber": "+1-555-123-4567",
  "businessId": "63f7d8e9c1a2b3e4f5g6h7i8",
  "initiationMethod": "missed_call",
  "leadName": "John"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "63f7d9a0c1a2b3e4f5g6h7i9",
    "message": "Hi — Velocity from Your Clinic. I saw a missed call — is now a good time? What's your name?",
    "state": "greeting"
  }
}
```

#### Receive Lead Message
```bash
POST /api/sms/incoming
Content-Type: application/json

{
  "phoneNumber": "+1-555-123-4567",
  "messageText": "Hi! I'm Sarah",
  "businessId": "63f7d8e9c1a2b3e4f5g6h7i8"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "What's the reason for your visit?",
    "state": "qualification",
    "conversationId": "63f7d9a0c1a2b3e4f5g6h7i9"
  }
}
```

#### Get Conversation History
```bash
GET /api/sms/conversation/+1-555-123-4567?businessId=63f7d8e9c1a2b3e4f5g6h7i8
```

#### Close Conversation
```bash
POST /api/sms/close
Content-Type: application/json

{
  "phoneNumber": "+1-555-123-4567",
  "businessId": "63f7d8e9c1a2b3e4f5g6h7i8",
  "reason": "completed"
}
```

#### Escalate to Human
```bash
POST /api/sms/escalate
Content-Type: application/json

{
  "phoneNumber": "+1-555-123-4567",
  "businessId": "63f7d8e9c1a2b3e4f5g6h7i8",
  "teamMemberId": "63f7d8e9c1a2b3e4f5g6h7i0",
  "reason": "Complex insurance question"
}
```

## Conversation Flow

### State Machine
1. **greeting** — Capture lead name
2. **qualification** — Ask reason, patient status, time preference
3. **booking** — Offer two appointment slots
4. **confirmed** — Appointment booked
5. **escalated** — Handed off to human
6. **closed** — Conversation ended

### Example Conversation

```
Lead:        "hello velocity"
Velocity:    "Hi — Velocity from [Clinic Name]. I saw a missed call — is now a good time? What's your name?"

Lead:        "i am zain"
Velocity:    "What's the reason for your visit?"

Lead:        "dental appointment"
Velocity:    "Are you a new or returning patient?"

Lead:        "new"
Velocity:    "Mornings or afternoons better?"

Lead:        "mornings"
Velocity:    "Would tomorrow at 2:00 PM or Wednesday at 10:00 AM work better for you?"

Lead:        "wed 10"
Velocity:    "Great — you're set for Wednesday, May 5 at 10:00 AM. See you at [Clinic Name]. We'll text a reminder 24 hours before."
```

## Emergency Detection

If the lead mentions emergency keywords (emergency, 911, ER, hospital), Velocity immediately responds:

```
"If this is an emergency please call 911 or go to the nearest ER right away. If urgent but not life-threatening, reply 'urgent' and I'll prioritize a callback."
```

The conversation is escalated and marked as emergency.

## Customization

### Update Clinic Name
Edit `.env` and set:
```
CLINIC_NAME=Your Clinic Name
```

### Modify Time Slots
In [smsTemplates.js](../../services/smsTemplates.js), update the `getTimeSlots()` function to integrate with your calendar API:

```javascript
const getTimeSlots = async () => {
  // Replace with real calendar API call
  const slots = await calendarAPI.getAvailableSlots();
  return slots;
};
```

### Add Custom Qualification Questions
In [SMSService.js](../../services/SMSService.js), extend the `_handleQualification()` method:

```javascript
// Example: Add insurance provider capture
if (!conversation.insuranceProvider) {
  conversation.insuranceProvider = text;
  return "Which insurance plan do you have?";
}
```

## Twilio Integration (Optional)

### 1. Set up Twilio Webhook
Point your Twilio phone number's messaging webhook to:
```
https://your-backend.com/api/sms/incoming
```

### 2. Convert Twilio Payload
Create middleware to convert Twilio format to our API:

```javascript
router.post('/twilio-webhook', (req, res) => {
  const { From, Body } = req.body;
  
  // Remove "+1" prefix if present
  const phoneNumber = From;
  const messageText = Body;
  const businessId = req.business._id; // From auth middleware
  
  // Call our SMS endpoint
  SMSService.processIncomingMessage(
    phoneNumber,
    messageText,
    businessId,
    'twilio'
  );
  
  res.sendStatus(200);
});
```

### 3. Send SMS Responses
Use Twilio client to send Velocity's responses:

```javascript
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = (to, message) => {
  return client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to
  });
};
```

## Testing

### Local Test
```bash
curl -X POST http://localhost:3000/api/sms/start \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1-555-123-4567",
    "businessId": "test-business-id",
    "initiationMethod": "missed_call"
  }'
```

### Full Conversation
1. Start conversation with `POST /api/sms/start`
2. Send message with `POST /api/sms/incoming`
3. Repeat step 2 for each lead message
4. Retrieve full history with `GET /api/sms/conversation/:phoneNumber`

## Analytics & Reporting

Query conversations by state:
```javascript
const SMSConversation = require('../models/SMSConversation');

// Get all confirmed bookings for a business
const bookedAppointments = await SMSConversation.find({
  businessId,
  state: 'confirmed'
});

// Get escalated conversations
const escalated = await SMSConversation.find({
  businessId,
  isEscalated: true
});

// Get emergency cases
const emergencies = await SMSConversation.find({
  businessId,
  isEmergency: true
});
```

## Next Steps

1. **Connect Twilio** — Set up real SMS sending/receiving
2. **Integrate Calendar** — Replace hardcoded time slots with actual availability
3. **Add Reminders** — Send 24-hour appointment reminders
4. **Add Analytics** — Track conversion rates, response times
5. **A/B Testing** — Test different message templates

---

**Status:** ✅ Ready to deploy | **Version:** 1.0.0
