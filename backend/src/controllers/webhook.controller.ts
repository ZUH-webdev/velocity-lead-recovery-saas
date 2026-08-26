import { Request, Response } from 'express'
import twilio from 'twilio'
import { prisma } from '../config/prisma'
import { env } from '../config/env'
import { TwilioService } from '../services/twilio.service'
import { createAppointment, findNextAvailableSlots } from '../services/appointments.service'
import { parseAppointmentTime, isWithinBusinessHours, formatInTenantTimezone } from '../services/datetime-parser.service'
import type { Tenant, Lead } from '../generated/prisma/client'

const VoiceResponse = twilio.twiml.VoiceResponse
const MessagingResponse = twilio.twiml.MessagingResponse
const WEBHOOK_BASE = `${env.API_BASE_URL}/webhooks/twilio`

// Not configurable anywhere yet (no per-service duration is wired into this
// conversation flow) — hardcoded per the task's explicit fallback instruction.
// `Service.durationMinutes` exists on the schema but nothing here selects a
// specific service, so there's nothing to read a real duration from yet.
const DEFAULT_APPOINTMENT_DURATION_MINUTES = 30

// Attempts to parse a real date/time out of the patient's SMS reply, check
// real availability, and create a real Appointment — replacing what used to
// be a keyword match that set Lead.status = BOOKED with nothing behind it.
async function attemptBooking(
  tenant: Tenant,
  lead: Lead,
  body: string,
): Promise<{ responseText: string; leadUpdate: Record<string, unknown> }> {
  const businessHours = { start: tenant.businessHoursStart, end: tenant.businessHoursEnd }
  const parsed = parseAppointmentTime(body, tenant.timezone, new Date())

  if (!parsed.datetime || parsed.ambiguous) {
    return {
      responseText:
        `Sorry, I didn't catch a specific day and time there. Could you say something like ` +
        `"Monday at 2pm"?`,
      leadUpdate: { lastContactedAt: new Date() },
    }
  }

  if (!isWithinBusinessHours(parsed.datetime, tenant.timezone, businessHours)) {
    return {
      responseText:
        `We're open ${businessHours.start}:00–${businessHours.end}:00. ` +
        `Could you suggest a time within business hours?`,
      leadUpdate: { lastContactedAt: new Date() },
    }
  }

  const result = await createAppointment(tenant, {
    leadId: lead.id,
    datetime: parsed.datetime,
    durationMinutes: DEFAULT_APPOINTMENT_DURATION_MINUTES,
  })

  if (result.ok) {
    const displayTime = formatInTenantTimezone(result.appointment.datetime, tenant.timezone)
    return {
      responseText: `You're all set for ${displayTime}! Reply CANCEL if you need to change it.`,
      leadUpdate: { status: 'BOOKED', score: { increment: 10 }, lastContactedAt: new Date() },
    }
  }

  if (result.reason === 'conflict') {
    const alternatives = await findNextAvailableSlots(
      tenant,
      parsed.datetime,
      DEFAULT_APPOINTMENT_DURATION_MINUTES,
      businessHours,
      tenant.timezone,
      3,
    )

    if (alternatives.length === 0) {
      return {
        responseText:
          `That time's already taken and I couldn't find another opening nearby — ` +
          `someone from our team will follow up with you directly to find a time.`,
        leadUpdate: { status: 'ENGAGED', lastContactedAt: new Date() },
      }
    }

    const optionsText = alternatives.map((d) => formatInTenantTimezone(d, tenant.timezone)).join(', ')
    return {
      responseText: `That time's already booked. Here are some open slots: ${optionsText}. Reply with the one that works.`,
      leadUpdate: { status: 'ENGAGED', lastContactedAt: new Date() },
    }
  }

  // lead_not_found shouldn't happen (same lead row the conversation is tied
  // to) — treat it the same as an unexpected failure.
  return {
    responseText: `Something went wrong on our end — someone from our team will follow up with you directly.`,
    leadUpdate: { lastContactedAt: new Date() },
  }
}

// Resolves the tenant a Twilio webhook belongs to.
//
// Primary signal: the `tenantId` query param stamped onto every webhook URL
// when a tenant's number is provisioned (see twilio-provisioning.service.ts).
// Fallback: match the dialed/texted `To` number against
// `Tenant.twilioPhoneNumber`, for requests that predate that stamping or a
// number configured by hand.
//
// Deliberately returns null — never `prisma.tenant.findFirst()` — when
// neither resolves. Silently guessing "the first tenant" is the bug this
// replaces: it would misroute every call the moment there's a second tenant.
async function resolveTenant(req: Request): Promise<Tenant | null> {
  const tenantId = req.query.tenantId as string | undefined
  if (tenantId) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
    if (tenant) return tenant
  }

  const to = req.body?.To as string | undefined
  if (to) {
    const tenant = await prisma.tenant.findFirst({ where: { twilioPhoneNumber: to } })
    if (tenant) return tenant
  }

  return null
}

function rejectUnresolvedTenant(req: Request, res: Response, context: string) {
  console.error(
    `[Webhook] Could not resolve tenant for ${context} — To: ${req.body?.To}, tenantId param: ${req.query.tenantId}`,
  )
  res.status(404).send('Unknown Twilio number — no matching tenant')
}

export const WebhookController = {

  // POST /api/v1/webhooks/twilio/voice?tenantId=...
  // Twilio calls this when someone calls a tenant's provisioned number.
  async handleInboundCall(req: Request, res: Response) {
    const { From, To, CallSid } = req.body

    const tenant = await resolveTenant(req)
    if (!tenant) {
      rejectUnresolvedTenant(req, res, 'inbound call')
      return
    }

    try {
      await prisma.callLog.create({
        data: {
          tenantId: tenant.id,
          callerPhone: From,
          callSid: CallSid,
          direction: 'inbound',
          status: 'in-progress',
        }
      })

      const twiml = new VoiceResponse()

      if (!tenant.twilioIntegrationEnabled) {
        // Call is logged above regardless — this only skips the AI IVR.
        twiml.say(
          { voice: 'Polly.Joanna' },
          'Thank you for calling. Please leave a message after the tone and our team will get back to you.',
        )
        twiml.hangup()
        res.type('text/xml')
        res.send(twiml.toString())
        return
      }

      const gather = twiml.gather({
        input: ['speech'],
        action: `${WEBHOOK_BASE}/voice/gather?tenantId=${tenant.id}`,
        method: 'POST',
        speechTimeout: 'auto',
        language: 'en-US',
      })

      gather.say(
        { voice: 'Polly.Joanna', language: 'en-US' },
        'Thank you for calling. This is the Velocity AI assistant. ' +
        'How can I help you today? You can say: book an appointment, ' +
        'check availability, or leave a message.'
      )

      twiml.say(
        { voice: 'Polly.Joanna' },
        'We did not receive a response. Please call back and we will assist you.'
      )
      twiml.hangup()

      res.type('text/xml')
      res.send(twiml.toString())
    } catch (err) {
      console.error('[Webhook] inboundCall error:', err)
      const twiml = new VoiceResponse()
      twiml.say('Thank you for calling. Please try again later.')
      twiml.hangup()
      res.type('text/xml')
      res.send(twiml.toString())
    }
  },

  // POST /api/v1/webhooks/twilio/voice/status?tenantId=...
  // Fires when call ends — detects missed calls
  async handleCallStatus(req: Request, res: Response) {
    const { CallSid, CallStatus, From, To, CallDuration } = req.body

    console.log(`[Webhook] Call status: ${CallStatus} from ${From}`)

    const tenant = await resolveTenant(req)
    if (!tenant) {
      rejectUnresolvedTenant(req, res, 'call status')
      return
    }

    try {
      await prisma.callLog.updateMany({
        where: { callSid: CallSid },
        data: {
          status: CallStatus,
          duration: CallDuration ? parseInt(CallDuration) : null,
        }
      })

      // MISSED CALL RECOVERY
      if (CallStatus === 'no-answer' || CallStatus === 'busy') {
        if (!tenant.twilioIntegrationEnabled) {
          // The call above is already logged — this only skips the automated
          // lead-creation/SMS-recovery flow. This is what makes the Settings
          // toggle mean something.
          console.log(`[Webhook] Missed-call automation skipped — tenant ${tenant.id} has Twilio integration disabled`)
          res.sendStatus(200)
          return
        }

        const tenantId = tenant.id

        // Create the lead using the existing schema's required fields + enums
        const lead = await prisma.lead.create({
          data: {
            tenantId,
            firstName: 'Unknown',
            phone: From,
            source: 'MISSED_CALL',
            status: 'NEW',
            priority: 'ROUTINE',
            score: 0,
          }
        })

        // Create a conversation using the existing schema's enums
        const conversation = await prisma.conversation.create({
          data: {
            leadId: lead.id,
            tenantId,
            channel: 'SMS',
            status: 'ACTIVE',
          }
        })

        const smsBody =
          `Hi! We just missed your call. We'd love to help you — ` +
          `reply YES to book an appointment or call us back at ${To}. ` +
          `Reply STOP to opt out.`

        const message = await TwilioService.sendSMS(tenantId, From, smsBody)

        // Log outbound message using existing Message schema fields
        const msgCount = await prisma.message.count({
          where: { conversationId: conversation.id }
        })

        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            tenantId,
            sender: 'AI',
            messageNumber: msgCount + 1,
            content: smsBody,
            rawPayload: { twilioSid: message.sid },
          }
        })

        await prisma.lead.update({
          where: { id: lead.id },
          data: { score: { increment: 5 } }
        })

        console.log(`[Webhook] Missed call recovered — Lead: ${lead.id} (tenant ${tenantId})`)
      }

      res.sendStatus(200)
    } catch (err) {
      console.error('[Webhook] callStatus error:', err)
      res.sendStatus(500)
    }
  },

  // POST /api/v1/webhooks/twilio/sms?tenantId=...
  // Fires when patient replies to SMS
  async handleInboundSMS(req: Request, res: Response) {
    const { From, To, Body, MessageSid } = req.body
    const messageUpper = Body.trim().toUpperCase()

    console.log(`[Webhook] SMS from ${From}: ${Body}`)

    const tenant = await resolveTenant(req)
    if (!tenant) {
      rejectUnresolvedTenant(req, res, 'inbound sms')
      return
    }

    try {
      const lead = await prisma.lead.findFirst({
        where: { phone: From, tenantId: tenant.id },
        orderBy: { createdAt: 'desc' },
        include: {
          conversations: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      })

      const twiml = new MessagingResponse()

      if (!lead || !lead.conversations[0]) {
        twiml.message(
          'Thanks for reaching out! Please call us directly to speak with our team.'
        )
        res.type('text/xml')
        res.send(twiml.toString())
        return
      }

      const conversation = lead.conversations[0]
      const conversationId = conversation.id
      const tenantId = tenant.id

      // Count messages for messageNumber
      const msgCount = await prisma.message.count({
        where: { conversationId }
      })

      // Log inbound message — always, regardless of the integration toggle.
      await prisma.message.create({
        data: {
          conversationId,
          tenantId,
          sender: 'LEAD',
          messageNumber: msgCount + 1,
          content: Body,
          rawPayload: { twilioSid: MessageSid },
        }
      })

      if (!tenant.twilioIntegrationEnabled) {
        // Inbound message is logged above — this only skips the AI auto-reply.
        res.type('text/xml')
        res.send(new MessagingResponse().toString())
        return
      }

      // AI response logic
      let responseText = ''
      let leadUpdate: Record<string, unknown> = {}

      if (messageUpper === 'STOP') {
        responseText = 'You have been unsubscribed. No further messages will be sent.'
        leadUpdate = { status: 'LOST' }
      } else if (
        messageUpper === 'YES' ||
        messageUpper.includes('BOOK') ||
        messageUpper.includes('APPOINT')
      ) {
        responseText =
          `Great! We'd love to book an appointment for you. ` +
          `Please reply with your preferred day and time ` +
          `(e.g. "Monday 2pm") and we'll confirm availability.`
        leadUpdate = { status: 'ENGAGED', score: { increment: 10 }, lastContactedAt: new Date() }
      } else if (
        messageUpper.includes('MONDAY') || messageUpper.includes('TUESDAY') ||
        messageUpper.includes('WEDNESDAY') || messageUpper.includes('THURSDAY') ||
        messageUpper.includes('FRIDAY') || messageUpper.includes('SATURDAY') ||
        messageUpper.includes('AM') || messageUpper.includes('PM')
      ) {
        try {
          const booking = await attemptBooking(tenant, lead, Body)
          responseText = booking.responseText
          leadUpdate = booking.leadUpdate
        } catch (err) {
          // Calendar API failure, parser exception, etc. — never leave the
          // patient without a reply just because a downstream integration broke.
          console.error('[Webhook] attemptBooking failed:', err)
          responseText =
            `Sorry, I'm having trouble checking availability right now — ` +
            `someone from our team will follow up with you directly.`
          leadUpdate = { status: 'ENGAGED', lastContactedAt: new Date() }
        }
      } else {
        responseText =
          `Thanks for your message! Our team will follow up with you shortly. ` +
          `Reply YES to book an appointment.`
        leadUpdate = { lastContactedAt: new Date() }
      }

      if (Object.keys(leadUpdate).length > 0) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: leadUpdate as Parameters<typeof prisma.lead.update>[0]['data'],
        })
      }

      // Log outbound AI response
      const replyMsgCount = await prisma.message.count({
        where: { conversationId }
      })

      await prisma.message.create({
        data: {
          conversationId,
          tenantId,
          sender: 'AI',
          messageNumber: replyMsgCount + 1,
          content: responseText,
        }
      })

      twiml.message(responseText)
      res.type('text/xml')
      res.send(twiml.toString())
    } catch (err) {
      console.error('[Webhook] inboundSMS error:', err)
      // Twilio (and the patient) still need a response — never leave them
      // with a bare 500 and no reply.
      const fallback = new MessagingResponse()
      fallback.message(`Sorry, something went wrong on our end — someone from our team will follow up with you directly.`)
      res.type('text/xml')
      res.send(fallback.toString())
    }
  },

  // POST /api/v1/webhooks/twilio/voice/gather?tenantId=...
  // Handles patient speech during AI voice call
  async handleVoiceGather(req: Request, res: Response) {
    const { SpeechResult, From } = req.body
    const twiml = new VoiceResponse()

    console.log(`[Webhook] Voice gather from ${From}: ${SpeechResult}`)

    const tenant = await resolveTenant(req)
    if (!tenant) {
      rejectUnresolvedTenant(req, res, 'voice gather')
      return
    }

    if (!tenant.twilioIntegrationEnabled) {
      twiml.say({ voice: 'Polly.Joanna' }, 'Thank you for calling. Our team will follow up with you soon.')
      twiml.hangup()
      res.type('text/xml')
      res.send(twiml.toString())
      return
    }

    const tenantId = tenant.id

    if (!SpeechResult) {
      twiml.say({ voice: 'Polly.Joanna' }, 'Sorry, I did not catch that.')
      twiml.redirect({ method: 'POST' }, `${WEBHOOK_BASE}/voice?tenantId=${tenantId}`)
      res.type('text/xml')
      res.send(twiml.toString())
      return
    }

    const speech = SpeechResult.toLowerCase()
    let responseText = ''

    if (speech.includes('appointment') || speech.includes('book')) {
      responseText =
        'Great! I can help you book an appointment. ' +
        'We will send you a text message to confirm the details. ' +
        'Thank you for calling!'
      await TwilioService.sendSMS(
        tenantId,
        From,
        `Hi! You called about booking an appointment. ` +
        `Reply with your preferred day and time and we'll get you scheduled!`
      )
    } else if (speech.includes('cancel') || speech.includes('reschedule')) {
      responseText =
        'I understand. We will send you a text message with options. Thank you!'
      await TwilioService.sendSMS(
        tenantId,
        From,
        `Hi! You called about rescheduling. ` +
        `Reply with your preferred new time or CANCEL to cancel.`
      )
    } else if (speech.includes('hours') || speech.includes('open')) {
      responseText =
        'Our office is open Monday through Friday, 9am to 5pm, ' +
        'and Saturday 10am to 2pm. We are closed Sundays. ' +
        'Is there anything else I can help you with?'
    } else {
      responseText =
        'Thank you for calling. A team member will follow up shortly. ' +
        'We will send you a text message. Have a great day!'
      await TwilioService.sendSMS(
        tenantId,
        From,
        `Hi! Thanks for calling. How can we help you? ` +
        `Reply to this message and our team will assist you.`
      )
    }

    twiml.say({ voice: 'Polly.Joanna' }, responseText)
    twiml.hangup()
    res.type('text/xml')
    res.send(twiml.toString())
  }
}
