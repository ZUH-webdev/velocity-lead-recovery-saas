-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "passwordResetTokenExpiresAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CallLog" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "callerPhone" TEXT NOT NULL,
    "callSid" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "duration" INTEGER,
    "recordingUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CallLog_callSid_key" ON "CallLog"("callSid");

-- CreateIndex
CREATE INDEX "CallLog_tenantId_createdAt_idx" ON "CallLog"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "CallLog_callSid_idx" ON "CallLog"("callSid");

-- AddForeignKey
ALTER TABLE "CallLog" ADD CONSTRAINT "CallLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
