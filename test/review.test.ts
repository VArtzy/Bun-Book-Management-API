import { describe, afterEach, it, expect, beforeEach } from 'bun:test'
import { BookTest, ReviewTest, UserTest } from './test-util'
import app from '../src'
import { log } from '../src/application/logging'

describe('POST /api/books/:bookId/review', () =>  {
    beforeEach(async () => {
        await UserTest.create()
        await BookTest.create()
    })
    afterEach(async () => {
        await BookTest.delete()
        await UserTest.delete()
    })

    it('should reject add new review if request is invalid', async() => {
        const book = await BookTest.get()
        const response = await app.request(`/api/books/${book[0].id}/review`, {
            method: 'POST',
            headers: new Headers({ "X-API-TOKEN": "test" }),
            body: JSON.stringify({
                body: "",
                rating: 0
            })
        })

        log.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.json()).toBeDefined()
    })

    it('should reject create review if requested book is not found', async() => {
        const response = await app.request(`/api/books/0/review`, {
            method: 'POST',
            headers: new Headers({ "X-API-TOKEN": "test" }),
            body: JSON.stringify({
                body: "This book is the best for everyone who loves to having clean code",
                rating: 4
            })
        })

        log.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.json()).toBeDefined()
    })

    it('should regsiter new review', async () => {
        const book = await BookTest.get()
        const response = await app.request(`/api/books/${book[0].id}/review`, {
            method: 'POST',
            headers: new Headers({ "X-API-TOKEN": "test" }),
            body: JSON.stringify({
                body: "This book is the best for everyone who loves to having clean code",
                rating: 4
            })
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(201)
        expect(json.data.body).toBe("This book is the best for everyone who loves to having clean code")
        expect(json.data.rating).toBe(4)
    })
})

describe('PUT /api/books/:bookId/review/:reviewId', () =>  {
    beforeEach(async () => {
        await UserTest.create()
        const bookId = await BookTest.create()
        await ReviewTest.create(bookId[0].id)
    })
    afterEach(async () => {
        await ReviewTest.delete()
        await BookTest.delete()
        await UserTest.delete()
    })

    it('should reject update review if request is invalid', async() => {
        const book = await BookTest.get()
        const review = await ReviewTest.get()
        const response = await app.request(`/api/books/${book[0].id}/review/${review[0].id}`, {
            method: 'PUT',
            headers: new Headers({ "X-API-TOKEN": "test" }),
            body: JSON.stringify({
                body: "",
                rating: 0
            })
        })

        log.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.json()).toBeDefined()
    })

    it('should reject update review if requested book is not found', async() => {
        const review = await ReviewTest.get()
        const response = await app.request(`/api/books/0/review/${review[0].id}`, {
            method: 'PUT',
            headers: new Headers({ "X-API-TOKEN": "test" }),
            body: JSON.stringify({
                body: "This book is the best for everyone who loves to having clean code",
                rating: 4
            })
        })

        log.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.json()).toBeDefined()
    })

    it('should reject update review if requested review is not found', async() => {
        const book = await BookTest.get()
        const response = await app.request(`/api/books/${book[0].id}/review/0`, {
            method: 'PUT',
            headers: new Headers({ "X-API-TOKEN": "test" }),
            body: JSON.stringify({
                body: "This book is the best for everyone who loves to having clean code",
                rating: 4
            })
        })

        log.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.json()).toBeDefined()
    })

    it('should update review', async () => {
        const book = await BookTest.get()
        const review = await ReviewTest.get()
        const response = await app.request(`/api/books/${book[0].id}/review/${review[0].id}`, {
            method: 'PUT',
            headers: new Headers({ "X-API-TOKEN": "test" }),
            body: JSON.stringify({
                body: "This book is the best for everyone who loves to having clean code",
                rating: 4
            })
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data.body).toBe("This book is the best for everyone who loves to having clean code")
        expect(json.data.rating).toBe(4)
    })
})
