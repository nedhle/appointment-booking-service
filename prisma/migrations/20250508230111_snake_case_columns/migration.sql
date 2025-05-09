/*
  Warnings:

  - You are about to drop the column `endTime` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `appointments` table. All the data in the column will be lost.
  - Added the required column `end_time` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "appointments_provider_id_startTime_idx";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "end_time" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "start_time" TIMESTAMPTZ NOT NULL;

-- CreateIndex
CREATE INDEX "appointments_provider_id_start_time_idx" ON "appointments"("provider_id", "start_time");
