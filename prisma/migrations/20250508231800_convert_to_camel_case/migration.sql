/*
  Warnings:

  - You are about to drop the column `created_at` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `patient_id` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `provider_id` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `appointment_duration` on the `providers` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `providers` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `providers` table. All the data in the column will be lost.
  - You are about to drop the column `weekly_schedule` on the `providers` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `providers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weeklySchedule` to the `providers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_provider_id_fkey";

-- DropIndex
DROP INDEX "appointments_provider_id_start_time_idx";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "created_at",
DROP COLUMN "end_time",
DROP COLUMN "patient_id",
DROP COLUMN "provider_id",
DROP COLUMN "start_time",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "patientId" TEXT NOT NULL,
ADD COLUMN     "providerId" TEXT NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'CONFIRMED';

-- AlterTable
ALTER TABLE "providers" DROP COLUMN "appointment_duration",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
DROP COLUMN "weekly_schedule",
ADD COLUMN     "appointmentDuration" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "weeklySchedule" JSONB NOT NULL;

-- CreateIndex
CREATE INDEX "appointments_patientId_idx" ON "appointments"("patientId");

-- CreateIndex
CREATE INDEX "appointments_providerId_idx" ON "appointments"("providerId");

-- CreateIndex
CREATE INDEX "appointments_providerId_startTime_idx" ON "appointments"("providerId", "startTime");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
