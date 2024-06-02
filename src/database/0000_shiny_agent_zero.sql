CREATE TABLE `books` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text(100),
	`author` text(100) NOT NULL,
	`rating` integer NOT NULL,
	`cover` text(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`id` integer PRIMARY KEY NOT NULL,
	`bookId` integer,
	`username` text(100),
	FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY NOT NULL,
	`body` text(1000),
	`rating` integer NOT NULL,
	`bookId` integer,
	`username` text(100),
	FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`username` text(100) PRIMARY KEY NOT NULL,
	`password` text(100),
	`name` text(100),
	`token` text(100) NOT NULL
);
