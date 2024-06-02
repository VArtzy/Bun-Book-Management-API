import { createMiddleware } from 'hono/factory'
import { ValiError } from 'valibot'
import { ResponseError } from '../error/response-error'
import { StatusCode } from 'hono/utils/http-status'
export const errorMiddleware = createMiddleware(async (c) => {
    if (c.error instanceof ValiError) {
        c.json({ error: `Validation Error : ${c.error.message}` }, 400)
    } else if (c.error instanceof ResponseError) {
        c.json({ error: c.error.message }, c.error.status as StatusCode)
    } else {
        c.json({ error: 'Internal Server Error' }, 500)
    }
})
