import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export const TwilioService = {

  async sendSMS(to: string, body: string) {
    try {
      const message = await client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER!,
        to,
        body,
      })
      console.log(`[Twilio] SMS sent to ${to} — SID: ${message.sid}`)
      return message
    } catch (err) {
      console.error('[Twilio] SMS failed:', err)
      throw err
    }
  },

  async makeCall(to: string, twimlUrl: string) {
    try {
      const call = await client.calls.create({
        from: process.env.TWILIO_PHONE_NUMBER!,
        to,
        url: twimlUrl,
      })
      console.log(`[Twilio] Call initiated to ${to} — SID: ${call.sid}`)
      return call
    } catch (err) {
      console.error('[Twilio] Call failed:', err)
      throw err
    }
  },

  validateWebhook(
    signature: string,
    url: string,
    params: Record<string, string>
  ): boolean {
    return twilio.validateRequest(
      process.env.TWILIO_AUTH_TOKEN!,
      signature,
      url,
      params
    )
  }
}
