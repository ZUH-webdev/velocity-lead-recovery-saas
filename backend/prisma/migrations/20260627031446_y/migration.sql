/*
  Warnings:

  - You are about to drop the column `tenantId` on the `Permission` table. All the data in the column will be lost.
  - The primary key for the `RolePermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the `MemberPermissionOverride` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoleDefinition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TenantApiKey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebhookEndpoint` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[key]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roleId,permissionId]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `RolePermission` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `userId` on table `TenantMember` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `fullName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MemberPermissionOverride" DROP CONSTRAINT "MemberPermissionOverride_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MemberPermissionOverride" DROP CONSTRAINT "MemberPermissionOverride_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "RoleDefinition" DROP CONSTRAINT "RoleDefinition_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "TenantApiKey" DROP CONSTRAINT "TenantApiKey_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "TenantMember" DROP CONSTRAINT "TenantMember_roleId_fkey";

-- DropForeignKey
ALTER TABLE "WebhookEndpoint" DROP CONSTRAINT "WebhookEndpoint_tenantId_fkey";

-- DropIndex
DROP INDEX "Permission_tenantId_idx";

-- DropIndex
DROP INDEX "Permission_tenantId_key_key";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "tenantId",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_pkey",
DROP COLUMN "createdAt",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "TenantMember" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "roleId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "fullName" SET NOT NULL;

-- DropTable
DROP TABLE "MemberPermissionOverride";

-- DropTable
DROP TABLE "RoleDefinition";

-- DropTable
DROP TABLE "TenantApiKey";

-- DropTable
DROP TABLE "WebhookEndpoint";

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isSystemRole" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberPermission" (
    "id" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "MemberPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "invitedEmail" TEXT NOT NULL,
    "roleId" UUID,
    "jobTitle" TEXT,
    "department" TEXT,
    "token" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Role_tenantId_idx" ON "Role"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_tenantId_key_key" ON "Role"("tenantId", "key");

-- CreateIndex
CREATE INDEX "MemberPermission_memberId_idx" ON "MemberPermission"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberPermission_memberId_permissionId_key" ON "MemberPermission"("memberId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_token_key" ON "Invite"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "Permission"("key");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantMember" ADD CONSTRAINT "TenantMember_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberPermission" ADD CONSTRAINT "MemberPermission_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TenantMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberPermission" ADD CONSTRAINT "MemberPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
