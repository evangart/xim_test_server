const crypto = require("crypto")

module.exports.Users = class Users {
  constructor(db) {
    this.db = db
  }

  get(email) {
    return this.db.then((db) => db.query(
      `SELECT id, email, password FROM xim_test.users WHERE email = ?`,
      [ email ]
    )).then(([ rows, fields ]) => rows[0])
  }

  add(email, password) {
    const hash = crypto.createHash("sha256")
    hash.update(password)

    return this.db.then((db) => db.query(
      `INSERT INTO xim_test.users (email, password) VALUES (?, ?)`,
      [ email, hash.digest("hex") ]
    )).then((result) => result[0].insertId)
  }
}