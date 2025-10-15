/*
  Warnings:

  - Added the required column `corp_code_id` to the `epcs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `epcs` ADD COLUMN `corp_code_id` INTEGER NOT NULL,
    MODIFY `status` ENUM('RECEIVED', 'DELIVERED', 'INBOUND', 'GENERATED') NOT NULL DEFAULT 'GENERATED';

-- CreateTable
CREATE TABLE `corp_codes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(4) NOT NULL,
    `label` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `corp_codes_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `epcs` ADD CONSTRAINT `epcs_corp_code_id_fkey` FOREIGN KEY (`corp_code_id`) REFERENCES `corp_codes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
