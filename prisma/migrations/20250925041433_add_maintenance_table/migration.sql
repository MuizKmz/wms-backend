-- CreateTable
CREATE TABLE `maintenance_records` (
    `maintenance_id` INTEGER NOT NULL AUTO_INCREMENT,
    `machine_id` INTEGER NOT NULL,
    `scheduled_date` DATETIME(3) NOT NULL,
    `maintenance_type` VARCHAR(191) NOT NULL,
    `assigned_to` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `remarks` TEXT NULL,
    `performed_by` INTEGER NULL,
    `performed_at` DATETIME(3) NULL,

    PRIMARY KEY (`maintenance_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `maintenance_records` ADD CONSTRAINT `maintenance_records_machine_id_fkey` FOREIGN KEY (`machine_id`) REFERENCES `machines`(`machine_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance_records` ADD CONSTRAINT `maintenance_records_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance_records` ADD CONSTRAINT `maintenance_records_performed_by_fkey` FOREIGN KEY (`performed_by`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
