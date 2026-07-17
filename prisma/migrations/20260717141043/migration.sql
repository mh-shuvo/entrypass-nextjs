/*
  Warnings:

  - A unique constraint covering the columns `[event_slug]` on the table `events` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_slug` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `events` ADD COLUMN `event_slug` VARCHAR(110) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `events_event_slug_key` ON `events`(`event_slug`);
