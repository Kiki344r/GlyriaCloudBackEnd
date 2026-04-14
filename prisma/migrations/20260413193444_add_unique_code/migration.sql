/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `GroupCode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `GroupCode_code_key` ON `GroupCode`(`code`);
