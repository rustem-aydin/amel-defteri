DROP TABLE `user_profile`;--> statement-breakpoint
ALTER TABLE `user_deeds` ADD `level` integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE `user_deeds` ADD `last_milestone` integer DEFAULT 0;