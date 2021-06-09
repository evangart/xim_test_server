const jwt = require("jsonwebtoken")
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env
const { errTypes, AppError } = require("../../common/errors")

module.exports = class Tokens {
  genAccess(id, email) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          user: { id, email }
        },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10m",
        },
        (err, token) => {
          if (err) reject(new AppError(errTypes.tokenGen, err))
          resolve(token)
        }
      )
    })
  }

  genRefresh(id, email) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          user: { id, email }
        },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        },
        (err, token) => {
          if (err) reject(new AppError(errTypes.tokenGen, err))
          resolve(token)
        }
      )
    })
  }

  decryptRefresh(refreshToken) {
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) reject(new AppError(errTypes.tokenDecrypt, err))
        resolve(decoded)
      })
    })
  }

  decryptAccess(accessToken) {
    return new Promise((resolve, reject) => {
      jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) reject(new AppError(errTypes.tokenDecrypt, err))
        resolve(decoded)
      })
    })
  }

  regenAccess(refreshToken) {
    return this.decryptRefresh(refreshToken)
      .then(({ user }) => this.genAccess(user.id, user.email))
  }
}