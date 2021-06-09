const DB = require("../services/db")
const Tokens = require("../services/tokens")
const db = new DB()
const tokens = new Tokens()

module.exports = async function checkAccess(req, res, next) {
  const cookies = req.cookies
  const { accessToken, refreshToken } = cookies

  if (!accessToken) return res.status(403).json({error: "Access denied"})

  try {
    const { user } = await tokens.decryptAccess(accessToken)

    const session = await db.tokens.get(user.id, refreshToken)
    if (!session) return res.status(401).json({ error: "Token expired" })

    req.user = user
    next()
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired" })
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({error: "Invalid token"});
    }

    console.error(err)
    return res.status(400).json({ error: err });
  }
}