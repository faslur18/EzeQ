CREATE TABLE `appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`salon_id` text NOT NULL,
	`service_id` text NOT NULL,
	`appointment_date` text NOT NULL,
	`start_time` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`salon_id`) REFERENCES `salons`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `operating_hours` (
	`id` text PRIMARY KEY NOT NULL,
	`salon_id` text NOT NULL,
	`day_of_week` integer NOT NULL,
	`open_time` text NOT NULL,
	`close_time` text NOT NULL,
	FOREIGN KEY (`salon_id`) REFERENCES `salons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `salons` (
	`id` text PRIMARY KEY NOT NULL,
	`admin_id` text NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`rating` real DEFAULT 0,
	`is_active` integer DEFAULT true,
	`status` text DEFAULT 'PENDING' NOT NULL,
	FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` text PRIMARY KEY NOT NULL,
	`salon_id` text NOT NULL,
	`name` text NOT NULL,
	`duration` integer NOT NULL,
	`price` real NOT NULL,
	FOREIGN KEY (`salon_id`) REFERENCES `salons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'CUSTOMER' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);