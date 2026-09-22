/*
  Warnings:

  - The values [view_user,view_events] on the enum `user_permissions_permission` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `user_permissions` MODIFY `permission` ENUM('manage_events', 'manage_user') NOT NULL;
