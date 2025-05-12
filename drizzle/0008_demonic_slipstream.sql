ALTER TABLE `Cart` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP();--> statement-breakpoint
ALTER TABLE `Orders` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP();--> statement-breakpoint
ALTER TABLE `Promotions` MODIFY COLUMN `description` varchar(500);--> statement-breakpoint
ALTER TABLE `Promotions` MODIFY COLUMN `image_url` varchar(255);--> statement-breakpoint
ALTER TABLE `Promotions` MODIFY COLUMN `start_date` datetime DEFAULT CURRENT_TIMESTAMP();--> statement-breakpoint
ALTER TABLE `Promotions` MODIFY COLUMN `end_date` datetime DEFAULT '2025-06-25 17:18:05.885';--> statement-breakpoint
ALTER TABLE `Promotions` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP();--> statement-breakpoint
ALTER TABLE `Users` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP();