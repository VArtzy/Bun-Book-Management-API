import { Hono } from 'hono'
import { errorMiddleware } from '../middleware/error-middleware'

export const app = new Hono()
app.use(errorMiddleware)
