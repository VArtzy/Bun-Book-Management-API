import { Hono } from 'hono'
import { ValiError } from 'valibot'
import { HTTPException } from 'hono/http-exception'

export const app = new Hono().basePath('/api')

app.onError((err, c) => {
    console.log(err)
    if (err instanceof ValiError) {
        return c.json({ error: err.message }, 400)
    } else if (err instanceof HTTPException) {
        return c.json({ error: err.message }, err.status)
    } else {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
})

