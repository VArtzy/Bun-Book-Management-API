import { Handler } from 'hono'
import { CreateUserRequest, toUserResponse } from '../model/user-model'
import { UserValidation } from '../validation/user-validation'
import { Validation } from '../validation/validation'
import { db } from '../application/database'
import { count, eq } from 'drizzle-orm'
import { users } from '../database/schema'
import { HTTPException } from 'hono/http-exception'
import { randomUUID } from 'crypto'

export class UserController {
    static register: Handler = async (c) => {
        const request: CreateUserRequest = await c.req.json()
        const validated = Validation.validate(UserValidation.REGISTER, request)
        const totalUserWithSameUsername = await db.select({ count: count() }).from(users)
        .where(eq(users.username, validated.username))

        if (totalUserWithSameUsername[0].count != 0) {
            throw new HTTPException(400, {message: 'Username already exists'})
        }

        validated.password = await Bun.password.hash(validated.password, { algorithm: 'bcrypt', cost: 10 })

        const user = await db.insert(users).values(validated).returning()

        const response = toUserResponse(user[0])

        return c.json({ data: response }, 201)
    }

    static login: Handler = async (c) => {
        const request: CreateUserRequest = await c.req.json()
        const validated = Validation.validate(UserValidation.LOGIN, request)

        let user = await db.select().from(users).where(eq(users.username, validated.username))
        if (!user[0]) {
            throw new HTTPException(401, { message: "Username or password is wrong" })
        }
        const isPasswordValid = await Bun.password.verify(validated.password, user[0].password)
        if (!isPasswordValid) {
            throw new HTTPException(401, { message: "Username or password is wrong" })
        }

        user = await db.update(users).set({ token: randomUUID() })
        .where(eq(users.username, validated.username)).returning()
        const response = toUserResponse(user[0])
        response.token = user[0].token!

        return c.json({ data: response }, 200)
    }

    static get: Handler = async (c) => {
        const user = c.get('user')
        const response = toUserResponse(user)
        
        return c.json({ data: response }, 200)
    }

    static update: Handler = async (c) => {
        const request: CreateUserRequest = await c.req.json()
        const validated = Validation.validate(UserValidation.UPDATE, request)
        const user = c.get('user')

        if (validated.name) {
            user.name = validated.name
        }
        if (validated.password) {
            user.password = await Bun.password.hash(validated.password, { algorithm: 'bcrypt', cost: 10 })
        }
        const result = await db.update(users).set(user).where(eq(users.username, user.username)).returning()
        const response = toUserResponse(result[0])

        return c.json({ data: response }, 200)
    }

    static logout: Handler = async (c) => {
       const user = c.get('user')
       await db.update(users).set({ token: null }).where(eq(users.username, user.username))
       return c.json({ data: "OK" }, 200)
    }
}
