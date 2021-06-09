const path = require("path")

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

  get(userId, pageNo = 1, pageSize = 10) {
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
    ).then(([ rows, fields ]) => rows)
    )
  }
}