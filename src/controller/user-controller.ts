import { Handler } from 'hono'
import { CreateUserRequest, toUserResponse } from '../model/user-model'
import { UserValidation } from '../validation/user-validation'
import { Validation } from '../validation/validation'
import { db } from '../application/database'
import { count, eq } from 'drizzle-orm'
import { users } from '../database/schema'
import { ResponseError } from '../error/response-error'

export class UserController {
    static register: Handler = async (c, next) => {
        try {
            const request: CreateUserRequest = await c.req.parseBody()
            const validated = Validation.validate(UserValidation.REGISTER, request)
            const totalUserWithSameUsername = await db.select({ count: count() }).from(users)
            .where(eq(users.username, validated.username))

            if (totalUserWithSameUsername[0].count != 0) {
                throw new ResponseError(400, 'Username already exists')
            }

            validated.password = await Bun.password.hash(validated.password, { algorithm: 'bcrypt', cost: 10 })

            const user = await db.insert(users).values({
                username: validated.username,
                password: validated.password,
                name: validated.name
            }).returning()

            const response = toUserResponse({
                username: user[0].username,
                password: user[0].password,
                name: user[0].name,
                token: null
            })
            c.json({ data: response }, 201)
        } catch (e) {
           await next()
        }
    }
}
