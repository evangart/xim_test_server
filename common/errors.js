module.exports.errTypes = {
  dbConnect: "dbConnect",
  dbQuery: "dbQuery",
  dbWrite: "dbWrite",
  upload: "upload",
  tokenGen: "tokenGen",
  tokenRegen: "tokenRegen",
  tokenDecrypt: "tokenDecrypt",
  tokenExpired: "tokenExpired",
}

module.exports.AppError = class AppError extends Error {
  constructor(type, data, message) {
    super(message)
    this.type = type
    this.data = data
  }
}