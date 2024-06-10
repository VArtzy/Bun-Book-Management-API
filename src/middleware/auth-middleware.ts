import { createMiddleware } from 'hono/factory'
import { eq } from 'drizzle-orm'
import { db } from '../application/database'
import { users } from '../database/schema'

export const auth = createMiddleware(async (c, next) => {
    const token = c.req.header('X-API-TOKEN')

    if (token) {
        const user = await db.query.users.findFirst({
            where: eq(users.token, token)
        })

        if (user) {
            c.set('user', user)
            await next()
            return
        }
    }

    return c.json({ error: "Unauthorized" }, 401)
})
