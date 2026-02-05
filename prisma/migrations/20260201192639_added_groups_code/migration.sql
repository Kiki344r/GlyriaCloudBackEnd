-- CreateTable
CREATE TABLE `GroupCode` (
    `UUID` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `groupId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GroupCode_code_key`(`code`),
    UNIQUE INDEX `GroupCode_groupId_key`(`groupId`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GroupCode` ADD CONSTRAINT `GroupCode_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Groups`(`UUID`) ON DELETE RESTRICT ON UPDATE CASCADE;
