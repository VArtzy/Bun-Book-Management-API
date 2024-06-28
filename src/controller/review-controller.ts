import { Handler } from "hono";
import { CreateReviewRequest, toReviewResponse } from "../model/review-model";
import { Validation } from "../validation/validation";
import { ReviewValidation } from "../validation/review-validation";
import { db } from "../application/database";
import { books, reviews } from "../database/schema";
import { and, asc, eq, gt, like } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class ReviewController {
    static create: Handler = async (c) => {
        const id = Number(c.req.param('bookId'))
        const user = c.get('user')
        const request: CreateReviewRequest = await c.req.json()

        const validated = Validation.validate(ReviewValidation.CREATE, request)
        const result = await db.query.books.findFirst({ where: eq(books.id, id) })
        if (!result) {
            throw new HTTPException(404, { message: `Book with id ${id} is not found` })
        }

        const review = await db.insert(reviews).values({ body: validated.body, rating: validated.rating, bookId: id, username: user.username }).returning()
        const response = toReviewResponse(review[0])

        return c.json({ data: response }, 201)
    }

    static update: Handler = async (c) => {
        const bookId = Number(c.req.param('bookId'))
        const reviewId = Number(c.req.param('reviewId'))
        const user = c.get('user')
        const request: CreateReviewRequest = await c.req.json()

        const validated = Validation.validate(ReviewValidation.UPDATE, request)
        const bookExist = await db.query.books.findFirst({ where: eq(books.id, bookId) })
        if (!bookExist) {
            throw new HTTPException(404, { message: `Book with id ${bookId} is not found` })
        }
        const reviewExist = await db.query.reviews.findFirst({ where: eq(reviews.id, reviewId) })
        if (!reviewExist) {
            throw new HTTPException(404, { message: `Review with id ${reviewId} is not found` })
        }

        const review = await db.update(reviews).set(validated).where(
            and(eq(reviews.bookId, bookId), eq(reviews.id, reviewId), eq(reviews.username, user.username))
        ).returning()
        if (!review[0]) {
            throw new HTTPException(401, { message: `You are unauthorized for this action` })
        }
        const response = toReviewResponse(review[0])

        return c.json({ data: response }, 200)
    }

    static get: Handler = async (c) => {
        const bookId = Number(c.req.param('bookId'))
        const reviewId = Number(c.req.param('reviewId'))
        const user = c.get('user')

        const bookExist = await db.query.books.findFirst({ where: eq(books.id, bookId) })
        if (!bookExist) {
            throw new HTTPException(404, { message: `Book with id ${bookId} is not found` })
        }
        const reviewExist = await db.query.reviews.findFirst({ where: eq(reviews.id, reviewId) })
        if (!reviewExist) {
            throw new HTTPException(404, { message: `Review with id ${reviewId} is not found` })
        }

        const review = await db.query.reviews.findFirst({
            where: and(eq(reviews.bookId, bookId), eq(reviews.id, reviewId), eq(reviews.username, user.username))
        })
        if (!review) {
            throw new HTTPException(401, { message: `you are unauthorized for this action` })
        }
        const response = toReviewResponse(review)

        return c.json({ data: response }, 200)
    }

    static delete: Handler = async (c) => {
        const bookId = Number(c.req.param('bookId'))
        const reviewId = Number(c.req.param('reviewId'))
        const user = c.get('user')

        const bookExist = await db.query.books.findFirst({ where: eq(books.id, bookId) })
        if (!bookExist) {
            throw new HTTPException(404, { message: `Book with id ${bookId} is not found` })
        }
        const reviewExist = await db.query.reviews.findFirst({ where: eq(reviews.id, reviewId) })
        if (!reviewExist) {
            throw new HTTPException(404, { message: `Review with id ${reviewId} is not found` })
        }

        const review = await db.delete(reviews).where(and(eq(reviews.bookId, bookId), eq(reviews.id, reviewId), eq(reviews.username, user.username))).returning()
        if (!review[0]) {
            throw new HTTPException(401, { message: `You are unauthorized for this action` })
        }

        return c.json({ data: "OK" }, 200)
    }

    static search: Handler = async (c) => {
        const bookId = Number(c.req.param('bookId'))
        const request = {
            body: c.req.query('body'),
            rating: c.req.query('rating') ? Number(c.req.query('rating')) : undefined,
            username: c.req.query('username'),
            cursor: c.req.query('cursor') ? Number(c.req.query('cursor')) : undefined,
            size: c.req.query('size') ? Number(c.req.query('size')) : 10,
        }
        const validated = Validation.validate(ReviewValidation.SEARCH, request)

        const results = await db.select().from(reviews)
        .where(
            and(
                validated.cursor ? gt(reviews.id, validated.cursor) : undefined,
                validated.body ? like(reviews.body, `%${validated.body}%`) : undefined,
                validated.rating ? eq(reviews.rating, validated.rating) : undefined,
                validated.username ? like(reviews.username, `%${validated.username}%`) : undefined,
                eq(reviews.bookId, bookId)
            )
        )
        .limit(request.size)
        .orderBy(asc(reviews.id))

        let cursor = null
        if (results[0]) {
            cursor = results[results.length - 1].id
        }

        return c.json({ data: results.map(review => toReviewResponse(review)), paging: {
            cursor,
            size: validated.size
        } })
    }
}
