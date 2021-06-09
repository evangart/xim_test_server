const mysql = require("mysql2/promise")
const { Files } = require("./files")
const { Users } = require("./users")
const { Tokens } = require("./tokens")

const {
  DB_SERVER_ADDRESS,
  DB_USER_NAME,
  DB_PASSWORD,
  DB_NAME,
} = process.env

module.exports = class DB {
  constructor(config) {
    this.config = {
      host: DB_SERVER_ADDRESS,
      user: DB_USER_NAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      ...config
    }
    this.connection = mysql.createConnection(this.config)
    this.files = new Files(this.connection)
    this.users = new Users(this.connection)
    this.tokens = new Tokens(this.connection)
  }
}