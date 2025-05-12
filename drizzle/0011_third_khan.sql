ALTER TABLE `Cart_Items` DROP FOREIGN KEY `Cart_Items_cart_id_Cart_id_fk`;
--> statement-breakpoint
ALTER TABLE `Cart_Items` DROP FOREIGN KEY `Cart_Items_product_id_Products_id_fk`;
--> statement-breakpoint
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_user_id_Users_id_fk`;
--> statement-breakpoint
ALTER TABLE `Order_Items` DROP FOREIGN KEY `Order_Items_order_id_Orders_id_fk`;
--> statement-breakpoint
ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_user_id_Users_id_fk`;
--> statement-breakpoint
ALTER TABLE `Promotions` DROP FOREIGN KEY `Promotions_product_id_Products_id_fk`;
--> statement-breakpoint
ALTER TABLE `Reviews` DROP FOREIGN KEY `Reviews_order_id_Orders_id_fk`;
--> statement-breakpoint
ALTER TABLE `Cart_Items` ADD CONSTRAINT `Cart_Items_cart_id_Cart_id_fk` FOREIGN KEY (`cart_id`) REFERENCES `Cart`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Cart_Items` ADD CONSTRAINT `Cart_Items_product_id_Products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_user_id_Users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Order_Items` ADD CONSTRAINT `Order_Items_order_id_Orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `Orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_user_id_Users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Promotions` ADD CONSTRAINT `Promotions_product_id_Products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_order_id_Orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `Orders`(`id`) ON DELETE cascade ON UPDATE no action;