module.exports.errTypes = {
  dbConnect: "dbConnect",
  dbQuery: "dbQuery",
  dbWrite: "dbWrite",
  fileUpload: "fileUpload",
  fileDelete: "fileDelete",
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