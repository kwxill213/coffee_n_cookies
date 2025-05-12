CREATE TABLE `ContactMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`message` varchar(2000) NOT NULL,
	`created_at` datetime DEFAULT '2025-05-11 22:32:08.824',
	`is_processed` boolean NOT NULL DEFAULT false,
	CONSTRAINT `ContactMessages_id` PRIMARY KEY(`id`)
);
