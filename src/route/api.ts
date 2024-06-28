import { app } from "./public-api"
import { UserController } from "../controller/user-controller"
import { auth } from "../middleware/auth-middleware"
import { BookController } from "../controller/book-controller"
import { ReviewController } from "../controller/review-controller"

app.use(auth)

app.get('/users/current', UserController.get)
app.patch('/users/current', UserController.update)
app.delete('/users/current', UserController.logout)

app.post('/books', BookController.create)
app.get('/books', BookController.search)
app.get('/books/current', BookController.list)
app.put('/books/:id', BookController.update)
app.delete('/books/:id', BookController.delete)
app.get('/books/:id', BookController.get)
app.post('/books/:id/current', BookController.add)
app.delete('/books/:id/current', BookController.remove)

app.post('/books/:bookId/review', ReviewController.create)
app.put('/books/:bookId/review/:reviewId', ReviewController.update)
app.get('/books/:bookId/review/:reviewId', ReviewController.get)
app.delete('/books/:bookId/review/:reviewId', ReviewController.delete)
app.get('/books/:bookId/review', ReviewController.search)

export { app }
