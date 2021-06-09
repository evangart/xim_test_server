const path = require("path")
const formidable = require("formidable")
const { errTypes, AppError } = require("../../common/errors")

module.exports = class Files {
  constructor() {
    this.dir = path.join(__dirname, "../../uploads")
  }

  add(req) {
    return new Promise((resolve, reject) => {
      const form = formidable({
        uploadDir: this.dir,
        allowEmptyFiles: false,
      })

      form.parse(req, (err, fields, files) => {
        if (err) reject(new AppError(errTypes.upload, err))
        if (files.file.size === 0) reject(new AppError(errTypes.upload, err))
        resolve(files.file)
      })
    })
  }

  list() {

  }

  delete() {

  }

  info() {

  }

  get() {

  }

  update() {

  }
}