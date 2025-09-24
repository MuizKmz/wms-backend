-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role_id` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `roles_role_name_key`(`role_name`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_code` VARCHAR(50) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `products_product_code_key`(`product_code`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `boms` (
    `bom_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `revision` VARCHAR(20) NOT NULL,
    `is_default` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `boms_product_id_revision_key`(`product_id`, `revision`),
    PRIMARY KEY (`bom_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bom_items` (
    `bom_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `bom_id` INTEGER NOT NULL,
    `material_id` INTEGER NOT NULL,
    `quantity` DECIMAL(10, 4) NOT NULL,
    `unit_of_measure` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`bom_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materials` (
    `material_id` INTEGER NOT NULL AUTO_INCREMENT,
    `material_code` VARCHAR(50) NOT NULL,
    `material_name` VARCHAR(255) NOT NULL,
    `supplier_id` INTEGER NULL,
    `specs` JSON NULL,

    UNIQUE INDEX `materials_material_code_key`(`material_code`),
    PRIMARY KEY (`material_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `material_batches` (
    `batch_id` INTEGER NOT NULL AUTO_INCREMENT,
    `material_id` INTEGER NOT NULL,
    `batch_no` VARCHAR(50) NOT NULL,
    `qty_received` DECIMAL(10, 4) NOT NULL,
    `qty_available` DECIMAL(10, 4) NOT NULL,
    `received_date` DATE NOT NULL,
    `expiry_date` DATE NULL,

    UNIQUE INDEX `material_batches_batch_no_key`(`batch_no`),
    PRIMARY KEY (`batch_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suppliers` (
    `supplier_id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplier_name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`supplier_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `work_orders` (
    `work_order_id` INTEGER NOT NULL AUTO_INCREMENT,
    `work_order_no` VARCHAR(50) NOT NULL,
    `product_id` INTEGER NOT NULL,
    `bom_id` INTEGER NOT NULL,
    `qty_planned` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `planner_id` INTEGER NOT NULL,
    `status` ENUM('Planned', 'In Progress', 'Completed', 'Cancelled') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `work_orders_work_order_no_key`(`work_order_no`),
    PRIMARY KEY (`work_order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compounding_orders` (
    `compounding_id` INTEGER NOT NULL AUTO_INCREMENT,
    `work_order_id` INTEGER NOT NULL,
    `chemist_id` INTEGER NULL,
    `qc_id` INTEGER NULL,
    `qa_id` INTEGER NULL,
    `status` ENUM('Draft', 'Prepared', 'QC Verified', 'QA Approved') NOT NULL,

    UNIQUE INDEX `compounding_orders_work_order_id_key`(`work_order_id`),
    PRIMARY KEY (`compounding_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compounding_material_lines` (
    `line_id` INTEGER NOT NULL AUTO_INCREMENT,
    `compounding_id` INTEGER NOT NULL,
    `material_id` INTEGER NOT NULL,
    `required_qty` DECIMAL(10, 4) NOT NULL,
    `actual_qty` DECIMAL(10, 4) NULL,
    `material_batch_id` INTEGER NULL,

    PRIMARY KEY (`line_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `production_batches` (
    `production_batch_id` INTEGER NOT NULL AUTO_INCREMENT,
    `work_order_id` INTEGER NOT NULL,
    `machine_id` INTEGER NOT NULL,
    `tool_id` INTEGER NULL,
    `mould_id` INTEGER NULL,
    `batch_no` VARCHAR(50) NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NULL,
    `qty_good` INTEGER NOT NULL DEFAULT 0,
    `qty_reject` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('In Progress', 'Paused', 'Completed') NOT NULL,

    UNIQUE INDEX `production_batches_batch_no_key`(`batch_no`),
    PRIMARY KEY (`production_batch_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `production_records` (
    `record_id` INTEGER NOT NULL AUTO_INCREMENT,
    `production_batch_id` INTEGER NOT NULL,
    `operator_id` INTEGER NOT NULL,
    `task_start` DATETIME(3) NOT NULL,
    `task_end` DATETIME(3) NULL,
    `qty_processed` INTEGER NULL,

    PRIMARY KEY (`record_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `production_material_consumption` (
    `consumption_id` INTEGER NOT NULL AUTO_INCREMENT,
    `production_batch_id` INTEGER NOT NULL,
    `material_batch_id` INTEGER NOT NULL,
    `qty_consumed` DECIMAL(10, 4) NOT NULL,
    `consumed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`consumption_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `machines` (
    `machine_id` INTEGER NOT NULL AUTO_INCREMENT,
    `machine_code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `department` VARCHAR(50) NULL,
    `location` VARCHAR(50) NULL,
    `status` ENUM('Available', 'In Use', 'Down', 'Maintenance') NOT NULL,

    UNIQUE INDEX `machines_machine_code_key`(`machine_code`),
    PRIMARY KEY (`machine_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tools` (
    `tool_id` INTEGER NOT NULL AUTO_INCREMENT,
    `machine_id` INTEGER NOT NULL,
    `identifier` VARCHAR(50) NOT NULL,
    `code` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `type` VARCHAR(50) NULL,
    `life_limit` INTEGER NULL,
    `total_cycles` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('Available', 'In Use', 'Down', 'Maintenance') NOT NULL,

    UNIQUE INDEX `tools_identifier_key`(`identifier`),
    PRIMARY KEY (`tool_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `moulds` (
    `mould_id` INTEGER NOT NULL AUTO_INCREMENT,
    `machine_id` INTEGER NOT NULL,
    `identifier` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `code` VARCHAR(100) NOT NULL,
    `cavity_count` INTEGER NULL,
    `life_limit` INTEGER NULL,
    `total_cycles` INTEGER NOT NULL DEFAULT 0,
    `type` VARCHAR(50) NULL,
    `status` ENUM('Available', 'In Use', 'Down', 'Maintenance') NOT NULL,

    UNIQUE INDEX `moulds_identifier_key`(`identifier`),
    PRIMARY KEY (`mould_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `downtime_events` (
    `downtime_id` INTEGER NOT NULL AUTO_INCREMENT,
    `machine_id` INTEGER NOT NULL,
    `production_batch_id` INTEGER NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NULL,
    `category` VARCHAR(50) NULL,
    `cause` VARCHAR(255) NULL,
    `reported_by` INTEGER NOT NULL,

    PRIMARY KEY (`downtime_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `qc_records` (
    `qc_id` INTEGER NOT NULL AUTO_INCREMENT,
    `production_batch_id` INTEGER NOT NULL,
    `inspector_id` INTEGER NOT NULL,
    `qc_type` ENUM('IPQC', 'OQC') NOT NULL,
    `checked_at` DATETIME(3) NOT NULL,
    `result` ENUM('Pass', 'Fail') NOT NULL,
    `remarks` TEXT NULL,

    PRIMARY KEY (`qc_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `qc_test_parameters` (
    `test_id` INTEGER NOT NULL AUTO_INCREMENT,
    `qc_id` INTEGER NOT NULL,
    `parameter_name` VARCHAR(100) NOT NULL,
    `expected_value` VARCHAR(100) NULL,
    `actual_value` VARCHAR(100) NOT NULL,
    `status` ENUM('Pass', 'Fail') NOT NULL,

    PRIMARY KEY (`test_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reject_scraps` (
    `reject_id` INTEGER NOT NULL AUTO_INCREMENT,
    `production_batch_id` INTEGER NOT NULL,
    `qc_id` INTEGER NULL,
    `reason` VARCHAR(255) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `disposition` ENUM('Rework', 'Scrap') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`reject_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `packing_records` (
    `packing_id` INTEGER NOT NULL AUTO_INCREMENT,
    `production_batch_id` INTEGER NOT NULL,
    `packed_by_id` INTEGER NOT NULL,
    `package_type` VARCHAR(50) NULL,
    `qty_packed` INTEGER NOT NULL,
    `packed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`packing_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boms` ADD CONSTRAINT `boms_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bom_items` ADD CONSTRAINT `bom_items_bom_id_fkey` FOREIGN KEY (`bom_id`) REFERENCES `boms`(`bom_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bom_items` ADD CONSTRAINT `bom_items_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `materials`(`material_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materials` ADD CONSTRAINT `materials_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`supplier_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `material_batches` ADD CONSTRAINT `material_batches_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `materials`(`material_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `work_orders` ADD CONSTRAINT `work_orders_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `work_orders` ADD CONSTRAINT `work_orders_bom_id_fkey` FOREIGN KEY (`bom_id`) REFERENCES `boms`(`bom_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `work_orders` ADD CONSTRAINT `work_orders_planner_id_fkey` FOREIGN KEY (`planner_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `compounding_orders` ADD CONSTRAINT `compounding_orders_work_order_id_fkey` FOREIGN KEY (`work_order_id`) REFERENCES `work_orders`(`work_order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `compounding_orders` ADD CONSTRAINT `compounding_orders_chemist_id_fkey` FOREIGN KEY (`chemist_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `compounding_orders` ADD CONSTRAINT `compounding_orders_qc_id_fkey` FOREIGN KEY (`qc_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `compounding_orders` ADD CONSTRAINT `compounding_orders_qa_id_fkey` FOREIGN KEY (`qa_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `compounding_material_lines` ADD CONSTRAINT `compounding_material_lines_compounding_id_fkey` FOREIGN KEY (`compounding_id`) REFERENCES `compounding_orders`(`compounding_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `compounding_material_lines` ADD CONSTRAINT `compounding_material_lines_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `materials`(`material_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `compounding_material_lines` ADD CONSTRAINT `compounding_material_lines_material_batch_id_fkey` FOREIGN KEY (`material_batch_id`) REFERENCES `material_batches`(`batch_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `production_batches` ADD CONSTRAINT `production_batches_work_order_id_fkey` FOREIGN KEY (`work_order_id`) REFERENCES `work_orders`(`work_order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `production_batches` ADD CONSTRAINT `production_batches_machine_id_fkey` FOREIGN KEY (`machine_id`) REFERENCES `machines`(`machine_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `production_batches` ADD CONSTRAINT `production_batches_tool_id_fkey` FOREIGN KEY (`tool_id`) REFERENCES `tools`(`tool_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `production_batches` ADD CONSTRAINT `production_batches_mould_id_fkey` FOREIGN KEY (`mould_id`) REFERENCES `moulds`(`mould_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `production_records` ADD CONSTRAINT `production_records_production_batch_id_fkey` FOREIGN KEY (`production_batch_id`) REFERENCES `production_batches`(`production_batch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `production_records` ADD CONSTRAINT `production_records_operator_id_fkey` FOREIGN KEY (`operator_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `production_material_consumption` ADD CONSTRAINT `production_material_consumption_production_batch_id_fkey` FOREIGN KEY (`production_batch_id`) REFERENCES `production_batches`(`production_batch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `production_material_consumption` ADD CONSTRAINT `production_material_consumption_material_batch_id_fkey` FOREIGN KEY (`material_batch_id`) REFERENCES `material_batches`(`batch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tools` ADD CONSTRAINT `tools_machine_id_fkey` FOREIGN KEY (`machine_id`) REFERENCES `machines`(`machine_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `moulds` ADD CONSTRAINT `moulds_machine_id_fkey` FOREIGN KEY (`machine_id`) REFERENCES `machines`(`machine_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `downtime_events` ADD CONSTRAINT `downtime_events_machine_id_fkey` FOREIGN KEY (`machine_id`) REFERENCES `machines`(`machine_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `downtime_events` ADD CONSTRAINT `downtime_events_production_batch_id_fkey` FOREIGN KEY (`production_batch_id`) REFERENCES `production_batches`(`production_batch_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `downtime_events` ADD CONSTRAINT `downtime_events_reported_by_fkey` FOREIGN KEY (`reported_by`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `qc_records` ADD CONSTRAINT `qc_records_production_batch_id_fkey` FOREIGN KEY (`production_batch_id`) REFERENCES `production_batches`(`production_batch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `qc_records` ADD CONSTRAINT `qc_records_inspector_id_fkey` FOREIGN KEY (`inspector_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `qc_test_parameters` ADD CONSTRAINT `qc_test_parameters_qc_id_fkey` FOREIGN KEY (`qc_id`) REFERENCES `qc_records`(`qc_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reject_scraps` ADD CONSTRAINT `reject_scraps_production_batch_id_fkey` FOREIGN KEY (`production_batch_id`) REFERENCES `production_batches`(`production_batch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reject_scraps` ADD CONSTRAINT `reject_scraps_qc_id_fkey` FOREIGN KEY (`qc_id`) REFERENCES `qc_records`(`qc_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `packing_records` ADD CONSTRAINT `packing_records_production_batch_id_fkey` FOREIGN KEY (`production_batch_id`) REFERENCES `production_batches`(`production_batch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `packing_records` ADD CONSTRAINT `packing_records_packed_by_id_fkey` FOREIGN KEY (`packed_by_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
