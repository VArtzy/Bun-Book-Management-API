import { app } from "../application/app"
import { UserController } from "../controller/user-controller"

app.post('/users', UserController.register)
app.post('/users/login', UserController.login)

export { app }
