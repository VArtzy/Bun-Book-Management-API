import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
    username: text('username', { length: 100 }).primaryKey(),
    password: text('password', { length: 100 }),
    name: text('name', { length: 100 }),
    token: text('token', { length: 100 }).notNull(),
})

export const books = sqliteTable('books', {
    id: integer('id').primaryKey(),
    title: text('title', { length: 100 }),
    author: text('author', { length: 100 }).notNull(),
    rating: integer('rating').notNull(),
    cover: text('cover', { length: 256 }).notNull(),
})

export const reviews = sqliteTable('reviews', {
    id: integer('id').primaryKey(),
    body: text('body', { length: 1000 }),
    rating: integer('rating').notNull(),
    bookId: integer('bookId').references(() => books.id),
    username: text('username', { length: 100 }).references(() => users.username),
})

export const collections = sqliteTable('collections', {
    id: integer('id').primaryKey(),
    bookId: integer('bookId').references(() => books.id),
    username: text('username', { length: 100 }).references(() => users.username),
})
