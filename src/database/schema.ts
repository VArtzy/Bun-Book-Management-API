import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
    username: text('username', { length: 100 }).primaryKey(),
    password: text('password', { length: 100 }).notNull(),
    name: text('name', { length: 100 }).notNull(),
    token: text('token', { length: 100 }),
})

export const books = sqliteTable('books', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text('title', { length: 100 }).notNull(),
    author: text('author', { length: 100 }),
    rating: integer('rating'),
    cover: text('cover', { length: 256 }),
})

export const reviews = sqliteTable('reviews', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    body: text('body', { length: 1000 }).notNull(),
    rating: integer('rating'),
    bookId: integer('bookId').references(() => books.id).notNull(),
    username: text('username', { length: 100 }).references(() => users.username).notNull(),
})

export const collections = sqliteTable('collections', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    bookId: integer('bookId').references(() => books.id).notNull(),
    username: text('username', { length: 100 }).references(() => users.username).notNull(),
})
