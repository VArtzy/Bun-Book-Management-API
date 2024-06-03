import { Hono } from 'hono'
import { UserController } from "../controller/user-controller"
import { errorMiddleware } from '../middleware/error-middleware'

export const app = new Hono()
app.use(errorMiddleware)
app.post("/api/users", UserController.register)
