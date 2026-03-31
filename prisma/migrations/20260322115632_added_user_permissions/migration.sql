/*
  Warnings:

  - You are about to drop the `_UserGroups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_UserGroups` DROP FOREIGN KEY `_UserGroups_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UserGroups` DROP FOREIGN KEY `_UserGroups_B_fkey`;

-- DropTable
DROP TABLE `_UserGroups`;

-- CreateTable
CREATE TABLE `UserGroupPermissions` (
    `UUID` VARCHAR(191) NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `groupId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserGroupPermissions_userId_groupId_key`(`userId`, `groupId`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GroupPermission` (
    `UUID` VARCHAR(191) NOT NULL,
    `permission` ENUM('READ', 'WRITE', 'MANAGE_MEMBERS', 'MANAGE_PROXIES', 'MANAGE_VMS', 'ADMIN') NOT NULL,
    `membershipId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GroupPermission_membershipId_permission_key`(`membershipId`, `permission`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserGroupPermissions` ADD CONSTRAINT `UserGroupPermissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`UUID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGroupPermissions` ADD CONSTRAINT `UserGroupPermissions_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Groups`(`UUID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupPermission` ADD CONSTRAINT `GroupPermission_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `UserGroupPermissions`(`UUID`) ON DELETE RESTRICT ON UPDATE CASCADE;
