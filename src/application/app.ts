import { Hono } from 'hono'
import { ValiError } from 'valibot'
import { HTTPException } from 'hono/http-exception'
import { prometheus } from '@hono/prometheus'

export const app = new Hono().basePath('/api')

export const { printMetrics, registerMetrics } = prometheus({ collectDefaultMetrics: true })

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

