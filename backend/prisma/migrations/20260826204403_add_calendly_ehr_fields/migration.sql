-- Calendly (alternate booking backend to Google Calendar)
ALTER TABLE "Tenant" ADD COLUMN "calendlyApiKey" TEXT;
ALTER TABLE "Tenant" ADD COLUMN "calendlyConnected" BOOLEAN NOT NULL DEFAULT false;

-- EHR (generic FHIR connector)
ALTER TABLE "Tenant" ADD COLUMN "ehrFhirBaseUrl" TEXT;
ALTER TABLE "Tenant" ADD COLUMN "ehrClientId" TEXT;
ALTER TABLE "Tenant" ADD COLUMN "ehrClientSecret" TEXT;
ALTER TABLE "Tenant" ADD COLUMN "ehrConnected" BOOLEAN NOT NULL DEFAULT false;

-- FHIR Appointment resource id, when a booking is synced to a connected EHR
ALTER TABLE "Appointment" ADD COLUMN "ehrAppointmentId" TEXT;
