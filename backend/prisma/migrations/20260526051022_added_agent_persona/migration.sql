-- CreateEnum
CREATE TYPE "OnboardingStep" AS ENUM ('PROFILE', 'PHONE', 'PERSONA', 'KNOWLEDGE', 'COMPLETE');

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "address" TEXT,
ADD COLUMN     "isLive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingStep" "OnboardingStep" NOT NULL DEFAULT 'PROFILE',
ADD COLUMN     "twilioPhoneNumber" TEXT,
ADD COLUMN     "twilioPhoneNumberSid" TEXT,
ADD COLUMN     "vapiAssistantId" TEXT,
ADD COLUMN     "vapiPhoneNumberId" TEXT;

-- CreateTable
CREATE TABLE "AgentPersona" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "voice" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "greeting" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "escalationRules" JSONB NOT NULL,
    "fallbackMessage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentPersona_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentPersona_tenantId_key" ON "AgentPersona"("tenantId");

-- AddForeignKey
ALTER TABLE "AgentPersona" ADD CONSTRAINT "AgentPersona_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
