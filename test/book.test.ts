import { afterEach, beforeEach, describe, expect, it } from "bun:test"
import app from "../src"
import { BookTest, UserTest } from "./test-util"
import { log } from "../src/application/logging"

describe('POST /api/books', () =>  {
    beforeEach(async () => {
        await UserTest.create()
    })
    afterEach(async () => {
        await BookTest.delete()
        await UserTest.delete()
    })

    it('should reject create new book if request is invalid', async() => {
        const response = await app.request('/api/books', {
            method: 'POST',
            headers: new Headers({ "X-API-TOKEN": "test" }),
            body: JSON.stringify({
                title: "",
                author: "",
                rating: 0,
                cover: ""
            })
        })

        log.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.json()).toBeDefined()
    })

    it('should create new book', async () => {
        const response = await app.request('/api/books', {
            method: 'POST',
            headers: new Headers({ "X-API-TOKEN": "test" }),
            body: JSON.stringify({
                title: "test",
                author: "test",
                rating: 5,
                cover: "https://test.com/test.jpg"
            })
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(201)
        expect(json.data.title).toBe("test")
        expect(json.data.author).toBe("test")
        expect(json.data.rating).toBe(5)
        expect(json.data.cover).toBeDefined()
    })
})

describe('PUT /api/books/:id', () =>  {
    beforeEach(async () => {
        await UserTest.create()
        await BookTest.create()
    })
    afterEach(async () => {
        await BookTest.delete()
        await UserTest.delete()
    })

    it('should reject update book if request is invalid', async() => {
        const book = await BookTest.get()
        const response = await app.request(`/api/books/${book[0].id}`, {
            method: 'PUT',
            headers: new Headers({ "X-API-TOKEN": "test" }),
            body: JSON.stringify({
                title: "",
                author: "",
                rating: 0,
                cover: ""
            })
        })

        log.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.json()).toBeDefined()
    })

    it('should reject update book if requested book is not found', async() => {
        const response = await app.request(`/api/books/0`, {
            method: 'PUT',
            headers: new Headers({ "X-API-TOKEN": "test" }),
            body: JSON.stringify({
                title: "test update",
                author: "tester",
                rating: 4,
                cover: "https://test.com/test-updated.jpg"
            })
        })

        log.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.json()).toBeDefined()
    })


    it('should update book', async () => {
        const book = await BookTest.get()
        const response = await app.request(`/api/books/${book[0].id}`, {
            method: 'PUT',
            headers: new Headers({ "X-API-TOKEN": "test" }),
            body: JSON.stringify({
                title: "test update",
                author: "tester",
                rating: 4,
                cover: "https://test.com/test-updated.jpg"
            })
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data.title).toBe("test update")
        expect(json.data.author).toBe("tester")
        expect(json.data.rating).toBe(4)
        expect(json.data.cover).toBeDefined()
    })
})


describe('DELETE /api/books/:id', () =>  {
    beforeEach(async () => {
        await UserTest.create()
        await BookTest.create()
    })
    afterEach(async () => {
        await BookTest.delete()
        await UserTest.delete()
    })

    it('should delete book', async() => {
        const book = await BookTest.get()
        const response = await app.request(`/api/books/${book[0].id}`, {
            method: 'DELETE',
            headers: new Headers({ "X-API-TOKEN": "test" })
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data).toBe("OK")
    })

    it('should reject delete book if requested book is not found', async() => {
        const response = await app.request(`/api/books/0`, {
            method: 'DELETE',
            headers: new Headers({ "X-API-TOKEN": "test" }),
        })

        log.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.json()).toBeDefined()
    })
})

describe('GET /api/books/:id', () =>  {
    beforeEach(async () => {
        await UserTest.create()
        await BookTest.create()
    })
    afterEach(async () => {
        await BookTest.delete()
        await UserTest.delete()
    })

    it('should get book', async() => {
        const book = await BookTest.get()
        const response = await app.request(`/api/books/${book[0].id}`, {
            method: 'GET',
            headers: new Headers({ "X-API-TOKEN": "test" })
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data.title).toBe("test")
        expect(json.data.author).toBe("test")
        expect(json.data.rating).toBe(5)
        expect(json.data.cover).toBeDefined()
    })

    it('should reject get book if requested book is not found', async() => {
        const response = await app.request(`/api/books/0`, {
            method: 'GET',
            headers: new Headers({ "X-API-TOKEN": "test" }),
        })

        log.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.json()).toBeDefined()
    })
})

