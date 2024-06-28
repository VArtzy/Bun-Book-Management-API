import { eq, or } from 'drizzle-orm'
import { db } from '../src/application/database'
import { users, books, collections, reviews } from '../src/database/schema'

export class UserTest {
    static async delete() {
        await db.delete(users).where(eq(users.username, "test"))
    }

    static async create() {
        await db.insert(users).values({
            username: "test",
            name: "test",
            password: await Bun.password.hash("test", { algorithm: "bcrypt", cost: 10 }),
            token: "test"
        })
    }

    static async get() {
        const user = await db.select().from(users).where(eq(users.username, "test"))

        if (!user) {
            throw new Error("User is not found");
        }

        return user
    }
}

export class BookTest {
    static async delete() {
        await db.delete(books).where(or(eq(books.title, "test"), eq(books.title, "test update")))
    }

    static async create() {
        return await db.insert(books).values({
            title: "test",
            author: "test",
            rating: 5,
            cover: "https://test.com/test.jpg"
        }).returning({ id: books.id })
    }

    static async get() {
        const book = await db.select().from(books).where(eq(books.title, "test"))

        if (!book) {
            throw new Error("Book is not found");
        }

        return book
    }
}

export class CollectionTest {
    static async delete() {
        await db.delete(collections).where(eq(collections.username, "test"))
    }

    static async create(bookId: number) {
        await db.insert(collections).values({
            bookId,
            username: "test"
        })
    }

    static async get() {
        const collection = await db.select().from(collections).where(eq(collections.username, "test"))

        if (!collection) {
            throw new Error("Collection is not found");
        }

        return collection
    }
}

export class ReviewTest {
    static async delete() {
        await db.delete(reviews).where(eq(reviews.username, "test"))
    }

    static async create(bookId: number) {
        await db.insert(reviews).values({
            body: "test",
            rating: 5,
            bookId,
            username: "test"
        })
    }

    static async get() {
        const review = await db.select().from(reviews).where(eq(reviews.username, "test"))

        if (!review) {
            throw new Error("Review is not found");
        }

        return review
    }
}
