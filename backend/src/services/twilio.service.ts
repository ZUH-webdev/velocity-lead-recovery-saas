import twilio from 'twilio'
import { prisma } from '../config/prisma'
import { env } from '../config/env'
import { decryptSecret } from '../utils/crypto'
import { getTwilioClientForTenant } from './twilio-provisioning.service'

// Every tenant-specific Twilio action goes through the tenant's own
// subaccount client (see twilio-provisioning.service.ts) — never the global
// parent account credentials. The parent account is only ever used to
// provision subaccounts.
export const TwilioService = {

  async sendSMS(tenantId: string, to: string, body: string) {
    const [client, tenant] = await Promise.all([
      getTwilioClientForTenant(tenantId),
      prisma.tenant.findUnique({ where: { id: tenantId } }),
    ])
    if (!client || !tenant?.twilioPhoneNumber) {
      throw new Error(`Tenant ${tenantId} has no active Twilio connection`)
    }

    try {
      const message = await client.messages.create({
        from: tenant.twilioPhoneNumber,
        to,
        body,
      })
      console.log(`[Twilio] SMS sent to ${to} — SID: ${message.sid} (tenant ${tenantId})`)
      return message
    } catch (err) {
      console.error('[Twilio] SMS failed:', err)
      throw err
    }
  },

  async makeCall(tenantId: string, to: string, twimlUrl: string) {
    const [client, tenant] = await Promise.all([
      getTwilioClientForTenant(tenantId),
      prisma.tenant.findUnique({ where: { id: tenantId } }),
    ])
    if (!client || !tenant?.twilioPhoneNumber) {
      throw new Error(`Tenant ${tenantId} has no active Twilio connection`)
    }

    try {
      const call = await client.calls.create({
        from: tenant.twilioPhoneNumber,
        to,
        url: twimlUrl,
      })
      console.log(`[Twilio] Call initiated to ${to} — SID: ${call.sid} (tenant ${tenantId})`)
      return call
    } catch (err) {
      console.error('[Twilio] Call failed:', err)
      throw err
    }
  },

  // Validates an inbound webhook's signature against the SIGNING tenant's own
  // subaccount auth token (each subaccount has its own token, distinct from
  // the parent account's). Not currently wired into the webhook routes — see
  // the audit note in webhook.controller.ts.
  async validateWebhookForTenant(
    tenantId: string,
    signature: string,
    url: string,
    params: Record<string, string>,
  ): Promise<boolean> {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
    if (!tenant?.twilioSubaccountAuthToken) return false

    const authToken = decryptSecret(
      tenant.twilioSubaccountAuthToken,
      env.TWILIO_CREDENTIAL_ENCRYPTION_KEY,
      'TWILIO_CREDENTIAL_ENCRYPTION_KEY',
    )
    return twilio.validateRequest(authToken, signature, url, params)
  },
}
