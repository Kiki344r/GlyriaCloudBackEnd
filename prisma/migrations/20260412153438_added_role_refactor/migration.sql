/*
  Warnings:

  - You are about to drop the column `role` on the `UserGroupPermissions` table. All the data in the column will be lost.
  - You are about to drop the `DefaultRolePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupPermission` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roleId` to the `UserGroupPermissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DefaultRolePermission` DROP FOREIGN KEY `DefaultRolePermission_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupPermission` DROP FOREIGN KEY `GroupPermission_membershipId_fkey`;

-- AlterTable
ALTER TABLE `Groups` ADD COLUMN `defaultRoleId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `UserGroupPermissions` DROP COLUMN `role`,
    ADD COLUMN `roleId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `DefaultRolePermission`;

-- DropTable
DROP TABLE `GroupPermission`;

-- CreateTable
CREATE TABLE `GroupRoles` (
    `UUID` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `groupId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GroupsRolesPermissions` (
    `UUID` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `permission` ENUM('EXERCISES', 'MANAGE_EXERCISES', 'MANAGE_MEMBERS', 'MANAGE_CODES', 'MANAGE_ROLES', 'MANAGE_SETTINGS') NOT NULL,

    UNIQUE INDEX `GroupsRolesPermissions_roleId_permission_key`(`roleId`, `permission`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Groups` ADD CONSTRAINT `Groups_defaultRoleId_fkey` FOREIGN KEY (`defaultRoleId`) REFERENCES `GroupRoles`(`UUID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGroupPermissions` ADD CONSTRAINT `UserGroupPermissions_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `GroupRoles`(`UUID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupRoles` ADD CONSTRAINT `GroupRoles_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Groups`(`UUID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupsRolesPermissions` ADD CONSTRAINT `GroupsRolesPermissions_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `GroupRoles`(`UUID`) ON DELETE RESTRICT ON UPDATE CASCADE;
