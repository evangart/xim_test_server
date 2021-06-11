const path = require("path")
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
    .then((result) => res.json({ message: "File uploaded successfully" }))
    .catch((err) => {
      console.error(err)
      res.json({ error: "Invalid file" })
    })
})

router.get("/list", (req, res) => {
  const { page, list_size } = req.query
  const pageNo = isNumeric(page) ? parseInt(page) : null
  const pageSize = isNumeric(list_size) ? parseInt(list_size) : null
  const userId = req.user.id

  db.files.getFiles(userId, pageNo, pageSize)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error(err)
      res.status(400).json({ error: "Internal error" })
    })
})

router.delete("/delete/:id", (req, res) => {
  const { id: fileId } = req.params
  const userId = req.user.id

  db.files.delete(userId, fileId)
    .then((file) => files.delete(file.name))
    .then(() => res.status(200).json({ message: "File deleted successfully" }))
    .catch((err) => {
      console.error(err)
      res.status(400).json({ error: err })
    })
})

router.get("/:id", (req, res) => {
  const { id: fileId } = req.params
  const userId = req.user.id

  db.files.getFile(userId, fileId)
    .then((file) => {
      if (!file) return res.status(400).json({ error: "File not found" })
      const { original_name, ext, mime, size, loading_date } = file
      res.status(200).json({ name: original_name, ext, mime, size, loading_date })
    })
    .catch((err) => {
      console.error(err)
      res.status(400).json({ error: "Internal error" })
    })
})

router.get("/download/:id", (req, res) => {
  const { id: fileId } = req.params
  const userId = req.user.id

  db.files.getFile(userId, fileId)
    .then((file) => {
      if (!file) return res.status(400).json({ error: "File not found" })

      const { name, original_name, ext } = file
      const filePath = path.join(files.dir, name)
      const fileName = `${original_name}.${ext}`

      res.download(filePath, fileName)
    })
    .catch((err) => {
      console.error(err)
      res.status(400).json({ error: "Internal error" })
    })
})

router.put("/update/:id", (req, res) => {
  const { id: fileId } = req.params
  const userId = req.user.id

  db.files.getFile(userId, fileId)
    .then((prevFile) => {
      if (!prevFile) return res.status(400).json({ error: "File not found" })

      return files.add(req)
        .then((newFile) => db.files.update(fileId, newFile, userId))
        .then((result) => files.delete(prevFile.name))
        .then(() => res.status(201).json({ message: "File updated successfully" }))
    })
    .catch((err) => {
      console.error(err)
      res.status(400).json({ error: "Internal error" })
    })
})

module.exports = router
