ALTER TABLE `Cart` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-09 15:11:18.620';--> statement-breakpoint
ALTER TABLE `Category` MODIFY COLUMN `image_url` varchar(255);--> statement-breakpoint
ALTER TABLE `Orders` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-09 15:11:18.620';--> statement-breakpoint
ALTER TABLE `Users` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-09 15:11:18.619';--> statement-breakpoint
ALTER TABLE `Users` ADD `image_url` varchar(255);