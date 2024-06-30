import { swaggerUI } from "@hono/swagger-ui"
import { app, printMetrics, registerMetrics } from "../application/app"
import { UserController } from "../controller/user-controller"

app.use('*', registerMetrics)
app.get('/metrics', printMetrics)
app.get('/ui', swaggerUI({ url: '/api/doc' }))
app.get('/doc', (c) => c.json({ "openapi": "3.0.1", "info": { "title": "Bun Book API" } }))
app.post('/users', UserController.register)
app.post('/users/login', UserController.login)

export { app }
