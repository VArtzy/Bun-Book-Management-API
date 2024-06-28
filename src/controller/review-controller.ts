import { Handler } from "hono";
import { CreateReviewRequest, toReviewResponse } from "../model/review-model";
import { Validation } from "../validation/validation";
import { ReviewValidation } from "../validation/review-validation";
import { db } from "../application/database";
import { books, reviews } from "../database/schema";
import { and, eq } from "drizzle-orm";
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

        const review = await db.update(reviews).set(validated).where(and(eq(reviews.bookId, bookId), eq(reviews.username, user.username))).returning()
        const response = toReviewResponse(review[0])

        return c.json({ data: response }, 200)
    }
}
