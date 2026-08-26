import { Router } from 'express'
import { TwilioService } from '../services/twilio.service'

const router = Router()

// POST /api/v1/test/sms — manual SMS trigger for testing (dev only)
// tenantId is required explicitly — no "just pick a tenant" fallback, even in a
// test route, now that each tenant has its own subaccount and number.
router.post('/sms', async (req, res) => {
  try {
    const { tenantId, to, body } = req.body
    if (!tenantId || !to || !body) {
      return res.status(400).json({ success: false, error: 'Missing "tenantId", "to", or "body" in request' })
    }
    const result = await TwilioService.sendSMS(tenantId, to, body)
    res.json({ success: true, sid: result.sid })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({ success: false, error: message })
  }
})

// POST /api/v1/test/call — manual outbound call trigger for testing (dev only)
router.post('/call', async (req, res) => {
  try {
    const { tenantId, to } = req.body
    if (!tenantId || !to) {
      return res.status(400).json({ success: false, error: 'Missing "tenantId" or "to" in request' })
    }
    const twimlUrl = `${process.env.APP_URL}/api/v1/webhooks/twilio/voice?tenantId=${tenantId}`
    const result = await TwilioService.makeCall(tenantId, to, twimlUrl)
    res.json({ success: true, sid: result.sid })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({ success: false, error: message })
  }
})

export default router
