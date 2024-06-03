import { app } from "../application/app"
app.get("/api/test", (c) => c.text("Hello World"))
