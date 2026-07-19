import { Router } from 'express'
import express from 'express'
import { WebhookController } from '../controllers/webhook.controller'

const router = Router()

// IMPORTANT: Twilio sends form-encoded data, not JSON
router.use(express.urlencoded({ extended: false }))

router.post('/twilio/voice', WebhookController.handleInboundCall)
router.post('/twilio/voice/status', WebhookController.handleCallStatus)
router.post('/twilio/voice/gather', WebhookController.handleVoiceGather)
router.post('/twilio/sms', WebhookController.handleInboundSMS)

export default router
