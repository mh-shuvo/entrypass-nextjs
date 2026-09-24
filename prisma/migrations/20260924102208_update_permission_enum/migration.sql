-- AlterTable
ALTER TABLE `user_permissions` MODIFY `permission` ENUM('manage_events', 'manage_user', 'manage_own_profile') NOT NULL;
