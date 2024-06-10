import { Handler } from "hono";
import { CreateBookRequest, toBookResponse } from "../model/book-model";
import { Validation } from "../validation/validation";
import { db } from "../application/database";
import { books } from "../database/schema";
import { BookValidation } from "../validation/book-validation";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class BookController {
    static create: Handler = async (c) => {
        const request: CreateBookRequest = await c.req.json()
        const validated = Validation.validate(BookValidation.CREATE, request)

        const book = await db.insert(books).values(validated).returning()
        const response = toBookResponse(book[0])

        return c.json({ data: response }, 201)
    }

    static update: Handler = async (c) => {
        const request: CreateBookRequest = await c.req.json()
        const validated = Validation.validate(BookValidation.UPDATE, request)
        const id = Number(c.req.param('id'))

        const result = await db.update(books).set(validated).where(eq(books.id, id)).returning()
        if (!result[0]) {
            throw new HTTPException(404, { message: `Book with id ${id} is not found` })
        }
        const response = toBookResponse(result[0])

        return c.json({ data: response }, 200)
    }

    static delete: Handler = async (c) => {
        const id = Number(c.req.param('id'))

        const result = await db.delete(books).where(eq(books.id, id)).returning()
        if (!result[0]) {
            throw new HTTPException(404, { message: `Book with id ${id} is not found` })
        }

        return c.json({ data: "OK" }, 200)
    }
}
