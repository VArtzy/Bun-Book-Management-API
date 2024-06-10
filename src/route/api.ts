import { app } from "./public-api"
import { UserController } from "../controller/user-controller"
import { auth } from "../middleware/auth-middleware"
import { BookController } from "../controller/book-controller"

app.use(auth)

app.get('/users/current', UserController.get)
app.patch('/users/current', UserController.update)
app.delete('/users/current', UserController.logout)

app.post('/books', BookController.create)
app.get('/books', BookController.search)
app.put('/books/:id', BookController.update)
app.delete('/books/:id', BookController.delete)
app.get('/books/:id', BookController.get)

export { app }
