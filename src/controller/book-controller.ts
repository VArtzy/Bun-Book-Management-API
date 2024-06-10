import { Handler } from "hono";
import { CreateBookRequest, toBookResponse } from "../model/book-model";
import { Validation } from "../validation/validation";
import { db } from "../application/database";
import { books } from "../database/schema";
import { BookValidation } from "../validation/book-validation";
import { eq, gt, asc, like, and } from "drizzle-orm";
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

    static get: Handler = async (c) => {
        const id = Number(c.req.param('id'))

        const result = await db.query.books.findFirst({
            where: eq(books.id, id)
        })
        if (!result) {
            throw new HTTPException(404, { message: `Book with id ${id} is not found` })
        }
        const response = toBookResponse(result)

        return c.json({ data: response }, 200)
    }

    static search: Handler = async (c) => {
        const request = {
            title: c.req.query('title'),
            author: c.req.query('author'),
            rating: c.req.query('rating') ? Number(c.req.query('rating')) : undefined,
            cursor: c.req.query('cursor') ? Number(c.req.query('cursor')) : undefined,
            size: c.req.query('size') ? Number(c.req.query('size')) : 10,
        }
        const validated = Validation.validate(BookValidation.SEARCH, request)

        const results = await db.select().from(books)
        .where(
            and(
                validated.cursor ? gt(books.id, validated.cursor) : undefined,
                validated.title ? like(books.title, `%${validated.title}%`) : undefined,
                validated.author ? like(books.author, `%${validated.author}%`) : undefined,
                validated.rating ? eq(books.rating, validated.rating) : undefined
            )
        )
        .limit(request.size)
        .orderBy(asc(books.id))

        let cursor = null
        if (results[0]) {
            cursor = results[results.length - 1].id
        }

        return c.json({ data: results.map(book => toBookResponse(book)), paging: {
            cursor,
            size: validated.size
        } })
    }
}
