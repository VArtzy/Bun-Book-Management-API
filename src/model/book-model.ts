import { books } from "../database/schema"

export type BookResponse = {
    id: number,
    title: string;
    author?: string;
    rating?: number;
    cover?: string;
}

export type CreateBookRequest = {
    title: string;
    author?: string;
    rating?: number;
    cover?: string;
}

export function toBookResponse(book: typeof books.$inferSelect): BookResponse {
    return {
        id: book.id,
        title: book.title,
        author: book.author!,
        rating: book.rating!,
        cover: book.cover!
    }
}
