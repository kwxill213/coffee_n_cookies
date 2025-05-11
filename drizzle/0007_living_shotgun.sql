CREATE TABLE `Promotions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` varchar(500) NOT NULL,
	`image_url` varchar(255) NOT NULL,
	`start_date` datetime,
	`end_date` datetime,
	`is_active` boolean NOT NULL DEFAULT true,
	`discount_percent` int,
	`product_id` int,
	`category_id` int,
	`created_at` datetime DEFAULT '2025-05-11 11:31:01.276',
	`conditions` varchar(500),
	CONSTRAINT `Promotions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `Cart` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-11 11:31:01.275';--> statement-breakpoint
ALTER TABLE `Orders` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-11 11:31:01.276';--> statement-breakpoint
ALTER TABLE `Users` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-11 11:31:01.274';--> statement-breakpoint
ALTER TABLE `Promotions` ADD CONSTRAINT `Promotions_product_id_Products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Promotions` ADD CONSTRAINT `Promotions_category_id_Category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE no action ON UPDATE no action;