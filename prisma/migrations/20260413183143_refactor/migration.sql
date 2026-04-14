/*
  Warnings:

  - You are about to drop the `forgotPassword` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `validateEmail` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[groupId,code]` on the table `GroupCode` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `GroupCode` DROP FOREIGN KEY `GroupCode_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupRoles` DROP FOREIGN KEY `GroupRoles_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupsRolesPermissions` DROP FOREIGN KEY `GroupsRolesPermissions_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `UserGroupPermissions` DROP FOREIGN KEY `UserGroupPermissions_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `UserGroupPermissions` DROP FOREIGN KEY `UserGroupPermissions_userId_fkey`;

-- DropForeignKey
ALTER TABLE `forgotPassword` DROP FOREIGN KEY `forgotPassword_userEmail_fkey`;

-- DropForeignKey
ALTER TABLE `validateEmail` DROP FOREIGN KEY `validateEmail_userEmail_fkey`;

-- DropIndex
DROP INDEX `GroupCode_code_key` ON `GroupCode`;

-- DropIndex
DROP INDEX `GroupCode_groupId_key` ON `GroupCode`;

-- DropIndex
DROP INDEX `GroupRoles_groupId_fkey` ON `GroupRoles`;

-- DropIndex
DROP INDEX `UserGroupPermissions_groupId_fkey` ON `UserGroupPermissions`;

-- DropTable
DROP TABLE `forgotPassword`;

-- DropTable
DROP TABLE `validateEmail`;

-- CreateTable
CREATE TABLE `EmailValidation` (
    `UUID` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expireAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ForgotPassword` (
    `UUID` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expireAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `GroupCode_groupId_code_key` ON `GroupCode`(`groupId`, `code`);

-- AddForeignKey
ALTER TABLE `EmailValidation` ADD CONSTRAINT `EmailValidation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ForgotPassword` ADD CONSTRAINT `ForgotPassword_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGroupPermissions` ADD CONSTRAINT `UserGroupPermissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGroupPermissions` ADD CONSTRAINT `UserGroupPermissions_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Groups`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupRoles` ADD CONSTRAINT `GroupRoles_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Groups`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupsRolesPermissions` ADD CONSTRAINT `GroupsRolesPermissions_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `GroupRoles`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupCode` ADD CONSTRAINT `GroupCode_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Groups`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;
