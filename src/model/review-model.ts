import { reviews } from "../database/schema"

export type ReviewResponse = {
    body: string
    rating?: number
    bookId: number
    username: string
}

export type CreateReviewRequest = {
    body: string
    rating?: number
}

export function toReviewResponse(review: typeof reviews.$inferSelect): ReviewResponse {
    return {
        body: review.body,
        rating: review.rating!,
        bookId: review.bookId,
        username: review.username
    }
}
