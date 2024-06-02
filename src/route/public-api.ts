import { app } from "../application/app"
import { UserController } from "../controller/user-controller"

app.post("/api/users", UserController.register)
