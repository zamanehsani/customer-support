/*
  Warnings:

  - You are about to drop the column `clientId` on the `Logs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_clientId_fkey";

-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "clientId";
