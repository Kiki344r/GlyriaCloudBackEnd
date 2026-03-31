-- AlterTable
ALTER TABLE `UserGroupPermissions` ADD COLUMN `role` ENUM('ETUDIANT', 'PROFESSEUR', 'ADMINISTRATEUR') NOT NULL DEFAULT 'ETUDIANT';

-- CreateTable
CREATE TABLE `DefaultRolePermission` (
    `UUID` VARCHAR(191) NOT NULL,
    `role` ENUM('ETUDIANT', 'PROFESSEUR', 'ADMINISTRATEUR') NOT NULL,
    `permission` ENUM('READ', 'WRITE', 'MANAGE_MEMBERS', 'MANAGE_PROXIES', 'MANAGE_VMS', 'ADMIN') NOT NULL,
    `groupId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DefaultRolePermission_role_permission_key`(`role`, `permission`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DefaultRolePermission` ADD CONSTRAINT `DefaultRolePermission_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Groups`(`UUID`) ON DELETE RESTRICT ON UPDATE CASCADE;
