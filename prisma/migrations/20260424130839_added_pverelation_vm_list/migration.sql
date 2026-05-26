/*
  Warnings:

  - You are about to drop the column `node` on the `GroupVm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `GroupVm` DROP COLUMN `node`,
    ADD COLUMN `nodeId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `GroupVm` ADD CONSTRAINT `GroupVm_nodeId_fkey` FOREIGN KEY (`nodeId`) REFERENCES `PVENodes`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;
