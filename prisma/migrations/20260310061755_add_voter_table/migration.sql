-- CreateTable
CREATE TABLE `voters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `partId` INTEGER NOT NULL,
    `wardId` INTEGER NOT NULL,
    `areaId` INTEGER NOT NULL,
    `voterName` VARCHAR(191) NOT NULL,
    `rollNo` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `aadharNumber` VARCHAR(191) NOT NULL,
    `voterId` VARCHAR(191) NOT NULL,
    `rationCardNumber` VARCHAR(191) NOT NULL,
    `rentalHouse` VARCHAR(191) NOT NULL,
    `houseOwnerName` VARCHAR(191) NULL,
    `houseOwnerContact` VARCHAR(191) NULL,
    `occupation` VARCHAR(191) NOT NULL,
    `govtScheme` VARCHAR(191) NOT NULL,
    `party` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `voters_aadharNumber_key`(`aadharNumber`),
    UNIQUE INDEX `voters_voterId_key`(`voterId`),
    UNIQUE INDEX `voters_categoryId_partId_wardId_areaId_rollNo_key`(`categoryId`, `partId`, `wardId`, `areaId`, `rollNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `voters` ADD CONSTRAINT `voters_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voters` ADD CONSTRAINT `voters_partId_fkey` FOREIGN KEY (`partId`) REFERENCES `parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voters` ADD CONSTRAINT `voters_wardId_fkey` FOREIGN KEY (`wardId`) REFERENCES `wards`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voters` ADD CONSTRAINT `voters_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `areas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
