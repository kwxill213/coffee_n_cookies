CREATE TABLE `Cart_Items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cart_id` int NOT NULL,
	`product_id` int NOT NULL,
	`quantity` int NOT NULL,
	CONSTRAINT `Cart_Items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Cart` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`created_at` datetime DEFAULT '2025-02-20 20:01:24.210',
	CONSTRAINT `Cart_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100),
	`isDrink` boolean,
	CONSTRAINT `Category_id` PRIMARY KEY(`id`),
	CONSTRAINT `Category_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `Order_Items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`product_id` int NOT NULL,
	`quantity` int NOT NULL,
	CONSTRAINT `Order_Items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`total_amount` decimal(10,2) NOT NULL,
	`address` varchar(255) NOT NULL,
	`status_id` int NOT NULL,
	`created_at` datetime DEFAULT '2025-02-20 20:01:24.210',
	CONSTRAINT `Orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(150),
	`description` varchar(255),
	`price` decimal(10,2) NOT NULL,
	`category` int NOT NULL,
	`image_url` varchar(255),
	CONSTRAINT `Products_id` PRIMARY KEY(`id`),
	CONSTRAINT `Products_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `Restaraunts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`address` varchar(255) NOT NULL,
	CONSTRAINT `Restaraunts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`product_id` int NOT NULL,
	`quantity` int NOT NULL,
	CONSTRAINT `Reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Status` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	CONSTRAINT `Status_id` PRIMARY KEY(`id`),
	CONSTRAINT `Status_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(50) NOT NULL,
	`password` varchar(255) NOT NULL,
	`gender` boolean,
	`email` varchar(100),
	`phone` varchar(20),
	`adress` varchar(255),
	`isAdmin` boolean NOT NULL DEFAULT false,
	`created_at` datetime DEFAULT '2025-02-20 20:01:24.208',
	CONSTRAINT `Users_id` PRIMARY KEY(`id`),
	CONSTRAINT `Users_email_unique` UNIQUE(`email`),
	CONSTRAINT `Users_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
ALTER TABLE `Cart_Items` ADD CONSTRAINT `Cart_Items_cart_id_Cart_id_fk` FOREIGN KEY (`cart_id`) REFERENCES `Cart`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Cart_Items` ADD CONSTRAINT `Cart_Items_product_id_Products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_user_id_Users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Order_Items` ADD CONSTRAINT `Order_Items_order_id_Orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `Orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Order_Items` ADD CONSTRAINT `Order_Items_product_id_Products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_user_id_Users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_status_id_Status_id_fk` FOREIGN KEY (`status_id`) REFERENCES `Status`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Products` ADD CONSTRAINT `Products_category_Category_id_fk` FOREIGN KEY (`category`) REFERENCES `Category`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_order_id_Orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `Orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_product_id_Products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id`) ON DELETE no action ON UPDATE no action;