const path = require("path")
const { errTypes, AppError } = require("../../common/errors")

module.exports.Files = class Files {
  constructor(db) {
    this.db = db
  }

  add(file, userId) {
    const { name, path: newPath, type, size } = file
    const originalName = path.parse(name)
    const newName = path.parse(newPath)

    return this.db.then((db) => db.query(
      `INSERT INTO xim_test.files 
         (name, original_name, ext, mime, size, loading_date, user_id)
       VALUES 
         (?, ?, ?, ?, ?, ?, ?)`,
      [
        newName.name,
        originalName.name,
        originalName.ext.replace(".", ""),
        type,
        size,
        new Date(),
        userId,
      ]
    ).then(
      (result) => ({ fileResult: file, DbResult: result })
    ))
  }

  getFiles(userId, pageNo = 1, pageSize = 10) {
    const offset = (pageNo - 1) * pageSize

    return this.db.then((db) => db.query(
      `SELECT original_name, ext, size, loading_date 
       FROM xim_test.files
       WHERE user_id = ?
       ORDER BY id
       LIMIT ? OFFSET ?
       `,
      [
        userId,
        pageSize,
        offset,
      ]
    ).then(([ rows, fields ]) => rows))
  }

  getFile(userId, fileId) {
    return this.db.then((db) => db.query(
      `SELECT name, original_name, ext, mime, size, loading_date 
       FROM xim_test.files 
       WHERE user_id = ? and id = ?`,
      [ userId, fileId ]
    )).then(([rows, fields]) => rows[0])
  }

  update(fileId, newFile, userId) {
    const { name, path: newPath, type, size } = newFile
    const originalName = path.parse(name)
    const newName = path.parse(newPath)

    return this.db.then((db) => db.query(
      `UPDATE xim_test.files
       SET name = ?, original_name = ?, ext = ?, mime = ?, size = ?, loading_date = ? 
       WHERE user_id = ? and id = ?`,
      [
        newName.name,
        originalName.name,
        originalName.ext.replace(".", ""),
        type,
        size,
        new Date(),
        userId,
        fileId,
      ]
    ).then(
      (result) => ({ fileResult: newFile, DbResult: result })
    ))
  }

  delete(userId, fileId) {
    return this.db.then((db) => {
      return this.getFile(userId, fileId)
        .then((file) => {
          if (!file)
            throw new AppError(errTypes.fileDelete, { userId, fileId }, "No file")

          return db.query(
            `DELETE FROM xim_test.files WHERE user_id = ? and id = ?`,
            [ userId, fileId ]
          ).then(() => ({ id: fileId, name: file.name }))
        })
    })
  }
}