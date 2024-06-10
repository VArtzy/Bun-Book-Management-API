import { app } from "./public-api"
import { UserController } from "../controller/user-controller"
import { auth } from "../middleware/auth-middleware"

app.use(auth)

app.get('/users/current', UserController.get)
app.patch('/users/current', UserController.update)
app.delete('/users/current', UserController.logout)

export { app }
