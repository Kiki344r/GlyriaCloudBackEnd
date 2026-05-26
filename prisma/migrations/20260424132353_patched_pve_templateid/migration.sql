/*
  Warnings:

  - Made the column `templateId` on table `PVENodes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `PVENodes` MODIFY `templateId` VARCHAR(191) NOT NULL;
