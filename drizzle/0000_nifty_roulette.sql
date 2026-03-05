CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `dashboard` (
	`id` text PRIMARY KEY NOT NULL,
	`siteId` text NOT NULL,
	`name` text NOT NULL,
	`layout` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`siteId`) REFERENCES `site`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `event` (
	`id` text PRIMARY KEY NOT NULL,
	`siteId` text NOT NULL,
	`name` text NOT NULL,
	`path` text NOT NULL,
	`referrer` text,
	`browser` text,
	`os` text,
	`country` text,
	`city` text,
	`device` text,
	`duration` integer,
	`revenue` integer,
	`metadata` text,
	`timestamp` text NOT NULL,
	FOREIGN KEY (`siteId`) REFERENCES `site`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `event_site_timestamp_idx` ON `event` (`siteId`,`timestamp`);--> statement-breakpoint
CREATE INDEX `event_site_name_idx` ON `event` (`siteId`,`name`);--> statement-breakpoint
CREATE INDEX `event_site_path_idx` ON `event` (`siteId`,`path`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`sessionToken` text NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_sessionToken_unique` ON `session` (`sessionToken`);--> statement-breakpoint
CREATE TABLE `site` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`domain` text NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`emailVerified` integer,
	`image` text,
	`password` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `verificationToken_token_unique` ON `verificationToken` (`token`);--> statement-breakpoint
CREATE TABLE `widget` (
	`id` text PRIMARY KEY NOT NULL,
	`dashboardId` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`config` text,
	`position` integer DEFAULT 0 NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`dashboardId`) REFERENCES `dashboard`(`id`) ON UPDATE no action ON DELETE cascade
);
