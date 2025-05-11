ALTER TABLE `Cart` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-10 13:13:13.862';--> statement-breakpoint
ALTER TABLE `Orders` MODIFY COLUMN `address` varchar(255);--> statement-breakpoint
ALTER TABLE `Orders` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-10 13:13:13.862';--> statement-breakpoint
ALTER TABLE `Users` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-10 13:13:13.859';