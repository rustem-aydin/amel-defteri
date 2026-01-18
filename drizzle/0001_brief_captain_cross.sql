DROP INDEX `idx_user_deeds_deed_id_added`;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_user_deeds_unique_deed_id` ON `user_deeds` (`deed_id`);