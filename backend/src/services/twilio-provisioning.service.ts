import twilio from "twilio";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { encryptSecret, decryptSecret } from "../utils/crypto";

const CREDENTIAL_KEY_ENV_NAME = "TWILIO_CREDENTIAL_ENCRYPTION_KEY";

function encryptTwilioSecret(plaintext: string): string {
  return encryptSecret(plaintext, env.TWILIO_CREDENTIAL_ENCRYPTION_KEY, CREDENTIAL_KEY_ENV_NAME);
}

function decryptTwilioSecret(payload: string): string {
  return decryptSecret(payload, env.TWILIO_CREDENTIAL_ENCRYPTION_KEY, CREDENTIAL_KEY_ENV_NAME);
}

// The parent account's client — the ONLY place the global .env Twilio
// credentials should be used. Every tenant-specific action (sending SMS,
// making calls, managing that tenant's number) must go through
// getTwilioClientForTenant() below, scoped to that tenant's subaccount.
function getParentClient() {
  return twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
}

// Returns a Twilio client authenticated as the tenant's own subaccount, or
// null if the tenant hasn't been provisioned yet.
export async function getTwilioClientForTenant(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant?.twilioSubaccountSid || !tenant.twilioSubaccountAuthToken) return null;

  const authToken = decryptTwilioSecret(tenant.twilioSubaccountAuthToken);
  return twilio(tenant.twilioSubaccountSid, authToken);
}

export const TwilioProvisioningService = {
  async createSubaccountForTenant(tenantId: string) {
    const parentClient = getParentClient();

    const subaccount = await parentClient.api.v2010.accounts.create({
      friendlyName: `velocity-tenant-${tenantId}`,
    });

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        twilioSubaccountSid: subaccount.sid,
        twilioSubaccountAuthToken: encryptTwilioSecret(subaccount.authToken),
        twilioConnectionStatus: "provisioning",
      },
    });

    return subaccount;
  },

  async provisionNumberForTenant(tenantId: string) {
    const client = await getTwilioClientForTenant(tenantId);
    if (!client) throw new Error("Tenant has no Twilio subaccount to provision a number under");

    const candidates = await client.availablePhoneNumbers("US").local.list({ limit: 1 });
    const candidate = candidates[0];
    if (!candidate) throw new Error("No available US phone numbers to purchase");

    const purchased = await client.incomingPhoneNumbers.create({
      phoneNumber: candidate.phoneNumber,
    });

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        twilioPhoneNumber: purchased.phoneNumber,
        twilioPhoneNumberSid: purchased.sid,
      },
    });

    return purchased;
  },

  async configureWebhooksForTenant(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant?.twilioPhoneNumberSid) {
      throw new Error("Tenant has no provisioned number to configure webhooks for");
    }

    const client = await getTwilioClientForTenant(tenantId);
    if (!client) throw new Error("Tenant has no Twilio subaccount to configure webhooks under");

    const base = `${env.API_BASE_URL}/webhooks/twilio`;

    await client.incomingPhoneNumbers(tenant.twilioPhoneNumberSid).update({
      voiceUrl: `${base}/voice?tenantId=${tenantId}`,
      voiceMethod: "POST",
      statusCallback: `${base}/voice/status?tenantId=${tenantId}`,
      statusCallbackMethod: "POST",
      smsUrl: `${base}/sms?tenantId=${tenantId}`,
      smsMethod: "POST",
    });

    await prisma.tenant.update({
      where: { id: tenantId },
      data: { twilioConnectionStatus: "active" },
    });
  },

  // Runs the full provisioning sequence. On failure at any step, resets the
  // tenant back to "not_connected" rather than leaving it stuck mid-provision
  // with a subaccount that was never fully wired up.
  async provisionTenant(tenantId: string) {
    try {
      await this.createSubaccountForTenant(tenantId);
      await this.provisionNumberForTenant(tenantId);
      await this.configureWebhooksForTenant(tenantId);
    } catch (err) {
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { twilioConnectionStatus: "not_connected" },
      }).catch(() => {});
      throw err;
    }
  },
};
