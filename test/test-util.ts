import { eq } from 'drizzle-orm'
import { db } from '../src/application/database'
import { users } from '../src/database/schema'

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
