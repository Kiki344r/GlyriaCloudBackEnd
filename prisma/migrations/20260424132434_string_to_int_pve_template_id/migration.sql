/*
  Warnings:

  - You are about to alter the column `templateId` on the `PVENodes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `PVENodes` MODIFY `templateId` INTEGER NOT NULL;
