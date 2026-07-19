import { Request, Response } from 'express'
import twilio from 'twilio'
import { prisma } from '../config/prisma'
import { TwilioService } from '../services/twilio.service'

const VoiceResponse = twilio.twiml.VoiceResponse
const MessagingResponse = twilio.twiml.MessagingResponse
const APP_URL = process.env.APP_URL!

// Helper — get first tenant (later: map by Twilio number)
async function getTenantId(): Promise<string> {
  const tenant = await prisma.tenant.findFirst()
  if (!tenant) throw new Error('No tenant found')
  return tenant.id
}

export const WebhookController = {

  // POST /api/v1/webhooks/twilio/voice
  // Twilio calls this when someone calls +17373398161
  async handleInboundCall(req: Request, res: Response) {
    const { From, To, CallSid } = req.body

    try {
      const tenantId = await getTenantId()

      await prisma.callLog.create({
        data: {
          tenantId,
          callerPhone: From,
          callSid: CallSid,
          direction: 'inbound',
          status: 'in-progress',
        }
      })

      const twiml = new VoiceResponse()
      const gather = twiml.gather({
        input: ['speech'],
        action: `${APP_URL}/api/v1/webhooks/twilio/voice/gather`,
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

  // POST /api/v1/webhooks/twilio/voice/status
  // Fires when call ends — detects missed calls
  async handleCallStatus(req: Request, res: Response) {
    const { CallSid, CallStatus, From, To, CallDuration } = req.body

    console.log(`[Webhook] Call status: ${CallStatus} from ${From}`)

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
        const tenantId = await getTenantId()

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

        const message = await TwilioService.sendSMS(From, smsBody)

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

        console.log(`[Webhook] Missed call recovered — Lead: ${lead.id}`)
      }

      res.sendStatus(200)
    } catch (err) {
      console.error('[Webhook] callStatus error:', err)
      res.sendStatus(500)
    }
  },

  // POST /api/v1/webhooks/twilio/sms
  // Fires when patient replies to SMS
  async handleInboundSMS(req: Request, res: Response) {
    const { From, To, Body, MessageSid } = req.body
    const messageUpper = Body.trim().toUpperCase()

    console.log(`[Webhook] SMS from ${From}: ${Body}`)

    try {
      const lead = await prisma.lead.findFirst({
        where: { phone: From },
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
        return res.send(twiml.toString())
      }

      const conversation = lead.conversations[0]
      const conversationId = conversation.id
      const tenantId = lead.tenantId

      // Count messages for messageNumber
      const msgCount = await prisma.message.count({
        where: { conversationId }
      })

      // Log inbound message
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
        responseText =
          `Perfect! We've noted your preferred time: "${Body}". ` +
          `Our team will confirm your appointment shortly. ` +
          `You'll receive a confirmation SMS once booked.`
        leadUpdate = { status: 'BOOKED', score: { increment: 10 }, lastContactedAt: new Date() }
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
      res.sendStatus(500)
    }
  },

  // POST /api/v1/webhooks/twilio/voice/gather
  // Handles patient speech during AI voice call
  async handleVoiceGather(req: Request, res: Response) {
    const { SpeechResult, From } = req.body
    const twiml = new VoiceResponse()

    console.log(`[Webhook] Voice gather from ${From}: ${SpeechResult}`)

    if (!SpeechResult) {
      twiml.say({ voice: 'Polly.Joanna' }, 'Sorry, I did not catch that.')
      twiml.redirect({ method: 'POST' }, `${APP_URL}/api/v1/webhooks/twilio/voice`)
      res.type('text/xml')
      return res.send(twiml.toString())
    }

    const speech = SpeechResult.toLowerCase()
    let responseText = ''

    if (speech.includes('appointment') || speech.includes('book')) {
      responseText =
        'Great! I can help you book an appointment. ' +
        'We will send you a text message to confirm the details. ' +
        'Thank you for calling!'
      await TwilioService.sendSMS(
        From,
        `Hi! You called about booking an appointment. ` +
        `Reply with your preferred day and time and we'll get you scheduled!`
      )
    } else if (speech.includes('cancel') || speech.includes('reschedule')) {
      responseText =
        'I understand. We will send you a text message with options. Thank you!'
      await TwilioService.sendSMS(
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
