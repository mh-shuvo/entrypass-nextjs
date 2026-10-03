-- CreateTable
CREATE TABLE `event_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `kind` ENUM('BANNER', 'SUPPORTING') NOT NULL,
    `bannerForEventId` INTEGER NULL,
    `storageKey` VARCHAR(512) NOT NULL,
    `originalName` VARCHAR(255) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `sizeBytes` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `event_media_bannerForEventId_key`(`bannerForEventId`),
    UNIQUE INDEX `event_media_storageKey_key`(`storageKey`),
    INDEX `event_media_eventId_kind_idx`(`eventId`, `kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `event_media` ADD CONSTRAINT `event_media_eventId_fkey`
    FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_media` ADD CONSTRAINT `event_media_bannerForEventId_fkey`
    FOREIGN KEY (`bannerForEventId`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
