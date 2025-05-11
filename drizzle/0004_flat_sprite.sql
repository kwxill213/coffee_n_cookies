
ALTER TABLE `Cart` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-10 10:13:49.536';--> statement-breakpoint
ALTER TABLE `Orders` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-10 10:13:49.537';--> statement-breakpoint
ALTER TABLE `Users` MODIFY COLUMN `created_at` datetime DEFAULT '2025-05-10 10:13:49.535';--> statement-breakpoint
ALTER TABLE `Orders` ADD `restaurant_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `Orders` ADD `delivery_time` datetime;--> statement-breakpoint
ALTER TABLE `Restaurants` ADD `name` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `Restaurants` ADD `phone` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `Restaurants` ADD `coordinateX` decimal(10,7) NOT NULL;--> statement-breakpoint
ALTER TABLE `Restaurants` ADD `coordinateY` decimal(10,7) NOT NULL;--> statement-breakpoint
ALTER TABLE `Restaurants` ADD `opening_time` varchar(5) NOT NULL;--> statement-breakpoint
ALTER TABLE `Restaurants` ADD `closing_time` varchar(5) NOT NULL;--> statement-breakpoint
ALTER TABLE `Restaurants` ADD `image_url` varchar(255);--> statement-breakpoint
ALTER TABLE `Restaurants` ADD `description` varchar(500);--> statement-breakpoint
ALTER TABLE `Restaurants` ADD `is_active` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `Restaurants` ADD `delivery_radius` int DEFAULT 5000 NOT NULL;--> statement-breakpoint
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_restaurant_id_Restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `Restaurants`(`id`) ON DELETE no action ON UPDATE no action;