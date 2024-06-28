import { collections } from "../database/schema"

export type BookResponse = {
    id: number
    bookId: number
    username: string
}

export type CreateBookRequest = {
    bookId: number
}

export function toCollectionResponse(collection: typeof collections.$inferSelect): BookResponse {
    return {
        id: collection.id,
        bookId: collection.bookId,
        username: collection.username
    }
}
