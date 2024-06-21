CREATE TABLE `downloads` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`ts` integer DEFAULT (current_timestamp),
	`image` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `stripe_customers` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`stripe_customer_id` text NOT NULL,
	`total_downloads` integer DEFAULT 0 NOT NULL,
	`plan_active` integer DEFAULT false NOT NULL,
	`subscription_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stripe_customers_stripe_customer_id_unique` ON `stripe_customers` (`stripe_customer_id`);