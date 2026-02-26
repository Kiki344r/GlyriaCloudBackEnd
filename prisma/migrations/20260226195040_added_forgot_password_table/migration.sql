-- CreateTable
CREATE TABLE `forgotPassword` (
    `UUID` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expireAt` DATETIME(3) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `forgotPassword` ADD CONSTRAINT `forgotPassword_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `Users`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
