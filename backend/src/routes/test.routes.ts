import { Router } from 'express'
import { TwilioService } from '../services/twilio.service'

const router = Router()

// POST /api/v1/test/sms — manual SMS trigger for testing (dev only)
router.post('/sms', async (req, res) => {
  try {
    const { to, body } = req.body
    if (!to || !body) {
      return res.status(400).json({ success: false, error: 'Missing "to" or "body" in request' })
    }
    const result = await TwilioService.sendSMS(to, body)
    res.json({ success: true, sid: result.sid })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({ success: false, error: message })
  }
})

// POST /api/v1/test/call — manual outbound call trigger for testing (dev only)
router.post('/call', async (req, res) => {
  try {
    const { to } = req.body
    if (!to) {
      return res.status(400).json({ success: false, error: 'Missing "to" in request' })
    }
    const twimlUrl = `${process.env.APP_URL}/api/v1/webhooks/twilio/voice`
    const result = await TwilioService.makeCall(to, twimlUrl)
    res.json({ success: true, sid: result.sid })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({ success: false, error: message })
  }
})

export default router
