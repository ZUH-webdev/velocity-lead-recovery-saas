-- Per-tenant Twilio subaccount (ISV pattern): each tenant gets its own Twilio
-- subaccount + number instead of sharing the parent account credentials.
ALTER TABLE "Tenant" ADD COLUMN "twilioSubaccountSid" TEXT;
ALTER TABLE "Tenant" ADD COLUMN "twilioSubaccountAuthToken" TEXT;
ALTER TABLE "Tenant" ADD COLUMN "twilioIntegrationEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Tenant" ADD COLUMN "twilioConnectionStatus" TEXT NOT NULL DEFAULT 'not_connected';
