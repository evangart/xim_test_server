const express = require("express")
const router = express.Router()

const DB = require("../services/db")
const Files = require("../services/files")
const db = new DB()
const files = new Files()

const { isNumeric } = require("../common/typeCheck")

router.post("/upload", (req, res) => {
  files.add(req)
    .then((file) => db.files.add(file, req.user.id))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err)
      res.json({error: "Invalid file"})
    })
})

router.get("/list", (req, res) => {
  const { page, list_size } = req.query
  const pageNo = isNumeric(page) ? parseInt(page) : null
  const pageSize = isNumeric(list_size) ? parseInt(list_size) : null
  const userId = req.user.id

  db.files.get(userId, pageNo, pageSize)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error(err)
      res.status(400).json({ error: "Internal error" })
    })
})

router.delete("/delete/:id", (req, res) => {

})

router.get("/:id", (req, res) => {

})

router.get("/download/:id", (req, res) => {

})

router.put("/update/:id", (req, res) => {

})

module.exports = router
