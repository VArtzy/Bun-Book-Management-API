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

describe('GET /api/books/:bookId/review', () =>  {
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

    it('should reject get review if requested book is not found', async() => {
        const review = await ReviewTest.get()
        const response = await app.request(`/api/books/0/review/${review[0].id}`, {
            headers: new Headers({ "X-API-TOKEN": "test" })
        })

        log.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.json()).toBeDefined()
    })

    it('should reject get review if requested review is not found', async() => {
        const book = await BookTest.get()
        const response = await app.request(`/api/books/${book[0].id}/review/0`, {
            headers: new Headers({ "X-API-TOKEN": "test" })
        })

        log.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.json()).toBeDefined()
    })

    it('should get review', async () => {
        const book = await BookTest.get()
        const review = await ReviewTest.get()
        const response = await app.request(`/api/books/${book[0].id}/review/${review[0].id}`, {
            headers: new Headers({ "X-API-TOKEN": "test" })
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data.body).toBe("test")
        expect(json.data.rating).toBe(5)
    })
})

describe('DELETE /api/books/:bookId/review/:reviewId', () =>  {
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

    it('should reject delete review if requested book is not found', async() => {
        const review = await ReviewTest.get()
        const response = await app.request(`/api/books/0/review/${review[0].id}`, {
            method: 'DELETE',
            headers: new Headers({ "X-API-TOKEN": "test" }),
        })

        log.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.json()).toBeDefined()
    })

    it('should reject delete review if requested review is not found', async() => {
        const book = await BookTest.get()
        const response = await app.request(`/api/books/${book[0].id}/review/0`, {
            method: 'DELETE',
            headers: new Headers({ "X-API-TOKEN": "test" }),
        })

        log.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.json()).toBeDefined()
    })

    it('should delete review', async () => {
        const book = await BookTest.get()
        const review = await ReviewTest.get()
        const response = await app.request(`/api/books/${book[0].id}/review/${review[0].id}`, {
            method: 'DELETE',
            headers: new Headers({ "X-API-TOKEN": "test" }),
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data).toBe("OK")
    })
})

describe('GET /api/books/:bookId/review', () =>  {
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

    it('should search review', async() => {
        const book = await BookTest.get()
        const response = await app.request(`/api/books/${book[0].id}/review`, {
            headers: new Headers({ "X-API-TOKEN": "test" })
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data.length).toBe(1)
        expect(json.paging.cursor).toBeDefined()
        expect(json.paging.size).toBe(10)
    })


    it('should search review by body', async() => {
        const book = await BookTest.get()
        const response = await app.request(`/api/books/${book[0].id}/review?body=es`, {
            headers: new Headers({ "X-API-TOKEN": "test" }),
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data.length).toBe(1)
        expect(json.paging.cursor).toBeDefined()
        expect(json.paging.size).toBe(10)
    })

    it('should search review by username', async() => {
        const book = await BookTest.get()
        const response = await app.request(`/api/books/${book[0].id}/review?username=tes`, {
            headers: new Headers({ "X-API-TOKEN": "test" }),
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data.length).toBe(1)
        expect(json.paging.cursor).toBeDefined()
        expect(json.paging.size).toBe(10)
    })

    it('should search review by rating', async() => {
        const book = await BookTest.get()
        const response = await app.request(`/api/books/${book[0].id}/review?rating=5`, {
            headers: new Headers({ "X-API-TOKEN": "test" }),
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data.length).toBe(1)
        expect(json.paging.cursor).toBeDefined()
        expect(json.paging.size).toBe(10)
    })

    it('should search book with no result', async() => {
        const book = await BookTest.get()
        const response = await app.request(`/api/books/${book[0].id}/review?body=salah`, {
            headers: new Headers({ "X-API-TOKEN": "test" }),
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data.length).toBe(0)
        expect(json.paging.cursor).toBeNull()
        expect(json.paging.size).toBe(10)
    })

    it('should search book with paging', async() => {
        const book = await BookTest.get()
        const review = await ReviewTest.get()
        const response = await app.request(`/api/books/${book[0].id}/review?cursor=${review[0].id - 1}&size=1`, {
            headers: new Headers({ "X-API-TOKEN": "test" }),
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data.length).toBe(1)
        expect(json.paging.cursor).toBeDefined()
        expect(json.paging.size).toBe(1)
    })
})
