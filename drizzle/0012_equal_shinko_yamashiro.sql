DROP TABLE `Reviews`;--> statement-breakpoint
ALTER TABLE `Cart` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP();--> statement-breakpoint
ALTER TABLE `ContactMessages` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP();--> statement-breakpoint
ALTER TABLE `Orders` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP();--> statement-breakpoint
ALTER TABLE `Promotions` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP();--> statement-breakpoint
ALTER TABLE `Users` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP();