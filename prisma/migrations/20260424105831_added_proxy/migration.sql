-- CreateTable
CREATE TABLE `GroupModule` (
    `UUID` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `requiresVm` BOOLEAN NOT NULL DEFAULT false,
    `groupId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GroupModuleItem` (
    `UUID` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` ENUM('TP', 'COURS', 'EXERCICE') NOT NULL,
    `content` LONGTEXT NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `moduleId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GroupVm` (
    `UUID` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('LYCEE', 'LOCAL') NOT NULL,
    `node` VARCHAR(191) NULL,
    `vmid` INTEGER NULL,
    `os` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NULL,
    `sshPort` INTEGER NULL,
    `rdpPort` INTEGER NULL,
    `groupId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VmProxy` (
    `UUID` VARCHAR(191) NOT NULL,
    `internalPort` INTEGER NOT NULL,
    `exposedIp` VARCHAR(191) NOT NULL,
    `exposedPort` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,
    `vmId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `VmProxy_vmId_internalPort_key`(`vmId`, `internalPort`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ModuleVmLink` (
    `UUID` VARCHAR(191) NOT NULL,
    `moduleId` VARCHAR(191) NOT NULL,
    `vmId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ModuleVmLink_moduleId_userId_key`(`moduleId`, `userId`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PortRange` (
    `UUID` VARCHAR(191) NOT NULL,
    `fromPort` INTEGER NOT NULL,
    `toPort` INTEGER NOT NULL,
    `label` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PortRange_ip_fromPort_key`(`ip`, `fromPort`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsedPort` (
    `UUID` VARCHAR(191) NOT NULL,
    `port` INTEGER NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `vmProxyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UsedPort_vmProxyId_key`(`vmProxyId`),
    UNIQUE INDEX `UsedPort_ip_port_key`(`ip`, `port`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GroupModule` ADD CONSTRAINT `GroupModule_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Groups`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupModuleItem` ADD CONSTRAINT `GroupModuleItem_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `GroupModule`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupVm` ADD CONSTRAINT `GroupVm_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Groups`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupVm` ADD CONSTRAINT `GroupVm_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VmProxy` ADD CONSTRAINT `VmProxy_vmId_fkey` FOREIGN KEY (`vmId`) REFERENCES `GroupVm`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModuleVmLink` ADD CONSTRAINT `ModuleVmLink_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `GroupModule`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModuleVmLink` ADD CONSTRAINT `ModuleVmLink_vmId_fkey` FOREIGN KEY (`vmId`) REFERENCES `GroupVm`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModuleVmLink` ADD CONSTRAINT `ModuleVmLink_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsedPort` ADD CONSTRAINT `UsedPort_vmProxyId_fkey` FOREIGN KEY (`vmProxyId`) REFERENCES `VmProxy`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;
