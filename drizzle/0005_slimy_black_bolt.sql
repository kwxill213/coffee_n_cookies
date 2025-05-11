ALTER TABLE `Cart` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-10 11:44:15.515';--> statement-breakpoint
ALTER TABLE `Orders` MODIFY COLUMN `restaurant_id` int;--> statement-breakpoint
ALTER TABLE `Orders` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-10 11:44:15.516';--> statement-breakpoint
ALTER TABLE `Users` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-10 11:44:15.514';