-- CreateTable
CREATE TABLE `Groups` (
    `UUID` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserGroups` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_UserGroups_AB_unique`(`A`, `B`),
    INDEX `_UserGroups_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Groups` ADD CONSTRAINT `Groups_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Users`(`UUID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserGroups` ADD CONSTRAINT `_UserGroups_A_fkey` FOREIGN KEY (`A`) REFERENCES `Groups`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserGroups` ADD CONSTRAINT `_UserGroups_B_fkey` FOREIGN KEY (`B`) REFERENCES `Users`(`UUID`) ON DELETE CASCADE ON UPDATE CASCADE;
