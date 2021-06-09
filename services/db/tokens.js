module.exports.Tokens = class Tokens {
  constructor(db) {
    this.db = db
  }

  add(userId, token) {
    return this.db.then((db) => db.query(
      `INSERT INTO xim_test.tokens (user_id, refresh_token) 
       VALUES (?, ?)`,
      [ userId, token ]
    )).then((result) => result[0].insertId)
  }

  get(userId, token) {
    return this.db.then((db) => db.query(
      `SELECT id FROM xim_test.tokens WHERE user_id = ? and refresh_token = ?`,
      [ userId, token ]
    )).then(([ rows, fields ]) => rows[0])
  }

  delete(userId, token) {
    return this.db.then((db) => db.query(
      `DELETE FROM xim_test.tokens WHERE user_id = ? and refresh_token = ?`,
      [ userId, token ]
    ))
  }
}