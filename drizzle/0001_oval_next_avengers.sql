ALTER TABLE `Cart` MODIFY COLUMN `created_at` datetime DEFAULT '2025-02-21 09:44:14.760';--> statement-breakpoint
ALTER TABLE `Orders` MODIFY COLUMN `created_at` datetime DEFAULT '2025-02-21 09:44:14.760';--> statement-breakpoint
ALTER TABLE `Users` MODIFY COLUMN `username` varchar(50) NOT NULL DEFAULT 'Пользователь';--> statement-breakpoint
ALTER TABLE `Users` MODIFY COLUMN `created_at` datetime DEFAULT '2025-02-21 09:44:14.758';