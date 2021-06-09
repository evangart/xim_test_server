require("dotenv").config()
const express = require("express")
const cors = require("cors")
const path = require("path")
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')

const checkAccess = require("./middlewares/checkAccess")
const usersRoutes = require("./routes/users")
const filesRoutes = require("./routes/files")

const { PORT } = process.env

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(usersRoutes)
app.use("/file", [ checkAccess, filesRoutes ])

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})