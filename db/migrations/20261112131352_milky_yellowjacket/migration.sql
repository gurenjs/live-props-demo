CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`customer` text NOT NULL,
	`item` text NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`updated_at` text NOT NULL
);
