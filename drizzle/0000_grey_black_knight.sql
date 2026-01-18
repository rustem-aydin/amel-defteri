CREATE TABLE `daily_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`deed_id` integer,
	`date` text,
	`is_intended` integer DEFAULT 0,
	`is_completed` integer DEFAULT 0,
	`earned_points` integer DEFAULT 0,
	FOREIGN KEY (`deed_id`) REFERENCES `deeds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_daily_logs_deed_date` ON `daily_logs` (`deed_id`,`date`);--> statement-breakpoint
CREATE TABLE `deed_categories` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon_url` text
);
--> statement-breakpoint
CREATE TABLE `deed_periods` (
	`id` integer PRIMARY KEY NOT NULL,
	`code` text,
	`title` text
);
--> statement-breakpoint
CREATE TABLE `deed_resources` (
	`deed_id` integer NOT NULL,
	`resource_id` integer NOT NULL,
	FOREIGN KEY (`deed_id`) REFERENCES `deeds`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pk_deed_resource` ON `deed_resources` (`deed_id`,`resource_id`);--> statement-breakpoint
CREATE TABLE `deed_statuses` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color_code` text
);
--> statement-breakpoint
CREATE TABLE `deeds` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`virtue_text` text,
	`start_ref` text,
	`end_ref` text,
	`time_mask` text,
	`intention_points` integer DEFAULT 0,
	`deed_points` integer DEFAULT 0,
	`category_id` integer,
	`status_id` integer,
	`period_id` integer,
	FOREIGN KEY (`category_id`) REFERENCES `deed_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`status_id`) REFERENCES `deed_statuses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`period_id`) REFERENCES `deed_periods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text,
	`content` text,
	`source_info` text
);
--> statement-breakpoint
CREATE TABLE `user_deeds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`deed_id` integer NOT NULL,
	`added_at` text NOT NULL,
	`removed_at` text,
	`target_count` integer DEFAULT 1,
	FOREIGN KEY (`deed_id`) REFERENCES `deeds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_user_deeds_deed_id_added` ON `user_deeds` (`deed_id`,`added_at`);--> statement-breakpoint
CREATE TABLE `user_profile` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`total_points` integer DEFAULT 0,
	`level` integer DEFAULT 1
);
