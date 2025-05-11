ALTER TABLE `Cart` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-09 14:57:23.544';--> statement-breakpoint
ALTER TABLE `Orders` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-09 14:57:23.545';--> statement-breakpoint
ALTER TABLE `Users` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-09 14:57:23.543';--> statement-breakpoint
ALTER TABLE `Category` ADD `image_url` varchar(200);