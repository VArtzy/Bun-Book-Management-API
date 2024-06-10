import { describe, afterEach, it, expect, beforeEach } from 'bun:test'
import { UserTest } from './test-util'
import app from '../src'
import { log } from '../src/application/logging'

describe('POST /api/users', () =>  {
    afterEach(async () => {
        await UserTest.delete()
    })

    it('should reject register new user if request is invalid', async() => {
        const response = await app.request('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                username: "",
                password: "",
                name: ""
            })
        })

        log.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.json()).toBeDefined()
    })

    it('should regsiter new user', async () => {
        const response = await app.request('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                username: "test",
                password: "test",
                name: "test"
            })
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(201)
        expect(json.data.username).toBe("test")
        expect(json.data.name).toBe("test")
    })
})

describe('POST /api/users/login', () => {
    beforeEach(async () => {
        await UserTest.create()
    })
    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to login', async () => {
        const response = await app.request('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                username: "test",
                password: "test"
            })
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data.username).toBe("test")
        expect(json.data.name).toBe("test")
        expect(json.data.token).toBeDefined()
    })

    it('should reject login user if username is wrong', async () => {
        const response = await app.request('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                username: "salah",
                password: "test"
            })
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(401)
        expect(json.error).toBeDefined()
    })

    it('should reject login user if password is wrong', async () => {
        const response = await app.request('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                username: "test",
                password: "salah"
            })
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(401)
        expect(json.error).toBeDefined()
    })
})

describe('GET /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create()
    })
    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to get user', async () => {
        const response = await app.request('/api/users/current', {
           headers: new Headers({ "X-API-TOKEN": "test" }) 
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data.username).toBe("test")
        expect(json.data.name).toBe("test")
    })


    it('should reject get user if token is invalid', async () => {
        const response = await app.request('/api/users/current', {
           headers: new Headers({ "X-API-TOKEN": "salah" }) 
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(401)
        expect(json.error).toBeDefined()
    })
})

describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create()
    })
    afterEach(async () => {
        await UserTest.delete()
    })

    it('should reject update user if request is invalid', async () => {
        const response = await app.request('/api/users/current', {
           method: 'PATCH',
           headers: new Headers({ "X-API-TOKEN": "test" }),
           body: JSON.stringify({
                password: "",
                name: ""
           })
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(400)
        expect(json.error).toBeDefined()
    })

    it('should reject update user if token is wrong', async () => {
        const response = await app.request('/api/users/current', {
           method: 'PATCH',
           headers: new Headers({ "X-API-TOKEN": "salah" }),
           body: JSON.stringify({
                password: "benar",
                name: "benar"
           })
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(401)
        expect(json.error).toBeDefined()
    })

    it('should be able to update user name', async () => {
        const response = await app.request('/api/users/current', {
           method: 'PATCH',
           headers: new Headers({ "X-API-TOKEN": "test" }),
           body: JSON.stringify({
                name: "benar"
           })
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data.name).toBe("benar")
    })

    it('should be able to update user password', async () => {
        const response = await app.request('/api/users/current', {
           method: 'PATCH',
           headers: new Headers({ "X-API-TOKEN": "test" }),
           body: JSON.stringify({
                password: "benar"
           })
        })

        log.debug(response.body)
        expect(response.status).toBe(200)

        const user = await UserTest.get()
        expect(await Bun.password.verify("benar", user[0].password)).toBe(true)
    })
})

describe('DELETE /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create()
    })
    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to logout', async () => {
        const response = await app.request('/api/users/current', {
            method: 'DELETE',
            headers: new Headers({ "X-API-TOKEN": "test" }) 
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(200)
        expect(json.data).toBe("OK")

        const user = await UserTest.get()
        expect(user[0].token).toBeNull()
    })

    it('should reject logout user if token is wrong', async () => {
        const response = await app.request('/api/users/current', {
            method: 'DELETE',
            headers: new Headers({ "X-API-TOKEN": "salah" }) 
        })
        const json = await response.json()

        log.debug(response.body)
        expect(response.status).toBe(401)
        expect(json.error).toBeDefined()
    })
})
